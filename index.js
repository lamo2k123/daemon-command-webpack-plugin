'use strict';

const { spawn } = require('child_process');
const killer = require('./lib/killer');
const getPids = require('./lib/get-pids');

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
    }

    get default() {
        return {
            manager : 'npm',
            command : 'run',
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
                .then(next);
        } else {
            next(null);
        }
    };

    spawning(code) {
        return new Promise((resolve, reject) => {
            if(code !== 1) {
                if(this.command) {
                    this.process = spawn(this.options.manager, [this.options.command, this.command], this.options.spawn);

                    this.process.stdout.pipe(process.stdout);
                    this.process.stderr.pipe(process.stderr);

                    if(this.options.marker) {
                        this.process.stdout.on('data', chunk => {
                            const data = chunk.toString();

                            marker.test(data) && resolve(null)
                        })
                    } else {
                        resolve(null);
                    }

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
                getPids(this.process.pid)
                    .then(
                        pids => killer(pids),
                        reject
                    )
                    .then(
                        () => {
                            this.process = null;

                            resolve(null);
                        },
                        reject
                    )
            } else {
                resolve(null);
            }
        })
    }

}

module.exports = DaemonCommand;
