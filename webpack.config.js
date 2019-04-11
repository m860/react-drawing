const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, "app/index.js"),
    module: {
        rules: [
            {
                include: [
                    path.resolve(__dirname, 'app'),
                    path.resolve(__dirname, "component")
                ],
                loader: 'babel-loader',

                options: {
                    plugins: [
                        "syntax-dynamic-import",
                        "@babel/plugin-proposal-class-properties"
                    ],

                    presets: [
                        '@babel/preset-env',
                        "@babel/preset-react",
                        "@babel/preset-flow"
                    ]
                },

                test: /\.js$/
            },
            {
                test: /\.(scss|css|sass)$/,

                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },

    output: {
        chunkFilename: '[name].[chunkhash].js',
        filename: '[name].[chunkhash].js'
    },

    mode: 'development',

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: true
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './app/index.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }
};
