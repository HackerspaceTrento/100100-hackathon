define(function() {

    var config = {};

    config.baseUrl = 'http://10.100.249.72:1337';

    config.roomba = {
        baseUrl: config.baseUrl + '/control/roomba'
    };

    config.camera = {
        defaultImage: 'img/plug.svg',
        domElement: '#videoCanvas',
//        url: 'http://10.100.1.235:8080/?action=stream',
    };

    config.sensors = {
        wsUrl: 'ws' + config.baseUrl.substr(4)
    };

    return config;
});