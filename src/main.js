import { spawn } from 'child_process';
import psTree from 'ps-tree';

class DaemonCommandWebpackPlugin {

    constructor(command, options) {
        this.command=command;
        this.options= options || {};
        this.exit   = false;

        process.on('SIGINT', () => {
            this.exit = true;

            this.kill();
        });
    }

    apply = compiler => {
        compiler.plugin('after-emit', this.afterEmit);
        compiler.plugin('watch-run', this.watchRun);
    };

    debounce = code => {
        if(!this.exit && code !== 1) {
            if(this.options.debounce) {
                if(this._debounce) {
                    clearTimeout(this._debounce);
                }

                this._debounce = setTimeout(this.spawning, this.options.debounce);
            } else {
                this.spawning();
            }
        }
    };

    spawning = () => {
        if(this.command) {
            this._process = spawn('npm', ['run', this.command], {
                ...this.options,
                shell   : true,
                stdio   : 'inherit',
                detached: true
            });

            this._process.on('close', this.debounce);
        }

        return this;
    };

    afterEmit = (compilation, next) => {
        if(this._watch) {
            if(this._process) {
                this.kill();
            } else {
                this.debounce();
            }
        }

        next(null)
    };

    watchRun = (context, next) => {
        if(!this._watch) {
            this._watch = true
        }

        next(null);
    };

    kill = () => {
        if(this._process && this._process.pid) {
            psTree(this._process.pid, (error, children) => {
                if(!error) {
                    for(let i in children) {
                        if(children.hasOwnProperty(i)) {
                            process.kill(children[i].PID, 'SIGINT');
                        }
                    }

                    if(this.exit) {
                        process.exit();
                    }
                } else {
                    console.log(error);
                }
            });

            delete this._process;
        }

        return this;
    }

}

export default DaemonCommandWebpackPlugin;
