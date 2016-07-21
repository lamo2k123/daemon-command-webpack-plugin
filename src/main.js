import { spawn } from 'child_process';

class DaemonCommandWebpackPlugin {

    constructor(command, options) {
        this.command =command;
        this.options = options || {};

        process.on('SIGINT', this.kill);
    }

    apply = compiler => {
        compiler.plugin('after-emit', this.afterEmit);
        compiler.plugin('watch-run', this.watchRun);
    };

    debounce = () => {
        if(this.options.debounce) {
            if(this._debounce) {
                clearTimeout(this._debounce);
            }

            this._debounce = setTimeout(this.spawning, this.options.debounce);
        } else {
            this.spawning();
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
            process.kill(-this._process.pid);

            delete this._process;
        }

        return this;
    }

}

export default DaemonCommandWebpackPlugin;
