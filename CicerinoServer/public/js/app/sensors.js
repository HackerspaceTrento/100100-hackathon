define([
    'app/config', 'jquery', 'backbone', 'underscore', 'smoothie',
    'text!template/sensorView.html',
], function (
        config, $, Backbone, _, smoothie,
        sensorViewTemplate
        ) {


    var SensorData = Backbone.Model.extend({
        idAttribute: 'time',
    });

    var SensorDataCollection = Backbone.Collection.extend({
        model: SensorData,
    });

    var SensorDataView = Backbone.View.extend({
        template: _.template(sensorViewTemplate),
        tagName: 'div',
        render: function () {

            this.$el.html(this.template(this.model.attributes));

        }
    });

    var Sensors = function () {

        this.config = config;
        this.btn = $('#btn-bar');

        this.initialize();
    }

    Sensors.prototype.initialize = function () {

        var me = this;

        me.graphView = $('#graph-view');
        me.videoView = $('#video-view');
        me.keybView = $('#keyb-view');


        var resizeChart = function (canvasEl) {
            canvasEl.prop('width', me.videoView.width());
            canvasEl.prop('height', $(window).height() - $('#btn-bar').height());
        };

        var alist = this.btn.find('a');
        alist.on('click', function () {

            var a = $(this);

            alist.removeClass('active');
            a.addClass('active');

            var type = a.data('type');

            if(type === 'webcam') {

                me.graphView.hide();
                me.videoView.show();
                me.keybView.show();

                return false;
            }

            var tpl = '<div class="row graph-view">\
                        <div class="columns large-12 small-12 medium-12">\
                            <canvas id="" width="100%" height="200"></canvas>\
                        </div>\
                    </div>';

            me.charts = me.charts || {};

            var _canvasId = 'canvas-' + type;
            var canvasEl = $('#' + _canvasId);
            $('.graph-view').hide();

            if(!canvasEl.size()) {

                var smoothieConf = {
                    verticalSections: 10,
                    millisPerPixels: 50
                };
                var timeSeriesConf = {
                    strokeStyle: 'rgba(0, 255, 0, 1)',
                    fillStyle: 'rgba(0, 255, 0, 0.2)',
                    lineWidth: 4
                };
                switch (type) {
                    case 'light':
                        timeSeriesConf = {
                            strokeStyle: 'rgba(255, 255, 255, 1)',
                            fillStyle: 'rgba(255, 255, 255, 0.2)',
                            lineWidth: 4
                        }
                        break;
                    case 'pressure':
                        break;
                    case 'sound':
                        break;
                    case 'temperature':
                        break;
                }

                var cel = $(tpl),
                    chart = me.charts[type] = new SmoothieChart(smoothieConf);
                cel.find('canvas').attr('id', _canvasId);
                cel.appendTo(me.graphView.children());

                canvasEl = $('#' + _canvasId);
                chart.addTimeSeries(me.dataset[type], timeSeriesConf);
                chart.streamTo(canvasEl[0], 1000);


                $(window).on('resize', function() {
                    resizeChart(canvasEl);
                });

                resizeChart(canvasEl);

            }

            canvasEl.parent().parent().show();

            me.graphView.show();
            me.videoView.hide();
            me.keybView.hide();

            return false;
        });

        this.connect();

    };

    Sensors.prototype.render = function (data) {

//        console.log(data);

        var me = this;
        data && Object.keys(data).forEach(function (key) {

            var el = $('#btn-' + key);
            if (el.size()) {


                var val = data[key][0].value,
                    ts  = data[key][0].time;
                var lbl = '';

                if (!val) {
                    val = '-';
                }
                else {
                    switch (key) {
                        case 'light':
                            lbl = "l";
                            break;
                        case 'pressure':
                            val = Math.round(val/100);
                            lbl = "bar";
                            break;
                        case 'sound':
                            lbl = "db";
                            break;
                        case 'temperature':
                            lbl = "°";
                            break;
                    }
                }

                me.dataset = me.dataset || {};
                var ds = me.dataset[key] = me.dataset[key] || new TimeSeries();

                ds.append(ts, val);


                el.find('label').text(val+lbl);
            }

        });

    };

    Sensors.prototype.connect = function () {

        var me = this;

        me.client = new WebSocket(me.config.sensors.wsUrl);

        me.client.onopen = function () {

        };

        me.client.onmessage = function (message) {
            message && me.render(JSON.parse(message.data));
        };

        me.client.onclose = function () {
            me.connect();
        };

    };

    return new Sensors();
});