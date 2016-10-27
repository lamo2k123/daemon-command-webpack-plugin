'use strict';

module.exports = message => {
    let out = '[daemon-command-webpack-plugin][resolve-marker]';

    if(message) {
        out = `${out}: ${message}`;
    }

    if(process && process.stdout && typeof process.stdout.write === 'function') {
        process.stdout.write(`${out}\r\n`);
    } else if(console && console.log) {
        console.log(out);
    } else {
        throw new Error('process.stdout.write and console.log undefined');
    }
};