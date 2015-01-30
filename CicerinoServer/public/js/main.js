require.config({

    baseUrl: 'js',

    paths: {

        jquery: 'lib/jquery/dist/jquery.min',
        underscore: 'lib/underscore/underscore-min',
        backbone: 'lib/backbone/backbone',

        foundation: 'lib/foundation/js/foundation.min',

        jsmpeg: 'jsmpeg',
        smoothie: 'lib/smoothie/smoothie',

    },

    shim: {

        app: {
            deps: [ 'foundation' ]
        },

        foundation: {
            deps: [ 'jquery' ]
        },

        jsmpeg: {
            exports: 'jsmpeg'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }

});

require(['app']);