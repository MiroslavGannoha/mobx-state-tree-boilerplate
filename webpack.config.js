const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// variables
const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.resolve(__dirname, 'wwwroot');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = (env) => {
    return {
        context: sourcePath,
        entry: {
            main: ['react-hot-loader/patch', './main.tsx'],
        },
        output: {
            path: outPath,
            filename: '[name].[hash].bundle.js',
            chunkFilename: '[name].[contenthash:8].chunk.js',
            publicPath: '/',
            pathinfo: false,
        },
        performance: {
            hints: false,
        },
        target: 'web',
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            // Fix webpack's default behavior to not load packages with jsnext:main module
            // (jsnext:main directs not usually distributable es6 format, but es6 sources)
            mainFields: ['module', 'browser', 'main'],
            alias: {
                'app': path.resolve(__dirname, 'src/app/'),
                'i18n': path.resolve(__dirname, 'src/i18n/'),
                'react-dom': '@hot-loader/react-dom',
            },
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: sourcePath,
                    exclude: /node_modules/,
                    use: isProduction
                        ? ['babel-loader']
                        : ['react-hot-loader/webpack', 'babel-loader'],
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: !isProduction,
                            },
                        },
                        'css-loader',
                        // 'postcss-loader',
                        'sass-loader',
                    ],
                },
                // static assets
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader',
                    options: {
                        name: './fonts/[name].[ext]',
                    },
                },
                { test: /\.html$/, use: 'html-loader' },
                { test: /\.png$/, use: 'url-loader?limit=10000' },
                { test: /\.jpg$/, use: 'file-loader' },
                {
                    type: 'javascript/auto',
                    test: /manifest\.json/,
                    include: path.resolve(__dirname, 'src/assets/'),
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: true,
            },
            runtimeChunk: true,
        },
        plugins: [
            new WebpackCleanupPlugin(),
            new MiniCssExtractPlugin({
                filename: isProduction ? '[name].[hash].bundle.css' : '[name].css',
                chunkFilename: isProduction ? '[name].[contenthash:8].chunk.css'  :'[id].css',
            }),
            new HtmlWebpackPlugin({
                template: 'assets/index.html',
            }),
            new webpack.DefinePlugin({
                API_URL: JSON.stringify(env.API_URL),
            }),
            // new webpack.IgnorePlugin(/ej2-richtexteditor/),
            // new BundleAnalyzerPlugin(),
        ],
        devServer: {
            port: 3000,
            open: true,
            contentBase: sourcePath,
            hot: true,
            inline: true,
            // lazy: true,
            // fileName: ''
            historyApiFallback: {
                disableDotRule: true,
            },
            stats: 'minimal',
        },
        devtool: isProduction ? false : 'cheap-source-map',
        // devtool: isProduction ? false : 'cheap-source-map',
        // devtool: 'cheap-module-eval-source-map',
    };
};
