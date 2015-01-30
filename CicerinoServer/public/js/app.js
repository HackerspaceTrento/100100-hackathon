define([ 'jquery', 'app/move', 'app/camera', 'app/sensors'  ], function($, appMove, appCamera, appSensors) {

    var App = function() {

        this.move = appMove;
        this.camera = appCamera;
        this.sensors = appSensors;

        $(document).foundation();
    };

    App.prototype.showCamera = function() {
        this.camera.start();
    };

    return new App();
});