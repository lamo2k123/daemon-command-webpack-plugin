import { spawn } from 'child_process';

class DaemonCommandWebpackPlugin {

    constructor(command, options) {
        this.command =command;
        this.options = options;
        this._kill = 0;

        process.on('SIGINT', this.kill);
    }

    apply = compiler => {
        compiler.plugin('after-emit', this.afterEmit);
        compiler.plugin('watch-run', this.watchRun);
    };

    spawning = () => {
        if(!this._kill && this.command) {
            this._process = spawn('npm', ['run', this.command], {
                ...this.options,
                shell   : true,
                stdio   : 'inherit',
                detached: true
            });

            this._process.on('close', this.spawning);
        }

        return this;
    };

    afterEmit = (compilation, next) => {
        if(this._watch) {
            this
                .kill()
                .spawning();
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

            this._kill++;
        }

        return this;
    }

}

export default DaemonCommands;