module.exports = message => {
    let out = '[daemon-command-webpack-plugin][resolve-marker]';

    if(message) {
        out = `${out}: ${message}`;
    }

    if(process && process.stdout && typeof process.stdout.write === 'function') {
        process.stdout.write(`${out}\n`);
    } else {
        console.log(out);
    }
};