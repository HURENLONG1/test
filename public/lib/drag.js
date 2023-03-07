(function ($) {
    var index = 0;
    var paddingTop = 52;
    var initDrag = false;
    var stamp = function (o, key) {
        return ++index;
    };
    var getPosition = function (el) {
        return el._drag_pos || function (el) {
            var offset = $(el).offset();
            return [offset.left, offset.top];
        }(el)
    }
    var setPosition = function (el, pos) {
        el.style.left = pos[0] + 'px';
        el.style.top = pos[1] + 'px';
        if (!el._drag_pos) {
            el.style.right = "auto";
            el.style.bottom = "auto";
            el.style.marginLeft = "0";
            el.style.marginTop = "0";
            el.style.transform = "none";
        }
        el._drag_pos = pos;
    }

    var adjustPosition = function (elements) {
        var $elements = elements ? $(elements) : $('.pos_drag');
        $elements.each(function (index) {
            var $this = $(this);
            if ($this.is(':visible')) {
                var $body = $('body');
                var offset = $this.offset();
                var elWidth = $this.outerWidth();
                var elHeight = $this.outerHeight();
                var bWidth = $body.outerWidth();
                var bHeight = $body.outerHeight();
                var pos = getPosition(this);
                if (offset.left <= 0) {
                    pos[0] = pos[0] - offset.left;
                } else if (offset.left + elWidth >= bWidth) {
                    pos[0] = pos[0] - (offset.left + elWidth - bWidth);
                } else {
                }
                if (offset.top <= paddingTop) {
                    pos[1] = pos[1] - offset.top + paddingTop;
                } else if (offset.top + elHeight >= bHeight) {
                    pos[1] = pos[1] - (offset.top + elHeight - bHeight);
                } else { }
                setPosition(this, pos);
            }
        });
    };
    //拖拽的实现
    var startDrag = function (pannel, body, fn) {
        var dragging = false;
        var iX, iY;
        var uKey = "drag_" + stamp();
        //pannel.css("cursor", "move");
        pannel.data("drag", "drag");
        pannel.data("panel", uKey);
        pannel.data("fn", fn);
        body.addClass(uKey);
        body.addClass('pos_drag');
        if (!initDrag) {
            initDrag = true;
            $(window).resize(function () { adjustPosition() });
            $(document).mousedown(function (e) {
                body = null;
                pannel = null;
                pannel = $(e.target);
                pannel = pannel.data("drag") ? pannel : pannel.parent();
                if (pannel.data("drag") && pannel.data("drag") == "drag" && pannel.data("panel")) { } else { return; }
                body = pannel.closest('.' + pannel.data("panel"));
                if (body.length == 0) return;
                dragging = true;
                body = body[0];
                iX = e.clientX;
                iY = e.clientY;
                var point = getPosition(body);
                if (point) {
                    iX = iX - point[0];
                    iY = iY - point[1];
                }
                return false;
            });
            $(document).mousemove(function (e) {
                if (dragging && body) {
                    $(body).attr("is_drag", dragging)
                    var e = e || window.event;
                    var oX = e.clientX - iX;
                    var oY = e.clientY - iY;
                    var point = [oX, oY];
                    if (pannel.data("fn")) {
                        pannel.data("fn")(body, point);
                    } else {
                        setPosition(body, point);
                    }
                    return false;
                }
            });
            $(document).on('mouseup mouseleave', function (e) {
                if (body) adjustPosition(body);
                dragging = false;
                iX = null;
                iY = null;
                pannel = null;
                body = null;
                uKey = null;
            });
        }
    };

    $.fn.drag = function (body, fn) {
        this.each(function (index, item) {
            new startDrag($(item), body || $(item.parentNode), fn);
        });
    }
})($);