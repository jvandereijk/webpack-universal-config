var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools.js');

module.exports = function(baseDir, outputDir, entryPoint) {
    // Initialize Webpack Isomorphic Tools
    var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);

    return {
        devtool: 'source-map',
        context: baseDir,
        entry: {
            main: [
                entryPoint
            ]
        },
        output: {
            path: path.join(baseDir, outputDir),
            filename: '[name]-[hash].js',
            chunkFilename: '[name]-[chunkhash].js',
            publicPath: '/dist/'
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
            new CleanPlugin([path.join(baseDir, outputDir)], {
                root: baseDir
            }),

            // CSS files from the extract-text-plugin loader
            new ExtractTextPlugin('[name]-[chunkhash].css', {
                allChunks: true
            }),

            new webpack.DefinePlugin({
                __CLIENT__: true,
                __SERVER__: false,
                __DEVELOPMENT__: false
            }),

            // Optimizations
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),

            webpackIsomorphicToolsPlugin
        ],
        devServer: {
            contentBase: 'http://' + host + ':' + port,
            quiet: true,
            noInfo: true,
            hot: true,
            inline: true,
            lazy: false,
            publicPath: 'http://' + host + ':' + port + '/dist/',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            stats: {
                colors: true
            }
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', [
                        'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
                        'postcss-loader'
                    ])
                },
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style', [
                        'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
                        'postcss-loader',
                        'less?sourceMap'
                    ])
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style', [
                        'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
                        'postcss-loader',
                        'sass?sourceMap&outputStyle=expanded'
                    ])
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff'
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
                },
                {
                    webpackIsomorphicToolsPlugin.regular_expression('images'),
                    loader: 'url?limit=10000'
                }
            ]
        },
        postcss: [
            autoprefixer({
                browsers: ['last 2 versions']
            })
        ]
    };
};
