## daemon-command-webpack-plugin
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000&style=flat-square)][License]
[![travis](https://img.shields.io/travis/lamo2k123/daemon-command-webpack-plugin/master.svg?maxAge=2592000&style=flat-square)][Travis]
[![AppVeyor](https://img.shields.io/appveyor/ci/gruntjs/grunt.svg?maxAge=2592000&style=flat-square)][appVeyor]
[![npm](https://img.shields.io/npm/dt/daemon-command-webpack-plugin.svg?maxAge=2592000&style=flat-square)][NPM]
[![npm](https://img.shields.io/npm/v/daemon-command-webpack-plugin.svg?maxAge=2592000&style=flat-square)][NPM]

## Installing as a package
Use NPM:
`npm i daemon-command-webpack-plugin -D` or `npm install daemon-command-webpack-plugin --save-dev`

Use YARN:
`yarn add daemon-command-webpack-plugin --dev`
## Usage
```javascript
// package.json

{
  "name": "me-app",
  "version": "1.0.0",
  "scripts": {
      "start:dev:env": "node `pwd`/server/build/index.js",
      "start:dev": "NODE_ENV=development PORT=3000 node `pwd`/server/build/index.js",
    },
}
```

```javascript
// webpack.config.js

import DaemonCommandPlugin from 'daemon-command-webpack-plugin';

module.exports = {
  // ... rest of config
  plugins: [
    // Command #1
    new DaemonCommandPlugin('start:dev:env', {
      spawn : {
        env : {
          NODE_ENV : 'development',
          PORT : 3000
        }
      }
    }),
    // Command #2
    new DaemonCommandPlugin('start:dev');,
    // Command #3 use yarn
    new DaemonCommandPlugin('start:dev', {
      manager : 'yarn'
    });
  ]
}
```
## Usage with marker
```javascript
// webpack.config.js

import DaemonCommandPlugin from 'daemon-command-webpack-plugin';

module.exports = {
  // ... rest of config
  plugins: [
    // Command #1
    new DaemonCommandPlugin('start:dev', {
      marker : true
    });
  ]
}
```

```javascript
// your-app.js

import express from 'express';
import marker from 'daemon-command-webpack-plugin/marker';

let app = express();

app.listen(8080, () => {
    console.log('Listen port: 8080');
    marker();
    // or
    marker('Listen port: 8080'); // Custom message
})
```



## Arguments
* `command` [\<String\>][String] The package.json scripts command to run
* `options` [\<Object\>][Object]
    * `manager` [\<String\>][String] Package manager. Default: `npm`
    * `command` [\<String\>][String] Command type. Default: `run`
    * `event` [\<String\>][String] Webpack life cycle event. Default: `after-emit`
    * `marker` [\<Boolean\>][Boolean] Resolve promise when a marker is found to stdout. Default: `false`
    * `spawn` [\<Object\>][Object] Spawn options
        * `cwd` [\<String\>][String] Current working directory of the child process
        * `env` [\<Object\>][Object] Environment key-value pairs
        * `argv0` [\<String\>][String] Explicitly set the value of argv[0] sent to the child process. This will be set to command if not specified.
        * `stdio` [\<Array\>][Array] | [\<String\>][String] Child's stdio configuration. (See options.stdio)
        * `detached` [\<Boolean\>][Boolean] Prepare child to run independently of its parent process. Specific behavior depends on the platform, see options.detached)
        * `uid` [\<Number\>][Number] Sets the user identity of the process
        * `gid` [\<Number\>][Number] Sets the group identity of the process
        * `shell` [\<Boolean\>][Boolean] | [\<String\>][String] If true, runs command inside of a shell. Uses `/bin/sh` on UNIX, and `cmd.exe` on Windows. A different shell can be specified as a string. The shell should understand the -c switch on UNIX, or /d /s /c on Windows. Defaults to false (no shell).

Use `cwd` to specify the working directory from which the process is spawned. If not given, the default is to inherit the current working directory.
Use `env` to specify environment variables that will be visible to the new process, the default is process.env.

## Marker arguments
* `out` [\<String\>][String] | [\<Array\>][Array] Your custom message

## License
[MIT][License]

[License]: http://www.opensource.org/licenses/mit-license.php
[NPM]: https://www.npmjs.com/package/daemon-command-webpack-plugin
[Travis]: https://travis-ci.org/lamo2k123/daemon-command-webpack-plugin
[appVeyor]: https://ci.appveyor.com/project/lamo2k123/daemon-command-webpack-plugin

[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
