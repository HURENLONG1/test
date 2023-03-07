var $work_page = $(".work_page");
var $main = $work_page.find(".center .main");
var $top = $work_page.find(".top");
var flag = false;
var kuang_w = 0;
var num = 100
var scr_t = $main.find(".main_right .main_right_main .data_panel .msg:first");
var s1 = 0
var float_ = 0
var id = 0
var bottom = 0
var $reanalyse = $(".reanalyse");


$(function () {



    $top.find(".btns").on("click", ".btn_item", function () {
        $(this).addClass("cur").siblings(".btn_item").removeClass("cur")
    })

    // 滚动条
    $main.find(".left_item").tinyscrollbar()

    set_scrollbar()

    // 屏幕发生变化
    window.onresize = function () {
        set_bottom();
        setdis();
        set_scrollbar();
        set_left();
        judge_w()
        // console.log(document.body.offsetWidth );
    }


    // 隐藏文字
    $main.find(".main_right .btns a .txt").each(function (index, item) {
        if ($(item).text().length >= 4) {
            $(item).addClass("txt_over").siblings(".icon").remove()
        }
    })

    // 右侧面板按钮划过
    $main.find(".main_right .page_bar a").hover(function () {
        // if(!$(this).hasClass("change")){
        $(this).addClass("cur")
        // }
    }, function () {
        if (!$(this).hasClass("change")) {
            $(this).removeClass("cur")
        }
    })
    // pagebar添加选中状态
    $main.find(".main_right ").on("click", ".page_bar a", function (e) {
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }

        if ($(this).hasClass("icon-bianji1")) {
            $(this).toggleClass("change").siblings("a").removeClass("change cur").find(".msg").fadeOut(300)
        }
        if ($(this).hasClass("btn1")) {
            $(this).find(".icon").toggleClass("icon-atlas-down icon-atlas-up")
            $(this).toggleClass("btn_add")
            if (!$(this).hasClass("btn_add")) {
                $(this).siblings("a").fadeIn(300)
            } else {
                hidden()
            }
        }

        if (!$(this).hasClass("change") && $(this).hasClass("icon-bianji1")) {
            $(this).removeClass("cur")
        }
    })

    // 左侧按钮收起
    if ($main.find(".main_left .main_left_top .btns a").length > 4) {
        var arr = $main.find(".main_left .main_left_top .btns a").slice(4, $main.find(".main_left .main_left_top .btns a").length);
        var more = '<a href="javascript:;" class="more"><span class="txt ">更多</span>\
        <span class="icon icon-atlas-down"></span>\
    </a>'

        arr.each(function (index, item) {
            $main.find(".main_left .main_left_top .btns .panel_btns").append($(item))
        })
        $main.find(".main_left .main_left_top .btns").append(more)
    }


    // 点击任意地方收起下拉框
    $(document).on("click", function (e) {
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        $(".panel_btns").fadeOut(300);
        $work_page.find(".center .top .operation .other .btn_item_list").fadeOut(300);
        $main.find(".fj .fj_main .file_panel .file_item .operation_panel").fadeOut(300);
        // $main.find(".main_right .main_right_main .data_panel .msg .msg_w .page_bar a .msg").fadeOut(300)
        // $main.find(".main_right .main_right_main .data_panel .msg .msg_w .page_bar a .msg").fadeOut(300)
        // $main.find(".main_right .main_right_main .data_panel .msg .msg_w .page_bar a").removeClass("change cur")
    })

    // 功能切换
    $main.find(".main_left .main_left_top ").on("click", ".btns a", function (e) {
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }

        $(this).addClass("cur").siblings("a").removeClass("cur");
        if ($(this).hasClass("more")) {
            $(this).siblings(".panel_btns").fadeToggle(300)
        }
        var $ref = $(this).data().ref;
        $main.find(".main_left .center .srcool_bar[data-ref=" + $ref + "]").fadeIn(300, function () {
            set_scrollbar()
        }).siblings(".srcool_bar").fadeOut(300);
        if ($(this).parent(".panel_btns").length >= 1) {
            $(this).parent().siblings(".more").find(".txt").text($(this).find(".txt").text());
            $(this).parent(".panel_btns").fadeOut(300)
        } else {
            $main.find(".main_left .main_left_top .btns .more .txt").text("更多")
        }

        if ($(this).data().ref === "fj") {
            $main.find(".fj .file_panel .file_item >.title .txt").width(346)
        }

        setTimeout(function () {
            settba()
        }, 0.1)

    })

    $main.find(".bd .bd_list .list .item").hover(function () {
        $(this).find("a").stop().fadeIn(300)
    }, function () {
        $(this).find("a").stop().fadeOut(300)
    })
    $main.on("click", ".bd .footer", function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        $(".proint_wrap").fadeIn(300)
    })

    // 打印面板
    $(".proint_wrap").find(".proint_panel .proint_panel_main").on("click", ".main_btns a", function () {
        $(this).addClass("cur").siblings("a").removeClass("cur");
        if ($(this).hasClass("btn1")) {
            $(".proint_wrap").find(".proint_panel .proint_panel_main .func_panel .all_proint").fadeOut(300, function () {
                $(this).siblings(".odd").fadeIn(300)
            })
        }
        if ($(this).hasClass("btn2")) {
            $(".proint_wrap").find(".proint_panel .proint_panel_main .func_panel .odd").fadeOut(300, function () {
                $(this).siblings(".all_proint").fadeIn(300, function () {
                    $(".proint_wrap").find(".proint_panel .proint_panel_main .all_proint").tinyscrollbar({
                        update: "relative"
                    })
                });
            })
        }
    })
    $(".proint_wrap").find(".proint_panel .proint_panel_main").on("click", ".func_panel .list .item", function () {
        $(this).find(".icon").addClass("icon-dot").siblings(".item").find(".icon").removeClass("icon-dot")
        $(this).siblings(".item").find(".icon").removeClass("icon-dot")
    })
    $(".proint_wrap").find(".proint_panel .proint_panel_main .func_panel .all_proint").on("click", ".all_proint_list .item .title_box", function (e) {
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        $(this).find(".icon-arrow1").toggleClass('change')
        $(this).find(".switch").toggleClass('icon-folder-open icon-folder')
        $(this).siblings(".list").fadeToggle(300, function () {
            $(".proint_wrap").find(".proint_panel .proint_panel_main .all_proint").tinyscrollbar({
                update: "relative"
            })
        })
    })

    $(".proint_wrap").find(".proint_panel .proint_panel_main .func_panel .all_proint").on("click", ".all_proint_list .item .kuang_box", function (e) {
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if ($(this).siblings(".switch").length === 0) {
            $(this).toggleClass("icon-dagou").parent().parent().siblings(".item").find(".icon-dagou").removeClass("icon-dagou")
        } else {
            $(this).toggleClass("icon-dagou")
        }
        if ($(this).parent().parent().parent().find(".kuang_box").length >= 1) {
            $(this).parents(".list").siblings(".title_box").find(".kuang_box").addClass("icon-dagou")
        } else {
            $(this).parents(".list").siblings(".title_box").find(".kuang_box").removeClass("icon-dagou")
        }

        if ($(this).hasClass("icon-dagou")) {
            $(this).parent(".title_box").siblings(".list").find(".kuang_box:first").addClass("icon-dagou")
        } else {
            $(this).parent(".title_box").siblings(".list").find(".kuang_box").removeClass("icon-dagou")
        }
    })
    $(".proint_wrap").find(".proint_panel .footer").on("click", ".footer_btns a", function () {
        $(".proint_wrap").fadeOut(300)
    })



    // 相关资源
    $main.on("click", ".xgzy .xgzy_item .title", function () {
        $(this).siblings("ul").stop().slideToggle(300, function () {
            $main.find(".left_item").tinyscrollbar({
                update: "relative"
            })
        });
        $(this).find(".icon").stop().toggleClass("icon-atlas-down icon-atlas-up");
        $main.find(".main_right .top_btns .top_btns_all .all_btn a").removeClass("cur")
        var linkType = $(this).data('linktype');
        var linkUrl = $(this).data('linkurl');
        if (linkUrl && linkUrl != 'NULL') {
            if (linkType == "0") {
                window.open(linkUrl);
            } else if (linkType == "1") {
                var rKey = $(this).data('rkey');
                var rText = $(this).data('text');
                SFS.BusinessView.openIFrameTab(rKey, rText, linkUrl, true);
            } else {
                var rKey = $(this).data('rkey');
                var rText = $(this).data('text');
                var $this = $(this);
                SFS.Ajax.getDialogHtml(rKey, 'get', linkUrl, undefined, undefined, undefined, true, {
                    target: $this
                });
            }
        }
    })
    $main.on("click", ".xgzy .xgzy_item .list .item", function () {
        $(this).addClass("cur").siblings(".item").removeClass("cur");
        var $this = $(this)
        $main.find(".main_right .top_btns .top_btns_all .all_btn a").removeClass("cur")
        add_label($this)

    })

    // 协同业务
    $main.on("click", ".xtyw .xtyw_item .title", function () {
        $(this).find(".icon").toggleClass(" icon_change")
        $(this).siblings(".list").slideToggle(300, function () {
            $main.find(".left_item").tinyscrollbar({
                update: "relative"
            })
        })
    })

    // 任务
    $main.find(".rw .main_left_main").on("click", ".item .title", function () {
        $(this).find(".icon").toggleClass("icon-atlas-down icon-atlas-up");
        $(this).siblings(".list").slideToggle(300, function () {
            $main.find(".left_item").tinyscrollbar({
                update: "relative"
            })
        })
    })

    // 附件
    $main.on("click", ".fj .btns .operation a", function (e) {

        $(this).toggleClass("cur").siblings("a").removeClass("cur");
        if ($(this).hasClass("batch")) {
            $(this).siblings("a").toggleClass("disabled_click");
            $main.find(".fj .fj_main .file_panel .icon-more3").toggleClass("disabled_click");
            $main.find(".fj .fj_main .btns").slideToggle(300, function () {
                $main.find(".left_item").tinyscrollbar({
                    update: "relative"
                })
            })
            $main.find(".fj .fj_main .file_panel .file_item .title .icon_box .kuang").toggleClass("kuang_cur").removeClass("icon-dagou")
            kuang_w = $main.find(".fj .fj_main .file_panel .kuang_cur").first().outerWidth(true);
            settba();
            $main.find(".main_left .center .fj .fj_main .btns .check_box .kuang").removeClass("icon-dagou")
        }
    })
    // 添加选中状态
    $main.on("click", ".fj .fj_main .file_panel .file_item .title .icon_box .kuang_cur", function (e) {
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }

        $(this).toggleClass("icon-dagou");
        if ($(this).hasClass("icon-dagou")) {
            $(this).parent().parent().siblings(".list").find(".kuang").addClass("icon-dagou")
        } else {
            $(this).parent().parent().siblings(".list").find(".kuang").removeClass("icon-dagou")
        }
        var all_lsit = $(this).parents(".list");
        all_lsit.each(function (index, item) {
            if ($(item).find(".kuang").length === $(item).find(".icon-dagou").length) {
                $(item).siblings(".title").find(".kuang").addClass("icon-dagou")
            } else {
                $(item).siblings(".title").find(".kuang").removeClass("icon-dagou")
            }
        })

        is_all_check()
    })

    $main.on("click", ".fj .fj_main .file_panel .file_item .title", function (e) {
        set_w = $(this)
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        $(this).find('.direction ').toggleClass("icon_change").siblings(".wenjian").toggleClass("icon-folder icon-folder-open");
        // 改
        $(this).parents(".file_panel").find(".cur").removeClass("cur");
        


        $(this).addClass("cur")
        $(this).siblings(".list").slideToggle(200, function () {
            $main.find(".left_item").tinyscrollbar({
                update: "relative"
            });
        })
        if ($(this).siblings(".list").length < 1 && $(this).find(".wenjian").length < 1) {
            $main.find(".fj .fj_main .file_panel").find(".cur").removeClass("cur")
            $(this).toggleClass("cur");
            $this = $(this)

            $main.find(".main_right .top_btns .top_btns_all .all_btn a").removeClass("cur")
            // add_label($this)


        }
        $(this).find(".operation_panel").fadeOut(300)


    })

    $main.on("click", ".fj .fj_main .file_panel .file_item .title .icon-more3", function (e) {
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        var $this = $(this)
        // $main.find(".fj .fj_main .file_panel .file_item .operation_panel").css("display", "none");
        $(".operation_panel").removeClass("operation_panel_top").fadeOut(100)
        $this.parent().siblings(".operation_panel").fadeIn(100);
        is_exceed($this.parent().siblings(".operation_panel"))

    })
    $main.on("click", ".fj .fj_main .file_panel .file_item .operation_panel a", function (e) {
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        $(this).parent().fadeOut(300)
    })

    // 删除附件
    $main.find(".fj .fj_main ").on("click", ">.btns a", function () {
        if ($(this).hasClass("del_")) {
            $main.find(".fj .fj_main .file_panel .file_item .title .icon-dagou").parent().parent().parent().remove()
        }
    })
    // 移动附件
    var m_parent
    var s = null
    var n = 0
    var finish = 10
    // n和finish是防止误触文件拖动。鼠标移动的过程中使n++，当n大于finish的时候才会做出相应的动作
    // 按下
    $main.on("mousedown", ".fj .fj_main .file_panel .file_item .title", function (e) {
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        s = $(this)
        m_parent = $(this).parent()
        flag = true

        // 这个判断防止点击更多而触发文件拖拽事件
        if ($(this).parents(".list").length >= 1 && !$(e.target).hasClass("icon-more3")) {
            if (flag === true) {
                var c_title = $(this).clone().addClass("c_title");//克隆元素
                $main.on("mousemove.c_title", ".fj .fj_main .file_panel .file_item .title", function (e) {
                    n++
                    if ($("body").find(".c_title").length === 0 && n >= finish) {
                        // 防止body被添加多个被复制的元素
                        $("body").append(c_title);
                    }

                    // 设置被复制元素的位置
                    $(".c_title").css({
                        position: "fixed",
                        left: e.screenX - 204 + "px",
                        top: e.screenY - 95 + "px"
                    })

                    $main.find(".fj .fj_main .active").removeClass("active"); //给划过的的文件添加蓝色的下划线

                    // 判断鼠标划过的目标文件是不是这个文件本身，是就添加蓝色下划线
                    if (!s.siblings(".list").is($(this).parent().parent()) && n >= finish) {
                        $(this).addClass("active");
    
                    }

                    $main.find(".fj .fj_main .file_panel .wenjian").removeClass("set_size") //去除文件夹放大的样式

                    // 判断鼠标划过的目标文件是不是这个文件本身。不是就去除蓝色下划线
                    if ($(e.target).hasClass("wenjian") && !s.siblings(".list").is($(this).parent().parent())) {
                        $main.find(".fj .fj_main .file_panel .active").removeClass("active")
                        $main.find(".fj .fj_main .file_panel .wenjian").removeClass("set_size")
                        $(this).find(".wenjian").addClass("set_size")
                    }
                })

                // 鼠标抬起
                $main.on("mouseup.c_title", ".fj .fj_main  .file_panel .file_item .title", function () {

                    // 判断被拖动的文件能否被放入目标文件夹
                    if ($(this).hasClass("active") && !$(this).is(s) && !s.siblings(".list").is($(this).parent().parent()) && n >= finish) {

                        // 重置移动
                        n = 0

                        // 判断目标文件夹是否有兄弟
                        if ($(this).siblings(".list").length == 0) {
                            $(this).parent().after(m_parent)
                        }
                        // 判断目标文件夹是否有兄弟
                        if ($(this).siblings(".list").length >= 1) {
                            $(this).parents(".list").find(".active").parent().after(m_parent)
                        }

                        // 文件被放入目标文件夹后重新计算一下缩进
                        setTimeout(function () {
                            settba()
                        }, 0.3)
                    }
                    if ($(this).find(".wenjian").hasClass("set_size") && !$(this).is(s) && !s.siblings(".list").is($(this).parent().parent()) && n >= finish) {
                        n = 0
                        // 判断目标文件夹是否存在文件，不存在就直接添加进去
                        if ($(this).siblings(".list").find(".list").length == 0) {
                            $(this).siblings(".list").append(m_parent)
                        }
                        // 存在就添加在最后
                        if ($(this).siblings(".list").find(".list").length >= 1) {
                            $(this).siblings(".list").find(".list:first").parent().before(m_parent)
                        }
                        // 重新计算缩进
                        setTimeout(function () {
                            settba()
                        }, 0.3)
                    }
                    $main.find(".fj .fj_main .file_panel .wenjian").removeClass("set_size")
                    $main.off("mousemove morseup");
                    $main.find(".fj .fj_main .active").removeClass("active")
                    flag = false;
                })
                $(document).on("mouseup.c", function () {
                    $main.off("mousemove morseup");//删除事件
                    $(".c_title").remove();
                    $(document).off("mouseup.c");
                    $main.find(".fj .fj_main .active").removeClass("active");
                    flag = false;
                })
            }
        }
    })

    // 表单
    $main.find(".bd").on("click", ".top .printer_panel a", function () {
        $(this).addClass("cur").siblings("a").removeClass("cur")
        var this_c = $(this).find("span").attr("class")
        $(this).parents(".bd").find(".bd_list .list .item").css("display", "none")

        $(this).parents(".bd").find(".bd_list .list .item .icon").each(function (index, item) {
            if ($(item).hasClass(this_c)) {
                $(item).parents(".item").fadeIn(400);
            }
        })
        if ($(this).hasClass("all")) {
            $(this).parents(".bd").find(".bd_list .list .item").fadeIn(300)
        }
    })
    // 表单打印机
    $main.find(".bd .bd_list .list").on("click", " .item .btn", function (e) {
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    })
    hidden()

    // 右侧按钮点击添加背景色
    $main.on("click", '.main_right .btns a', function () {
        $(this).toggleClass("cur").siblings("a").removeClass("cur")
        var ref = $(this).data().ref;
        var a_height = 0
        scr_t.find("." + ref).prevAll().each(function (index, item) {
            a_height += $(item).height()
        })
        scr_t.scrollTop(a_height)

    })

    // 右侧头部可拖动按钮
    // 添加cur
    $main.find(".main_right .top_btns ").on("click", ".top_btns_all .all_btn a", function (e) {
        $(this).addClass("cur").siblings("a").removeClass("cur");
        $($main.find(".main_right .main_right_main .data_panel >.msg")[$(this).index()]).fadeIn(300).siblings(".msg").fadeOut(300)
        scr_t = $($main.find(".main_right .main_right_main .data_panel >.msg")[$(this).index()])
        $main.find(".main_right >.btns .cur").removeClass("cur")
        hidden()
        set_left();
        set_bottom();
    })
    $main.find(".main_right .top_btns ").on("click", ".top_btns_all .all_btn a .icon-delete", function (e) {
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        var $this_w = $(this).parent().outerWidth(true);
        var all_btn_l = parseInt($(this).parents(".all_btn").css("left"));
        $(this).parents(".all_btn").css("left", $this_w + all_btn_l + 'px')
        $(this).parent().remove()
        setdis()
        var $id = $(this).parent().attr('id')
        var $ele = $main.find(".main_left #" + $id)
        $ele.removeClass("exist").removeAttr("id");
        scr_t.fadeOut(300, function () {
            scr_t = $main.find(".main_right .main_right_main .data_panel >.msg:last")
            $main.find(".main_right .main_right_main .data_panel >.msg:last").fadeIn(300, function () {
                set_left();
            });

            hidden()
        });
    })

    setdis()

    // 左右移动
    float_ = s1

    $main.find(".main_right ").on("click", ".top_btns .direction_btn", function () {

        if ($(this).hasClass("icon-atlas-next")) {

            float_ -= num
            if (float_ <= -($main.find(".main_right .top_btns .top_btns_all .all_btn").outerWidth() - $main.find(".main_right .top_btns .top_btns_all").outerWidth())) {
                float_ = -($main.find(".main_right .top_btns .top_btns_all .all_btn").outerWidth() - $main.find(".main_right .top_btns .top_btns_all").outerWidth())
            }
            $(this).siblings(".top_btns_all").find(".all_btn").css("left", float_ + "px")

        }
        if ($(this).hasClass("icon-atlas-prev")) {

            float_ += num
            if (float_ >= 0) {
                float_ = 0
            }
            $(this).siblings(".top_btns_all").find(".all_btn").css("left", float_ + "px")
        }
    })

    // 头部鼠标鼠标划过
    $work_page.find(".center .top .operation a").on("click", function () {
        $(this).addClass("cur").siblings().removeClass("cur").find(".btn_item_list").fadeOut(300);
        $(this).siblings(".other").find("a").removeClass("cur");
    })
    $work_page.find(".center .top .operation .other").on("click", function (e) {
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        $(this).addClass("cur").siblings("a").removeClass("cur");
        $(this).find(".btn_item_list").fadeToggle(300)
        $(this).find(".gd .icon").toggleClass("icon-atlas-down icon-atlas-up");

    })
    $work_page.find(".center .top .operation .other").on("click", ".btn_item_list .list .item", function () {
        $(this).addClass("cur").siblings(".item").removeClass("cur")
    })

    // 头部按钮隐藏
    if ($work_page.find('.center .top .operation >a').length >= 8) {
        var arr = $work_page.find('.center .top .operation >a').slice(8, $work_page.find('.center .top .operation >a').length);
        arr.each(function (index, item) {
            $work_page.find('.center .top .operation .other .btn_item_list').append($(item))

        })

    }

    set_left()

    // 任务
    $main.find(".main_left .center ").on("click", ".rw .main_left_main .item ul .list_item", function () {
        var opertype = $(this).data('opertype');
        var operkey = $(this).data('operkey');
        var bimId = $('.layout').data('bimid');
        var key = $('.layout').data('key');
        var navid = $('.layout').data('navid');
        var operparams = $(this).data('params');
        var gkey = $(this).data('gkey');
        var desc = $(this).data('desc');
        switch (opertype) {
            case 'EditForm':
                var formItem = $('.bd_list .list .wh-add[data-formid=' + operkey + ']');
                if (formItem.length > 0)
                    SFS.BusinessView.openForm($(formItem[0]).data('text'), bimId, bimId, operkey, operparams, key, navid, $(formItem[0]).data('customtemplate'));
                else
                    alert('表单[' + operkey + ']没有填写权限或不存在！');
                break;
            case 'PrintForm':
                SFS.BusinessView.printForm(bimId, bimId, operkey, operparams, key, navid);
                break;
            case 'OpenAffix':
            case 'OpenAffix_Text':
                SFS.BusinessView.openAffix(bimId, operkey, operparams, undefined, true);
                break;
            case 'OpenAffixFolder':
            case 'OpenAffixFolder_Text':
                SFS.BusinessView.openAffix(bimId, operkey, operparams);
                SFS.Ajax.getData('get', SFS.RootUrl + '/WorkFlow/SetCaseGuideItemState', {
                    caseId: bimId,
                    gkey: gkey
                });
                break;
            case 'UploadAffix':
            case 'UploadAffix_Text':
                SFS.BusinessView.uploadAffix(bimId, operkey, operparams);
                break;
            case 'OpenGPY':
            case 'OpenGPY_Text':
                SFS.BusinessView.openGPY(bimId, operkey, operparams);
                break;
            case 'Synergism':
                SFS.BusinessView.synergism(operkey);
                break;
            case 'Action':
                if (operparams && operparams.ACTIONTYPE) $(this).data("type", operparams.ACTIONTYPE);
                SFS.ViewAction.DoAction(operkey, desc, operparams, $(this));
                break;
        }
    })

    // 弹窗关闭
    $(".proint_wrap").find(".proint_panel").on("click", ".proint_panel_top .icon-delete", function () {
        $(".proint_wrap").fadeOut(300)
    })


    // pagebar跟随滚动条
    set_bottom()

    function set_bottom() {

        var msg_h = scr_t.height();
        var msg_w_h = scr_t.find(" .msg_w").height();
        scr_t.scrollTop(0)
        scr_t.find(".msg_w .page_bar").css("bottom", msg_w_h - msg_h + 24 + 'px')
        bottom = parseInt(scr_t.find(" .msg_w .page_bar").css("bottom"))
    }

    $main.find(".main_right .main_right_main .data_panel >.msg").scroll(function () {

        var scroll_top = scr_t.scrollTop()
        scr_t.find(".msg_w .page_bar").css("bottom", bottom - scroll_top + "px")

    })

    // 默认选中重新分析第一条；
    $main.find(".xgzy .kjfxbg_ .list >.item:first").click()

    // 重新分析
    var $add_ele
    $main.find(".xgzy .kjfxbg_ ").on("click", ".title .reanalyse", function (e) {
        $reanalyse.find('.reanalyse_panel .main .reason_inp .inp_box .select-wrapper .icon_box .txt').text("").parents(".reason_inp").siblings(".remark_box").find("textarea").val("")
        $reanalyse.fadeIn(300)
        $add_ele = $(this);
        $add_ele.parent().siblings(".list").find(".item:last .txt2").css("display", "none").siblings(".icon-printer").css("display", "block");
        $(this).parent().siblings(".list").slideDown(300);
        $(this).siblings(".icon").toggleClass("icon-atlas-down icon-atlas-up")
        e.stopPropagation();

    })
    $main.find(".xgzy .kjfxbg_ ").on("click", ".list .item .icon-printer", function (e) {
        alert("打印")
    })


    // 重新分析的下拉框
    $reanalyse.find(".reanalyse_panel .main .reason_inp ").on("click", ".inp_box", function (e) {
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    })
    $reanalyse.find(".reanalyse_panel .main .reason_inp .inp_box").on("click", ".select-wrapper .icon_box", function (e) {
        $this = $(this)
        var e = window.event || e;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }

        if ($(e.target).hasClass("icon")) {
            $(e.target).toggleClass("icon-atlas-up icon-atlas-down")
            $(this).siblings(".select_content").slideToggle(300, function () {
                set_h($this)
            })
        } else {
            $(this).siblings(".select_content").slideDown(300, function () {
                set_h($this)
            });
            $(this).find(".icon").removeClass("icon-atlas-down").addClass("icon-atlas-up")
        }

    })

    $reanalyse.find(".reanalyse_panel .main .reason_inp .select_content").on("click", ".scroll_panel .list li", function (e) {
        $(this).parents(".select_content").siblings(".icon_box").find(".icon").removeClass("icon-atlas-up").addClass("icon-atlas-down").siblings(".txt").text($(this).text());
        $(this).parents(".select_content").slideUp(300);
        $(this).addClass("cur").siblings("li").removeClass("cur")
    })

    // 取消
    $reanalyse.find(".reanalyse_panel").on("click", ".footer a", function () {
        var len = $(this).parents(".footer").siblings(".main").find(".reason_inp .inp_box .icon_box .txt").text().length;
        if ($(this).hasClass("cancel")) {
            $reanalyse.fadeOut(300);

        } else if ($(this).hasClass("confirm") && len > 0) {
            $reanalyse.fadeOut(300);
            var $add_li = '<li class="item">\
            <span class="txt">\
            20171207_162\
            </span>\
            <span class="txt2">分析中...</span>\
            <span class="icon-printer"></span>\
            </li>'
            $add_ele.parent().siblings(".list").append($add_li);
            set_scrollbar()
            setTimeout(function () {
                $add_ele.parent().siblings(".list").find(".item:last .txt2").css("display", "none").siblings(".icon-printer").css("display", "block")
            }, 2000)

        } else {
            $.sfs_notice({
                title: '提示',
                message: '您还没有填写“生成理由”，请填写后再重新分析',
                // backdrop: true,
                close: false,
                entrue: {
                    txt: '确定',
                }
            });
        }
    })

    // 关闭
    $reanalyse.find(".reanalyse_panel").on("click", ".top .icon-delete", function () {
        $reanalyse.fadeOut(300)
    })


    // 面板左右收起展开
    $main.find(".main_left").on("click", ".show_btn", function () {

        $(this).toggleClass("prev");
        $main.toggleClass("show_cut");
        setTimeout(function () {
            set_left();
            setdis();
        }, 200);

    })


    // 判断屏幕尺寸是否小于1440
    judge_w()

    detection_file()

    // 附件全选
    $main.find(".main_left .center .fj ").on("click", ".fj_main .btns .check_box", function () {
        $(this).find(".kuang").toggleClass("icon-dagou");
        if ($(this).find(".kuang").hasClass("icon-dagou")) {
            $main.find(".main_left .center .fj .fj_main .file_panel .kuang_cur").addClass("icon-dagou")
        } else {
            $main.find(".main_left .center .fj .fj_main .file_panel .kuang_cur").removeClass("icon-dagou")
        }
    });
    
    

})

