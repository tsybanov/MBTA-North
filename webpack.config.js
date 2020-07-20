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
            { test : /\.(js)$/, loader: 'babel-loader' },
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