var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = function(baseDir, outputDir, host, port) {
    // Load Babel configuration from .babelrc
    var babelrc = {};
    try {
        babelrc = JSON.parse(fs.readFileSync(path.join(baseDir, '.babelrc')));
    } catch (err) {
        console.error('Failed to parse your .babelrc.');
        console.error(err);
    }

    // Merge global and dev-only plugins
    var babelrcDevelopment = babelrc.env && babelrc.env.development || {};
    var combinedPlugins = babelrc.plugins || [];
    combinedPlugins = combinedPlugins.concat(babelrcDevelopment.plugins || []);

    // Merge global, dev-only and combined plugins configrations
    var babelLoaderQuery = Object.assign({}, babelrcDevelopment, babelrc, {plugins: combinedPlugins});
    delete babelLoaderQuery.env;

    return {
        devtool: 'inline-source-map',
        entry: {
            main: [
                'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
                './src/client.js'
            ]
        },
        output: {
            path: outputDir,
            filename: '[name]-[hash].js',
            chunkFilename: '[name]-[chunkhash].js',
            publicPath: 'http://' + host + ':' + port + '/dist/'
        },
        progress: true,
        resolve: {
            modulesDirectories: [
                'src',
                'node_modules'
            ],
            extensions: ['', '.json', '.js', '.jsx']
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                __CLIENT__: true,
                __SERVER__: false,
                __DEVELOPMENT__: true
            })
        ],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loaders: [
                        'babel-loader?' + JSON.stringify(babelLoaderQuery),
                        'eslint-loader'
                    ]
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.css$/,
                    loaders: [
                        'style',
                        'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.less$/,
                    loaders: [
                        'style',
                        'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
                        'postcss-loader',
                        'less?sourceMap'
                    ]
                },
                {
                    test: /\.scss$/,
                    loaders: [
                        'style',
                        'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
                        'postcss-loader',
                        'sass?sourceMap&outputStyle=expanded'
                    ]
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/octet-stream'
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file'
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=image/svg+xml'
                }
            ]
        },
        postcss: [
            // Ugly hack to load autoprefixer as peer dependency (I blame postcss for their terrible structure)
            require(path.join(baseDir, 'node_modules', 'autoprefixer'))({
                browsers: ['last 2 versions']
            })
        ]
    };
};
