import { spawn } from 'child_process';
import psTree from 'ps-tree';

class DaemonCommandWebpackPlugin {

    constructor(command, options) {
        this.command = command;
        this.options = options || {};
    }

    apply = compiler => {
        compiler.plugin('watch-run', this.watchRun);
        compiler.plugin('after-emit', this.afterEmit);
    };

    watchRun = (context, next) => {
        if(!this._watch) {
            this._watch = true
        }

        next(null);
    };


    afterEmit = (compilation, next) => {
        if(this._watch) {
            this
                .kill()
                .then(this.spawning)
                .then(next);
        } else {
            next(null);
        }
    };

    watchOut = (out, resolve) => {
        const data = out.toString();

        if(this.options.outResolve.test(data)) {
            resolve(null);
        }
    }

    spawning = code => {
        return new Promise((resolve, reject) => {
            if(code !== 1) {
                if(this.command) {
                    this._process = spawn('npm', ['run', this.command]);

                    this._process.stdout.pipe(process.stdout);
                    this._process.stderr.pipe(process.stderr);

                    if(this.options.outResolve) {
                        this._process.stdout.on('data', out => this.watchOut(out, resolve))
                        this._process.stderr.on('data', out => this.watchOut(out, resolve))
                    } else {
                        resolve(null);
                    }

                    this._process.on('exit', code => code === 1 && resolve(null));
                }
            } else {
                resolve(null)
            }
        })
    };

    kill = () => {
        return new Promise((resolve, reject) => {
            if(this._process && this._process.pid) {
                psTree(this._process.pid, (error, childrens) => {
                    if(!error) {
                        const pids = childrens.map(children => children.PID);
                        const kill = spawn('kill', ['-9', ...pids]);

                        kill.on('close', () => {
                            delete this._process;

                            resolve(null);
                        })
                    } else {
                        reject(error);
                    }
                });
            } else {
                resolve(null);
            }
        })
    }

}

export default DaemonCommandWebpackPlugin;
