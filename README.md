## daemon-command-webpack-plugin
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)][License]
[![travis](https://img.shields.io/travis/lamo2k123/daemon-command-webpack-plugin/master.svg?maxAge=2592000)][Travis]
[![npm](https://img.shields.io/npm/dt/daemon-command-webpack-plugin.svg?maxAge=2592000)][NPM]
[![npm](https://img.shields.io/npm/v/daemon-command-webpack-plugin.svg?maxAge=2592000)][NPM]

## Installing as a package
`npm i daemon-command-webpack-plugin -S` or `npm install daemon-command-webpack-plugin --save`

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

const DaemonCommandPlugin = require('daemon-command-webpack-plugin');

module.exports = {
  // ... rest of config
  plugins: [
    // Command #1
    new DaemonCommandPlugin('start:dev:env', {
      env : {
        NODE_ENV : 'development',
        PORT : 3000
      }
    }),
    // Command #2
    new DaemonCommandPlugin('start:dev');
  ]
}
```

## Arguments
* `command` [\<String\>][String] The package.json scripts command to run
* `options` [\<Object\>][Object]
    * `cwd` [\<String\>][String] Current working directory of the child process
    * `env` [\<Object\>][Object] Environment key-value pairs
    * `uid` [\<Number\>][Number] Sets the user identity of the process
    * `gid` [\<Number\>][Number] Sets the group identity of the process
    * `outResolve` [\<RegExp\>][RegExp] Resolve promise when a match is found to stdout

Use `cwd` to specify the working directory from which the process is spawned. If not given, the default is to inherit the current working directory.
Use `env` to specify environment variables that will be visible to the new process, the default is process.env.

## License
[MIT][License]

[License]: http://www.opensource.org/licenses/mit-license.php
[NPM]: https://www.npmjs.com/package/daemon-command-webpack-plugin
[Travis]: https://travis-ci.org/lamo2k123/daemon-command-webpack-plugin

[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
