const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'icp-widget.js',
            library: 'ICPWidget',
            libraryTarget: 'umd',
            globalObject: 'this'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        browsers: ['last 2 versions', 'ie >= 11']
                                    }
                                }],
                                '@babel/preset-react'
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    }
                })
            ]
        },
        plugins: [
            new CleanWebpackPlugin()
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, 'public')
            },
            compress: true,
            port: 3000,
            hot: true,
            open: true
        }
    };
}; 