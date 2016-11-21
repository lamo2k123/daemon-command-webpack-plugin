'use strict';

const { spawn } = require('child_process');

module.exports = pid => {
    if(typeof pid === 'number') {
        pid = pid.toString();
    }

    const parents = [pid];

    return new Promise((resolve, reject) => {
        // @TODO: windows
        // Linux:
        // 1. " <defunct> " need to be striped
        // ```bash
        // $ ps -A -o comm,ppid,pid,stat
        // COMMAND          PPID   PID STAT
        // bbsd             2899 16958 Ss
        // watch <defunct>  1914 16964 Z
        // ps              20688 16965 R+
        // ```
        //
        // Win32:
        // 1. wmic PROCESS WHERE ParentProcessId=4604 GET Name,ParentProcessId,ProcessId,Status)
        // 2. The order of head columns is fixed
        // ```shell
        // > wmic PROCESS GET Name,ProcessId,ParentProcessId,Status
        // Name                          ParentProcessId  ProcessId   Status
        // System Idle Process           0                0
        // System                        0                4
        // smss.exe                      4                228
        // ```
        // spawn('wmic.exe', ['PROCESS', 'GET', 'Name,ProcessId,ParentProcessId,Status']);
        const result = spawn('ps', ['-A', '-o', 'ppid,pid']);
        const data = [];

        result.stdout.on('data', chunk => data.push(chunk));
        result.stdout.on('end', () => {
            const out       = Buffer.concat(data).toString();
            const strings   = out.split(/[\r\n]/);
            delete strings.shift();
            const list      = strings.map(item => {
                item = item.trim().split(/\s+/);

                return {
                    ppid: item[0],
                    pid : item[1]
                }
            });
            const children = list.filter(item => {
                const result = parents.indexOf(item.ppid) !== -1;

                result && parents.push(item.pid);

                return result;
            });

            resolve(children.map(item => item.pid));
        })
    })
};
