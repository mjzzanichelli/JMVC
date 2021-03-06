// Karma configuration
// Generated on Thu Oct 16 2014 11:32:24 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'specs/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha','chai','sinon'],


    // list of files / patterns to load in the browser
    files: [
      "../../lib/jmvc.0.0.1.js",
      ""+ (require("./args")().get("test")||"*") + ".spec.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //reporters: ['dots','mocha','progress'],
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE', 'Safari', 'Opera'],
    //browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE', 'Safari'],
    browsers: ['PhantomJS'],
    //browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    plugins: [
    	'karma-mocha',
    	'karma-chai',
    	'karma-sinon',
    	'karma-mocha-reporter',
    	'karma-chrome-launcher',
      	'karma-phantomjs-launcher',
      	'karma-firefox-launcher',
      	'karma-ie-launcher',
      	'karma-safari-launcher',
      	'karma-opera-launcher',
    ],
    
  });
};
