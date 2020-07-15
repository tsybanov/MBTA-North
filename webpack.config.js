var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path : path.resolve(__dirname, 'build/'),
        filename : 'bundle.js'
    },
    module: {
        rules : [
            { 
                test : /\.(js)$/, 
                loader: 'babel-loader', 
                options: {
                    sourceType: "unambiguous",
                    presets: [
                                '@babel/preset-env',
                                '@babel/react',{
                                    'plugins': [
                                            '@babel/plugin-proposal-class-properties',
                                            "@babel/plugin-transform-runtime"
                                    ]}
                            ]
                }
            },
            { test : /\.css$/, use: ['style-loader', 'css-loader']},
            { test: /\.(woff|woff2|eot|ttf|svg)$/, use: 'file-loader'}
        ]
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin ({
            template: 'public/index.html'
        })
    ]
}