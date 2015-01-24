define([ 'app/config',  'jquery', 'jsmpeg' ], function(config, $, jsmpeg) {

    var Camera = function() {

        this.config = config;
        this.img = null;

        var me = this;

        this.loadIp(function() {
            me.initialize();
        });

    };

    Camera.prototype.loadIp = function(then) {
        var me = this;
        $.get(config.baseUrl + '/yunIP').success(function(res) {
            me.config.camera.url = 'http://' + res.yunIP + ':8080/?action=stream';
            then && then();
        });
    };

    Camera.prototype.initialize = function() {

        this.img = $(this.config.camera.domElement);

        var me = this;
        var _set =  function() {
            me.img.attr('src', me.config.camera.url);
        };

        _set();

        var lasterr = null;
        var errcnt = 0;

        var errhandler = function() {

            errcnt++;

            if(errcnt > 5 && lasterr && ((new Date).getTime() - lasterr) < 500) {
                errcnt = 0;
                lasterr = null;
                me.img.off('error');
                me.img.attr('src', me.config.camera.defaultImage);
                return;
            }

            lasterr = (new Date).getTime();
            console.warn("ouch");
            _set();
        };

        me.img.on('error', errhandler);

        me.img.on('click', function() {
            me.img.off('error').on('error', errhandler);
            me.loadIp(function() {
                _set();
            });
        });

    };

    return new Camera;
});