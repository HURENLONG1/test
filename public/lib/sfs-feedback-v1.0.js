//UMD 写法
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    //    methods
    var _plugins = ['alert','message','notice','popconfirm','modal','whitepaper']
     /**
     * @function sfs_alert
     * @param type [string]   default 默认|info 提示|success 成功|warn 警告|failure 失败|error 错误
     * @param title [string]   
     * @param message [string] 
     * @param close [bollen] 
     * @param duration [string] 停留时间 单位毫秒
     * @param timeout [string] 倒数时间 单位秒
     * @param direction [string] 方向 left|right|top|bottom 
     * @param detail [object] 
     *      {
                txt: '查看详情',
                cb: function () { 
                    console.log('查看详情');
                }
            }
     * @param back [object] 
     *      {
                txt: '返回首页',
                cb: function () { 
                    console.log('查看详情');
                }
            }
     * @param entrue [object] 
     *      {
                txt: '确定',
                cb: function () { 
                    console.log('查看详情');
                }
            }
     *  
     * @param cancel [object] 
     *      {
                txt: '取消',
                cb: function () { 
                    console.log('查看详情');
                }
            }
     *  
     */
    /**
     * @function initfulltext 自动检查是否添加了 标题
     */
    var init_fulltext = function () { 
        $(document).on('mouseover', '[sfstitle]', function (e) {
        e = e || window.event;
        var pos = { x: e.clientX||e.screenX,y: e.clientY||e.screenY };
        var docW = document.body.clientWidth;
        var docH = document.body.clientHeight;
        var $target = $(e.target);
        var inTarget = $target.attr('sfstitle')!==undefined;
        if (inTarget) {
            var fullText = $target.text();
            var titleW = $target.attr('title-width')||300;
            var $fullTextHtml = $('<div class="sfs_fulltext_wrapper" style="opacity:0;">\
                <span class="txt">'+ fullText + '</span>\
                </div>');
            if ($('.sfs_fulltext_wrapper').length == 0) {
            $('body').append($fullTextHtml);
            }
            var selfW = $fullTextHtml.outerWidth();
            var selfH = $fullTextHtml.outerHeight();
            var selfOffsetTop = $target.offset().top;
            var targetH = $target.outerHeight();
            var dx = dy = 0; var spaceW = 8;
            if (pos.x + selfW / 2 > docW) {//处理溢出右边屏幕
                dx = docW - selfW - spaceW;
            } else {
                dx = pos.x - selfW / 2;
                dx = dx > spaceW ? dx : spaceW;//处理溢出左边边屏幕
            }
            if (selfOffsetTop + targetH + selfH > docH) {
                dy = selfOffsetTop - selfH;
            } else {
                dy = selfOffsetTop + targetH;
            }
           /*  if (pos.y+ selfH > docH) {
                dy = pos.y - selfH;
            } else {
            dy = pos.y;
            } */
            $fullTextHtml.css({width:titleW, 'top': dy, left: dx }).animate({ 'opacity': 1 }, 300);
        }
        });
        $(document).on('mousemove', function (e) {
            e = e || window.event;
            var $target = $(e.target);
            var inTarget = $target.attr('sfstitle')!==undefined ||
                ($target.closest('.sfs_fulltext_wrapper').length > 0);
            if (!inTarget) {
                try {
                    $('.sfs_fulltext_wrapper').remove();
                } catch (err) { 
                    console.log(err)
                }
            }
        });
    }
    init_fulltext();
    /**
     * @function delay 延迟执行
     * @param {function} cb 
     */
    function delay(cb) { 
        setTimeout(function () {
            cb();
        }, 300);
    }
    /**
     * 
     * @param {ele} ele 
     * @param {*} options 
     */
    function Plugin(ele,options) {
        var defaults = {
            title: '',
            message: '',
            type: 'default',/* info|success|warn|error|failure */
            backdrop:false,
            duration: 3000,
            timeout:null,
            more: null,
            close: true,
            entrue: null,
            cancel: null,
            direction:'bottom',/* top|bottom|left|right */
            detail:null,
            back: null,
            // detail: {/* 成功--查看详情按钮 */
            //     txt: '查看详情',
            //     cb: function () { 
            //         console.log('查看详情');
            //     }
            // },
            // back: {/* 成功--返回首页按钮 */
            //     txt: '返回首页',
            //     cb: function () { 
            //         console.log('返回首页');
            //     }
            // }
            
            
        }
        this.ele = $(ele);
        this.html = new Object();
        this.options = $.extend(true,{}, defaults, options);
        for (var key in this.options) {
            this[key] = this.options[key];
        }
        this.render(options);
        this.addEvents();
        return this.html[this.pluginName];
    };
    Plugin.prototype.render = function () {
        var self = this;
        self.view()
        

    }
    Plugin.prototype.view = function () {
        var self = this;
        this._view();
         /**
         * notice 类型 可以往下叠加
         */
        // if (self.pluginName === 'notice') {
        //     var nofirstTime = $('.sfs_notice_wrapper').length > 0;
        //     if (!nofirstTime) {
        //         $('body').append('<div class="sfs_notice_wrapper"></div>')
        //     } 
        //     $('.sfs_notice_wrapper').append(self.html[self.pluginName]);
        //     setTimeout(function () {
        //         self.html[self.pluginName].addClass('sfs_show')
        //     });
        //     return;
        // };
        self.ele.append(self.html[self.pluginName]);
        if ((self.pluginName === 'modal'||self.pluginName === 'notice') && self.backdrop) {
            $('body').append(self.html.backdropHtml)
        }
        setTimeout(function () {
            self.html[self.pluginName].addClass('sfs_show')
        });
        /**
         * message 类型 一段时间自动隐藏
         */
        if (self.pluginName === 'message') {
            setTimeout(function () {
                self.html[self.pluginName].removeClass('sfs_show');
                delay(function () {
                    self.html[self.pluginName].remove();
                });
            },self.duration);
            
        }
        // return self.html[self.pluginName]
    }
    
    Plugin.prototype._view = function () { 
        var self = this;
        var iconSizeCls =  '';
        var itemsAlignCls =  '';
        if (self.title !== '') {
            iconSizeCls = 'iconsize22'
            itemsAlignCls= 'feedback_has_title'
        }
        if (self.pluginName === 'modal') {
            iconSizeCls = 'iconsize70'
            
        }
        /* 状态svg icon */
        var svgPath = {
            success: '<path  d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m182.739 276.693a8 8 0 0 0-11.112-0.205l-0.202 0.195-242.24 241.847a8 8 0 0 1-11.103 0.195l-0.202-0.195-89.305-89.16a8 8 0 0 0-11.112-0.185l-0.202 0.195-56.522 56.615a8 8 0 0 0-0.186 11.112l0.195 0.201L429.88 718.184a8 8 0 0 0 11.102 0.195l0.202-0.195 310.068-309.563a8 8 0 0 0 0.204-11.112l-0.195-0.202-56.522-56.614z"  />',
            info: '<path  d="M512 960c247.424 0 448-200.576 448-448S759.424 64 512 64 64 264.576 64 512s200.576 448 448 448z m40-604h-80a8 8 0 0 1-8-8v-80a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v80a8 8 0 0 1-8 8z m0 408h-80a8 8 0 0 1-8-8V424a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v332a8 8 0 0 1-8 8z"  />',
            warn: '<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>',
            error:  '<path  d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m40 604h-80a8 8 0 0 0-8 8v80a8 8 0 0 0 8 8h80a8 8 0 0 0 8-8v-80a8 8 0 0 0-8-8z m0-408h-80a8 8 0 0 0-8 8v332a8 8 0 0 0 8 8h80a8 8 0 0 0 8-8V268a8 8 0 0 0-8-8z"  />',
            failure: '<path  d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64zM401.691 333.81a8 8 0 0 0-11.111-0.196l-0.202 0.195-56.569 56.569a8 8 0 0 0-0.195 11.111l0.195 0.202L444.117 512 333.809 622.31a8 8 0 0 0-0.195 11.111l0.195 0.202 56.569 56.569a8 8 0 0 0 11.111 0.195l0.202-0.195L512 579.88l110.31 110.31a8 8 0 0 0 11.111 0.195l0.202-0.195 56.569-56.569a8 8 0 0 0 0.195-11.111l-0.195-0.202L579.882 512l110.309-110.309a8 8 0 0 0 0.195-11.111l-0.195-0.202-56.569-56.569a8 8 0 0 0-11.111-0.195l-0.202 0.195L512 444.118 401.691 333.809z"  />'
        }
        var iconType = self.type === "default" ||  self.type === "doing" ? 'info' : self.type;
        var statusHtml = '<span class="sfsicon '+iconSizeCls+'">\
                <svg class="sfs-'+ iconType +'-icon" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg" focusable="false">'
                 + svgPath[iconType] +   
                '</svg>\
            </span>';
        var moreBtnHtml = self.more?'<a href="javascript:;" class="more_btn">查看详情</a>':'';
        var closeBtnHtml = self.close&&self.pluginName!=='message'?'<span class="close_btn">×</span>' : '';
        var titleHtml = self.title !== '' ? '<div class="title">' + self.title + '</div>' : ''
        var messageHtml = '<div class="message"> <span class="txt"> ' +self.message+'<span>' + moreBtnHtml+ '</div>' ;
        var contentHtml = '<div class="content"> ' + titleHtml + messageHtml + '</div>';
        var entrueAndcancelHtml = (function () {
            var entrueHtml = '', cancelHtml = '';
            if (!self.entrue) return '';
            // if (self.entrue.cb) {
                entrueHtml = '<a href="javascript:;" class="entrue_btn">' + (self.entrue.txt ? self.entrue.txt : '确定') + '</a>';
                cancelHtml = '<a href="javascript:;" class="cancel_btn">' + (self.cancel&&self.cancel.txt ? self.cancel.txt : '取消') + '</a>';
            // }
         
            var html = '<div class="btn_group">' + cancelHtml + entrueHtml + '</div>';
            return html;
        })();
        function returnWidthFeedbackType(feedbackType) { 
            self.html[feedbackType] = $('<div class="sfs_feedback_wrapper sfs_'+ feedbackType +' '+ self.type + '_item '+self.direction +'_item '+itemsAlignCls+'">'+
                '<div class="feedback_body">'+statusHtml + contentHtml + closeBtnHtml +'</div>'  +
                '<div class="feedback_footer">'+entrueAndcancelHtml+' </div>'+
        '</div>');
        };
        /**
         * 可以复用结构的类型枚举
         */
        var someType = ['alert', 'message', 'notice', 'popconfirm'];
        for (let index = 0; index < someType.length; index++) {
            var _feedType = someType[index];
            returnWidthFeedbackType(_feedType)
        }
        

        var modalBtnsHtml = (function () {
            if (self.type === 'doing') {
                return '<div class="btn_group"><a href="javascript:;" class="ok_btn">知道了</a></div>';
                
            } else if (self.type === 'success') {
                var detailHtml = '', backHtml = '';
                if (self.detail) {
                    detailHtml = '<a href="javascript:;" class="detail_btn">' + (self.detail && self.detail.txt ? self.detail.txt : '查看详细') + '</a>';
                }
                if (self.back) {
                    backHtml = '<a href="javascript:;" class="back_btn">' + (self.back && self.back.txt ? self.back.txt : '返回首页') + '</a>';
                }
                if (self.detail || self.back) {
                    return '<div class="btn_group">' + detailHtml + backHtml + '</div>'
                } else {
                    return '';
                }
            } else {
                return '';
            }
        })();
        /**
         * 秒数，回调2个参数都不能少
         */
        var modalCloseHtml = '';
        var timeOutHtml = '';
        if (self.timeout && self.timeout.time && self.timeout.cb) {
            timeOutHtml = '<span class="modal_timeout"><span class="time">' + self.timeout.time + '</span>秒后，</span>';
        } else {
            modalCloseHtml = '<span class="close_btn">×</span>'
        }
        self.html.modal = $('<div class="sfs_modal '+ self.type+'_item">'+statusHtml+
        modalCloseHtml+
        '<div class="content"> ' + titleHtml + 
        '<p class="message">'+ timeOutHtml + self.message +'</p>\
        </div>'+ modalBtnsHtml +
            '</div>');
        var tiptxt = self.type === 'networkerror' ? '网络故障，找不到页面' : '暂时找不到数据';
        self.html.whitepaper = $('<div class="sfs_whitepaper"> <div class="paperimg '+self.type+'"></div> <div class="message">'+tiptxt+'</div> </div>');
        self.html.backdropHtml = $('<div class="feedback_backdrop"></div>');
        
        
    }
    Plugin.prototype.addEvents = function () {
        var self = this;

        self.html.alert.on('click','.close_btn',function () {
            var fn = self.close;
            self.destroy(fn)
        }).on('click','.more_btn',function () {
            if (typeof self.more === 'function') {   
                self.more();
            };
        });
        /**
         * notice & popconfirm 事件一样 
         * 确定||取消
        */
        if (self.pluginName === 'notice' || self.pluginName === 'popconfirm') {
            self.html[self.pluginName].on('click', '.btn_group a,.close_btn', function () {
                var isEntrue = $(this).hasClass('entrue_btn');
                var isCancel = $(this).hasClass('cancel_btn');
                var fn = '';
                if (isEntrue && self.entrue && typeof self.entrue.cb==='function') {
                    fn = self.entrue.cb;
                };
                if (isCancel && self.cancel && typeof self.cancel.cb==='function') {
                    fn = self.cancel.cb;
                };
                self.destroy(fn)
            });
        }
        self.html.modal.on('click', '.btn_group a,.close_btn', function () {
            var fn = '';
            var isDetail = $(this).hasClass('detail_btn');
            var isBack = $(this).hasClass('back_btn'); 
            if (isDetail&&self.detail && typeof self.detail.cb === 'function'){
                    fn = self.detail.cb;
            }
            if(isBack&&self.back&&typeof self.back.cb==='function'){
                fn = self.back.cb;
            }
            self.destroy(fn)

        });
        /**
         * 倒数
         */
        countdown();
        function countdown() { 
            if (!(self.timeout && self.timeout.time && self.timeout.cb)) return;
            var time = self.timeout.time;
            var countdownTimer = setInterval(function(){
                if (time > 0) {   
                    time--
                    self.html.modal.find('.modal_timeout .time').text(time);
                } else {
                    clearInterval(countdownTimer);
                    var fn = self.timeout.cb();
                    self.destroy(fn)
                }
            }, 1000);
        }
    }
    Plugin.prototype.destroy = function (fn) { 
        var self = this;
        self.html[self.pluginName].removeClass('sfs_show');
        delay(function () { 
            self.html[self.pluginName].remove();
            if (self.backdrop) {   
                self.html.backdropHtml.remove();
            }
            if (typeof fn === 'function') { fn() };
        })
    }
    $(_plugins).each(function (index,item) { 
        $['sfs_'+item] = $.fn['sfs_'+item] = function () { 
            var _self = this;
            var options = arguments[0];
            options.pluginName = item; 
            if (_self.length > 0 && typeof _self === 'object') {
                $(_self).each(function () { 
                    return new Plugin(this,options)
                })
            } else {
                return new Plugin('body',options)
            }
           
        }
    })
    
}));