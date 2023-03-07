/**
 * 版本更新 
 * 新增了，
 * $.data(this,'plugin_ALL_tinyscrollbar');
 * => 获取到的值为object,分别对应x、y轴滚动条对象{ x:scrollbarX,y:scrollbarY };
 * $.data(this,'plugin_tinyscrollbar'); 依然默认获取 y轴滚动条对象
 * 
 * kevin浩 修改于 2019/05/24
 * 
 * 修改初始方式 不需要 html结构，兼容旧版本的 html+js 详情用法 看demo
 * kevin浩 修改于 2020/1/2
 * 
 * 如果使用刷新 html的时候，scrollbar也被清除了，使用tinyscrollbar 会默认识别是否含有scrollbar
 * 进行 初始化或update
 * kevin浩 修改于 2020/5/15
 * 
 * 上个版本的修改没有兼容到 上一版scroll.js的用法. 这里做了下修复
 *  kevin浩 修改于 2020/5/18
 * 
 * */
; (function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        factory();
    }
}(function () {
    "use strict";

    var pluginName = "tinyscrollbar"
        , defaults = {
            axis: 'y'
            , wheel: true
            , wheelSpeed: 40
            , wheelLock: true
            , touchLock: true
            , trackSize: false
            , thumbSize: false
            , thumbSizeMin: 20
        }
        ;

    function Plugin($container, options) {

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;

        this._name = pluginName;

        var self = this
            , isHorizontal = this.options.axis === 'x'
            , hasTouchEvents = ("ontouchstart" in document.documentElement)
            , wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                    "DOMMouseScroll" // let's assume that remaining browsers are older Firefox
            , mousePosition = 0
            , sizeLabel = isHorizontal ? "width" : "height"
            , posiLabel = isHorizontal ? "left" : "top"
            ;
        /**
         *  添加滚动条 结构
         * */
        _renderScrollBar()

        var $scrollbar = isHorizontal ? $container.find(".scrollbar.scrollbar_x") : $container.find(".scrollbar:not(.scrollbar_x)")
            , $viewport = $container.find(".viewport").eq(0)
            , $overview = $container.find(".overview").eq(0)
            , $track = $scrollbar.find(".track")
            , $thumb = $scrollbar.find(".thumb");

        this.contentPosition = 0;

        this.viewportSize = 0;

        this.contentSize = 0;

        this.contentRatio = 0;

        this.trackSize = 0;

        this.trackRatio = 0;

        this.thumbSize = 0;

        this.thumbPosition = 0;

        this.hasContentToSroll = false;

        function _initialize() {
            self.update();
            _setEvents();

            return self;
        }

        /**
         * You can use the update method to adjust the scrollbar to new content or to move the scrollbar to a certain point.
         *
         * @method update
         * @chainable
         * @param {Number|String} [scrollTo] Number in pixels or the values "relative" or "bottom". If you dont specify a parameter it will default to top
         */
        this.update = function (scrollTo) {
            // $viewport.css(sizeLabel, 'auto');
            var sizeLabelCap = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase();
            this.overviewSize = $overview[0]['client' + sizeLabelCap];
            this.viewportSize = $viewport[0]['offset' + sizeLabelCap];
            this.contentSize = $overview[0]['scroll' + sizeLabelCap];
            this.contentRatio = this.viewportSize / this.contentSize;
            this.trackSize = this.options.trackSize || this.viewportSize;
            this.thumbSize = Math.min(this.trackSize, Math.max(this.options.thumbSizeMin, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
            this.trackRatio = (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize);
            this.hasContentToSroll = this.contentRatio < 1;

            $scrollbar.toggleClass("disable", !this.hasContentToSroll);
            switch (scrollTo) {
                case "bottom":
                    this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0);
                    break;

                case "relative":
                    this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
                    break;

                default:
                    this.contentPosition = parseInt(scrollTo, 10) || 0;
                    this.contentPosition = Math.min(self.contentPosition, this.overviewSize - self.viewportSize);
                    this.contentPosition = this.contentPosition < 0 ? 0 : this.contentPosition;
            }

            this.thumbPosition = this.contentPosition / this.trackRatio;
            _setCss();

            return self;
        };

        /**
         * 向下兼容，老版本可以继续使用
         * 
         * 1)在使用滚动条时，可以不用再处理html和css 
         * 2)至于滚动条的背景色和滑块颜色可自主控制
         * 
         *  */
        function _renderScrollBar() {
            var hasScrollBarY = $container.find('.scrollbar:not(.scrollbar_x)').eq(0),
                hasScrollBarX = $container.find('.scrollbar.scrollbar_x').eq(0);
            /* 没有滚动条结构 */
            var horizontalScrollbar =
                '<div class="scrollbar scrollbar_x disable">' +
                '<div class="track">' +
                '<div class="thumb">' +
                '<div class="end"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            if (hasScrollBarX.length == 0 && hasScrollBarY.length == 0) {
                ;
                horizontalScrollbar = isHorizontal ? horizontalScrollbar : ''
                /*修改:在不消除原来绑定事件的情况下，添加滚动条-start*/
                var $innerElement = $container.contents().detach();
                var scrollHtml = $(
                    horizontalScrollbar +
                    '<div class="scrollbar disable">' +
                    '<div class="track">' +
                    '<div class="thumb">' +
                    '<div class="end"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="viewport">' +
                    '<div class="overview">' +
                    '</div></div> ');
                scrollHtml.find('.overview').append($innerElement);
                $container.css('position', 'relative').html(scrollHtml);
                /*修改:在不消除原来绑定事件的情况下，添加滚动条-end*/
            } else if (hasScrollBarX.length == 0 && hasScrollBarY.length == 1) {
                hasScrollBarY.before(horizontalScrollbar);
            }
            var scrollBarCss =
                '<style data-name="scrollbar">' +
                '.scrollbar {position: absolute; top: 0; right: 0; z-index: 8; width: 8px; height: 100%;}' +
                '.scrollbar.disable {display: none;}' +
                '.scrollbar.scrollbar_x { width: 100%; height: 10px; right: auto; top: auto; left: 0; bottom: 0; }' +
                '.scrollbar.scrollbar_x .track { height: 100%; }' +
                '.scrollbar.scrollbar_x .thumb { width: 100%; }' +
                '.scrollbar.scrollbar_x .thumb { height: 100%; }' +
                '.track {position: relative; width: 100%; cursor: pointer; }' +
                '.thumb {position: absolute; width: 100%; background: #65625f; }' +
                '.viewport {position: relative; height: 100%; overflow:hidden;}' +
                '.overview {position: absolute; width:100%;}' +
                '</style>';
            if ($('[data-name="scrollbar"]').length == 0) {
                $('head').append(scrollBarCss);

            }
        }

        function _setCss() {
            $thumb.css(posiLabel, self.thumbPosition);
            // $viewport.css(sizeLabel, self.trackSize);
            $overview.css(posiLabel, -self.contentPosition);
            $scrollbar.css(sizeLabel, self.trackSize);
            $track.css(sizeLabel, self.trackSize);
            $thumb.css(sizeLabel, self.thumbSize);
        }

        function _setEvents() {
            if (hasTouchEvents) {
                $viewport[0].ontouchstart = function (event) {
                    if (1 === event.touches.length) {
                        event.stopPropagation();

                        _start(event.touches[0]);
                    }
                };
            }
            $thumb.bind("mousedown", function (event) {
                event.stopPropagation();
                _start(event);
            });
            $track.bind("mousedown", function (event) {
                _start(event, true);
            });

            $(window).resize(function () {
                //self.update("relative");
            });

            if (self.options.wheel && window.addEventListener) {
                $container[0].addEventListener(wheelEvent, _wheel, false);
            }
            else if (self.options.wheel) {
                $container[0].onmousewheel = _wheel;
            }
        }

        function _isAtBegin() {
            return self.contentPosition > 0;
        }

        function _isAtEnd() {
            return self.contentPosition <= (self.contentSize - self.viewportSize) - 5;
        }

        function _start(event, gotoMouse) {
            if (self.hasContentToSroll) {
                $("body").addClass("noSelect");

                mousePosition = gotoMouse ? $thumb.offset()[posiLabel] : (isHorizontal ? event.pageX : event.pageY);

                if (hasTouchEvents) {
                    document.ontouchmove = function (event) {
                        // if (self.options.touchLock || _isAtBegin() && _isAtEnd()) {
                        //     event.preventDefault();
                        // }
                        event.touches[0][pluginName + "Touch"] = 1;
                        _drag(event.touches[0]);
                    };
                    document.ontouchend = _end;
                }
                $(document).bind("mousemove", _drag);
                $(document).bind("mouseup", _end);
                $thumb.bind("mouseup", _end);
                $track.bind("mouseup", _end);

                _drag(event);
            }
        }

        function _wheel(event) {
            if (self.hasContentToSroll) {
                // Trying to make sense of all the different wheel event implementations..
                //
                var evntObj = event || window.event
                    , wheelDelta = -(evntObj.deltaY || evntObj.detail || (-1 / 3 * evntObj.wheelDelta)) / 40
                    , multiply = (evntObj.deltaMode === 1) ? self.options.wheelSpeed : 1
                    ;

                self.contentPosition -= wheelDelta * multiply * self.options.wheelSpeed;
                self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));
                self.thumbPosition = self.contentPosition / self.trackRatio;

                /**
                 * The move event will trigger when the carousel slides to a new slide.
                 *
                 * @event move
                 */


                $thumb.css(posiLabel, self.thumbPosition);
                $overview.css(posiLabel, -self.contentPosition);

                $container.trigger("move");

                if (self.options.wheelLock || _isAtBegin() && _isAtEnd()) {
                    evntObj = $.event.fix(evntObj);
                    evntObj.preventDefault();
                }
            }
            event.stopPropagation();
        }

        function _drag(event) {
            if (self.hasContentToSroll) {
                // 默认是1920 的设计下的滚动条
                var screenRatio = 1920/document.documentElement.clientWidth;
                var mousePositionNew = isHorizontal ? event.pageX : event.pageY
                    , thumbPositionDelta = event[pluginName + "Touch"] ?
                        (mousePosition - mousePositionNew)/screenRatio : (mousePositionNew - mousePosition)
                    , thumbPositionNew = Math.min((self.trackSize - self.thumbSize), Math.max(0, self.thumbPosition + thumbPositionDelta))//这里除以10是为了在移动端滑动的时候距离不要太大
                    ;

                self.contentPosition = thumbPositionNew * self.trackRatio;

                $container.trigger("move");

                $thumb.css(posiLabel, thumbPositionNew);
                $overview.css(posiLabel, -self.contentPosition);
                if (typeof self.options.afterDrag == 'function') {
                    self.options.afterDrag.call(this, self);
                }
            }
        }

        /**
         * @method _end
         * @private
         */
        function _end() {
            self.thumbPosition = parseInt($thumb.css(posiLabel), 10) || 0;

            $("body").removeClass("noSelect");
            $(document).unbind("mousemove", _drag);
            $(document).unbind("mouseup", _end);
            $thumb.unbind("mouseup", _end);
            $track.unbind("mouseup", _end);
            document.ontouchmove = document.ontouchend = null;
        }

        return _initialize();
    }

    $(document).on('selectstart', 'body.noSelect', function () { return false; })

    /**
     * @class tinyscrollbar
     * @constructor
     * @param {Object} options
     @param {String} [options.axis='y'] Vertical or horizontal scroller? ( x || y ).
     @param {Boolean} [options.wheel=true] Enable or disable the mousewheel.
     @param {Boolean} [options.wheelSpeed=40] How many pixels must the mouswheel scroll at a time.
     @param {Boolean} [options.wheelLock=true] Lock default window wheel scrolling when there is no more content to scroll.
     @param {Number} [options.touchLock=true] Lock default window touch scrolling when there is no more content to scroll.
     @param {Boolean|Number} [options.trackSize=false] Set the size of the scrollbar to auto(false) or a fixed number.
     @param {Boolean|Number} [options.thumbSize=false] Set the size of the thumb to auto(false) or a fixed number
     @param {Boolean} [options.thumbSizeMin=20] Minimum thumb size.
     */

    $.fn[pluginName] = function (options) {
        var arr = [];
        var defaults = { axis: 'y' };//防止判断出差给出默认检查值 axis: 'y'
        /**
         * 
         * arr 当多个对象添加同时添加 滚动条的时候返回 滚动条对象本身
         * scrollObj 给当前对象data-plugin_ALL_tinyscroll 绑定方法 横or竖 滚动条 对象 {x:fn,y:fn} 
         * 

         *  */
        options = $.extend({}, defaults, options);
        this.each(function () {
            var scrollObj = $(this).data("plugin_ALL_" + pluginName);
            var hasScroll = scrollObj != undefined,
                hasScrollBarElement = $(this).find('.scrollbar').length;

            if (hasScroll) {
                if (hasScrollBarElement) {
                    if (scrollObj[options.axis]) {//老版本scroll.js 的用法兼容 
                        for (var fn in scrollObj) {
                            var upDate = options.update ? options.update : 'top';
                            //scrollObj[fn].update('relative');
                            scrollObj[fn].update(upDate);
                        }
                    } else {
                        scrollObj[options.axis] = new Plugin($(this), options);
                        arr.push($.data(this, "plugin_ALL_" + pluginName, scrollObj));
                    }
                } else {
                    for (var axis in scrollObj) {
                        scrollObj[axis] = new Plugin($(this), scrollObj[axis].options);
                        if (axis == 'y') {
                            $.data(this, "plugin_" + pluginName, scrollObj.y);
                        }
                    }
                    arr.push($.data(this, "plugin_ALL_" + pluginName, scrollObj));
                }
            } else {
                scrollObj = scrollObj || {};
                scrollObj[options.axis] = new Plugin($(this), options);
                /**
                 *  向下兼容,老版本的 支持这个 data属性 
                 *  绑在data-plugin_tinyscrollbar 的为 初始化的竖向滚动条对象 
                 *  修改bug 避免多次 实例化 
                 * */
                if (options.axis == 'y') {
                    $.data(this, "plugin_" + pluginName, scrollObj.y);
                }
                /**
                 *  绑在 data-plugin_ALL_tinyscrollbar 
                 *  {x:横滚动条对象,y:竖滚动条对象} 
                 * */
                arr.push($.data(this, "plugin_ALL_" + pluginName, scrollObj));

            }
        });
        /**
         * @elem [selector|'relative'|'bottom'] 默认为不设置 位置:顶部
         * [selector] 滚动范围包裹的节点对象 或 选择器 刷新时进行定位 
         * 'relative','bottom' 相对当前位置,底部位置
         *  */
        $.fn.updateScroll = function (elem) {
            var _this = $(this),
                $elem = $(elem),
                scroll = 0;

            var scrollObj = $(this).data("plugin_ALL_" + pluginName);
            var hasScroll = scrollObj != undefined,
                hasScrollBarElement = $(this).find('.scrollbar').length > 0;
            if (hasScroll && hasScrollBarElement) {
                for (var fn in scrollObj) {
                    if (fn == 'x') {
                        scrollVal(scrollObj[fn], 'left')
                    } else {
                        scrollVal(scrollObj[fn], 'top')
                    }
                }
            } else {
                console.warn('滚动条已经被破坏，请先初始化滚动条！！！')
            }
            function scrollVal(_scrollObj, position) {
                if ($elem.parents('.overview').length > 0) {
                    /* 之前的版本 */
                    // var temp = $elem;
                    // while (!temp.parent().hasClass('overview')) {
                    //     scroll += temp.position()[position];
                    //     temp = temp.parent();
                    // }
                    /* 解决 多层嵌套后，滚动条定位到该节点 失败的bug */
                    /* 改后的版本 */
                    var overviewOffsetTop = $elem.parents('.overview').offset()[position],
                        elemOffsetTop =  $elem.offset()[position];
                    scroll += elemOffsetTop - overviewOffsetTop;
                }
                scroll = scroll ? scroll > 0 ? scroll : 0 : 0;
                //新增 updateScroll 可以实现 相对位置 或者 底部以及顶部
                scroll = ((elem === 'relative' || elem === 'bottom') && scroll === 0) ? elem : scroll;
                //相对于overview的偏移量
                _scrollObj.update(scroll);
            }

            return _this;
        };
        return arr;
    };
}));