// 检测文件是否被全选
function is_all_check() {
    var kuang_cur_len = $main.find(".main_left .center .fj .fj_main .file_panel .kuang_cur").length;
    var dagou_len = $main.find(".main_left .center .fj .fj_main .file_panel .icon-dagou").length;
    if (kuang_cur_len == dagou_len) {
        $main.find(".main_left .center .fj .fj_main .btns .check_box .kuang").addClass("icon-dagou")
    } else {
        $main.find(".main_left .center .fj .fj_main .btns .check_box .kuang").removeClass("icon-dagou")
    }
}

function judge_w() {
    var body_w = document.body.offsetWidth;
    if (body_w <= 1440) {
        $main.find(".main_left .show_btn").toggleClass("prev");
        $main.toggleClass("show_cut");
        setTimeout(function () {
            set_left();
            setdis();
        }, 200);
    }
}



// 依附表单
function set_left() {
    var l_ = (scr_t.width() - scr_t.find(".tab_data_panel").width()) / 2
    var h_ = scr_t.find(".tab_data_panel").width()
    var page_bar_w = scr_t.find(".page_bar").outerWidth(true)
    if (scr_t.find(".tab_data_panel").length > 0 && scr_t.find(".tab_data_panel").width() < scr_t.width()) {
        $main.find(".main_right .page_bar").css("left", l_ + h_ + 38);
        $main.find(".main_right .page_bar").parent().css("min-width", h_ + 38 + page_bar_w + page_bar_w + 'px')
    }
    if (scr_t.find(".tab_data_panel").length > 0 && scr_t.find(".tab_data_panel").width() >= scr_t.width()) {
        $main.find(".main_right .page_bar").css("left", h_ + 38 + page_bar_w + "px")
        scr_t.find(".msg_w").css("width", h_ + 38 + page_bar_w + page_bar_w + 'px')

    }

}

