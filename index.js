'use strict';

const debug = require('debug')('daemon-command');
const path = require('path');
const { spawn } = require('child_process');
const treeKill = require('tree-kill');

const marker = /^\[daemon-command-webpack-plugin]\[resolve-marker]/gm;

class DaemonCommand {

    constructor(command, options) {
        this.options = options;

        this.command = command;

        this.apply = this.apply.bind(this);
        this.watch = this.watch.bind(this);
        this.handler = this.handler.bind(this);
        this.spawning = this.spawning.bind(this);
        this.kill = this.kill.bind(this);
        this.spawnArgs = [];

        const npmExec = process.env.npm_execpath;
        const nodeExec = process.env.npm_node_execpath;
        const npmPathIsJs = typeof npmExec === 'string' && /\.js/.test(path.extname(npmExec));

        if (!npmPathIsJs) {
            this.execPath = npmExec;
        }
        else {
            this.execPath = nodeExec || 'npm';
            this.spawnArgs.push(npmExec);
        }
    }

    get default() {
        return {
            event   : 'after-emit',
            marker  : false,
            spawn   : {}
        }
    }

    get options() {
        return this._options;
    }

    set options(params) {
        const options = this.default;

        this._options = Object.assign(options, params);
    }

    get process() {
        return this._process;
    }

    set process(params) {
        this._process = params;
    }

    apply(compiler) {
        compiler.plugin('watch-run', this.watch);
        compiler.plugin(this.options.event, this.handler);
    };

    watch(context, next) {
        if(!this._watch) {
            this._watch = true
        }

        next(null);
    };

    handler(compilation, next) {
        if(this._watch) {
            this
                .kill()
                .then(this.spawning)
                .then(next)
                .catch(console.error);
        } else {
            next(null);
        }
    };

    spawning(code) {
        return new Promise((resolve, reject) => {
            if(code !== 1) {
                if(this.command) {
                    let finalArgs = [...this.spawnArgs, this.command];
                    debug('Spawning: "%s %o"', this.execPath, finalArgs);

                    this.process = spawn(this.execPath, finalArgs, this.options.spawn);
                    this.process.stdout.pipe(process.stdout);
                    this.process.stderr.pipe(process.stderr);

                    if(this.options.marker) {
                        this.process.stdout.on('data', chunk => {
                            const data = chunk.toString();

                            if (marker.test(data)) {
                                debug('Marker caught!');
                                resolve(null);
                            }
                        })
                    } else {
                        resolve(null);
                    }

                    this.process.on('error', err => reject(err));
                    this.process.on('exit', code => code === 1 && resolve(null));
                }
            } else {
                resolve(null)
            }
        })
    };

    kill() {
        return new Promise((resolve, reject) => {
            if(this.process && this.process.pid) {
                debug('Killing: %o [%s]', this.process.spawnargs, this.process.pid)
                treeKill(this.process.pid, 'SIGKILL', (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.process = null;
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        })
    }

}

module.exports = DaemonCommand;
