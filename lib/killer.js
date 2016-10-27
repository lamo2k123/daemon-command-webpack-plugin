const { spawn } = require('child_process');

module.exports = pids => {
    return new Promise((resolve, reject) => {
        switch(process.platform) {
            case 'win32':
                // @TODO: windows )) taskkill
                break;
            default:
                const kill = spawn('kill', ['-9', ...pids]);

                kill.on('close', code => {
                    if(code) {
                        reject(code)
                    } else {
                        resolve(null);
                    }
                });
                break;
        }
    })
};