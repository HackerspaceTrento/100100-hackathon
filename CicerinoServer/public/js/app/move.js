define([ 'app/config', 'app/utils', 'jquery' ], function(config, utils, $) {

    var Move = function() {
        this.config = config;
        this.bind();
    };

    Move.prototype.api = function(op, then) {
        return $.get(this.config.roomba.baseUrl + '/' + op)
                .success(function(r) {
                    then && then(null, r);
                })
                .fail(function(r) {
                    then && then(r);
                });
    };

    Move.prototype.bind = function() {

        var me = this;
        var _kpress = function(ev) {

            console.log(ev, ev.keyCode);

            var op = null;
            switch(ev.keyCode) {
                case 38:
                    op = 'forward';
                    break;
                case 40:
                    op = 'backward';
                    break;
                case 39:
                    op = 'right';
                    break;
                case 37:
                    op = 'left';
                    break;
            }

            if(op) {

                if(me.lock) return false;
                me.lock = true;

                me.api(op, function(err, res) {

                    me.lock = false;

                    if(err) {
                        console.log(err);
                        return;
                    }

                });

                return false;
            }

        };

        if(utils.isMobile() || 1) {

            $('.btn-move').on('click', function() {
                _kpress({ keyCode: $(this).data('code') });
            });

            return false;
        }
        else {
            $('#keyb-view').hide();
        }

        $(window).off('keypress').on('keypress', __kpress);

//        $(el).off().on()


    };

    return new Move();
});