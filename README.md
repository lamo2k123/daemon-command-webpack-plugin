## daemon-command-webpack-plugin
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](http://www.opensource.org/licenses/mit-license.php)
[![Travis branch](https://img.shields.io/travis/lamo2k123/daemon-command-webpack-plugin/master.svg?maxAge=2592000)](https://travis-ci.org/lamo2k123/daemon-command-webpack-plugin)
[![npm](https://img.shields.io/npm/dt/daemon-command-webpack-plugin.svg?maxAge=2592000)](https://www.npmjs.com/package/daemon-command-webpack-plugin)
[![npm](https://img.shields.io/npm/v/daemon-command-webpack-plugin.svg?maxAge=2592000)](https://www.npmjs.com/package/daemon-command-webpack-plugin)

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
* `command` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The package.json scripts command to run
* `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    * `cwd` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Current working directory of the child process
    * `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Environment key-value pairs
    * `uid` [\<Number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sets the user identity of the process
    * `gid` [\<Number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Sets the group identity of the process
    * `debounce` [\<Number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to debounce command start or restart

Use `cwd` to specify the working directory from which the process is spawned. If not given, the default is to inherit the current working directory.
Use `env` to specify environment variables that will be visible to the new process, the default is process.env.

## License
[MIT](http://www.opensource.org/licenses/mit-license.php)
