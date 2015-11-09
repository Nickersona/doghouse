var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');

var styleLoaders = [
    'css-loader',
    'autoprefixer-loader?{browsers:["last 2 version", "ie 9"]}',
    'sass-loader'
];

module.exports = {
    entry: './src/client.js',
    output: {
        filename: 'client.js', //this is the default name, so you can skip it
        path: path.resolve('./public'),
        //at this directory our bundle file will be available
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader'},
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: 'babel'
            },
            { test: /\.png$/, loader: 'url-loader?limit=100000' },
            { test: /\.jpg$/, loader: 'file-loader?lomit=100000' },
            { test: /\.scss$/, loader:  ExtractTextPlugin.extract('style-loader', styleLoaders.join('!')) },
            { test: /\.svg$/,
                loader: 'svg-sprite?' + JSON.stringify({
                    name: '[name]_[hash]',
                    prefixize: true,
                    spriteModule: path.resolve('./utils') + '/my-sprite'
                })
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        // This pulls out the CSS into a styles.css sheet instead of inlining style declarations
        new ExtractTextPlugin('style.css', { allChunks: true }),
    ]
}
