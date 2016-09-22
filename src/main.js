import { spawn } from 'child_process';
import psTree from 'ps-tree';

class DaemonCommandWebpackPlugin {

    constructor(command, options) {
        this.command= command;
        this.options= options || {};
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
            if(this._process) {
                this.kill();
            } else {
                this.debounce();
            }
        }

        next(null)
    };

    debounce = code => {
        if(code !== 1) {
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
                stdio : 'inherit'
            });

            this._process.on('close', this.debounce);
            this._process.on('exit', code => {
                if(code === 1) {
                    this.kill();
                }
            });
        }
    };

    kill = () => {
        if(this._process && this._process.pid) {
            psTree(this._process.pid, (error, childrens) => {
                const pids = childrens.map(children => children.PID);

                spawn('kill', ['-9', ...pids]);
            });

            delete this._process;
        }
    }

}

export default DaemonCommandWebpackPlugin;