// 右侧标签添加
/**
 * ele:当前点击的元素
 */
function add_label(ele, lab_title) {
    if (!ele.hasClass("exist")) {
        id++
        ele.attr("id", id)
        var value = lab_title || ele.find(".txt").text();
        var a = '<a href="javascript:;" class="cur" id = ' + id + '>\
            <span class="txt">' + value + '</\span>\
            <span class="icon icon-delete"></span>\
            </a>'
        $main.find(".main_right .top_btns .all_btn").append(a);
        $main.find(".main_right .top_btns .all_btn #" + id).siblings("a").removeClass("cur")
        var add_l = $main.find(".main_right .top_btns .all_btn #" + id).width()
        ele.addClass("exist");
        var all_btn_l = $main.find(".main_right .top_btns .top_btns_all .all_btn").outerWidth();
        var top_btns_all_l = $main.find(".main_right .top_btns .top_btns_all").outerWidth();
        s1 = all_btn_l - top_btns_all_l;
        $main.find(".main_right .top_btns .top_btns_all .all_btn").css("left", -(s1 + add_l) + "px")
        float_ = -(s1 + add_l)
        setdis()
    }

}

function setdis() {
    var w_ = 0;
    $main.find(".main_right .top_btns .all_btn a").each(function (index, item) {
        w_ += $(item).outerWidth(true)
    })

    // 设置显隐条件
    $main.find(".main_right .top_btns .all_btn").width(w_ + 5);
    if ($main.find(".main_right .top_btns .all_btn").width() > $main.find(".main_right .top_btns").width()) {

        $main.find(".main_right .top_btns .direction_btn").fadeIn(300)
    } else {

        $main.find(".main_right .top_btns .direction_btn").fadeOut(300);
        $main.find(".main_right .top_btns .all_btn").css("left", "0px")
    }


}

