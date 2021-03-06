# webpack-universal-config

Extendable Webpack configuration for a universal/isomorphic application.

## Features
- Hot reloading
- Babel loader
- ESLint loader
- JSON loader
- CSS, Sass & Less loaders
- Loaders for other files (with proper content types): svg, ttf, woff, woff2, eot

## Installation
```
$ npm install webpack-universal-config
```

## Usage
Create a configuration file at the root of your project and extend `webpack-universal-config`:
```javascript
var path = require('path');
var universalConfig = require('webpack-universal-config');

// Load environment variables
var host = process.env.HOST || 'localhost';
var port = parseInt(process.env.PORT) || 3000;

// Load universal configuration
var config = universalConfig(__dirname, "./static/dist", "./src/client", host, port);

// TODO: Modify the configuration here to fit your project

// Export the configuration
module.exports = config;
```

Now you can configure ESLint in `.eslintrc` and Babel in `.babelrc`. In `.babelrc` you can specify both production and development plugins, for example:
```json
{
    "presets": ["es2015", "stage-0", "react"],
    "plugins": [
        "plugin-loaded-in-development-and-production"
    ],
    "env": {
        "development": {
            "plugins": [
                "plugin-loaded-in-development-only"
            ]
        }
    }
}
```

Run this command to start the hot-reloading development server:
```
$ webpack-dev-server --config <your configuration file>
```

## API
```javascript
var universalConfig = require('webpack-universal-config');

var config = universalConfig(baseDir, outputDir, entryPoint);
// baseDir - The root folder of the projec (e.g. __dirname)
// outputDir - The folder in which Webpack puts processed files
// entryPoint - Entry point of the application for Webpack
// NOTE: both outputDir and entryPoint are relative to the baseDir
```
