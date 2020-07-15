var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path : path.resolve(__dirname, 'public'),
        filename : 'bundle.js'
    },
    module: {
        rules : [
            { 
                test : /\.(js)$/, 
                loader: 'babel-loader', 
                options: {
                    presets: ['@babel/preset-env',
                              '@babel/react',{
                              'plugins': ['@babel/plugin-proposal-class-properties']}]
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