// 右侧面板隐藏按钮
function hidden() {
    if (scr_t.find(".page_bar a").length > 4) {
        var all_btns = scr_t.find(".page_bar a").slice(3, scr_t.find(".page_bar a").length);
        all_btns.each(function (index, item) {
            $(item).fadeOut(100)
            if ($(item).hasClass("btn1")) {
                $(item).fadeIn(100)
            }
        })
    }
    if (scr_t.find(".page_bar a").length <= 4) {
        scr_t.find(".page_bar a:last").fadeOut(300)
    }
}

// 缩进
function settba() {
    var direction_num = 18; //缩进基数
    var file_panel_w = $main.find(".fj .fj_main .file_panel").width();//整个文件面板的宽度
    var direction_w = $main.find(".fj .fj_main .file_panel .direction").first().outerWidth(true); //小箭头的宽度
    var wenjian_w = $main.find(".fj .fj_main .file_panel .wenjian").first().outerWidth(true); //文件夹图标的宽度
    var icon_more3_w = $main.find(".fj .fj_main .file_panel .icon-more3").first().outerWidth(true); //
    kuang_w = $main.find(".fj .fj_main .file_panel .kuang").first().outerWidth(true); //三个点图标的宽度
    $main.find(".fj .fj_main .file_panel .file_item").each(function (index, item) {

        $(item).find(".title").each(function (index, item) {
            // 遍历所有的title，title有几个list父元素就乘以几个缩进基数
            var pad_l = ($(item).parents(".list").length + 1) * 16
            $(item).css("padding-left", pad_l + "px");
            if ($(item).find(".direction").length === 0) {
                $(item).css("padding-left", pad_l + direction_num + "px");
            }
            // 超出文字显示省略号
            $(item).find(".txt").width(file_panel_w - direction_w - wenjian_w - icon_more3_w - pad_l - kuang_w).addClass("txt_hidden")
                // 遍历所有的文件名称，给其设置宽度，并添加超出显示省略号的样式，
            if ($(item).siblings(".list").length === 0 || $(item).siblings(".list").find(".item").length === 0) {
                $(item).find(".icon_box .direction ").removeClass("icon-arrow1");
            } else {
                $(item).find(".icon_box .direction ").addClass("icon-arrow1");
            }
        })

    })
}

// 刷新滚动条
function set_scrollbar() {
    $main.find(".left_item").tinyscrollbar({
        update: "relative"
    })
}


// 判断下拉框的高度
function set_h(ele) {
    if (ele.siblings(".select_content ").find(".scroll_panel").outerHeight(true) > 160) {
        ele.siblings(".select_content").find(".scroll_panel").height(160).tinyscrollbar()
    }
}


// 批量打印检测文件夹中是否存在文件
function detection_file() {
    $(".proint_wrap").find(".proint_panel .proint_panel_main .func_panel .all_proint_list .title_box").each(function (index, item) {
        if ($(item).siblings(".list").find(".item").length <= 0 || $(item).siblings(".list").length <= 0) {
            $(item).find(".icon-arrow1").css("display", "none")
        }
    })
}

// 判断附件的按钮组是否超出可视域
function is_exceed(ele) {  
    var $main_left_h = $(".fj.left_item").height();
    var $ele_t = ele.offset().top;
    var $main_left_t = $(".fj.left_item").offset().top;
    var ele_h = ele.height();

    if($ele_t - $main_left_t + ele_h>$main_left_h){
        ele.addClass("operation_panel_top")
    }else{
        ele.removeClass("operation_panel_top")
    }
}