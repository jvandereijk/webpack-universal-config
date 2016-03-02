// TODO: replace Express with Koa
// TODO: load host, port and config location from CLI arguments (--> find a library that handles CLI arguments)

var Express = require('express');
var webpack = require('webpack');

// Replace with your configuration file
var config = require('./config.development.js');
var compiler = webpack(config);

// Load environment variables
var host = process.env.HOST || 'localhost';
var port = parseInt(process.env.PORT) || 3000;

// Define server options
var serverOptions = {
    contentBase: 'http://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: config.output.publicPath,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    stats: {
        colors: true
    }
};

// Initialize server and register middleware
var app = new Express();
app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

// Start server
app.listen(port, function(err) {
    if (err) {
        console.error(err);
    } else {
        console.info('Webpack development server listening on port %s', port);
    }
});
