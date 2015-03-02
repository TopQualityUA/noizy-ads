var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    // the entry point of your library
    entry: {
        'background': './scripts/background/background.js',
        'worker': './scripts/background/worker.js',
        'chrome_reload': './scripts/background/chrome_reload.js',
        'content_pre_load': './scripts/content/content_pre_load.js',
        'content_after_load': './scripts/content/content_after_load.js',
        'options': './scripts/views/options.js',
        'popup': './scripts/views/popup.js'
    },
    resolve: {
        root: [
            __dirname + '/bower_components/',
            __dirname +'/node_modules/'
        ],
        extensions: ['', '.js'],
        modulesDirectories: ['bower_components', 'node_modules'],
        alias: {
            'jquery': __dirname + '/bower_components/jquery/dist/jquery.js',
            'io': __dirname + '/node_modules/socket.io/node_modules/socket.io-client/lib/index.js',
            'babel_polyfill': __dirname + '/node_modules/babel/polyfill.js',
            'brain': __dirname + '/node_modules/brain/brain-0.5.0.js'
        }
    },
    output: {
        // where to put standalone build file
        path: __dirname + '/dist/scripts',
        // the name of the standalone build file
        filename: '[name].js',
        chunkFilename: "[id].js",
        // the standalone build should be wrapped in UMD for interop
        libraryTarget: 'umd'/*,
        // the name of your library in global scope
        library: 'noizy_ads'*/
    },
    externals: {
        // Specify all libraries a user need to have in his app,
        // but which can be loaded externally, e.g. from CDN
        // or included separately with a <script> tag

        // 'jquery': 'jQuery'
    },
    module: {
        //preLoaders: [
        //    {
        //        test: /\.js$/, // include .js files
        //        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        //        loader: "jshint-loader"
        //    }
        //],
        loaders : [
            {
                test: /.*\.js$/,
                exclude: /node_modules|bower_components/,
                loader: 'babel-loader?experimental'
            }
        ]
    }/*,
    plugins: [
        new CommonsChunkPlugin({
         "name": "vendor",
         "filename": "vendor.js"
        })
    ]*//*,
    jshint: {
        // any jshint option http://www.jshint.com/docs/options/
        // i. e.
        camelcase: true,

        // jshint errors are displayed by default as warnings
        // set emitErrors to true to display them as errors
        emitErrors: false,

        // jshint to not interrupt the compilation
        // if you want any file with jshint errors to fail
        // set failOnHint to true
        failOnHint: false,

        // custom reporter function
        reporter: function(errors) { }
    }*/
};
