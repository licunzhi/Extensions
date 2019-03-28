var bg = chrome.runtime.connect({name: "damy-net"});
var DAMY = new Object();

function y() {
    return {
        e: "exid",
        v: "ver",
        t: "t"
    }
}

function z(a) {
    return "undefined" != typeof a && a.length ? a.split("").reverse().join("") : void 0
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ?
            "星期" : "周") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

bg.onMessage.addListener(function (msg) {
    if (msg.act) {
        if (msg.act == 'EXINFO') {
            fill_version(msg.content);
        } else if (msg.act == 'GET') {
            if (msg.flag) {
                switch (msg.flag) {
                    case "URL_ALIMAMA_SEARCH":
                        DAMY.loader.get_tkInfo_callback(msg.content);
                        break;
                    case "URL_ALIMAMA_CAMPAIGNS":
                        DAMY.loader.get_jhInfo_callback(msg.content.data, msg.content.other);
                        break;
                    case "URL_ALIMAMA_HIDDEN_CAMPAIGNS":
                        DAMY.loader.DAMY.loader.get_pages_callback(msg.content.data, msg.content.other);
                        break;
                    case "URL_ALIMAMA_CAMPAIGN_DETAIL":
                        DAMY.loader.get_hidden_jhInfo_callback(msg.content.data, msg.content.other);
                        break;
                    case "URL_PRICE_HISTORY2":
                        hh_price_on(msg.content);
                        break;
                    case "URL_1688_SAME_ITEM":
                        DAMY.loader.load_same_item_callback(msg.content.data);
                        break;
                }
            }
            
        } else if (msg.act == 'POST') {
            if (msg.flag) {
                switch (msg.flag) {
                    case "URL_PRICE_HISTORY":
                        bg_price_callback_post(msg.content);
                        break;
                }
            }
            
        } else if (msg.act == 'GET_COOKIE') {
            if (msg.flag) {
                switch (msg.flag) {
                    case "GET_TB_COOKIE":
                        bg_tbcookie_callback(msg.content);
                        break; 
                }
            }
        }
    }

});
function bg_tbcookie_callback(data) {
    // 读取旺旺cookie获取卖家等级，推荐与卖家等级相应的菜单内容
    var data = data.suffix;
    var uid_reg = /x=\d+/g;
    var nick_reg = /sn=.*/g;
    var uid_ret = uid_reg.exec(data);
    var nick_ret = nick_reg.exec(data);
    if (uid_ret) {
        var userid = uid_ret[0].split('=')[1];
    } else {
        var userid = '';
    }
    if (nick_ret) {
        var nick = nick_ret[0].split(';')[0].split('=')[1];
    } else {
        var nick = '';
    }
    if (userid && nick) {
        sessionStorage.setItem('DZT_SESSION_INFO', JSON.stringify({userid: userid, nick: nick}));
    } else {
        sessionStorage.removeItem('DZT_SESSION_INFO');
    }
    bg.postMessage({act: 'GET_SELLER_LEVEL', userid: userid})
    
};
bg.postMessage({act: 'EXINFO'});
var inh = 'innerHTML';

function init_main(crx_version, extension_id) {

    var g = y();
    r = 'tros';
    x = 'nioj';
    u = 'push';
    re = 'reverse';
    lit = 'split';
    oi = 'join';
    dd = '=';
    var gi = 'getItem';
    var nc = 'nick';
    var ui = 'userid';

    var w = new Date().getTime();
    var v = crx_version;

    var inject = (function (o_fun, fun_name) {
        return function (data) {
            window.postMessage({ret: data}, '*');
            ret = o_fun.apply(this, arguments);
            var el = document.getElementById(fun_name);
            el.parentNode.removeChild(el);
            return ret;
        }
    }).toString();

    window.addEventListener('message', function (event) {
        if (event.data != '' && event.data.ret != undefined) window.jsonp_data = event.data.ret.mods;
    }, false);

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        // msg 消息    sender 发送器   sendResponse 待运行的回调函数
        if (msg.act == 'url') {
            var tmp = (msg.data.indexOf('?') > 0 && msg.data.indexOf('&') > 0) ? msg.data.split('?')[1].split('&') : [];
            for (var i in tmp) {
                if (tmp[i].split('=')[0] == 'callback') {
                    var n = tmp[i].split('=')[1];
                    var exjs = "window." + n + "=(" + inject + ")(window." + n + ",'" + n + "');";
                    var hm = document.createElement("script");
                    hm.id = n;
                    hm.innerHTML = exjs;
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(hm, s);
                }
            }
        } else if (msg.act == 'showTip') {
            $('<div class="copy_itemid_tip">宝贝ID：' + msg.item_id + ' 复制成功</div>').appendTo('body');
        }
    });


    var e = extension_id;
    var dzt_load_href = window.location.href;

    bg.postMessage({act: 'GET_ITEM_ID', item_url: dzt_load_href});
    bg.postMessage({act: 'GET_COOKIE', url: location.host, flag: 'GET_TB_COOKIE'});

    if (!check_domain(dzt_load_href)) return;
    if (dzt_load_href.indexOf('.taobao.com/search.htm') >= 0 || dzt_load_href.indexOf('.taobao.com/category.htm') >= 0 || dzt_load_href.indexOf('.jiyoujia.com/search.htm') >= 0 || dzt_load_href.indexOf('.tmall.com/search.htm') >= 0 || dzt_load_href.indexOf('.tmall.com/category-') >= 0 || dzt_load_href.indexOf('.taobao.com/category-') >= 0 || dzt_load_href.indexOf('.fliggy.com/search.htm') >= 0) {
        if ($('#bd').length) $('#bd').attr('style', 'overflow:visible !important;') //去除店铺内宝贝列表页溢出隐藏
    }
    var i = e + v + w + e;
    i = s(i);
    var callback = '';
    if (dzt_load_href.indexOf('://s.taobao.com/') >= 0 || dzt_load_href.indexOf('://list.tmall.com/search_product.htm') >= 0) {
        callback = gs();
    }
    var js_params = callback ? {'sign': i, 'callback': callback} : {'sign': i};

    $.post('https://ssl.dianzhentan.com/api/4.0/js_params/', js_params, function (data) {
        window.dzt_status = data.s;
        window.dzt_ver = data.v;
        window.ste = data.ste;
        window.curr_ts = data.t;
        window.class_img_d = data.i;
        var class_name = data.c;
        var err_msg = data.err_msg;
        var c_v = data.c_v;
        var yes_ts = parseInt(data.y_t);
        var ts = [];
        for (var i = 0; i < 7; i++) {
            var y_t = yes_ts - 86400 * i;
            ts.push(y_t);
        }
        window.ts_lst = ts;
        window.curr_date = parseInt(window.curr_ts);

        var rank_array;
        var ret_t_set;
        var is_append_sale_box = true; // 今日销量批量查询工具条

        var ztc_tip_html = '<div style="position:relative;">' +
            '</div><a href="https://www.dianzhentan.com/crx/fake/" target="_black"><div class="dzt-notice-alert ztc_tip">' +
            '<p>店侦探&看店宝重磅推出：</p>' +
            '<p><b>全网独家</b>直通车完整正确数据！</p>' +
            '<p style="color:red;font-size:12px;">其它所有同类插件直通车翻页均为假数据！</p>' +
            '</div>' +
            '</a><span class="tip_close">x</span>' +
            '</div>';

        var item_html = '<div class="kdb-tool-box">' +
            '<span class="ext-logo14 kdb-logo14"></span>' +
            '<a href="https://www.kandianbao.com/?z=sug" target="_blank">看店宝</a>： ' +
            '<a href="https://item.kandianbao.com/-id-/?z=sug" target="_blank">宝贝分析</a> ' +
            '<a href="https://item.kandianbao.com/pingjia/-id-/?z=sug" target="_blank">评价下载</a> ' +
            //'<a href="http://item.kandianbao.com/sku/-id-/?z=sug" target="_blank">销量分析</a> '+
            '<a href="https://dian.kandianbao.com/shangpin/-nick-/?z=sug" target="_blank">全店销售</a> ' +
            '<a href="https://dian.kandianbao.com/-nick-/?z=sug" target="_blank">店铺分析</a> ' +
            '<a href="https://dsr.kandianbao.com/-nick-/?z=sug" target="_blank">DSR计算</a> ' +
            '<a href="https://dian.kandianbao.com/new/-nick-/?z=sug" target="_blank">店铺上新</a> ' +
            '<a href="https://item.kandianbao.com/m/-id-/?z=sug" target="_blank" class="dzt_cle_un">手淘预览</a></div>' +
            '<div class="dzt-tool-box">' +
            '<span class="ext-logo14 dzt-logo14"></span>' +
            '<a href="http://www.dianzhentan.com/?z=sug" target="_blank">店侦探</a>： ' +
            '<a href="http://www.dianzhentan.com/member/render/?sid=-shopid-&ww=-nick-" target="_blank">店铺日销售分析</a> ' +
            '<a href="http://www.dianzhentan.com/member/render/?sid=-shopid-&pid=-id-&ww=-nick-" target="_blank" class="dzt_cle_un">宝贝日销量</a> ' +
            '<a href="http://ci.dianzhentan.com/item/-id-/?z=sug" target="_blank">宝贝展现词</a> ' +
            '<a href="http://ci.dianzhentan.com/item/-id-/?z=sug&f=mobile" target="_blank">无线展现词</a> ' +
            '<a href="http://ci.dianzhentan.com/item/-id-/?z=sug&f=ztc_tb" target="_blank">直通车分析</a></div>';

            var shop_html = '<div class="dzt-notice-alert">'+
            '<div class="dzt-notice-alert-l" style="float: left;"><a href="javascript:;" target="_blank" class="title"></a><span> -- </span><span class="text"></span></div>' +
            '<div class="dzt-notice-alert-r" style="float: right;"><div class="price_link dzt_tool">' +
            '<a href="javascript:;">调价</a>' +
            '<div class="chart_container"><div class="chart" loaded="false" pid="-pid-"></div></div></div>' +
            '<div class="dzt_tool_lm_hd dzt_tool">' +
            '<a href="javascript:;">淘宝客</a>' +
            '<div id="dzt_tool_lm_hd_lst" class="dzt_hover_box">' +
            '</div>' +
            '</div>' +
            '<div class="dzt_tool_ck_rank dzt_tool">' +
            '<a href="javascript:;">查排名</a>' +
            '<div id="dzt_tool_ck_rank_detail" class="dzt_hover_box">' +
            '<div class="dzt_txt_h4">当前宝贝排名实时查询</div>' +
            '<div class="dzt_tip" style="border-bottom: 1px dashed #999;padding-bottom:5px;">自动往后最多翻10页,查询指定关键词在PC端淘宝搜索结果中的位置。</div>' +
            '<div id="dzt_ck_rank_from">' +
            '<input type="text" id="dzt_ck_rank_kw" class="dzt_input_txt"/> ' +
            '<select id="dzt_ck_type" class="dzt_input_txt" placeholder="关键词"><option value="org">自然搜索位置</option><option value="simba">直通车位置</option><option value="both" selected="">自然搜索+直通车</option></select> ' +
            '<button class="dzt_btn dzt_btn_danger" id="dzt_tool_start_ck_rank" style="margin-top: -4px;">开始查询</button>' +
            '<div id="dzt_ck_rank_ret" class="dzt_alert dzt_alert_inbox">初始化完毕，可以开始搜索关键词。</div>' +
            '<div class="dzt_tip" style="margin-top:10px;">若出现使用频繁，则超过淘宝访问频率限制，此时请歇一歇再使用。</div>' +
            '<div class="dzt_tip">注意：搜索结果可能受千人千面、个性化因素影响。</div>' +
            '<div class="dzt_tip">因淘宝搜索排名随时可能变化，本功能查询返回大概位置。</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="dzt_tool_same_item dzt_tool">' +
            '<a href="javascript:;">同款货源</a>' +
            '<div id="dzt_tool_same_item_lst" class="dzt_hover_box">' +
            '</div>' +
            '</div>' +
            '<div class="dzt_tool_app">' +
            '<a href="http://www.dianzhentan.com/member/?ww=-nick-&itemid=-pid-" target="_blank">监控此店铺</a>' +
            '</div>' +
            '</div>' +
            '<div class="dzt_clear"></div>' +
            '</div>' +

            '<div class="dzt-detail-top-bar dzt_clear" pid="-pid-">' +
            '<div class="dztbar-t-l">' +
            '<div style="margin-bottom:12px;margin-top:3px;">' +
            '[<a href="http://www.dianzhentan.com/?z=sug" target="_blank">dianzhentan.com</a>] ' +
            // '下架：<a title="" style="color:#f35a4a;" id="dzt-del-time" href="javascript:;"><div class="dzt-loading-po"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></a> &nbsp;&nbsp;&nbsp;' +
            '<span style="position:relative"><span class="clear-cat">下架:</span><a title="" style="color:#f35a4a;" id="dzt-del-time" href="javascript:;""><div class="dzt-loading-po"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></a> &nbsp;&nbsp;&nbsp;<div class="dzt-tip-container dzt-del-time">加载中...</div></span>' +
            '<span style="position:relative"><span class="clear-cat">类目:</span><a title="" style="color:#f35a4a;" id="dzt-cat" href="javascript:;"><div class="dzt-loading-po"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></a> &nbsp;&nbsp;&nbsp;<div class="dzt-tip-container">加载中...</div></span>' +
            '<span class="dzt-sales-viewer"><span>今日销量:</span><span style="color:#f35a4a;" class="sales_count sales_count_-pid-" itemid="-pid-" loading="0"><a href="//www.dianzhentan.com/base/" target="_blank">请登录</a><span class="dzt_tooltiptext"></span><div class="dzt-loading-po" style="display:none;"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></span>' +
            '</div>' +
            '<span class="dzt-ci-title">搜索展现<span class="dzt-arrow-r">&nbsp;</span></span>' +
            '<span class="dzt-ci-hover tb_hover" data-t="tb">淘宝展现（<a href="#" target="_blank" id="dzt-tb-count"></a>）<div class="dzt-ci-table dzt-ci-tb">' + getKw_list_html("tb") + '</div></span>' +
            '<span class="dzt-ci-hover tb_ztc_hover" data-t="ztc_tb">淘宝直通车（<a href="#" target="_blank" id="dzt-tb-ztc-count"></a>）<div class="dzt-ci-table dzt-ci-tb-ztc-dfk">' + getKw_list_html("ztc_tb") + '</div></span>' +
            '<span class="dzt-ci-hover tm_hover" data-t="tmall" id="dzt-tmall">天猫展现（<a href="#" target="_blank" id="dzt-tmall-count"></a>）<div class="dzt-ci-table dzt-ci-tmall">' + getKw_list_html("tmall") + '</div></span>' +
            '<span class="dzt-ci-hover tm_ztc_hover" data-t="ztc_tmall" id="dzt-tmall-ztc">天猫直通车（<a href="#" target="_blank" id="dzt-tmall-ztc-count"></a>）<div class="dzt-ci-table dzt-ci-tmall-ztc">' + getKw_list_html("ztc_tmall") + '</div></span>' +
            '<span class="dzt-ci-hover m_hover" data-t="mobile">无线展现（<a href="#" target="_blank" id="dzt-mobile-count"></a>）<div class="dzt-ci-table dzt-ci-moble">' + getKw_list_html("mobile") + '</div></span>' +
            '<span class="dzt-ci-hover m_ztc_hover" data-t="ztc_mobile">无线直通车（<a href="#" target="_blank" id="dzt-mobile-ztc-count"></a>）<div class="dzt-ci-table dzt-ci-mobile-ztc">' + getKw_list_html("ztc_mobile") + '</div></span>' +
            err_msg +
            // '<a href="https://maijia800.com" target="_blank" style="text-decoration:underline;">卖家导航</a>' +
            '</div>' +
            '<div class="dztbar-t-r">' +
            '<a href="" target="_blank" class="course"><img src=""/></a>' +
            '</div>' +
            // '<div class="dztbar-t-r">' +
            // '<a href="http://xue.kandianbao.com/?z=sug" title="' + class_title + '" target="_blank"><img src="' + class_img_https_url + '" /></a>' +
            // '</div>' +
            '</div>';

            var search_html =
            '<div class="dzt-ext-info-bar">' +
            // '<div id="dzt_cat_-pid-" style="display:none;">'+
            //     // '<span class="ext-logo14 time-logo14"></span>' +
            //     '<span class="dzt-mr5">类目:<span title="-" class="dzt-cat-text">-</span></span>'+
            //     // '<span class="dzt-online-viewer" title="当前在线浏览宝贝的人数（仅PC端）" style="cursor:pointer;">在线:<b style="color:#ff0000;" id="view_count_-pid-">－</b>人</span>' +
            // '</div>'+
            '<div>' +
            // '<span class="dzt-online-viewer" style="cursor:pointer;">在线: <span style="color:#35a;" class="view_count view_count_-pid-" title="只限店侦探企业版及以上用户可以点击查看当前PC端浏览该宝贝的人数">点击查看</span>&nbsp;&nbsp;&nbsp;</span>' +
            //'<span class="dzt-online-viewer" style="cursor:pointer;">在线: <span style="color:#35a;" class="view_count view_count_-pid-" title="数据接口已被官方关闭，目前暂时无法使用">维护中</span>&nbsp;&nbsp;&nbsp;</span>' +
            // '<span class="view_count_rank view_count_rank_-pid-">(第<b style="color:#4184f3">-</b>名)</span>' +
            '<span class="dzt_cat dzt-hover-tip dzt_cat_-pid-">' +
            '<span class="dzt_cat_icon">类</span>' +
            '<span class="dzt_cat_info_-pid- dzt_cat_info" catId="0">-</span>' +
            '<div class="dzt-tip-container dzt-tip-container_-pid-">' +
            '加载中..' +
            '</div>' +
            '</span>' +
            // '<span class="ext-logo14 sales-logo14"></span>' +
            '<span class="dzt-sales-viewer" style="margin-left: 5px;"><b>今日销量:</b><span style="color:#f35a4a;" class="sales_count sales_count_-pid-" itemid="-pid-" loading="0"><a href="//www.dianzhentan.com/base/" target="_blank">请登录</a><span class="dzt_tooltiptext"></span><div class="dzt-loading-po" style="display:none;"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></span>' +
            '</div>' +
            // '<div>'+
            //
            // '</div>'+
            '<div class="dzt_time_-pid-">' +
            '<span class="ext-logo14 time-logo14"></span>' +
            '<span class="dzt-mr5" style="cursor:pointer;">下架:<b class="b">-</b></span>' +

            '</div>' +
            '<div>' +
            '<span class="ext-logo14 kdb-logo14"></span> ' +
            '<a href="http://www.kandianbao.com/?z=sug" target="_blank">看店宝</a>:' +
            '<a href="#" target="_blank" class="kdb-item">宝贝</a> ' +
            '<a href="#" target="_blank" class="kdb-shop">店铺</a> ' +
            '<a href="#" target="_blank" class="kdb-search">搜索</a> ' +
            // '<div class="dzt-hover-tip dzt_cat_-pid-" style="display:none;">' +
            // '<a href="javascript:;">类目</a>' +
            // '<div class="dzt-tip-container">' +
            // '加载中..' +
            // '</div>' +
            // '</div> ' +
            '<div class="price_link">' +
            '<a href="javascript:;">调价</a>' +
            '<div class="chart_container">' +
            '<div class="chart" loaded="false" pid="-pid-"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div>' +
            '<span class="ext-logo14 dzt-logo14"></span> ' +
            '<a href="http://www.dianzhentan.com/?z=sug" target="_blank">自然搜索</a>:' +
            '<span class="dzt-search dzt-ci-hover" data-t="-dzt-t-"><!--search-client-->' +
            '(<a href="javascript:;" class="dzt-list-tb-val" style="color:#ff0000" target="_blank">-</a>)' +
            '<div class="dzt-ci-table dzt-ci-tb">' +
            get_nav_table('<span>搜索</span>' + '展现词') +
            '</div>' +
            '</span> ' +
            '<!--mobile_html-->' +
            '</div>' +
            '<!--ztc_search_html-->' +
            '</div>';

        var search_top_html = '<div class="dzt-notice-alert dzt-notice-alert-search">声明：店侦探[<a href="http://www.dianzhentan.com" target="_blank">www.dianzhentan.com</a>]及插件从未爬取生意参谋数据，所有数据均来自公开网页。<a href="http://www.dianzhentan.com/notice/" target="_blank">详情</a></div><div class="search-top-tool-box">' +
            '<span class="dztbar-t-l">[<a href="http://www.dianzhentan.com/?z=sug" target="_blank">dianzhentan.com</a>]</span>' +
            '<span style="margin-left:10px;color:red;cursor:pointer;" title="本页宝贝的统计数据">本页统计</span>' +
            '<span id="dzt_area_views">' +
            '<div class="dzt_zwf"></div>' +
            '<span>' +
            '<a href="javascript:;">区域图</a>' +
            '<span class="icon-btn-arrow-2-h" style="margin-left:1px;"></span>' +
            '</span>' +
            '<div class="area_container">' +
            '<span class="area_arrow"></span>' +
            '<div class="chart" loaded="false"></div>' +
            '</div>' +
            '</span>' +
            '<span id="dzt_endtime_views">' +
            '<div class="dzt_zwf"></div>' +
            '<span>' +
            '<a href="javascript:;">下架图</a>' +
            '<span class="icon-btn-arrow-2-h" style="margin-left:1px;"></span>' +
            '</span>' +
            '<div class="area_container">' +
            '<span class="area_arrow"></span>' +
            '<div class="chart" loaded="false"></div>' +
            '</div>' +
            '</span>' +
            '<span id="dzt_price_views">' +
            '<div class="dzt_zwf"></div>' +
            '<span>' +
            '<a href="javascript:;">价格图</a>' +
            '<span class="icon-btn-arrow-2-h" style="margin-left:1px;"></span>' +
            '</span>' +
            '<div class="area_container">' +
            '<span class="area_arrow"></span>' +
            '<div class="chart" loaded="false"></div>' +
            '</div>' +
            '</span>' +
            '<span class="dzt-ci-title dzt_price_title" style="margin-left:20px;">价格(最近30天)<span class="dzt-arrow-r">&nbsp;</span></span>' +
            '<span id="dzt_price_average" class="dzt_top_sp">平均价: <a class="dzt_val_a" href="javascript:void(0)" title="">-</a></span>' +
            '<span id="dzt_price_min" class="dzt_top_sp">最低价: <a class="dzt_val_a" href="javascript:void(0)" title="">-</a></span>' +
            '<span id="dzt_price_max" class="dzt_top_sp">最高价: <a class="dzt_val_a" href="javascript:void(0)" title="">-</a></span>' +
            '<span class="dzt-ci-title dzt_sales_title" style="margin-left:20px;">销量(最近30天)<span class="dzt-arrow-r">&nbsp;</span></span>' +
            '<span id="dzt_sales_average" class="dzt_top_sp">平均销: <a class="dzt_val_a" href="javascript:void(0)" title="">-</a></span>' +
            '<span id="dzt_sales_min" class="dzt_top_sp">最低销: <a class="dzt_val_a" href="javascript:void(0)" title="">-</a></span>' +
            '<span id="dzt_sales_max" class="dzt_top_sp">最高销: <a class="dzt_val_a" href="javascript:void(0)" title="">-</a></span>' +
            '<span class="dzt_tool_ck_rank dzt_tool dzt_search_tool">' +
            '<a href="javascript:;">找宝贝<span class="dzt-arrow-bottom">&nbsp;</span></a>' +
            '<div class="dzt_zwf"></div>' +
            '<div id="dzt_search_tool_ck_rank" class="dzt_hover_box">' +
            '<div class="dzt_txt_h4">自动翻页找到您的宝贝排在第几页的哪个位置</div>' +
            '<div class="dzt_tip" style="border-bottom: 1px dashed #999;padding-bottom:5px;">自动往后最多翻10页,随时关注您和竞争对手的宝贝排在什么位置。</div>' +
            '<div id="dzt_search_ck_rank_from">' +
            '<div class="dzt_tip dzt_tip_tit">请输入要查找的宝贝链接。<span class="dzt_input_clear">清空输入框</span></div>' +
            '<input type="text" id="dzt_search_ck_rank_kw" class="dzt_input_txt" style="width:250px;"/> ' +
            '<select id="dzt_search_ck_type" class="dzt_input_txt" placeholder="关键词"><option value="org">自然搜索位置</option><option value="simba">直通车位置</option><option value="both" selected="">自然搜索+直通车</option></select> ' +
            '<button class="dzt_btn dzt_btn_danger" id="dzt_search_tool_start_ck_rank" style="margin-top: -4px;">开始查询</button>' +
            '<div id="dzt_search_ck_rank_ret" class="dzt_alert dzt_alert_inbox dzt_tip">初始化完毕，可以开始搜索宝贝。</div>' +
            '<div class="dzt_tip" style="margin-top:10px;">若出现使用频繁，则超过淘宝访问频率限制，此时请歇一歇再使用。</div>' +
            '<div class="dzt_tip">注意：搜索结果可能受千人千面、个性化因素影响。</div>' +
            '<div class="dzt_tip">因淘宝搜索排名随时可能变化，本功能查询返回大概位置。</div>' +
            '<div class="dzt_tip">如果您在返回的位置找不到宝贝，可以周围四处找找，应该就在附近。</div>' +
            '</div>' +
            '</div>' +
            '</span>' +
            '</div>';

        function get_nav_table(title) {
            var nav_li = '';
            var tbody = '';
            for (var i = 0; i < window.ts_lst.length; i++) {
                nav_li += i == 0 ? '<li class="nav-ci-curr">' : '<li>';
                var ts = window.ts_lst[i];
                var d = new Date(ts * 1000);
                nav_li += '<a href="javascript:;" data-type="-dzt-t-" data-ts="' + ts + '" data-pid="-pid-">' + d.format("MM-dd") + '</a><i></i></li>';
                var hide_class = i == 0 ? '' : 'dzt_hide';
                tbody += '<tbody class="dzt-ci-tbody -hide-" id="-dzt-t-_-date-_-pid-"><tr><td colspan="9">加载中...</td></tr></tbody>'.replace('-date-', ts).replace('-hide-', hide_class);
            }
            var html = '<ul class="dzt-ci-nav dzt_clear">' +
                nav_li +
                '</ul>' +
                '<table>' +
                '<thead>' +
                '<tr>' +
                '<th class="th-ci">' +
                '<span class="ext-arrow ext-arrow-top"></span>' +
                '<a href="http://www.dianzhentan.com/?z=sug" style="color:#ccc;margin-right:5px;" target="_blank">dianzhentan.com</a><b><!--search-type-->' + title + '</b>' +
                '</th>' +
                '<th class="th-rank th_time text-center">' +
                '<b>排名</b>' +
                '</th>' +
                '<th class="th-trend">' +
                '<b>操作</b>' +
                '</th>' +
                '<!--tmp_html-->' +
                '</tr>' +
                '</thead>' +
                tbody +
                '</table>';
            var dzt_no_html = '<th><b>关键词指数</b></b></th>';
            var dzt_yes_html = '<th class="text-center"><b>展现指数</b></b></th><th class="text-center"><b>点击指数</b></b></th><th class="text-center"><b>点击率</b></b></th><th class="text-center"><b>点击转化率</b></b></th><th class="text-center"><b>直通车均价</b></b></th><th class="text-center"><b>竞争度</b></b></th>';
            if (window.dzt_ver == -1 || window.dzt_ver < 40) {
                // 未登录店侦探或没有查看权限
                html = html.replace('<!--tmp_html-->', dzt_no_html);
            } else if (window.dzt_ver >= 40) {
                // 店侦探企业版及以上
                html = html.replace('<!--tmp_html-->', dzt_yes_html);
            }
            return html;
        }


        var mobile_kw_html = '<span class="dzt-search dzt-ci-hover" data-t="mobile">无线' +
            '(<a href="javascript:;" class="dzt-list-mobile-val" style="color:#ff0000" target="_blank">-</a>)' +
            '<div class="dzt-ci-table dzt-ci-mobile">' +
            get_nav_table('<span style="color:#f35a4a;">无线</span>' + '展现词').replace(/-dzt-t-/g, 'mobile') +
            '</div>' +
            '</span> ';

        var ztc_search_html =
            '<div>' +
            '<span class="ext-logo14 mobile-logo14"></span> ' +
            '<a href="http://www.dianzhentan.com/?z=sug" target="_blank">直 通 车</a>:' +
            '<span id="dzt-product-ztc-info" class="dzt-search dzt-ci-hover" data-t="ztc_-dzt-t-">PC' +
            '(<a href="javascript:;" class="dzt-list-ztc-val" style="color:#ff0000" target="_blank">-</a>)' +
            '<div class="dzt-ci-table dzt-ci-ztc-tb">' +
            get_nav_table('<span style="color:#f35a4a;">直通车</span>' + '展现词').replace(/-dzt-t-/g, 'ztc_-dzt-t-') +
            '</div>' +
            '</span> ' +

            '<span class="dzt-search dzt-ci-hover" data-t="ztc_mobile">无线' +
            '(<a href="javascript:;" class="dzt-list-ztc-mobile-val" style="color:#ff0000" target="_blank">-</a>)' +
            '<div class="dzt-ci-table dzt-ci-ztc-mobile">' +
            get_nav_table('<span style="color:#f35a4a;">无线直通车</span>' + '词').replace(/-dzt-t-/g, 'ztc_mobile') +
            '</div>' +
            '</span> ' +
            '</div>';

        var ztc_html = '<p class="dzt-ext-tmall-ztc-bar" style="padding:5px 0px">' +
            '<span class="ext-logo14 dzt-logo14"></span> <a href="http://www.dianzhentan.com/?z=sug">直通车：天猫（<span style="color:#ff0000" class="dzt-tmall-val">-</span>）无线（<span style="color:#ff0000" class="dzt-mobile-val">-</span>）</a>' +
            '</p><p class="dzt-ext-tmall-ztc-bar" style="padding:5px 0px"><span class="ext-logo14 kdb-logo14"></span> <a href="#">直通车分析</a></p>';


        var view_onload = '<div class="dzt-loading-po"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';


        var loading_opt = {
            text: "加载中...",
            effect: "bar",
            textStyle: {
                color: '#222',
                fontSize: 16
            }
        };
        var nodata_loading_opt = {
            text: "暂无数据.",
            effect: "whirling",
            textStyle: {
                color: '#ff0000',
                fontSize: 16
            }
        };
        var chart_opt = {
            animationDuration: 500,
            animationEasing: 'quarticInOut',
            color: ['#f35a4a', '#4184f3'],
            grid: {
                x: 60,
                y: 20,
                x2: 35,
                y2: 30,
                borderWidth: 0
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                hideDely: 100,
                transitionDuration: 0,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderColor: '#e7e7e7',
                borderRadius: 2,
                borderWidth: 1,
                textStyle: {color: '#222'},
                formatter: function (params, ticket, callback) {
                    var res = "日期：" + params[0].name;
                    res += '<br/>' + params[0].seriesName + '：' + params[0].value + " 元";
                    return res;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999',
                        width: 1,
                        type: 'dotted'
                    }
                }
            },
            legend: {
                show: false,
                data: ['价格'],
                orient: 'horizontal',
                x: 'left',
                y: 'bottom'
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                splitLine: {lineStyle: {type: 'dotted'}},
                axisLine: {lineStyle: {color: '#999', width: 1}}, //边轴
                axisTick: {show: false},
                data: [0]
            }],
            yAxis: [{
                type: 'value',
                axisLine: {lineStyle: {color: '#999', width: 1}}, //边轴
                axisTick: {show: false},
                boundaryGap: ['20%', '20%'],
                //boundaryGap:[1,1],
                min: 0,
                //max:'dataMax',
                scale: true,
                splitNumber: 4,
                splitLine: {lineStyle: {type: 'dotted'}},
                axisLabel: {
                    formatter: function (value) {
                        return parseInt(value) + ' 元';
                    }
                }
            }],
            series: [{
                name: '价格',
                smooth: true,
                type: 'line',
                symbolSize: 1,
                markPoint: {
                    symbolSize: '6',
                    data: [{
                        symbol: 'circle',
                        name: '历史最高',
                        type: 'max',
                        value: '10',
                        //symbolRotate:'-45',
                        label: {
                            normal: {
                                position: 'top',
                                show: true,
                                textStyle: {
                                    color: 'rgb(65,132,243)',
                                    fontSize: '14'
                                },
                                formatter: function (params) {
                                    return '￥' + params.data.value;
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(65,132,243)'
                            }
                        }
                    }, {
                        name: '历史最低',
                        symbol: 'circle',
                        type: 'min',
                        symbolRotate: '180',
                        label: {
                            normal: {
                                position: 'bottom',
                                show: true,
                                textStyle: {
                                    color: 'rgb(54,174,72)',
                                    fontSize: '14'
                                },
                                formatter: function (params) {
                                    return '￥' + params.data.value;
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(54,174,72)'
                            }
                        }
                    }]
                },
                label: {
                    normal: {
                        show: false,
                        formatter: function (params) {
                            return '￥' + params.data;
                        },
                        textStyle: {
                            fontSize: 12,
                            color: "#f35a4a"
                        }
                    },
                    emphasis: {
                        show: true,
                        formatter: function (params) {
                            return;
                        },
                        textStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        color: '#f35a4a'
                    }
                },
                data: [0]
            }]
        };

        var chart_opt_t = {
            animationDuration: 500,
            animationEasing: 'quarticInOut',
            color: ['#f35a4a', '#4184f3'],
            grid: {
                x: 60,
                y: 20,
                x2: 35,
                y2: 30,
                borderWidth: 0
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                hideDely: 100,
                transitionDuration: 0,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderColor: '#e7e7e7',
                borderRadius: 2,
                borderWidth: 1,
                textStyle: {color: '#222'},
                formatter: function (params, ticket, callback) {
                    var res = "日期：" + params[0].name;
                    res += '<br/>' + params[0].seriesName + '：' + params[0].value + " 元";
                    return res;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999',
                        width: 1,
                        type: 'dotted'
                    }
                }
            },
            legend: {
                show: false,
                data: ['价格'],
                orient: 'horizontal',
                x: 'left',
                y: 'bottom'
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                splitLine: {lineStyle: {type: 'dotted'}},
                axisLine: {lineStyle: {color: '#999', width: 1}}, //边轴
                axisTick: {show: false},
                data: [0]
            }],
            yAxis: [{
                type: 'value',
                axisLine: {lineStyle: {color: '#999', width: 1}}, //边轴
                axisTick: {show: false},
                boundaryGap: ['20%', '20%'],
                //boundaryGap:[1,1],
                //min:'dataMin',
                //max:'dataMax',
                scale: true,
                splitNumber: 4,
                splitLine: {lineStyle: {type: 'dotted'}},
                axisLabel: {
                    formatter: function (value) {
                        return parseInt(value) + ' 元';
                    }
                }
            }],
            series: [{
                name: '价格',
                smooth: true,
                type: 'line',
                symbolSize: 1,
                markPoint: {
                    symbolSize: '6',
                    data: [{
                        symbol: 'circle',
                        name: '历史最高',
                        type: 'max',
                        value: '10',
                        //symbolRotate:'-45',
                        label: {
                            normal: {
                                position: 'top',
                                show: true,
                                textStyle: {
                                    color: 'rgb(65,132,243)',
                                    fontSize: '14'
                                },
                                formatter: function (params) {
                                    return '￥' + params.data.value;
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(65,132,243)'
                            }
                        }
                    }, {
                        name: '历史最低',
                        symbol: 'circle',
                        type: 'min',
                        symbolRotate: '180',
                        label: {
                            normal: {
                                position: 'bottom',
                                show: true,
                                textStyle: {
                                    color: 'rgb(54,174,72)',
                                    fontSize: '14'
                                },
                                formatter: function (params) {
                                    return '￥' + params.data.value;
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(54,174,72)'
                            }
                        }
                    }]
                },
                label: {
                    normal: {
                        show: false,
                        formatter: function (params) {
                            return '￥' + params.data;
                        },
                        textStyle: {
                            fontSize: 12,
                            color: "#f35a4a"
                        }
                    },
                    emphasis: {
                        show: true,
                        formatter: function (params) {
                            return;
                        },
                        textStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        color: '#f35a4a'
                    }
                },
                data: [0]
            }]
        };

        var setOptionS = {
            title: {
                show: true,
                textStyle: {
                    color: '#000000',
                    fontStyle: 'normal',
                    fontSize: 15
                    // fontFamily: "宋体"
                },
                // left: '4%'
                // padding: [20, 10, 10, 520]
            },
            color: ['#4184f3', '#f35a4a'],
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                hideDely: 100,
                transitionDuration: 0,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderColor: '#e7e7e7',
                borderRadius: 2,
                borderWidth: 1,
                textStyle: {color: '#222'},
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#999',
                        width: 1,
                        type: 'dotted'
                    }
                }
            },
            toolbox: {
                show: true,
                itemSize: 12,
                // right: '4%',
                // top: '20px',
                color: ['#FF6B6B', '#4184f3', '#C7F464', '#556270', '#C44D58', '#4ECDC4'],
                feature: {
                    mark: {show: true},
                    // dataView: { show: true, readOnly: false },
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            // calculable: true,
            legend: {
                selectedMode: false,
                data: []
            },
            xAxis: [{
                type: 'category',
                axisPointer: {
                    type: "shadow"
                },
                splitLine: {show: false},
                boundaryGap: true,
                axisLine: {show: false}, //边轴
                axisTick: {show: false},
                nameTextStyle: {
                    color: '#000000',
                    // fontWeight: 'bold'
                    // fontFamily: "宋体"
                },
                axisLabel: {
                    interval: '0',
                    rotate: '30'
                },
                data: []
            }],
            yAxis: [{
                type: 'value',
                axisLine: {show: false}, //边轴
                axisTick: {show: false},
                // splitNumber: 6,
                splitLine: {lineStyle: {type: 'dotted'}},
                nameTextStyle: {
                    color: '#000000',
                    // fontWeight: 'bold'
                    // fontFamily: "宋体"
                },
                axisLabel: {formatter: "{value} 个"},
                // splitLine: {show: !0},
                // splitArea: {show: !1}
            },
                {
                    type: 'value',
                    axisLine: {show: false}, //边轴
                    axisTick: {show: false},
                    // splitNumber: 6,
                    // splitLine: { lineStyle: { type: 'dotted' } },
                    nameTextStyle: {
                        color: '#000000',
                        // fontWeight: 'bold'
                        // fontFamily: "宋体"
                    },
                    axisLabel: {formatter: "{value} 人"},
                    splitLine: {show: !1},
                    // splitArea: {show: !1}
                }

            ],
            series: [{
                type: 'bar',
                name: '卖家数量',
                // smooth: true,
                barMaxWidth: 34,
                symbolSize: 5,
                // label: {
                //     normal: {
                //         show: true,
                //         position: 'top',
                //         textStyle: {
                //             fontSize: 12,
                //             color: '#f35a4a'
                //         }
                //     }
                // },
                // areaStyle: {
                //     normal: {
                //         opacity: 0.1
                //     }
                // },
                data: []
            },
                {
                    name: "付款人数",
                    type: "line",
                    smooth: true,
                    yAxisIndex: 1,
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top',
                    //         textStyle: {
                    //             fontSize: 12,
                    //             color: '#f35a4a'
                    //         }
                    //     }
                    // },
                    // areaStyle: {
                    //     normal: {
                    //         opacity: 0.1
                    //     }
                    // },
                    data: []
                }
            ]
        };

        function getKw_list_html(t) {
            var str = '展现关键词';
            if (t == 'tb') {
                str = '<span>淘宝</span>' + '展现词';
            } else if (t == 'ztc_tb') {
                str = '<span>淘宝PC直通车</span>' + '词';
            } else if (t == 'tmall') {
                str = '<span>天猫搜索</span>' + '展现词';
            } else if (t == 'ztc_tmall') {
                str = '<span>天猫直通车</span>' + '词';
            } else if (t == 'mobile') {
                str = '<span>无线</span>' + '展现词';
            } else if (t == 'ztc_mobile') {
                str = '<span>无线直通车</span>' + '词';
            }
            var nav_li = '';
            var tbody = '';
            for (var i = 0; i < window.ts_lst.length; i++) {
                nav_li += i == 0 ? '<li class="nav-ci-curr">' : '<li>';
                var ts = window.ts_lst[i];
                var d = new Date(ts * 1000);
                nav_li += '<a href="javascript:;" data-type="' + t + '" data-ts="' + ts + '" data-pid="-pid-">' + d.format("MM-dd") + '</a></li>';
                var hide_class = i == 0 ? '' : 'dzt_hide';
                tbody += '<tbody class="dzt-ci-tbody -hide-" id="-type-_-date-_-pid-"><tr><td colspan="9">加载中...</td></tr></tbody>'.replace('-type-', t).replace('-date-', ts).replace('-hide-', hide_class);
            }
            var kw_list_html = '<ul class="dzt-ci-nav dzt_clear">' +
                nav_li +
                '</ul>' +
                '<table>' +
                '<thead>' +
                '<tr>' +
                '<th class="th-ci">' +
                '<span class="ext-arrow ext-arrow-top"></span>' +
                '<a href="http://www.dianzhentan.com/?z=sug" style="color:#ccc;" target="_blank">' +
                'dianzhentan.com' + ' ' +
                '</a>' +
                '<b>展现关键词</b>' +
                '</th>' +
                '<th class="th-rank text-center">' +
                '<b>排名</b>' +
                '</th>' +
                '<th class="th-trend">' +
                '<b>操作</b>' +
                '</th>' +
                '<!--tmp_html-->' +
                '</tr>' +
                '</thead>' +
                tbody +
                '</table>';
            var dzt_no_html = '<th><b>关键词指数</b></b></th>';
            var dzt_yes_html = '<th class="text-center"><b>展现指数</b></b></th><th class="text-center"><b>点击指数</b></b></th><th class="text-center"><b>点击率</b></b></th><th class="text-center"><b>点击转化率</b></b></th><th class="text-center"><b>直通车均价</b></b></th><th class="text-center"><b>竞争度</b></b></th>';
            if (window.dzt_ver == -1 || window.dzt_ver < 40) {
                // 未登录店侦探或没有查看权限
                kw_list_html = kw_list_html.replace('<!--tmp_html-->', dzt_no_html);
            } else if (window.dzt_ver >= 40) {
                // 店侦探企业版及以上
                kw_list_html = kw_list_html.replace('<!--tmp_html-->', dzt_yes_html);
            }
            return kw_list_html.replace('展现关键词', str);
        }

        function intVersion(str) {
            return parseInt(str.replace(/\./ig, ''));
        }

        var _hmt = _hmt || [];
        var tk_info_prepared;
        var http = 'http';
        var dzt_url = 'http://cj.dianzhentan.com';
        DAMY.loader = {
            cat_cache: {},
            init_page: function () {
                var url = window.location.href;
                if (url.indexOf('https') == 0) {
                    http = 'https';
                    dzt_url = 'https://ssl.dianzhentan.com';
                }
                // DAMY.loader.check_ver();
                // var hm = document.createElement("script");
                // hm.src = "https://hm.baidu.com/hm.js?c478afee593a872fd45cb9a0d7a9da3b";
                // var s = document.getElementsByTagName("script")[0];
                // s.parentNode.insertBefore(hm, s);
                DAMY.loader.start_page();
            },
            // check_ver: function() {
            //     if (typeof bg != 'undefined') {
            //         bg.postMessage({ act: 'VER', cb: 'DAMY.loader.check_ver_cb' });
            //     } else {
            //         this.check_ver_cb('0');
            //     }
            // },
            // check_ver_cb: function(data) {
            //     if (intVersion(data) < intVersion(curr_ver)) {
            //         if (typeof bg != 'undefined') {
            //             bg.postMessage({ act: 'NEW_VERSION' });
            //         }
            //         var url = window.location.href;
            //         if (url.indexOf('://s.taobao.com/search') > 0 || url.indexOf('://list.tmall.com/search_product.htm') > 0) {
            //             if (window.localStorage) {
            //                 if (localStorage.dzt_not_remind_ver == curr_ver) {
            //                     return
            //                 }
            //             }
            //             $('<div id="dzt-extension-update-box">' +
            //                 '<div class="dzt_update_info">' +
            //                 '<a href="javascript:;" class="dzt_close">x</a>' +
            //                 '<p>亲，店侦探&amp;看店宝 <span class="dzt_im_update">重要升级<span>。</p>' +
            //                 '<p>七天引流词上线插件！</p>' +
            //                 //'<p>最新版本:<span class="dzt_ver_num">' + curr_ver + '</span></p>' +
            //                 '<a class="dzt_download" href="http://update.dianzhentan.com/chajian/" target="_blank">立即更新</a>' +
            //                 '</div>' +
            //                 '<div class="dzt_update_buttons">' +
            //                 '<a href="javascript:;" class="dzt_remind_next_ver">该版本不再提醒</a>' +
            //                 '</div>' +
            //                 '</div>').appendTo('body');

            //             $('#dzt-extension-update-box .dzt_close').click(function() {
            //                 $('#dzt-extension-update-box').css('display', 'none');
            //             });
            //             $('#dzt-extension-update-box .dzt_remind_next_ver').click(function() {
            //                 if (window.localStorage) {
            //                     localStorage.dzt_not_remind_ver = curr_ver
            //                 } else {
            //                     alert('您的浏览器无法记忆此操作，请安装最新的Chrome浏览器。');
            //                 }
            //                 $('#dzt-extension-update-box').css('display', 'none');
            //             });
            //         }
            //     }
            // },
            start_page: function () {
                var url = window.location.href;
                // 淘宝宝贝页面
                var finish = false;
                var tmall = false;
                // 天猫宝贝页面
                var curr = $('#J_PromoPrice');
                if (curr.length == 0) {
                    curr = $('.tb-meta li.tb-promo');
                }
                var shopInfo = DAMY.loader.get_shop_info();
                if (shopInfo.istmall || shopInfo.isalitrip || shopInfo.istmall_alitrip_p || shopInfo.istmall_chaoshi || shopInfo.isfliggy) {
                    tmall = true;
                    finish = true;
                } else if (shopInfo.istb || shopInfo.isworld) {
                    finish = true;
                }
                if (finish) {
                    // console.log(1111)
                    // 获取宝贝ID
                    var id, shopid, nick, tmp;

                    if ($('input[name="item_id"]').length) {
                        shopInfo.istmall = false;
                        if ($('.tb-shop-seller').length) {
                            nick = $('.tb-shop-seller').find('a').text(); //普通淘宝C店
                        } else if (/飞猪/.test($('#headerCon').find('.trip-logo').text())) {
                            //飞猪   -原阿里旅行去啊
                            nick = DAMY.loader.trim_all($('.h-shopcard-seller').find('dd:eq(0)').text().replace(/掌\s+柜：/, ''));
                            shopInfo.istmall = true;
                        } else if ($('.tuan-aside').length > 0) {
                            //阿里旅行-酒店团购
                            nick = $('.tuan-aside').find('.shop-name .wangwang').attr('title');
                            shopInfo.istmall = true;
                        } else {
                            nick = dzt_nick_rel($('head')); //可获取极有家、企业店铺、亲宝贝详情页掌柜昵称
                        }

                    } else if ($('#J_HotelPayArea').length) {
                        //阿里旅行-酒店
                        nick = $('.tb-shopinfo').find('.shop-card>p>a').attr('title');
                    } else {
                        nick = $('.slogo-shopname').text(); //天猫
                        shopInfo.istmall = true;
                    }

                    function dzt_nick_rel(str) {
                        return str.html().split('g_config')[1].split('idata')[0].split('sellerNick')[1].split('sibUrl')[0].split("'")[1];

                    }

                    // //获取企业店铺昵称
                    // if($('.shop-type-icon-enterprise').length > 0 && !nick){
                    //     nick = $('.summary-popup.J_TSummaryPopup .shop-more-info p.info-item:eq(1)').text().replace(/掌\s+柜：/,'');
                    // }

                    if ($('#LineZing').length) { //天猫
                        id = $('#LineZing').attr('itemid');
                        shopid = $('#LineZing').attr('shopid');
                        if ($('#mallLogo').find('a').attr('title') == '阿里健康大药房') {
                            nick = $('#mallLogo').find('a').attr('title');
                        } else if ($('#mallLogo').find('a').text().indexOf('天猫超市') >= 0) {
                            nick = $('#mallLogo').find('a').text().split('-')[0];
                            id = parseInt($('#J_AddFavorite').attr('data-aldurl').split('itemId=')[1]);
                            shopid = '67597230'; //天猫超市shopid固定
                        }
                    } else {

                        //获取宝贝ID
                        id = $('input[name="item_id"]').val();
                        if ($('[name="microscope-data"]').length) {
                            //获取shopid
                            shopid = $('[name="microscope-data"]').attr('content');
                            if (shopid) shopid = shopid.split('shopId=')[1].split(';')[0];

                        } else {
                            //获取淘宝全球shopid
                            shopid = $('.tb-shop-seller').find('a').attr('href');
                            if (shopid) shopid = shopid.split('//shop')[1].split('.')[0];
                        }
                        //阿里旅行-酒店
                        if ($('#J_HotelPayArea').length) {
                            id = $('.tb-detail-hd').find('#J_HotelTitle').attr('data-item-id');
                        }

                        //阿里旅行-酒店团购
                        if ($('.tuan-aside').length) {
                            id = $('.tuan-aside').find('.shop-links #xshop_collection_href').attr('href').match(/itemid=\d+/)[0].split('=')[1];
                            shopid = $('.tuan-aside').find('.shop-links #xshop_collection_href').attr('mercury:params').match(/id=\d+/)[0].split('=')[1];
                            $('.tuan-content').attr('id', 'detail'); //添加id以适配所有CSS

                        }

                        if (/飞猪/.test($('#page').find('a.trip-logo__link').attr('title'))) {
                            nick = DAMY.loader.trim_all($('.c-shop-card ').find('dd.c-shop-card-mid-item:eq(0)').text().replace(/掌\s+柜：/, ''));
                            //获取shopid
                            $('script').each(function () {
                                var tmp = $(this).html();
                                if (tmp.indexOf('window.__INITIAL_STATE__') >= 0) {
                                    var shopid_reg = /"shopId"\s*:\s*(\d+)/g;
                                    var ret = shopid_reg.exec(tmp);
                                    if (ret && ret.length == 2) {
                                        shopid = ret[1];
                                    }
                                }
                            });
                            id = $('.report-content').attr('href').split('=')[1];
                            shopInfo.istmall = true;
                        }

                    }

                    // 写入基本信息
                    tmp = item_html.replace(/-id-/g, id);
                    tmp = tmp.replace(/-shopid-/g, shopid);
                    tmp = tmp.replace(/-nick-/g, encodeURIComponent(DAMY.loader.trim_all(nick)));
                    if ($('.item-discount').length) {
                        //淘宝全球插入位置适配
                        $(tmp).insertAfter($('.item-discount')).css({
                            'background-color': '#fff2e7',
                            'margin-top': '-5px'
                        });
                    } else if ($('#J_HotelPayArea').length) {
                        //阿里旅行-酒店插入位置适配
                        $('#J_HotelPayArea').find('.unit').append($(tmp))
                    } else if ($('.J-sku').length) {
                        //阿里旅行-酒店团购插入位置适配
                        $('.J-sku').append($(tmp));

                    } else if ($('.item-streamer').length) {
                        $(tmp).insertAfter($('.item-streamer'));
                    } else {
                        $(tmp).insertAfter(curr);
                    }


                    // 获取类目ID
                    var cid;
                    cid = $('body').html();
                    cid = cid.split('category=')[1];
                    cid = cid.split('&')[0];
                    cid = cid.replace('item%5f', '');
                    if ((!cid && shopInfo.isalitrip) || (!cid && shopInfo.isfliggy)) {
                        $('script').each(function () {
                            var tmp = $(this).html();
                            if (tmp.indexOf('window.__INITIAL_STATE__') >= 0) {
                                var cat_reg = /"categoryId"\s*:\s*(\d+)/g;
                                var ret = cat_reg.exec(tmp);
                                if (ret && ret.length == 2) {
                                    cid = ret[1];
                                }
                            } else {
                                var cat_reg = /categoryId\s*?:\s*?'(\d+)'/g;
                                var ret = cat_reg.exec(tmp);
                                if (ret && ret.length == 2) {
                                    cid = ret[1];
                                }
                            }
                        });
                    }
                    var dzt_tk_info = '<div id="dzt_tk_info">' +
                        '<div class="dzt_tk_info_title">淘宝客</div>' +
                        '<div class="dzt_tk_info_span dzt_tkTip" style="display:none;">提示: <b>该宝贝未参与淘宝客</b></div>' +
                        '<div class="dzt_tk_info_span dzt_tkCommRate"><span class="dzt_tooltiptext">通用计划佣金比率</span>比率: <b>...</b></div>' +
                        '<div class="dzt_tk_info_span dzt_tkCommFee"><span class="dzt_tooltiptext">通用计划佣金</span>佣金: <b>...</b></div>' +
                        '<div class="dzt_tk_info_span dzt_tkTotalNum"><span class="dzt_tooltiptext">所有计划的月推广量</span>月推广: <b>...</b> 件</div>' +
                        '<div class="dzt_tk_info_span dzt_tkTotalFee"><span class="dzt_tooltiptext">所有计划的月推广支出佣金</span>月支出: <b>...</b></div>' +
                        // '<div class="dzt_tk_info_title dzt_tk_info_more">更多</div>' +
                        '</div>';
                    if (shopInfo.isfliggy) {
                        $(".item-desc").before(dzt_tk_info);
                    } else if (shopInfo.istmall) {
                        $(".tb-meta").before(dzt_tk_info);
                    } else {
                        $(".tb-meta").after(dzt_tk_info);
                    }
                    //加载淘宝客
                    DAMY.loader.get_tkInfo(id);
                    var end;

                    tmp = shop_html;
                    tmp = tmp.replace(/-pid-/g, id);
                    tmp = tmp.replace(/-nick-/g, encodeURIComponent(DAMY.loader.trim_all(nick)));
                    tmp = $(tmp);

                    if (/酒店/.test($('#trip-header-pg').find('strong>a').text())) {
                        //阿里旅行-酒店&团购没有类目
                        tmp.find('.clear-cat').remove();
                        tmp.find('#dzt-cat').remove();
                        if ($('.tb-detail-bd').length) {
                            //适配阿里旅行-酒店 图片广告位置
                            $(tmp).find('.dztbar-t-r').attr('style', 'width:289px;')
                        }
                    }

                    //点击时，只能显示单独一个窗口，用于统一处理调价，查排名，淘宝客，同款货源按钮
                    function single_show_dzt_tool(obj, e) {
                        // 点到按钮才触发
                        if ($(e.target).is("a") && $(e.target).is($(obj).children("a").first())) {
                            if ($(obj).is('.dzt_pin')) {
                                $(obj).removeClass('dzt_pin').trigger('mouseout');
                            } else {
                                $(".dzt_tool.dzt_pin").removeClass("dzt_pin").trigger('mouseout');
                                $(obj).trigger('mouseenter').addClass('dzt_pin');
                            }
                        }
                    }

                    // 详情页，调价按钮，延迟hover事件及点击事件
                    tmp.find('.price_link').hoverDelay({
                        hoverEvent: function () {
                            DAMY.loader.price_on(this);
                        },
                        outEvent: function () {
                            if ($(this).is(":not(.dzt_pin)")) DAMY.loader.price_out(this);
                        }
                    });

                    tmp.find('.price_link').click(function (e) {
                        single_show_dzt_tool(this, e);
                    });
                    // 详情页，同款货源按钮，延迟hover事件及点击事件
                    tmp.find('.dzt_tool_same_item').hoverDelay({
                        hoverEvent: function () {
                            DAMY.loader.same_item_on(this);
                        },
                        outEvent: function () {
                            if ($(this).is(":not(.dzt_pin)")) DAMY.loader.same_item_out(this);
                        }
                    });
                    tmp.find('.dzt_tool_same_item').click(function (e) {
                        single_show_dzt_tool(this, e);
                    });
                    tmp.find('.dzt_tool_ck_rank').hoverDelay({
                        hoverEvent: function () {
                            DAMY.loader.ck_rank_on(this);
                        },
                        outEvent: function () {
                            if ($(this).is(":not(.dzt_pin)")) DAMY.loader.ck_rank_out(this);
                        }
                    });
                    tmp.find('.dzt_tool_ck_rank').click(function (e) {
                        single_show_dzt_tool(this, e);
                    });
                    tmp.find('.dzt_tool_lm_hd').hoverDelay({
                        hoverEvent: function () {
                            DAMY.loader.lm_hd_on(this);
                            var loaded = $(this).attr('load');
                            if (loaded != '1' && loaded != '2') DAMY.loader.get_tkInfo(id);
                            if (loaded == '1') DAMY.loader.get_other_tkInfo(id);
                        },
                        outEvent: function () {
                            if ($(this).is(":not(.dzt_pin)")) DAMY.loader.lm_hd_out(this);
                        }
                    });
                    tmp.find('.dzt_tool_lm_hd').click(function (e) {
                        single_show_dzt_tool(this, e);
                    });
                    if (!shopInfo.istmall) {
                        tmp.find('#dzt-tmall').remove();
                        tmp.find('#dzt-tmall-ztc').remove();
                    }

                    if (end) {
                        tmp.find('#dzt-del-time').attr('title', end.format("yyyy-MM-dd EEE HH:mm"));
                        tmp.find('#dzt-del-time').html(end.format("EEE HH:mm"));
                    } else {
                        end = -1;
                        $('script').each(function () {
                            var script = $(this).html();
                            var ends_reg = /ends=(\d+)&/g;
                            var ret = ends_reg.exec(script);
                            if (ret && ret.length == 2) {
                                end = ret[1];
                                if (end) {
                                    end = DAMY.loader.getDate(end);
                                    tmp.find('#dzt-del-time').attr('title', end.format("yyyy-MM-dd EEE HH:mm"));
                                    tmp.find('#dzt-del-time').html(end.format("EEE HH:mm"));
                                    return false;
                                }
                            }
                        });
                    }
                    //宝贝详情页的关键词hover
                    tmp.find('.dzt-ci-hover').hoverDelay({
                        hoverEvent: function () {
                            var dzt_ci_table = $(this).find('.dzt-ci-table');
                            if (window.dzt_ver >= 40) {
                                dzt_ci_table.addClass('dzt-ci-yes');
                            }
                            dzt_ci_table.css('display', 'block');
                            setTimeout(function () {
                                dzt_ci_table.addClass("dzt-ci-table-show");
                            }, 15);
                            $(this).find('.dzt-ci-nav li.nav-ci-curr a').trigger('click');
                        },
                        outEvent: function () {
                            var dzt_ci_table = $(this).find('.dzt-ci-table');
                            dzt_ci_table.removeClass("dzt-ci-table-show");
                            setTimeout(function () {
                                dzt_ci_table.css('display', 'none');
                            }, 200);

                        }
                    });
                    tmp.find('.dzt-ci-nav li a').click(function () {
                        $(this).parents('.dzt-ci-nav').find('li.nav-ci-curr').removeClass('nav-ci-curr');
                        $(this).parent().addClass('nav-ci-curr');
                        $(this).parents('.dzt-ci-nav').next('table').find('tbody:not(.dzt_hide)').addClass('dzt_hide');
                        $(this).parents('.dzt-ci-nav').next('table').find('#' + $(this).attr('data-type') + '_' + $(this).attr('data-ts') + '_' + $(this).attr('data-pid')).removeClass('dzt_hide');
                        if ($(this).attr('load') != '1') {
                            DAMY.loader.get_kwlist(this, $(this).attr('data-pid'), $(this).attr('data-type'), $(this).attr('data-ts'));
                        }
                    });
                    tmp.find('#dzt_tool_start_ck_rank').click(function () {
                        var kw = $.trim($('#dzt_ck_rank_kw').val());
                        if (kw == '') {
                            $('#dzt_ck_rank_ret').html('请输入关键词！');
                            return;
                        }
                        var type = $('#dzt_ck_type').val();
                        $(this).removeClass('dzt_btn_danger').attr('disabled', 'disabled').text('搜索中...');
                        DAMY.loader.ck_rank(kw, type, id, 0, false);
                    });
                    if ($('.sea-detail-item').length) {
                        $('.sea-detail-item').prepend(tmp);
                        $('.sea-detail-item').find('#dzt-cat').css('display', 'none');
                        $('.sea-detail-item').find('.clear-cat').css('display', 'none');
                    } else if ($('.tuan-content').length) {
                        tmp.insertBefore($('.tuan-content').find('.item-main'));
                    } else if ($('.property').length) {
                        $('.property').prepend(tmp);
                    } else {
                        $('#detail').prepend(tmp);
                    }
                    var ssl_dzt = 'https://ssl.dianzhentan.com';
                    if (id) {
                        var i = [];
                        var f = k();
                        i[u](f.e, f.v, f.w, 'id' + id, 'tctimer');
                        i = s(i[z(r)]()[z(x)]('&'));
                        $.ajax({
                            url: ssl_dzt + '/api/4.0/tc_time/',
                            data: {
                                'ver': v,
                                't': w,
                                'id': id,
                                'sign': i,
                                'tc': 'timer'
                            },
                            timeout: 10000,
                            success: function (data) {
                                if (data && data.tid != 0) {
                                    DAMY.loader.get_endtime(data.tid);
                                } else {
                                    $('.dzt-detail-top-bar #dzt-del-time').attr('title', '维护中，请稍后查看！').html('维护中,稍后查看');
                                }
                            },
                            error: function () {
                                console.log('下架时间获取错误！');
                            }
                        })
                    }
                    if (cid) {
                        var i = [];
                        var y = k();
                        i[u](y.e, y.v, y.w, 'cid' + cid);
                        i = s(i[z(r)]()[z(x)]('&'));
                        $.get(ssl_dzt + '/api/4.0/cat/', {'ver': v, 't': w, 'cid': cid, 'sign': i}, function (data) {
                            if (data && data.cat) {
                                $('.dzt-detail-top-bar #dzt-cat').html(data.cat);
                                $('.dzt-detail-top-bar #dzt-cat').hover(function () {
                                    $(this).next('.dzt-tip-container').html(data.fcat).show();
                                }, function () {
                                    $(this).next('.dzt-tip-container').hide();
                                })
                            } else {
                                $('.dzt-detail-top-bar #dzt-cat').html('维护中');
                                $('.dzt-detail-top-bar #dzt-cat').hover(function () {
                                    $('.dzt-tip-container').html('服务器维护中，请稍后查看！');
                                    $(this).next('.dzt-tip-container').show();
                                }, function () {
                                    $(this).next('.dzt-tip-container').hide();
                                })
                            }
                        });

                    }
                    var i = [];
                    var istmall = shopInfo.istmall ? 1 : 0;
                    var c = k();
                    i[u](c.e, c.v, c.w, 'id' + id, 'tmall' + istmall);
                    i = s(i[z(r)]()[z(x)]('&'));
                    $.get(dzt_url + '/api/4.0/item/', {
                        'ver': v,
                        't': w,
                        'id': id,
                        'tmall': shopInfo.istmall ? 1 : 0,
                        'sign': i
                    }, function (data) {
                        $('.dzt-detail-top-bar #dzt-tb-count').html(data.tb);
                        $('.dzt-detail-top-bar #dzt-tb-count').attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug');
                        $('.dzt-detail-top-bar #dzt-tb-ztc-count').html(data.z);
                        $('.dzt-detail-top-bar #dzt-tb-ztc-count').attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=ztc_tb');
                        $('.dzt-detail-top-bar #dzt-mobile-count').html(data.m);
                        $('.dzt-detail-top-bar #dzt-mobile-count').attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=mobile');
                        $('.dzt-detail-top-bar #dzt-mobile-ztc-count').html(data.mz);
                        $('.dzt-detail-top-bar #dzt-mobile-ztc-count').attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=ztc_mobile');
                        if (shopInfo.istmall) {
                            $('.dzt-detail-top-bar #dzt-tmall-count').html(data.tm);
                            $('.dzt-detail-top-bar #dzt-tmall-count').attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=tmall');

                            $('.dzt-detail-top-bar #dzt-tmall-ztc-count').html(data.tz);
                            $('.dzt-detail-top-bar #dzt-tmall-ztc-count').attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=ztc_tmall');
                        }
                    });
                    DAMY.loader.render_sales_text(id);
                    DAMY.loader.load_same_item();
                    DAMY.loader.get_course_info();
                    DAMY.loader.render_slogan_info();
                    return;
                }
                // 天猫列表页
                if (url.indexOf('://list.tmall.com/search_product.htm') >= 0) {
                    tmall = true;
                    this.render_tmall();
                    this.render_tmall_chaoshi();
                } else if (url.indexOf('.tmall.com/category') >= 0 || url.indexOf('.tmall.com/search.htm') >= 0 || url.indexOf('.tmall.com/view_shop.htm') >= 0) {
                    tmall = true;
                    this.render_tmallstore();
                } else if (url.indexOf('subject.tmall.com/subject/subject.htm') >= 0) {
                    tmall = true;
                    this.render_tmall_subject();
                }

                // 淘宝列表页
                if (url.indexOf('://s.taobao.com/') >= 0) {
                    if (url.indexOf('tab=mysearch') >= 0) {
                        this.render_mysearch();
                    } else if (url.indexOf('type=samestyle') >= 0 || url.indexOf('type=similar') >= 0) {
                        this.render_same();
                    } else if (url.indexOf('app=theme') >= 0) {
                        this.render_theme();
                    } else if (url.indexOf('://s.taobao.com/list') >= 0) {
                        this.render_list();
                    } else {
                        this.render_tb();
                        this.render_p4p_b();
                        this.itemList_ck_rank($(search_top_html));

                    }
                } else if (url.indexOf('.taobao.com/search.htm') != -1 || url.indexOf('.jiyoujia.com/search.htm') > 0 || url.indexOf('.fliggy.com/search.htm') > 0) {
                    this.render_store();
                }
                if (url.indexOf('://list.taobao.com/') >= 0 || url.indexOf('search1.taobao.com/itemlist/') >= 0) {
                    this.render_list();
                }
                //腔调
                if (url.indexOf('://style.taobao.com') >= 0 || url.indexOf('.taobao.com/markets/style/qiangdiao2016') >= 0 || url.indexOf('.taobao.com/go/market/') >= 0) {
                    this.render_tb_style();
                }
                /**********淘宝主题市场目前只适配女装、男装，其它主题市场页面卡顿暂不适配************/
                // //淘宝主题市场
                // if (url.indexOf('.taobao.com/markets/nvzhuang') >= 0 || url.indexOf('://nz.taobao.com/') >= 0 /*|| url.indexOf('.taobao.com/markets/xie/nvxie') >= 0 || url.indexOf('.taobao.com/markets/bao/xiangbao') >= 0*/ ) {
                //     this.render_tb_markets();
                // }

                // //淘宝主题市场
                // if (url.indexOf('.taobao.com/markets/nvzhuang') >= 0 || url.indexOf('.taobao.com/markets/nanzhuang') >= 0 || url.indexOf('://nz.taobao.com/') >= 0 || url.indexOf('.taobao.com/markets/xie/nvxie') >= 0 || url.indexOf('.taobao.com/markets/bao/xiangbao') >= 0) {
                //     this.render_tb_markets_newList();
                // }
                // 淘宝全球
                if (url.indexOf('://world.taobao.com/search/search.htm') >= 0) {
                    this.render_world_search();
                }
                //淘宝店铺分类
                if (url.indexOf('.taobao.com/category') >= 0 || url.indexOf('.jiyoujia.com/category') > 0) {
                    this.render_tbshopcat();
                }
                //淘抢购
                if (url.indexOf('://qiang.taobao.com/') >= 0) {
                    if (url.indexOf('://qiang.taobao.com/category.htm') >= 0) {
                        this.render_tqg(true);
                    } else {
                        this.render_tqg(false);
                    }
                }
                //清仓
                if (url.indexOf('://qing.taobao.com') >= 0 || url.indexOf('://ju.taobao.com/qing') >= 0) {
                    this.render_qing();
                }
                //聚划算
                if (url.indexOf('ju.taobao.com') >= 0) {
                    if (url.indexOf('://detail.ju.taobao.com/home.htm') >= 0) {
                        this.render_judetail();
                    } else {
                        this.render_jhs();
                    }
                } 
                if(url.indexOf('://jusp.tmall.com/') >= 0) {
                    this.render_jhs();
                }
                //逛街
                if (url.indexOf('guang.taobao.com') >= 0) {
                    if (url.indexOf('guang.taobao.com/detail/index.htm') >= 0) {
                        this.render_guang_item();
                    } else {
                        this.render_guang();
                    }
                }
                //淘特来斯
                if (url.indexOf('taotelaisi.taobao.com') >= 0) {
                    this.render_taotelaisi();
                }
                //中国质造
                if (url.indexOf('://q.taobao.com/') >= 0 || url.indexOf('://www.taobao.com/markets/quality/v2') >= 0) {
                    this.render_quality();
                }
                //全民抢拍
                if (url.indexOf('://www.taobao.com/market/p/') >= 0 || url.indexOf('://pp.taobao.com/')) {
                    this.render_pp();
                }
                //女装抢新
                // if(url.indexOf('www.taobao.com/market/nvzhuang/') >= 0 || url.indexOf('://nz.taobao.com/') >= 0 || url.indexOf('://nvren.taobao.com/') >= 0){
                //     if(url.indexOf('://nvren.taobao.com/') >= 0){
                //         // this.render_nvzhuang(true);
                //     }else{
                //         this.render_nvzhuang(false);
                //     }
                // }
                //淘金币
                if (url.indexOf('://taojinbi.taobao.com/') >= 0) {
                    this.render_tjb();
                }
                // 汇吃列表页
                if (url.indexOf('://chi.taobao.com/itemlist/') >= 0) {
                    this.render_hc();
                }
                //天天特价
                if (url.indexOf('://tejia.taobao.com/') >= 0 || url.indexOf('://www.taobao.com/market/tejia/') >= 0 || url.indexOf('jupage.taobao.com') >= 0) {
                    this.render_tttj();
                }
                //淘宝全球购
                if (url.indexOf('://g.taobao.com/brand_detail.htm') >= 0) {
                    this.render_global();
                }
                //天猫国际
                if (url.indexOf('://list.tmall.hk/search_product.htm') >= 0) {
                    this.render_tmallgj();
                    // this.render_itemList_top();
                }
                //折800
                // if(url.indexOf('://www.zhe800.com') >= 0){
                //     //this.render_zhe800();
                // }
                //淘粉吧
                // if(url.indexOf('://www.taofen8.com') >= 0){
                //     this.render_tf8();
                // }
                //会员购
                // if(url.indexOf('://www.huiyuangou.com/') >= 0){
                //     this.render_hyg();
                // }
                //亲宝贝
                if (url.indexOf('.taobao.com/markets/tbhome') >= 0) {
                    this.render_qbb();
                }

            },
            get_dzt_role_name: function () {
                if(window.dzt_ver == 30){
                    return '专业版用户';
                }else if(window.dzt_ver == 40){
                    return '企业版用户';
                }else if(window.dzt_ver == 48){
                    return '旗舰版用户';
                }else if(window.dzt_ver == 100){
                    return '管理员'
                }else{
                    return '普通版用户'
                }
            },
            append_sale_box: function (obj) {
                if(!$(obj).is(':has(.sale-tool-box)') && window.dzt_ver != -1){
                    // 只在登陆状态下插入今日销量工具条
                    var sale_tool_box = '<div class="sale-tool-box"><span class="dzt-batch-sales-btn login"><span style="position: relative;"><a href="javascript:void(0)" target="_blank" style="color: #fff;"></a></span></span><span class="sale-tooltiptext"></span></div>';
                    $(obj).prepend(sale_tool_box);
                }
            },
            render_sales_text: function(id){
                var dzt_role = window.dzt_ver;
                var ste = window.ste;
                var grade_html = '<span class="sale"><a href="https://www.dianzhentan.com/buy/" target="_blank">升级查看</a></span>';
                var show_text_html = '<span class="sale">点击查看</span>';
                if(dzt_role != -1){
                    // 已登录店侦探用户
                    var batch_sale_btn = $('.dzt-batch-sales-btn.login').find('a');
                    if(dzt_role < 40){
                        // 店侦探企业版以下
                        if(dzt_role == 5){
                            // 演示版账号
                            // var dzt_tooltiptext = '演示账号无法查看<br>请登陆您的店侦探账号查看';
                            var sale_box_tooltiptext = '演示账号无法查看，请登陆您的店侦探账号查看';
                            var show_text_html = '<a href="//www.dianzhentan.com/base/" target="_blank">请登录</a>';
                            batch_sale_btn.text('请登录');
                            $('.dzt-batch-sales-btn.login').css('display', 'none');
                        }else{
                            if(ste > 0){
                                // 试用中
                                $('.dzt-sales-viewer').addClass('show-tip');
                                var remain_time = DAMY.loader.delist_remaintime(ste, window.curr_ts / 1000);
                                // var ste = ste * 1000;
                                // var stetotime = DAMY.loader.getDate(ste).format("yyyy-MM-dd HH:mm:ss");
                                var dzt_tooltiptext = remain_time  + ' 后试用结束！<a target="_blank" href="https://www.dianzhentan.com/buy/" style="color:#fff;text-decoration: underline;">立即升级</a>';
                                var sale_box_tooltiptext = '<span style="color:#f35a4a;">' + remain_time  + ' </span>后试用结束！<a target="_blank" href="https://www.dianzhentan.com/buy/">立即升级</a>';
                                batch_sale_btn.text('查询今日销量');
                                // $('.sales_count_' + id).find('.dzt_tooltiptext').css({'width': '330px', 'left': '-8%'});
                            }else if(ste == -1){
                                // 未试用
                                // var dzt_tooltiptext = '请申请试用或升级到企业版/旗舰版查看';
                                var sale_box_tooltiptext = '您可以申请今日销量查询试用或<a href="https://www.dianzhentan.com/buy/" target="_blank">升级</a>到店侦探企业版/旗舰版查看';
                                var show_text_html = '<span class="sale"><a href="https://ci.dianzhentan.com/answer_qs/" target="_blank">立即试用</a></span>';
                                batch_sale_btn.text('立即试用');
                            }else if(ste == 0){
                                // 已试用
                                // var dzt_tooltiptext = '试用已结束<br>请升级到企业版/旗舰版继续使用此功能';
                                var sale_box_tooltiptext = '试用已结束，请升级到企业版/旗舰版继续使用此功能';
                                var show_text_html = grade_html;
                                batch_sale_btn.text('升级查看');
                            }
                        }
                        if($('.dzt-batch-sales-btn.login>span').attr('loading') != '1'){
                            if(ste > 0){
                                $('.dzt-batch-sales-btn.login>span').find('a').remove().end().attr('loading', '1').append('<a href="javascript:void(0)" target="_blank" style="color: #fff;">批量查销量</a>');
                            }else{
                                $('.dzt-batch-sales-btn.login>span').find('a').remove().end().attr('loading', '1').append(show_text_html);
                            }
                        }

                    }else if(dzt_role == 40){
                        // 店侦探企业版用户
                        // var dzt_tooltiptext = '店侦探企业版<br>可查看您已监控店铺的宝贝今日销量';
                        var sale_box_tooltiptext = '店侦探企业版，可查看您已监控店铺的宝贝今日销量';
                        batch_sale_btn.text('查看今日销量');
                    }else if(dzt_role >= 48){
                        // 店侦探旗舰版及以上
                        // var dzt_tooltiptext = '店侦探' + DAMY.loader.get_dzt_role_name() + '<br>可查看所有用户监控店铺的宝贝今日销量';
                        var sale_box_tooltiptext = '店侦探' + DAMY.loader.get_dzt_role_name() + '，可查看所有用户监控店铺的宝贝今日销量';
                        batch_sale_btn.text('查看今日销量');
                    }
                    if($('.sales_count_' + id).attr('loading') == '0'){
                        $('.sales_count_' + id).find('a').remove().end().attr('loading', '1').append(show_text_html);
                    }

                    if(dzt_role >= 40 || ste > 0){
                        $('.sales_count_' + id).find('.sale').click(function () {
                            $(this).css('display', 'none').parents('.dzt-sales-viewer').find('.dzt-loading-po').removeAttr('style');
                            DAMY.loader.render_sales($(this).parent('.sales_count').attr('itemid'));
                        })
                    }

                    $('.sale-tooltiptext').html(sale_box_tooltiptext);
                    $('.sales_count_' + id).find('.dzt_tooltiptext').html(dzt_tooltiptext);


                }
            },
            render_sales: function (ids) {
                // var role_name = DAMY.loader.get_dzt_role_name();
                // var sale_tip_1 = '您当前为店侦探' + role_name + '用户<br>不可查看';
                var sale_tip_2_4 = '添加监控后，第二天可查看<br>如已添加，请次日查看';
                var sale_tip_3 = '添加该店铺监控后，即可查看今日销量数据';
                // var sale_tip_4 = '您当前为店侦探' + role_name + '<br>该宝贝总销量未缓存';
                var sale_tip_5 = '获取数据失败';
                var sale_tip_6 = '获取数据超时';
                $.get('https://ssl.dianzhentan.com/api/4.0/sale/', {'ids': ids}, function(data){
                    var data = data.data;
                    if(data == -99){
                        // 维护中
                        $('.dzt-sales-viewer').find('.sales_count span.sale').css({'display': 'inline-block', 'color': '#f35a4a'}).text('维护中').end().find('.dzt-loading-po').attr('style', 'display:none;');
                    }else{
                        if(!data){
                            $('.dzt-sales-viewer').find('.sales_count span.sale').css({'display': 'inline-block', 'color': '#f35a4a'}).text('无权查看').end().find('.dzt-loading-po').attr('style', 'display:none;');

                        }else{
                            for (var id in data) {
                                $('.sales_count_' + id).parent('.dzt-sales-viewer').addClass('show-tip');
                                var dzt_sale = $('.sales_count_' + id).find('span.sale');
                                // var wwid = $('#dzt-ext-info-bar-' + id).parent('.item').find('.shopname .dsrs').next('span').text();
                                var jk_url = 'https://www.dianzhentan.com/member/?itemid=' + id;
                                var jk_html = '<a href="' + jk_url + '" target="_blank"> 监控此店铺</a>';
                                if(data[id] == -2){
                                    $('.sales_count_' + id).find('.dzt_tooltiptext').html(sale_tip_2_4);
                                    dzt_sale.html(jk_html);
                                }else if(data[id] == -3){
                                    $('.sales_count_' + id).find('.dzt_tooltiptext').html(sale_tip_3);
                                    dzt_sale.html('<a href="' + jk_url + '" target="_blank"> 添加监控查看</a>');
                                }else if(data[id] == -4){
                                    $('.sales_count_' + id).find('.dzt_tooltiptext').html(sale_tip_2_4);
                                    dzt_sale.html(jk_html);
                                }else if(data[id] == -5){
                                    $('.sales_count_' + id).find('.dzt_tooltiptext').html(sale_tip_5);
                                    dzt_sale.html(' 获取失败');
                                }else if(data[id] == -6){
                                    $('.sales_count_' + id).find('.dzt_tooltiptext').html(sale_tip_6);
                                    dzt_sale.html(' 获取超时');
                                }else if(data[id] >= 0){
                                    $('.sales_count_' + id).find('.dzt_tooltiptext').html('该宝贝今日销量（含退款）');
                                    dzt_sale.html(data[id] + ' 件');
                                }

                                $('.sales_count_' + id).find('span').css('display', 'inline-block').parents('.dzt-sales-viewer').find('.dzt-loading-po').attr('style', 'display:none;');
                            }
                        }

                    }

                })

            },
            get_endtime: function (tid) {
                // console.log(tid);
                var i = [];
                var f = k();
                i[u](f.e, f.v, f.w, 'tid' + tid);
                i = s(i[z(r)]()[z(x)]('&'));
                $.get('https://ssl.dianzhentan.com/api/4.0/get_time/', {
                    'ver': v,
                    't': w,
                    'tid': tid,
                    'sign': i
                }, function (data) {
                    if (data && data.t) {
                        var unixTimestamp = new Date(data.t * 1e3);
                        var del_time = unixTimestamp.format('MM-dd HH:mm EEE');
                        var remain_time = DAMY.loader.delist_remaintime(data.t, data.ct);
                        $('.dzt-detail-top-bar #dzt-del-time').html(del_time);
                        $('#dzt-del-time').hover(function () {
                            $(this).next('.dzt-del-time').html('剩余下架时间：' + remain_time).show();
                        }, function () {
                            $(this).next('.dzt-del-time').hide();
                        })
                    } else {
                        $('.dzt-detail-top-bar #dzt-del-time').attr('title', '下架时间获取失败').html('获取失败');
                    }
                })
            },
            render_slogan_info: function () {
                // 广告宣传语
                var url = 'https://ssl.dianzhentan.com/api/4.0/slogan/';
                $.ajax({
                    url: url,
                    dataType: 'text',
                    timeout: 10000,
                    success: function (data) {
                        var data = JSON.parse(data).data;
                        $('.dzt-notice-alert').find('span.text').html(data.text).end().find('.dzt-notice-alert-l .title').attr('href', data.url).html(data.title);
                    },
                    error: function () {
                        console.debug('获取广告宣传语失败！');
                    }
                })
            },
            get_course_info: function () {
                /********** 课程图  *************/
                var i = [];
                var l = k();
                i[u](l.e, l.v, l.w);
                i = s(i[z(r)]()[z(x)]('&'));
                var course_url = 'https://ssl.dianzhentan.com/api/4.0/v2/course/';
                $.ajax({
                    url: course_url,
                    data: {
                        'ver': v,
                        't': w,
                        'sign': i
                    },
                    dataType: 'text',
                    timeout: 10000,
                    success: function (data) {
                        var course_info = JSON.parse(data).data;
                        var stick_course = course_info[1];
                        if (stick_course) {
                            // 是否有需要置顶课程
                            var storage = window.localStorage;
                            var dzt_key = s(stick_course.image_url);
                            var flag = storage.getItem(dzt_key) != undefined ? storage.getItem(dzt_key) : 1;
                            if (parseInt(stick_course.top_num) > parseInt(flag)) {
                                var show_course = stick_course;
                                storage.setItem(dzt_key, parseInt(flag) + 1);
                            } else {
                                var show_course = course_info[0];
                            }
                        } else {
                            var show_course = course_info[0];
                        }
                        var class_img_https_url = show_course.image_url;
                        var class_title = show_course.title;
                        $('.dztbar-t-r').find('a img').attr('src', class_img_https_url);
                        $('.dztbar-t-r').find('a').attr('href', show_course.jump_url).attr('title', class_title).attr('style', 'float:right;');
                    },
                    error: function () {
                        console.debug('获取课程信息失败！');
                    }
                });

            },

            get_shop_info: function () {
                var url = window.location.href;
                var tmall = false;
                var istmall_alitrip_p = false;
                var istmall_chaoshi = false;
                var isalitrip = false;
                var istb = false;
                var world = false;
                var isfliggy = false;
                if (url.indexOf('://detail.alitrip.com/item.htm') >= 0 || url.indexOf('://hotel.alitrip.com/') >= 0 || url.indexOf('://tuan.alitrip.com/detail.htm') >= 0) {
                    istmall_alitrip_p = true;
                }
                if (url.indexOf('://tuan.fliggy.com/detail.htm') >= 0 || url.indexOf('.fliggy.com/item.htm') >= 0) {
                    isfliggy = true;
                }
                if (url.indexOf('://chaoshi.detail.tmall.com/item.htm') >= 0) {
                    istmall_chaoshi = true;
                }
                if (url.indexOf('://items.alitrip.com/item.htm') >= 0 || url.indexOf('://traveldetail.taobao.com/item.htm') >= 0) {
                    isalitrip = true;
                }
                if (url.indexOf('://detail.tmall.com/item.htm') >= 0 || url.indexOf('maiyao.liangxinyao.com/category') >= 0 || url.indexOf('://detail.tmall.hk/hk/item.htm') >= 0 || url.indexOf('://detail.tmall.hk/item.htm') >= 0 || url.indexOf('://detail.yao.95095.com/item.htm') >= 0 || url.indexOf('://detail.liangxinyao.com/item.htm') >= 0 || url.indexOf('://detail.tmall.com//item.htm') >= 0 || isalitrip || istmall_alitrip_p) {
                    tmall = true;
                }
                if (url.indexOf('://item.taobao.com/item.htm') >= 0) {
                    istb = true;
                }
                if (url.indexOf('://world.taobao.com/item/') >= 0) {
                    world = true;
                }
                if (url.indexOf('://world.tmall.com/item/') >= 0) {
                    world = true;
                    tmall = true;
                }
                return {
                    istb: istb,
                    istmall: tmall,
                    isalitrip: isalitrip,
                    istmall_alitrip_p: istmall_alitrip_p,
                    isworld: world,
                    istmall_chaoshi: istmall_chaoshi,
                    isfliggy: isfliggy
                };
            },
            // offsetTop: function(obj, setTop){
            //     $(window).scroll(function (){
            //         // 让浮动层距离窗口顶部，始终保持setTop的距离
            //         var offsetTop = $(window).scrollTop() + setTop +"px";
            //         obj.animate({top : offsetTop },{ duration:500 , queue:false });
            //     });
            // },
            dzt_arr_unique: function (arr) {
                /**
                 * 数组去重方法封装
                 * @type {Array}
                 */
                var result = [],
                    json = {};
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (!json[arr[i]]) {
                        json[arr[i]] = 1;
                        result.push(arr[i]); //返回没被删除的元素
                    }
                }
                return result;
            },
            get_sellerId: function () {
                var sellerid = document.documentElement.innerHTML.match(/sellerId['|"]*\s*:\s*['|"]*(\d+)/)[1];
                return sellerid;
            },

            get_tkInfo: function (id) {
                var alimamaUrl = "http://pub.alimama.com/items/search.json?q=";
                var itemUrl = encodeURIComponent("http://item.taobao.com/item.htm?id=" + id);
                var tkUrl = alimamaUrl + itemUrl + '&perPageSize=50';
                jhUrl = "http://pub.alimama.com/shopdetail/campaigns.json?oriMemberId=" + DAMY.loader.get_sellerId();
                couponsUrl = 'https://cart.taobao.com/json/GetPriceVolume.do?sellerId=' + DAMY.loader.get_sellerId();
                hiddenCouponsUrl = "http://zhushou3.taokezhushou.com/api/v1/coupons_base/" + DAMY.loader.get_sellerId() + "?item_id=" + id;
                /*************** 鹊桥活动接口有误，暂关闭**************/
                // qqhdUrl = 'http://zhushou4.taokezhushou.com/api/v1/queqiao?itemId=' + id;
                bg.postMessage({act: 'GET', url: tkUrl, flag: 'URL_ALIMAMA_SEARCH'});
            },
            get_tkInfo_callback: function (data) {
                var yx = "";
                var n;
                try {
                    n = JSON.parse(data.data);
                } catch (err) {
                    console.debug(err);
                }
                var tb_login = false; // 默认不需要登录淘宝联盟
                var tb_login_html = '<a href="http://pub.alimama.com/myunion.htm" target="_blank">请登录淘宝联盟后刷新本页面查看</a>';
                if (!n.ok) {
                    // 请求太多需要登录淘宝联盟才可查看了
                    var tb_login = true;
                    $(".dzt_tk_info_span").css('display', 'none');
                    $(".dzt_tkTip b").html(tb_login_html);
                    $(".dzt_tkTip").css('display', 'inline-block');
                    
                }
                if (n.data && n.data.pageList && n.data.pageList != null) {
                    var l = n.data.pageList[0];
                    var eventRate = 0;
                    if (l.eventRate) {
                        var eventRate = l.eventRate;
                    }
                    var couponInfo = '';
                    if (l.couponInfo != '无') {
                        var couponInfo = {
                            'couponEffectiveStartTime': l.couponEffectiveStartTime,
                            'couponEffectiveEndTime': l.couponEffectiveEndTime,
                            'couponLeftCount': l.couponLeftCount,
                            'couponTotalCount': l.couponTotalCount,
                            'couponInfo': l.couponInfo,
                            'couponAmount': l.couponAmount,
                            'itemId': l.auctionId
                        };
                    }
                    var s = '¥' + l.tkCommonFee;
                    var c = l.totalNum + '件';
                    var d = l.totalFee + '元';
                    var itemId = l.auctionId;
                    var tk_r = l.tkCommonRate + '%'; //通用单品佣金
                    //$(".dzt_tool_lm_hd>a").text("淘客(" + tk_r + ")");
                    var capId = l.tkSpecialCampaignIdRateMap;
                    if (capId && capId != null) {
                        capId = l.tkSpecialCampaignIdRateMap;
                    } else {
                        capId = 'undefined';
                    }
                    var yx_rate = null;
                    if (l.tkRate > l.tkCommonRate) {
                        yx_rate = l.tkRate + '%';
                        yx = '<div class="lm_hd_h_l">' +
                            '<p title="营销计划佣金">营销佣金：' +
                            '<strong style="margin-right:20px;" class="dzt_red">¥' + l.tkCommFee + '</strong>' +
                            '</p>' +
                            '<p title="营销计划佣金比率">营销比率：' +
                            '<strong class="dzt_red">' + yx_rate + '</strong>' +
                            '</p>' +
                            '</div>';
                    }
                    $(".dzt_tkCommRate b").text(tk_r);
                    $(".dzt_tkCommFee b").text(s);
                    $(".dzt_tkTotalNum b").text(l.totalNum);
                    $(".dzt_tkTotalFee b").text('¥' + l.totalFee);

                } else {
                    var tkInfo_none = '<span class="di_none">-</span>';
                    var tkInfo_none_html = !tb_login ? '<div class="dzt_lm_hd_tit">该宝贝没有淘宝客佣金</div>' : '<div class="dzt_lm_hd_tit">' + tb_login_html + '</div>';
                    var s = tkInfo_none;
                    var c = tkInfo_none;
                    var d = tkInfo_none;
                    var tk_r = tkInfo_none;
                    var capId = 'undefined';
                    setTimeout(function () {
                        $('.lm_hd_h_r').after(tkInfo_none_html);
                        $('.dzt_tk_clear').remove();
                    }, 500)

                    $(".dzt_tk_info_span").css('display', 'none');
                    $(".dzt_tkTip").css('display', 'inline-block');
                }
                var tkInfo_html = '<div class="dzt_lm_hd_h">' +
                    '<div class="lm_hd_h_l">' +
                    '<p title="通用计划此宝贝的佣金">佣金：' +
                    '<strong style="margin-right:20px;" class="dzt_red">' + s + '</strong>' +
                    '</p>' +
                    '<p title="通用计划此宝贝的佣金比率">比率：' +
                    '<strong class="dzt_red">' + tk_r + '</strong>' +
                    '</p>' +
                    '</div>' + yx +
                    '<ul class="lm_hd_h_r">' +
                    '<li>' +
                    '<p>月推广量</p>' +
                    '<p><strong class="dzt_red">' + c + '</strong></p>' +
                    '</li>' +
                    '<li>' +
                    '<p>月支出佣金</p>' +
                    '<p><strong class="dzt_red">' + d + '</strong></p>' +
                    '</li>' +
                    '</ul>' +
                    '<div style="width:100%;height:0px;border-bottom:1px solid #ddd;clear:both;" class="dzt_tk_clear"></div>' +
                    '</div>';
                $('#dzt_tool_lm_hd_lst').append(tkInfo_html);
                $('.dzt_tool_lm_hd').attr('load', '1');
                tk_info_prepared = {
                    "couponInfo": couponInfo,
                    "tk_r": tk_r,
                    "capId": capId,
                    "eventRate": eventRate,
                    "yx_rate": yx_rate,
                    'itemId': itemId
                };
            },
            get_other_tkInfo: function () {
                bg.postMessage({act: 'GET', url: jhUrl, flag: 'URL_ALIMAMA_CAMPAIGNS', other: tk_info_prepared,});
            },
            get_jhInfo_callback: function (data, other) {
                var jh_table = '<table id="dzt_tk_jh" class="dzt_lm_hd_table mt"><thead><tr><th>淘宝客活动计划</th><th width="15%">类型</th><th width="15%">人工审核</th><th width="15%">平均佣金</th><th width="15%">单品佣金</th><th width="8%">详情</th></tr></thead></table>';

                var jh_none = '<tr><td colspan="6" class="di_none">没有计划</td></tr>';
                var reg = /<title>阿里妈妈.*<\/title>/gi;
                if (reg.test(data)) {
                    jh_html = '<tr><td colspan="7"><a href="http://pub.alimama.com/myunion.htm" target="_blank">登录淘宝联盟后刷新本页面查看</a></td></tr>';
                } else {
                    if (other.eventRate) {
                        var queqiao_url = "http://pub.alimama.com/promo/item/channel/index.htm?q=" + encodeURIComponent("https://item.taobao.com/item.htm?id=" + other.itemId) + "&channel=qqhd&yxjh=-1";
                        var jh_html = '<tr style="color:#f35a4a;"><td>鹊桥计划</td><td>鹊桥</td><td>否</td><td>-</td><td>' + other.eventRate + '%</td><td><a href="' + queqiao_url + '" target="_blank">详情</a></td></tr>';
                    } else {
                        var jh_html = '';
                    }
                    var jh_data = JSON.parse(data).data;

                    if (jh_html || (jh_data && jh_data.campaignList)) {
                        var jh_info = jh_data.campaignList;
                        var tk_spc_none = '<span style="color:red;" title="请点击右侧详情进入查看">获取失败</span>';
                        jh_info.forEach(function (item, index) {
                            if (item.campaignId == 0) {
                                if (other.tk_r != '<span class="di_none">-</span>') {
                                    var tk_spc = other.tk_r;
                                } else {
                                    var tk_spc = tk_spc_none;
                                }
                            } else {
                                if (other.capId && other.capId != undefined) {
                                    var capId = other.capId;
                                    if (capId[item.campaignId] && capId[item.campaignId] != null && capId[item.campaignId] != undefined) {
                                        var tk_spc = capId[item.campaignId] + '%';
                                    } else {
                                        var tk_spc = tk_spc_none;
                                    }

                                } else {
                                    var tk_spc = tk_spc_none;
                                }
                            }
                            var m = item.campaignName;
                            var a = item.avgCommissionToString;
                            var l = item.campaignType == '1' ? '通用' : l = item.campaignType == '2' ? '<span style="color:#3DAF98">定向</span>' : '';
                            var s = item.properties == '3' ? '是' : '<span class="di_none">否</span>';
                            var s_href = "http://pub.alimama.com/myunion.htm?#!/promo/self/campaign?campaignId=" + item.campaignId + "&shopkeeperId=" + item.shopKeeperId + "&userNumberId=" + DAMY.loader.get_sellerId();
                            jh_html += '<tr><td>' + m + '</td><td>' + l + '</td><td>' + s + '</td><td>' + a + '</td><td>' + tk_spc + '</td><td><a href="' + s_href + '" target="_blank">详情</a></td></tr>';
                            if (item.campaignType == '1' && other.yx_rate) {
                                jh_html += '<tr><td><a href="https://taobaoke.bbs.taobao.com/detail.html?appId=42801&postId=7519010" target="_blank" style="color:#f19b10;">营销计划</a></td><td><span style="color:#f19b10;">营销</span></td><td>-</td><td>-</td><td>' + other.yx_rate + '</td><td>-</td></tr>';
                            }
                        })
                    } else {
                        jh_html += jh_none;
                    }

                }
                $('.dzt_lm_hd_h').after(jh_table);
                $('#dzt_tk_jh').append(jh_html);
                $('.dzt_tool_lm_hd').attr('load', '2');
                DAMY.loader.get_coupons(couponsUrl, other.couponInfo);

                //隐藏计划
                // var hiddenjh_params_url = 'http://zhushou4.taokezhushou.com/api/v1/plan?seller_id=' + DAMY.loader.get_sellerId();
                // bg.postMessage({ act: 'GET', url: hiddenjh_params_url, cb: 'DAMY.loader.get_hidden_jh_params_callback' });

            },
            get_hidden_jh_params_callback: function (data) {
                // console.log(data)
                if (data && data.data != 'error') {
                    var json_str = JSON.parse(data.data).data;
                    $(json_str).each(function () {
                        var get_pages_url = "http://pub.alimama.com/campaign/merchandiseDetail.json?campaignId=" + this.campaign_id + "&shopkeeperId=" + this.shopkeeper_id + "&userNumberId=" + this.usernumber_id + "&tab=2&omid=" + this.usernumber_id + "&toPage=1&perPagesize=10&_input_charset=utf-8"
                        bg.postMessage({
                            act: 'GET',
                            url: get_pages_url,
                            other: {"campaign_id": this.campaign_id, "shopkeeperId": this.shopkeeper_id},
                            flag: "URL_ALIMAMA_HIDDEN_CAMPAIGNS"
                        });
                    })
                }

            },

            get_pages_callback: function (data, other) {
                if (!((/<title>阿里妈妈.*<\/title>/gi).test(data))) {
                    // console.log(11111)
                    var get_pages_info = JSON.parse(data).data;
                    // console.log(get_pages_info)
                    $(get_pages_info).each(function () {
                        var commissionRatePercent = this.pagelist[0].commissionRatePercent;
                        // console.log(commissionRatePercent)
                        var hiddenjh_url = "http://pub.alimama.com/campaign/campaignDetail.json?campaignId=" + this.campaignID + "&shopkeeperId=" + other.shopkeeperId;
                        bg.postMessage({
                            act: 'GET',
                            url: hiddenjh_url,
                            other: {"campaign_id": this.campaignID, 'commissionRatePercent': commissionRatePercent},
                            flag: 'URL_ALIMAMA_CAMPAIGN_DETAIL'
                        });
                    })
                }

            },

            get_hidden_jhInfo_callback: function (data, other) {
                if (data && data != 'error') {
                    var hidden_jhInfo = JSON.parse(data).data;
                    var yc_jh = '';
                    if (hidden_jhInfo && hidden_jhInfo.catCommissions.length && hidden_jhInfo.cpsCampaignDO && hidden_jhInfo.cpsCampaignDO.status != 4) {
                        $(hidden_jhInfo).each(function () {
                            if (this.catCommissions.length) {
                                var a = this.catCommissions[0].commissionRate + '%';
                            }
                            if (this.cpsCampaignDO) {
                                var s = this.cpsCampaignDO.properties == '2' ? '是' : '<span class="di_none">否</span>';
                                var n_url = "http://pub.alimama.com/myunion.htm?#!/promo/self/campaign?campaignId=" + this.cpsCampaignDO.campaignId + "&shopkeeperId=" + this.cpsCampaignDO.shopKeeperId + "&userNumberId=" + DAMY.loader.get_sellerId();
                                if (other.campaign_id == this.cpsCampaignDO.campaignId) {
                                    yc_jh += '<tr><td>' + this.cpsCampaignDO.campaignName + '</td><td class="di_none">隐藏</td><td>' + s + '</td><td>' + a + '</td><td>' + other.commissionRatePercent + '%</td><td><a href="' + n_url + '" target="_blank">详情</a></td></tr>';
                                }
                            }
                        })
                    }
                    if (yc_jh != '') {
                        $('#dzt_tk_jh').append(yc_jh);
                    }

                    // if(hidden_jhInfo && hidden_jhInfo.catCommissions){
                    //     var c = hidden_jhInfo.catCommissions;
                    //     var a = c[0].commissionRate + '%';
                    // }
                    // if(hidden_jhInfo && hidden_jhInfo.cpsCampaignDO){
                    //     var n = hidden_jhInfo.cpsCampaignDO;
                    //     $(n).each(function(){
                    //         var s = this.properties == '2' ? '是' : '<span class="di_none">否</span>';
                    //         var n_url = "http://pub.alimama.com/myunion.htm?#!/promo/self/campaign?campaignId=" + this.campaignId + "&shopkeeperId=" + this.shopKeeperId + "&userNumberId=" + DAMY.loader.get_sellerId();
                    //         if(other.campaign_id == this.campaignId){
                    //             yc_jh = '<tr><td>'+ this.campaignName +'</td><td class="di_none">隐藏</td><td>'+ s +'</td><td>'+ a +'</td><td>'+ other.commissionRatePercent +'%</td><td><a href="' + n_url + '" target="_blank">详情</a></td></tr>';
                    //         }

                    //     })
                    // }


                }

            },

            get_coupons: function (url, couponInfo) {
                var coupons_table = '<h4 class="mt">优惠券<span class="dzt_yhj_ts"><div class="dzt_tooltip">请注意，优惠劵数据显示会有稍许延时，过段时间再查看就能正常显示！</div><span class="dzt-arrow-bottom">&nbsp;</span></span></h4><table class="dzt_lm_hd_table" id="dzt_coupons"><thead><tr><th>优惠券</th><th width="25%">有效期</th><th width="15%">类型</th><th width="10%">状态</th></tr></thead></table>';
                $('#dzt_tk_jh').after(coupons_table);
                $('.dzt_yhj_ts').hover(function () {
                    $(this).find('.dzt_tooltip,.dzt-arrow-bottom').attr('style', 'display:block;');
                }, function () {
                    $(this).find('.dzt_tooltip,.dzt-arrow-bottom').attr('style', 'display:none;');
                })
                var coupons_html = '';

                $.getJSON(url).done(function (data) {
                    if (couponInfo) {
                        var couponEffectiveEndTime = couponInfo.couponEffectiveEndTime.replace(/-/g, '.');
                        var couponEffectiveStartTime = couponInfo.couponEffectiveStartTime.replace(/-/g, '.');
                        var timeRange = couponEffectiveStartTime + '<span class="di_none"> ~ </span>' + couponEffectiveEndTime;
                        var couponInfoUrl = 'http://pub.alimama.com/promo/search/index.htm?q=' + encodeURIComponent("https://item.taobao.com/item.htm?id=" + couponInfo.itemId) + '&yxjh=-1';
                        coupons_html += '<tr><td><span style="padding:2px 10px;background:#f35a4a;color:#fff;">' + couponInfo.couponAmount + '元</span><span style="margin-left:5px;padding:2px;background:#15ae81;color:#fff;border-radius: 3px;" title="阿里妈妈劵">阿</span></td><td>' + timeRange + '</td><td>' + couponInfo.couponInfo + '</td><td><a href="' + couponInfoUrl + '" target="_blank">官方转链</a></td></tr>';
                    }
                    var uhand = data.priceVolumes;
                    if (data && uhand != '') {
                        uhand.forEach(function (item) {
                            if (item.status == 'unreceived') {
                                var s_tmp = '<a href="https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=' + DAMY.loader.get_sellerId() + '&activityId=' + item.id + '" target="_blank">可领取</a>';
                            } else {
                                var s_tmp = '<span style="color:#ccc;">已领取</span>';
                            }
                            var c_timeRange = item.timeRange.replace('-', '<span class="di_none"> ~ </span>');
                            coupons_html += '<tr><td><span style="padding:2px 10px;background:#f35a4a;color:#fff;">' + item.title + '</span></td>' +
                                '<td>' + c_timeRange + '</td>' +
                                '<td>' + item.condition + '</td>' +
                                '<td>' + s_tmp + '</td>' +
                                '</tr>';
                        })


                        $('#dzt_coupons').append(coupons_html);

                        // $(uhand).each(function() {
                        //     // console.log(this)
                        //     var c_title = this.title;
                        //     var c_timeRange = this.timeRange;
                        //     var c_condition = this.condition;
                        //     var c_status = this.status;
                        //     var c_id = this.id
                        //     var get_coupons_url = "https://shop.m.taobao.com/shop/coupon.htm?seller_id=" + DAMY.loader.get_sellerId() + "&activity_id=" + this.id;
                        //     $.get(get_coupons_url, function(data) {
                        //
                        //         var coupons_info = data;
                        //         // c_info = DAMY.loader.get_couponns_info(coupons_info);
                        //
                        //         if (c_status == 'unreceived') {
                        //             var s_tmp = '<a href="https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=' + DAMY.loader.get_sellerId() + '&activityId=' + c_id + '" target="_blank">可领取</a>';
                        //         } else {
                        //             var s_tmp = '<span style="color:#ccc;">已领取</span>';
                        //         }
                        //         c_timeRange = c_timeRange.replace('-', '<span class="di_none"> ~ </span>')
                        //         coupons_html += '<tr><td><span style="padding:2px 10px;background:#f35a4a;color:#fff;">' + c_title + '</span></td>' +
                        //             '<td>' + c_timeRange + '</td>' +
                        //             '<td>' + c_condition + '</td>' +
                        //             // '<td>' + c_info.sNum + '</td>' +
                        //             // '<td>' + c_info.rNum + '</td>' +
                        //             // '<td>' + c_info.limit + '</td>' +
                        //             '<td>' + s_tmp + '</td>' +
                        //             '</tr>';
                        //         $('#dzt_coupons').append(coupons_html);
                        //     })
                        // })


                    } else { //需要用到隐藏优惠劵时此处注释

                        var coupons_html = '<tr><td colspan="7" class="di_none">没有优惠券</td></tr>';
                        $('#dzt_coupons').append(coupons_html);
                    }
                }).fail(function () {
                    var coupons_html = '<tr><td colspan="7"><a href="https://login.taobao.com/member/login.jhtml" target="_blank">登陆淘宝后刷新本页面查看</a></td></tr>';
                    $('#dzt_coupons').append(coupons_html);
                })
                /*.always(function(){
                         //隐藏优惠劵
                         bg.postMessage({act: 'get', url: hiddenCouponsUrl, other: {'u': uhand}, cb: 'DAMY.loader.get_hiddenCoupons_callback'});
                         })*/

                /*************** 鹊桥活动接口有误，暂关闭**************/
                // bg.postMessage({ act: 'GET', url: qqhdUrl, cb: 'DAMY.loader.get_qqhd_callback' });


            },
            // get_hiddenCoupons_callback: function(data,other){
            //      var n = JSON.parse(data).data;
            //      if(n != ''){
            //          $(n).each(function(){
            //              var act_id = this.activity_id;
            //              DAMY.loader.parseCoupons(act_id);
            //          })
            //      }
            //      if(n == '' && other.u == ''){
            //          var coupons_none_html = '<tr><td colspan="7" class="di_none">没有优惠券</td></tr>';
            //          $('#dzt_coupons').append(coupons_none_html);
            //      }

            // },
            // parseCoupons: function(id){
            //      var i = "https://shop.m.taobao.com/shop/coupon.htm?seller_id=" + DAMY.loader.get_sellerId() + "&activity_id=" + id;
            //      $.get(i).done(function(data){
            //          var hidden_couponns_info = data;
            //          var n = DAMY.loader.get_couponns_info(hidden_couponns_info);   //获取隐藏优惠劵信息
            //          var hiddenCoupons_html = '<tr class="di_none">'+
            //                                      '<td>'+ n.ntitle +'</td>'+
            //                                      '<td>'+ n.start + ' ~ ' + n.end +'</td>'+
            //                                      '<td>满'+ n.useM + '减' + n.amount +
            //                                      '<td>'+ n.sNum +'</td>'+
            //                                      '<td>'+ n.rNum +'</td>'+
            //                                      '<td>'+ n.limit +'</td>'+
            //                                      '<td><a href="' + i +'" target="_blank">可领取</a></td>'+
            //                                   '</tr>';
            //          $('#dzt_coupons').append(hiddenCoupons_html);
            //          //}
            //      }).fail(function(){
            //          console.error('解析优惠券失败',i)
            //      })

            // },
            //********************接口被取消了，暂时停用2017-4-27****************************
            // get_couponns_info: function(data) {
            //     // console.log('####',data)
            //     var e = data.replace(/\n/g, "").match(/(\d*)元优惠券[\s\S]*剩<span class="rest">(\d*)[\s\S]*<span class="count">(\d*)[\s\S]*单笔满([\d\.]*)元可用[\s\S]*每人限领(.*)张[\s\S]*有效期:([\d|-]*)至([\d|-]*)/);
            //     // console.log(e)
            //     if (e) {
            //         var n = {
            //             ntitle: e[0].match(/\d*元优惠券/)[0] + '(隐藏)', //优惠劵名称
            //             amount: e[1], //  减多少
            //             sNum: e[2], //剩余
            //             rNum: e[3], //已领
            //             useM: e[4], //满多少
            //             limit: e[5], //限领
            //             start: e[6].replace(/-/g, "."), //开始时期
            //             end: e[7].replace(/-/g, ".") //结束日期
            //         }
            //         return n;
            //     }


            // },
            /*************** 鹊桥活动接口有误，暂关闭**************/
            // get_qqhd_callback: function(data) {
            //     if(data) var n = JSON.parse(data.data);
            //     if (n && n.dataList.length > 0) {
            //         // var n = JSON.parse(data.data);
            //         // console.log(n);
            //         var qqhd_table = '<div class="dzt_qqhd_mh" id="dzt_more"><h4 class="mt">淘宝客活动推广(鹊桥活动)<span style="font-weight:normal;margin-left:20px;">数据由<a href="http://www.taokezhushou.com" target="_blank">淘客助手</a>提供</span></h4><table class="dzt_lm_hd_table" id="dzt_qqhd"></table></div>';
            //         var qqhd_html = '<thead><th>活动ID</th><th>佣金</th><th>分成</th><th>开始</th><th>结束</th><th>宝贝列表</th><th>活动详情</th></thead>';
            //
            //         $(n.dataList).each(function() {
            //             var i = this.eventId;
            //             // console.log(i)
            //             var s_d = this.startTime.split('T')[0];
            //             // console.log(s_d)
            //             var e_d = this.endTime.split('T')[0];
            //             var f = this.shareRate + '%';
            //             var l = this.left_day;
            //             var c = this.commissionRate * 1/100 + '%';
            //             // console.log(c)
            //             qqhd_html += '<tr><td>' + i + '</td><td>' + c + '</td><td>' + f + '</td><td>' + s_d + '</td><td>' + e_d + '</td><td><a href="https://temai.taobao.com/preview.htm?id=' + i + '" target="_blank">全部宝贝</a></td><td><a href="http://pub.alimama.com/myunion.htm?#!/promo/act/activity_detail?eventId=' + i + '&lianmang" target="_blank">详情</a></td></tr>';
            //         })
            //
            //         if (n.status == '200') {
            //             $('#dzt_coupons').after(qqhd_table);
            //             $('#dzt_qqhd').append(qqhd_html);
            //
            //             if (n.dataList.length > 6) {
            //                 var dzt_moreqq = '<div style="text-align:center;margin-top:10px;"><a href="javascript:;" id="dzt_MoreQq">展开更多淘宝客活动</a></div>';
            //                 $('#dzt_more').after(dzt_moreqq);
            //
            //                 $('#dzt_MoreQq').click(function() {
            //                     if ($('#dzt_MoreQq').text() == '展开更多淘宝客活动') {
            //                         $(this).text('收起淘宝客活动').parent().prev().removeClass('dzt_qqhd_mh');
            //                     } else {
            //                         $(this).text('展开更多淘宝客活动').parent().prev().addClass('dzt_qqhd_mh');
            //                     }
            //                 })
            //
            //             }
            //         }
            //     }
            // },
            render_tb_style: function () {
                var itemlist_class = '.grid';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('.item:not(:has(.dzt-ext-info-bar))').each(function () {
                        //先获取宝贝ID
                        var id = $(this).attr('data-itemid');
                        if (id) ids.push(id);
                        var nick = $(this).find('.shopname').find('a').text();
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        $(this).append(html);
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }
                setTimeout(function () {
                    DAMY.loader.render_tb_style();
                }, 2000);
            },

            render_theme: function () {
                var itemlist_class = '.m-itemlist';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('.item-common:not(:has(.dzt-ext-info-bar))').each(function () {
                        //先获取宝贝ID
                        var id = $(this).find('a.pic-link').attr('data-nid');
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        $('.dzt_cat').remove();
                        $(this).append(html).attr('style', 'height:520px !important;');
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }
                setTimeout(function () {
                    DAMY.loader.render_theme();
                }, 2000);
            },

            render_qbb: function () {
                var itemlist_class = '#crowd-guide-items';
                if ($('#crowd-guide-items').length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('.item:not(:has(.dzt-ext-info-bar))').each(function () {
                        //先获取宝贝ID
                        var id = $(this).find('a').attr('href').match(/id=\d+/)[0].split('=')[1];
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.dzt-ci-nav').attr('style', 'width:440px;');
                        $(this).append(html);
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }
                setTimeout(function () {
                    DAMY.loader.render_qbb();
                }, 2000);
            },

            render_tbshopcat: function () {
                var itemlist_class = '.item3line1,.item30line1,.item4line1';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('.item:not(:has(.dzt-ext-info-bar))').each(function () {
                        // 先获取宝贝ID
                        var id = DAMY.loader.seach_item_id(this);
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);

                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box('.shop-hesper-bd');
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }
                setTimeout(function () {
                    DAMY.loader.render_tbshopcat();
                }, 2000);
            },
            render_qing: function () {
                var itemlist_class = '.item-list';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('.item-card:not(:has(.dzt-ext-info-bar))').each(function () {
                        // 先获取宝贝ID
                        var id = DAMY.loader.seach_item_id(this);
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function () {
                    DAMY.loader.render_qing();
                }, 2000);
            },
            render_quality: function () {
                var itemlist_class = '.m-itemList';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    // $(itemlist_class).find('li.listitem:not(:has(.dzt-ext-info-bar)),' +
                    //     'li.zqx-item:not(:has(.dzt-ext-info-bar)),' +
                    //     'li.recommend-item:not(:has(.dzt-ext-info-bar)),' +
                    //     '.grid li.item:not(:has(.dzt-ext-info-bar))').each(function() {
                    //     var id;
                    //     var reg = /item\.htm\?.*id=(\d+)/i;

                    //     $(this).find('a').each(function() {
                    //         var url = $(this).attr('href');
                    //         if (typeof id == 'undefined' && reg.test(url)) {
                    //             var ret = reg.exec(url);
                    //             id = ret[1];
                    //         }
                    //     });
                    //     if (id) ids.push(id);
                    //     var nick = '';
                    //     var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                    //     html.find('.kdb-shop').detach();
                    //     html.find('.kdb-search').detach();
                    //     $(this).append(html);
                    // });
                    $(itemlist_class).find('li.item:not(:has(.dzt-ext-info-bar))').each(function () {
                        var id = $(this).attr('data-itemid');
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);
                    })
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function () {
                    DAMY.loader.render_quality();
                }, 2000);
            },
            render_pp: function () {
                var itemlist_class = '.p-cat-wrapper';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('li.p-cat-item:not(:has(.dzt-ext-info-bar))').each(function () {
                        var id;
                        var reg = /item\.htm\?id=(\d+)/i;
                        $(this).find('a').each(function () {
                            var url = $(this).attr('href');
                            if (typeof id == 'undefined' && reg.test(url)) {
                                var ret = reg.exec(url);
                                id = ret[1];
                            }
                        });
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function () {
                    DAMY.loader.render_pp();
                }, 2000);
            },
            render_taotelaisi: function () {
                var itemlist_class = '.wrap .content ul.product-content ';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('li.content-item:not(:has(.dzt-ext-info-bar))').each(function () {
                        var id;
                        var reg = /item\.htm\?id=(\d+)/i;
                        $(this).find('a').each(function () {
                            var url = $(this).attr('href');
                            if (typeof id == 'undefined' && reg.test(url)) {
                                var ret = reg.exec(url);
                                id = ret[1];
                            }
                        });
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function () {
                    DAMY.loader.render_taotelaisi();
                }, 2000);
            },

            render_guang_item: function () {
                var itemlist_class = '.detail-section';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $('.detail-section:not(:has(.dzt-ext-info-bar))').each(function () {
                        // 先获取宝贝ID
                        var reg = /item\.htm\?id=(\d+)/i;
                        var id;
                        $('.comments-buy').find('a').each(function () {
                            var url = $(this).attr('href');
                            if (typeof id == 'undefined' && reg.test(url)) {
                                var ret = reg.exec(url);
                                id = ret[1];
                            }
                        });
                        if (id) {
                            ids.push(id);
                            var nick = '';
                            var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                            html.find('.kdb-shop').detach();
                            html.find('.kdb-search').detach();
                            $(this).append(html);

                        }
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }
                this.render_guang(true);
                setTimeout(function () {
                    DAMY.loader.render_guang_item();
                }, 2000);
            },
            render_guang: function(notInternal) {
                var itemlist_class = '.waterfall .waterfall-list';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('.waterfall-common-inner:not(:has(.dzt-ext-info-bar))').each(function() {
                        // 先获取宝贝ID
                        var id = $(this).find('a').eq(0).attr('data-nid');
                        if (typeof id == 'undefined') {
                            var reg = /&itemid=(\d+)/i;
                            $(this).find('a').each(function() {
                                var url = $(this).attr('href');
                                if (typeof id == 'undefined' && reg.test(url)) {
                                    var ret = reg.exec(url);
                                    id = ret[1];
                                }
                            });
                        }
                        if (id) ids.push(id);
                        var nick = '';
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);
                        html.attr('style', 'margin-top:-40px;');
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }
                if (!notInternal) {
                    setTimeout(function() {
                        DAMY.loader.render_guang();
                    }, 2000);
                }
            },
            render_tjb: function() {
                $('.J_ItemPanel a.topic-item').each(function() {
                    var item_class = $(this).attr('class');
                    $(this).removeClass("topic-item").removeClass('last-item').wrap('<div class="dzt-tjb-item ' + item_class + '"></div>');
                });
                if ($('.J_ItemPanel .dzt-tjb-item').length > 0) {
                    $('.J_ItemPanel').attr('load', '1');
                } else {
                    $('.J_ItemPanel').attr('load', '0');
                }
                $('.J_TopicPanel a.topic-item').each(function() {
                    var item_class = $(this).attr('class');
                    $(this).removeClass("topic-item").wrap('<div class="dzt-tjb-item ' + item_class + '"></div>');
                });
                if ($('.J_TopicPanel .dzt-tjb-item').length > 0) {
                    $('.J_TopicPanel').attr('load', '1');
                } else {
                    $('.J_TopicPanel').attr('load', '0');
                }

                $('.J_BrandDetailList a.topic-item').each(function() {
                    var item_class = $(this).attr('class');
                    $(this).removeClass("topic-item").wrap('<div class="dzt-tjb-item ' + item_class + '"></div>');
                });
                if ($('.J_BrandDetailList a.dzt-tjb-item').length > 0) {
                    $('.J_BrandDetailList').attr('load', '1');
                } else {
                    $('.J_BrandDetailList').attr('load', '0');
                }

                $(".shop-money-list").each(function() {
                    if ($(this).attr('load') != '1') {
                        $(this).find('.brand-detail-item').each(function() {
                            var item_class = $(this).attr('class');
                            $(this).removeClass("brand-detail-item brand-detail-item-last").wrap('<div class="dzt-tjb-item ' + item_class + '"></div>');
                        });
                    }

                    if ($(this).find('.dzt-tjb-item').length > 0) {
                        $(this).attr('load', '1');
                    } else {
                        $(this).attr('load', '0');
                    }
                });

                var itemlist_class = '.J_ItemPanel,.J_TopicPanel,.J_BrandDetailList,.shop-money-list';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).find('.dzt-tjb-item:not(:has(.dzt-ext-info-bar))').each(function() {
                        // 先获取宝贝ID
                        var id = $(this).find('a').eq(0).attr('data-nid');
                        if (typeof id == 'undefined') {
                            var reg = /item\.htm\?id=(\d+)/i;
                            $(this).find('a').each(function() {
                                var url = $(this).attr('href');
                                if (typeof id == 'undefined' && reg.test(url)) {
                                    var ret = reg.exec(url);
                                    id = ret[1];
                                }
                            });
                        }
                        if (id) ids.push(id);
                        var nick = $(this).find('.shop').find('span:last').html();
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);

                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function() {
                    DAMY.loader.render_tjb();
                }, 2000);
            },
            render_judetail: function () {
                var itemlist_class = '.detail-main';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $('.detail-main:not(:has(.dzt-ext-info-bar))').each(function () {
                        // 先获取宝贝ID
                        var id = $('#itemId').val();
                        if (id) ids.push(id);
                        var nick = $('.sellername:eq(0)').text();

                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        //html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);
                        // $('.dzt-ext-info-bar').find('.kdb-logo14').parent('div').attr('style', 'margin-left:100px;');
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function () {
                    DAMY.loader.render_judetail();
                }, 2000);
            },
            render_jhs: function () {
                var itemlist_class = '.ju-itemlist';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    //if($('#q').length) kw = $('#q').val();
                    $(itemlist_class).find('.item-small-v3:not(:has(.dzt-ext-info-bar)),.item-big-v2:not(:has(.dzt-ext-info-bar))').each(function () {
                        // 先获取宝贝ID
                        var id = $(this).find('a').eq(0).attr('data-nid');
                        if (typeof id == 'undefined') {
                            var reg = /item_id=(\d+)/i;
                            $(this).find('a').each(function () {
                                var url = $(this).attr('href');
                                if (typeof id == 'undefined' && reg.test(url)) {
                                    var ret = reg.exec(url);
                                    id = ret[1];
                                }
                            });
                        }
                        if (id) ids.push(id);
                        var nick = $(this).find('.shop').find('span:last').html();
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.find('.kdb-shop').detach();
                        html.find('.kdb-search').detach();
                        $(this).append(html);
                    });
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function () {
                    DAMY.loader.render_jhs();
                }, 2000);
            },
            render_tqg: function(isCategory) {
                if (isCategory) {
                    $('.qg-category-list>a.qg-item').removeClass("qg-item").removeClass("qg-ing").wrap('<div class="dzt-tqg-item"></div>');
                } else {
                    if ($('.qg-limit-list').attr('load') != '1') {
                        $('.qg-limit-list .qg-item').removeClass("qg-item").removeClass("qg-ing").wrap('<div class="dzt-tqg-item"></div>');
                    }
                    if ($('.qg-limit-list .dzt-tqg-item').length > 0) {
                        $('.qg-limit-list').attr('load', '1');
                    } else {
                        $('.qg-limit-list').attr('load', '0');
                    }

                    if ($('.qg-last-list').attr('load') != '1') {
                        $('.qg-last-list .qg-item').removeClass("qg-item").removeClass("qg-ing").wrap('<div class="dzt-tqg-item"></div>');
                    }
                    if ($('.qg-last-list .dzt-tqg-item').length > 0) {
                        $('.qg-last-list').attr('load', '1');
                    } else {
                        $('.qg-last-list').attr('load', '0');
                    }

                    if ($('.qg-brand-list').attr('load') != '1') {
                        $('.qg-brand-list .qg-item').removeClass("qg-item").removeClass("qg-ing").wrap('<div class="dzt-tqg-item"></div>');
                    }
                    if ($('.qg-brand-list .dzt-tqg-item').length > 0) {
                        $('.qg-brand-list').attr('load', '1');
                    } else {
                        $('.qg-brand-list').attr('load', '0');
                    }
                }
                $('.dzt-tqg-item').addClass("qg-item qg-ing");

                var itemlist_class = '.qg-category-list,.qg-limit-list,.qg-last-list,.qg-brand-list';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    if ($('#q').length) kw = $('#q').val();
                    $(itemlist_class).find('.dzt-tqg-item:not(:has(.dzt-ext-info-bar))').each(function() {
                        if ($(this).find('.qg-done').length > 0) {
                            var html = "";
                            $(this).append(html);
                        } else {
                            // 先获取宝贝ID
                            var id = $(this).find('a').eq(0).attr('data-nid');
                            if (typeof id == 'undefined') {
                                var reg = /item\.htm\?id=(\d+)&/i;
                                $(this).find('a').each(function() {
                                    var url = $(this).attr('href');
                                    if (typeof id == 'undefined' && reg.test(url)) {
                                        var ret = reg.exec(url);
                                        id = ret[1];
                                    }
                                });
                            }
                            if (id) ids.push(id);
                            var nick = $(this).find('.shop').find('span:last').html();
                            var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                            html.find('.kdb-shop').detach();
                            html.find('.kdb-search').detach();
                            $(this).append(html);
                        }
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function() {
                    DAMY.loader.render_tqg(isCategory);
                }, 2000);
            },
            render_tmall_subject: function () {
                var itemlist_class = '#J_ItemList';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    var nick = '';
                    $(itemlist_class).find('.product:not(:has(.dzt-ext-info-bar))').each(function () {
                        var id = $(this).attr('data-id');
                        if (id) {
                            ids.push(id);
                            var html = DAMY.loader.render_search(id, kw, nick, 'tmall');
                            $(this).find('.product-iWrap').append(html);
                            $(this).attr('style', 'height:400px !important;')
                        }
                    });
                    this.search_kws(ids, 'tmall');
                }
                setTimeout(function () {
                    DAMY.loader.render_tmall_subject();
                }, 1000);
            },
            render_tmallstore: function() {
                var itemlist_class = '.J_TItems,.shop-list';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    var nick = $('.slogo-shopname').text();
                    //$(itemlist_class).attr('dzt-load', 'dzt');
                    $(itemlist_class).find('.item:not(:has(.dzt-ext-info-bar))').each(function() {
                        // 先获取宝贝ID
                        var id = DAMY.loader.seach_item_id(this);
                        if (id) {
                            ids.push(id);
                            var html = DAMY.loader.render_search(id, kw, nick, 'tmall');
                            //html.insertAfter($(this).find('.rates'));
                            $(this).append(html);
                            if (!$('.rates').length) {
                                $('.dzt-ext-info-bar').attr('style', 'padding-top:20px;');
                            }
                        }
                        var catId = $(this).find('a.J_TGoldData').attr('atpanel').split(',')[2];
                        $(this).find('.dzt_cat_info_' + id).attr('catId', catId);
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if(ids.length){
                        DAMY.loader.search_kws(ids, 'tmall');
                    }

                }

                setTimeout(function() {
                    DAMY.loader.render_tmallstore();
                }, 1000);
            },
            render_store: function () {
                var itemlist_class = '.shop-hesper-bd, .J_TItems';

                if ($(itemlist_class).length <= 0 || $(itemlist_class).attr('dzt-load')) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    var nick = $('.base-info .seller-name').text().replace('掌柜：', '');
                    $(itemlist_class).attr('dzt-load', 'dzt');
                    $(itemlist_class).find('.item').each(function () {
                        $('.tshop-pbsm-shop-srch-list').find('.skin-box-bd').attr('style', 'color:#2953a6;'); //适配部分用户模板样式不兼容
                        // 先获取宝贝ID
                        var id = DAMY.loader.seach_item_id(this);
                        if (id) {
                            ids.push(id);
                            var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                            //html.insertAfter($(this).find('.rates'));
                            $(this).append(html);
                            html.find('.dzt-mr5 b').attr('style', 'color:#404040;')
                            if ($('.detail-info').length) {
                                //适配列表方式位置摆放
                                $('.dzt-ext-info-bar').css({
                                    'float': 'right',
                                    'margin-top': '-65px',
                                    'margin-right': '100px'
                                });
                            }
                        }

                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if(ids.length){
                        DAMY.loader.search_kws(ids, 'tb');
                    }

                }
                setTimeout(function () {
                    DAMY.loader.render_store();
                }, 1000);
            },
            render_tmallgj: function() {
                var itemlist_class = '#J_ItemList';
                if ($(itemlist_class).length <= 0 || $(itemlist_class).attr('dzt-load')) {
                    //
                } else {
                    var ids = new Array();
                    var kw = $('#q').val();
                    $(itemlist_class).attr('dzt-load', 'dzt');
                    $(itemlist_class).find('.product').each(function() {
                        // 先获取宝贝ID
                        var id = $(this).attr('data-id');
                        if (id) {
                            ids.push(id);
                            var nick = $(this).find('.productShop-name').text();
                            var html = DAMY.loader.render_search(id, kw, nick, 'tmall');
                            $(this).find(".product-iWrap").append(html);
                            // $(this).attr('style', 'height:425px !important;');
                        }
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if(ids.length){
                        DAMY.loader.search_kws(ids, 'tmall');
                    }


                }
                if ($(itemlist_class).find('.qly-ext-append').length > 0) {
                    $('#J_ItemList').find('.product').attr('style', 'height:570px!important;')
                }
                DAMY.loader.render_itemList_top();

                setTimeout(function() {
                    DAMY.loader.render_tmallgj();
                }, 1000);
            },
            render_mysearch: function () {
                var itemlist_class = '#mysearch-grid';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = $('#q').val();
                    $(itemlist_class).find('.grid-cell:not(:has(.dzt-ext-info-bar))').each(function () {
                        // 先获取宝贝ID
                        var id = DAMY.loader.seach_item_id(this);
                        if (id) {
                            ids.push(id);
                            var nick = $(this).find('.shop-name').text();
                            var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                            html.insertAfter($(this).find('.goods'));
                        }
                    });
                    if (ids.length) {
                        this.search_kws(ids, 'tb');
                    }
                }
                setTimeout(function () {
                    DAMY.loader.render_mysearch();
                }, 1000);
            },
            render_global: function() {
                var itemlist_class = '.m-itemlist';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    $(itemlist_class).find(".item:not(:has(.dzt-ext-info-bar))").each(function() {
                        var id = DAMY.loader.seach_item_id(this);
                        if (id) {
                            ids.push(id);
                            var nick = $(this).find('.shop').find('span:last').html();
                            var html = DAMY.loader.render_search(id, '', nick, 'tb');
                            html.insertAfter($(this).children('div:last'));
                        }
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if (ids.length) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                // 重新加载
                setTimeout(function() {
                    DAMY.loader.render_global();
                }, 2000);
            },
            render_tttj: function() {
                // var itemlist_class = '.filter-list-detail,.cat-item-list,.module .list,.items-list';
                var itemlist_class = '#J_TJ_Items,.J_Top4,.tj_items,.items';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';

                    $(itemlist_class).find('.item,.J_TJ_Item:not(:has(.dzt-ext-info-bar)),.top4_item:not(:has(.dzt-ext-info-bar)),.J_Item:not(:has(.dzt-ext-info-bar))').each(function() {
                        // 先获取宝贝ID
                        if ($(this).attr('wrap') != 1) {
                            $(this).attr('wrap', 1).wrap('<div class="dzt-wrap-box"></div>');
                        }
                        var id;
                        if ($(this).find('.tj_item_link[data-id]').length > 0) {
                            id = $(this).find('.tj_item_link').attr('data-id');
                        } else if ($(this).find('.top4_item_link[data-id]').length > 0) {
                            id = $(this).find('.top4_item_link').attr('data-id');
                        } else {
                            id = $(this).attr('href').split('id=')[1];
                        }
                        if (id) {
                            ids.push(id);
                            var nick = '';
                            var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                            html.find('.kdb-shop').detach();
                            html.find('.kdb-search').detach();
                            if (!$(this).parent('div').find('.dzt-ext-info-bar').length) {
                                $(this).parent('div').append(html);
                            }

                        }
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if(ids.length){
                        DAMY.loader.search_kws(ids, 'tb');
                    }

                }
                setTimeout(function() {
                    DAMY.loader.render_tttj();
                }, 2000);
            },
            render_list: function () {
                var itemlist_class = '.m-itemlist,.m-items';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    $(itemlist_class).find(".item:not(:has(.dzt-ext-info-bar))").each(function () {
                        var id = $(this).find('a').eq(0).attr('data-nid');
                        if (typeof id == 'undefined') {
                            id = DAMY.loader.seach_item_id(this);
                        }
                        if (id) {
                            ids.push(id);
                            var nick = $(this).find('.shop').find('span:last').html();
                            var html = DAMY.loader.render_search(id, '', nick, 'tb');
                            html.insertAfter($(this).children('div:last'));
                            // if($('a.style-icon[data-value="list"]').hasClass('selected')){
                            //     $('.kdb-logo14').parent('div').attr('style', 'margin-left:100px;');
                            // }
                        }
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    if (ids.length) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }
                // 重新加载
                setTimeout(function () {
                    DAMY.loader.render_list();
                }, 2000);
            },

            render_tmall: function() {
                if ($('#J_ItemList').length <= 0 || $('#J_ItemList').attr('dzt-load')) {
                    //
                } else {
                    var ids = new Array();
                    var kw = $('#mq').attr('value');
                    $('#J_ItemList').attr('dzt-load', 'dzt');

                    $('#J_ItemList').find('.product-iWrap:not(:has(.pa-cover))').each(function() {
                        var id = $(this).parent('div').attr('data-id');
                        if (!id) {
                            return;
                        }
                        ids.push(id);
                        //var nick = $(this).find('.ww-small').attr('data-nick');
                        // var catId = $(this).find('.productTitle>a').attr('href').split('&')[4].split('=')[1];
                        var nick = $(this).find('.productShop>a.productShop-name').text();
                        var html = DAMY.loader.render_search(id, kw, nick, 'tmall');
                        // $(this).find('.dzt_cat_info_' + id).attr('catId', catId);
                        //html.insertAfter($(this).find('.productStatus'));
                        if ($('.product-iWrap').length) {
                            //大图模式
                            html.appendTo($(this).parent('div').find('.product-iWrap'));
                        } else {
                            //小图模式
                            $(this).attr('style', 'height:240px !important;').find('.product-limited').after(html);
                            $('.dzt-ext-info-bar').attr('style', 'clear:both;');
                        }
                        var catId = $(this).parent('div').attr('data-atp').split(',')[2];
                        $(this).find('.dzt_cat_info_' + id).attr('catId', catId);
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box('#J_ItemList');
                    if(ids.length){
                        DAMY.loader.search_kws(ids, 'tmall');
                    }

                }

                if ($('#J_ItemList').find('.qly-ext-append').length > 0) {
                    $('#J_ItemList').find('.product').attr('style', 'height: 580px !important;'); //适配千里眼
                } else if ($('#J_ItemList').find('.tmall_cha_keyword_counts_div').length > 0) {
                    $('#J_ItemList').find('.product').attr('style', 'height:600px !important;') //适配查排名
                }
                DAMY.loader.render_tmall_p4p();
                DAMY.loader.render_itemList_top();

                // if(!$('#J_ItemList').hasClass('dzt-box')){
                //     $('#J_ItemList').addClass('dzt-box').append(dzt_batch_right_html);
                // }
                setTimeout(function() {
                    DAMY.loader.render_tmall();
                }, 1000);
            },
            render_tmall_p4p: function () {
                // console.log(879798978)
                var ids = [];
                var kw = $('#mq').attr('value');
                $('.recommend-loading').find('li>div[class*="-item-inner"]:not(:has(.dzt-ext-info-bar))').each(function () {
                    var id = $(this).find('a[class*="imglink"]').attr('atpanel').split(',')[1];
                    ids.push(id);
                    var nick = $(this).find('a[class*="-wangwang"]').text();
                    var html = DAMY.loader.render_search(id, kw, nick, 'tmall');
                    html.appendTo($(this));
                    $(this).parents('ul[class*="-shop-list"]').css('overflow', 'visible');
                    $(this).parents('tbcc[id*="tbcc-c"]').attr('style', 'overflow:visible;');
                    $(this).parents('div[class*="-global"]').attr('style', 'height:460px;');
                })
                if (ids.length) {
                    DAMY.loader.search_kws(ids, 'tmall');
                }
            },
            render_tmall_chaoshi: function () {
                if ($('#J_ProductList').length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = $('#mq').val();
                    $('#J_ProductList>li.product').each(function () {
                        var id = $(this).attr('data-itemid');
                        // console.log(id)
                        if (!id) {
                            return;
                        }
                        ids.push(id);
                        var nick = $('#mallLogo').find('a').text().split('-')[0];
                        var html = DAMY.loader.render_search(id, kw, nick, 'tmall');
                        var catId = $(this).find('.product-title>a').attr('atpanel').split(',')[2];
                        //html.insertAfter($(this).find('.productInfo:not(:has(.dzt-ext-info-bar))').find('.item-summary'));
                        html.appendTo($(this).find('.productInfo:not(:has(.dzt-ext-info-bar))'));
                        $(this).find('.dzt_cat_info_' + id).attr('catId', catId);
                        html.attr('style', 'margin-left:-10px;').find('b').attr('style', 'font-weight:bold;');

                    });
                    if (ids.length) DAMY.loader.search_kws(ids, 'tmall');
                }
                setTimeout(function () {
                    DAMY.loader.render_tmall_chaoshi();
                }, 1000);
            },
            render_hc: function () {
                if ($('#list-itemList').length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    $('#list-itemList').find(".item:not(:has(.dzt-ext-info-bar))").each(function () {
                        var id = $(this).attr('data-itemid');
                        if (!id) {
                            id = DAMY.loader.seach_item_id(this);
                        }
                        if (id) {
                            ids.push(id);
                            var nick = $(this).find('.shopname').text();
                            var html = DAMY.loader.render_search(id, '', nick, 'tb');
                            html.insertAfter($(this).children('div:last')).find('a').attr('style', 'color:#35a;');
                            html.find('.dzt-list-tb-val,.dzt-list-ztc-val,.dzt-list-mobile-val,.dzt-list-ztc-mobile-val').attr('style', 'color:#ff0000;')
                            $('#list-itemList').find('.item').attr('style', 'height: 470px !important;');
                            $('.dzt-ext-info-bar>div').attr('style', 'margin-top:0;');
                        }
                    });
                    if (ids.length) DAMY.loader.search_kws(ids, 'tb');
                }
                setTimeout(function () {
                    DAMY.loader.render_hc();
                }, 1000);
            },
            render_tb_spuhead: function () {
                var ids = [];
                var kw = '';
                if ($('#q').length) kw = $('#q').val();
                if (typeof window.jsonp_data == 'undefined') {
                    var itemdata = DAMY.loader.dzt_get_itemInfo();
                    var itemlist = itemdata.itemlist;
                    DAMY.loader.set_spuhead_info(itemlist);
                } else {
                    var tb_spuhead_jsonp = window.jsonp_data.itemlist.data.auctions;
                    DAMY.loader.set_spuhead_info(tb_spuhead_jsonp);
                }

                $('.m-itemlist').find('.item:not(:has(.dzt-ext-info-bar))').each(function () {
                    var id = $(this).attr('nid');
                    if (id) ids.push(id);
                    var nick = $(this).attr('nick');
                    var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                    html.insertAfter($(this).children('div:last'));
                })
                //右侧直通车
                $.when(DAMY.loader.get_p4p_id()).then(function () {
                    $('#J_shopkeeper').find('tbcc ul>li[class*="-item"]:not(:has(.dzt-ext-info-bar))').each(function () {
                        var id = $(this).attr('p4p_id');
                        if (id) ids.push(id);
                        var nick = $(this).attr('nick');
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.appendTo($(this));
                        $('#J_shopkeeper').find('tbcc[id^="tbcc-"]').attr('style', 'overflow:visibility;');
                    });
                });

                if (ids.length > 0) {
                    DAMY.loader.search_kws(ids, 'tb');
                }
            },
            set_spuhead_info: function (data) {
                $('.m-itemlist').find('.item').each(function (i, v) {
                    $(this).attr('nid', data[i].nid)
                        .attr('nick', data[i].nick)
                        .attr('location', data[i].item_loc)
                        .attr('price', data[i].view_price)
                        .attr('category', data[i].category);

                })
            },
            render_tb: function() {
                var itemlist_class = '.m-itemlist,.m-items,.m-recitem, #J_shopkeeper';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    if ($('#spudetail-spuhead').length) {
                        DAMY.loader.render_tb_spuhead();
                    } else {
                        var ids = new Array();
                        var kw = '';
                        if ($('#q').length) kw = $('#q').val();
                        //$(itemlist_class).attr('dzt-load', 'dzt');
                        $(itemlist_class).find('.item:not(:has(.dzt-ext-info-bar)),.recitem:not(:has(.dzt-ext-info-bar))').each(function() {
                            // 先获取宝贝ID
                            var id = $(this).find('a').eq(0).attr('trace-nid');
                            if (typeof id == 'undefined') {
                                var reg = /item\.htm\?id=(\d+)&/i;
                                var p4p_reg = /click\.simba\.taobao\.com/i;
                                $(this).find('a').each(function() {
                                    var url = $(this).attr('href');
                                    if (typeof id == 'undefined' && reg.test(url)) {
                                        var ret = reg.exec(url);
                                        id = ret[1];

                                    } else if (typeof id == 'undefined' && p4p_reg.test(url)) {

                                        id = $(this).attr('data-nid')
                                    }

                                });
                            }
                            if (id) ids.push(id);
                            var nick = $(this).find('.shop').find('span:last').html();
                            var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                            html.insertAfter($(this).children('div:last'));
                        });
                        if ($('#J_shopkeeper').length) {
                            //右侧直通车
                            DAMY.loader.get_p4p_id();
                            $(itemlist_class).find('tbcc ul>li[class*="-item"]:not(:has(.dzt-ext-info-bar))').each(function() {
                                var id = $(this).attr('p4p_id');
                                if (id) ids.push(id);
                                var nick = $(this).attr('nick');
                                var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                                html.appendTo($(this));
                                $(itemlist_class).find('tbcc[id^="tbcc-"]').attr('style', 'display:block;');
                                $('#J_shopkeeper').find('a[class*="-red"]').css('bottom', '143px');
                            });

                            if (!($('.grid-right').find('.ztc_tip').length)) {
                                $('.grid-right #J_shopkeeper div[class$="-banner"]').after(ztc_tip_html);
                            }
                            $('.tip_close').click(function() {
                                $('.dzt-notice-alert.ztc_tip').remove();
                                $('.grid-right div[class$="-banner"]').addClass('ztc_tip');
                            });

                        }
                        if (is_append_sale_box) DAMY.loader.append_sale_box('.m-itemlist');

                        if (ids.length > 0) {
                            DAMY.loader.search_kws(ids, 'tb');
                        }
                        // if($('.styles ul li').find('a[data-value="list"]').hasClass('active')){
                        //     $('#mainsrp-itemlist .kdb-logo14').parent('div').attr('style', 'margin-left:100px;')
                        // }
                        if ($(itemlist_class).find('.item .ironman-item-info').length > 0) {

                            if ($('.styles ul li:first').find('a').hasClass('active')) {
                                $(itemlist_class).find('.item:not(.item-p4p)').attr('style', 'height:560px !important;'); //网格模式适配魔镜
                            } else {
                                $(itemlist_class).find('.item:not(.item-p4p)').attr('style', 'height:200px !important;'); //列表模式适配魔镜
                            }

                        } else if ($(itemlist_class).find('.qly-ext-append').length > 0) {
                            $(itemlist_class).find('.grid .item.qly-ext-append').attr('style', 'height:600px !important;'); //适配千里眼
                        } else if ($(itemlist_class).find('.cha_keyword_counts_div').length > 0) {
                            $('.response-wider').find('.m-itemlist .grid .items .item').attr('style', 'height:582px !important;') //适配查排名
                        }
                    }
                }

                DAMY.loader.render_itemList_top();
                setTimeout(function() {
                    DAMY.loader.render_tb();
                }, 2000);
            },
            render_p4p_b: function() {
                var ids = [];
                $.when(DAMY.loader.get_p4p_id()).then(function() {
                    if ($('#J_shopkeeper_bottom').length) var p4p_b_itemlist = '#J_shopkeeper_bottom';
                    if ($(p4p_b_itemlist).length <= 0) {
                        //
                    } else { //底部直通车
                        // console.log(1111)

                        var kw = '';
                        if ($('#q').length) kw = $('#q').val();
                        $(p4p_b_itemlist).find('ul>li[class*="-item"]:not(:has(.dzt-ext-info-bar))').each(function() {
                            if (typeof($(this).attr('p4p_id')) != 'undefined') {
                                var id = $(this).attr('p4p_id');
                                if (id) ids.push(id);
                                var nick = $(this).attr('nick');
                                var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                                html.appendTo($(this));
                                $(p4p_b_itemlist).find('tbcc[id^="tbcc-"]').attr('style', 'overflow:visibility;');
                                $('#J_shopkeeper_bottom').find('div[class*="-global"]').attr('style', 'height:586px;');
                                $('#J_shopkeeper_bottom').find('div[class*="-foot"]').attr('style', 'margin-top:122px;');
                            }
                        });
                        var dzt_batch_sales_html = '<span class="dzt-batch-sales-btn login"><span style="position: relative;"><a href="javascript:void(0)" target="_blank" style="color: #fff;">批量查销量</a></span></span>';
                        if(is_append_sale_box && !$(p4p_b_itemlist).is(':has(.dzt-batch-sales-btn)')){
                            $(p4p_b_itemlist).append(dzt_batch_sales_html);
                        }
                        if (ids.length > 0) {
                            DAMY.loader.search_kws(ids, 'tb');

                            // if ($('#J_shopkeeper_bottom').hasClass('dzt_box')) {
                            //     var i = [];
                            //     var f = k();
                            //     i[u](f.e, f.v, f.w, 'ids' + ids.join(','));
                            //     i = s(i[z(r)]()[z(x)]('&'));
                            //     $('#J_shopkeeper_bottom .dzt-online-viewer').find('.view_count').html(view_onload);
                            //     $.ajax({
                            //         url: 'https://ssl.dianzhentan.com/api/4.0/tc_onlines/',
                            //         data: {
                            //             ids: ids.join(','),
                            //             'ver': v,
                            //             't': w,
                            //             'sign': i
                            //         },
                            //         success: function(data) {
                            //
                            //             var tid = data.tid;
                            //             if (tid == 0) {
                            //                 // 服务器维护
                            //                 $('#J_shopkeeper_bottom .dzt-online-viewer').find('.view_count').html('<b style="color: #f35a4a;">维护中</b>').attr('title', '服务器维护中，请稍后再试。');
                            //             } else if (tid == -1) {
                            //                 // 查询次数超额
                            //                 $('#J_shopkeeper_bottom .dzt-online-viewer').find('.view_count').html('<b style="color: #f35a4a;">查询次数已用完</b>').attr('title', '你当天查询次数已经超过限额，请明天再查看，每天限额查询5000次。');
                            //             } else if (tid == -2) {
                            //                 // 没有权限查看的店侦探注册用户
                            //                 $('#J_shopkeeper_bottom .dzt-online-viewer').find('.view_count').html('<b class="dzt_yhj_ts"><a style="color: #f35a4a;" href="https://www.dianzhentan.com/buy/" target="_blank">付费查看</a><div class="dzt_tooltip">此功能只限店侦探付费用户查看</div><span class="dzt-arrow-bottom">&nbsp;</span></b>');
                            //                 $('.dzt_yhj_ts').hoverDelay({
                            //                     hoverEvent: function() {
                            //                         $(this).find('.dzt_tooltip,.dzt-arrow-bottom').attr('style', 'display:block;');
                            //                     },
                            //                     outEvent: function() {
                            //                         $(this).find('.dzt_tooltip,.dzt-arrow-bottom').attr('style', 'display:none;');
                            //                     }
                            //                 });
                            //             } else {
                            //                 // console.log('====='+ids)
                            //                 // setTimeout(function(){
                            //                 DAMY.loader.get_onlines(tid);
                            //                 // }, 300)
                            //             }
                            //         }
                            //     })
                            // }

                        }

                    }
                })
                setTimeout(function() {
                    DAMY.loader.render_p4p_b();
                }, 2000);

            },
            get_p4p_id: function () {
                var p4p_itemlist = '#J_shopkeeper, #J_shopkeeper_bottom';
                var ids_r = [];
                var ids_b = [];
                var nick_r = [];
                var nick_b = [];
                if (typeof window.jsonp_data == 'undefined') {
                    var p4p_item = DAMY.loader.dzt_get_itemInfo();
                    if (p4p_itemlist.length <= 0) {
                        //
                    } else {
                        for (var i = 0, r_len = p4p_item.p4p_r_data.length; i < r_len; i++) {
                            ids_r.push(p4p_item.p4p_r_data[i].RESOURCEID);
                            nick_r.push(p4p_item.p4p_r_data[i].WANGWANGID);
                        }
                        DAMY.loader.set_p4p_id($('#J_shopkeeper').find('tbcc ul>li[class*="-item"]'), ids_r, nick_r);
                        if (typeof(p4p_item.p4p_b_data) != 'undefined') {
                            for (var i = 0, b_len = p4p_item.p4p_b_data.length; i < b_len; i++) {
                                ids_b.push(p4p_item.p4p_b_data[i].RESOURCEID);
                                nick_b.push(p4p_item.p4p_b_data[i].WANGWANGID);
                            }
                            DAMY.loader.set_p4p_id($('#J_shopkeeper_bottom').find('ul>li[class*="-item"]'), ids_b, nick_b);
                        }

                    }

                } else {
                    // console.log('拦截jsonp');
                    if (p4p_itemlist.length <= 0) {
                        //
                    } else {
                        // console.log(JSON.parse(window.jsonp_data.p4p.data.p4pdata))
                        var p4p_r_jsonp = JSON.parse(window.jsonp_data.p4p.data.p4pdata).right.data.ds1;
                        for (var i = 0, r_len = p4p_r_jsonp.length; i < r_len; i++) {
                            ids_r.push(p4p_r_jsonp[i].RESOURCEID);
                            nick_r.push(p4p_r_jsonp[i].WANGWANGID);
                        }
                        DAMY.loader.set_p4p_id($('#J_shopkeeper').find('tbcc ul>li[class*="-item"]'), ids_r, nick_r);

                        if (typeof(JSON.parse(window.jsonp_data.p4p.data.p4pdata).bottom) != 'undefined') {
                            var p4p_b_jsonp = JSON.parse(window.jsonp_data.p4p.data.p4pdata).bottom.data.ds1;
                            for (var i = 0, b_len = p4p_b_jsonp.length; i < b_len; i++) {
                                ids_b.push(p4p_b_jsonp[i].RESOURCEID);
                                nick_b.push(p4p_b_jsonp[i].WANGWANGID);
                            }

                            DAMY.loader.set_p4p_id($('#J_shopkeeper_bottom').find('ul>li[class*="-item"]'), ids_b, nick_b);
                        }

                    }

                }

            },
            set_p4p_id: function (item, ids, nicks) {
                $.each(item, function (i, item) {
                    $(this).attr('p4p_id', ids[i]);
                    $(this).attr('nick', nicks[i]);
                })
            },
            render_table_data: function (obj, name, count, deals_cnt, type) {
                var i = $('<table class="dzt-table-box"></table>');
                if (type == '1') {
                    var s = '<td class="table-title">地域分布</td>';
                    var d = '<td class="table-title">卖家数量(个)</td>';
                } else if (type == '2') {
                    var s = '<td class="table-title">下架时间段</td>';
                    var d = '<td class="table-title">宝贝数量(个)</td>';
                } else if (type == '3') {
                    var s = '<td class="table-title">价格区间</td>';
                    var d = '<td class="table-title">宝贝数量(个)</td>';
                }
                var o = '<td class="table-title">付款人数(人)</td>';
                name.forEach(function (t) {
                    s = s + '<td style="border: 1px solid #ddd;">' + t + "</td>"
                })
                i.append("<tr>" + s + "</tr>");

                count.forEach(function (t) {
                    d = d + '<td style="border: 1px solid #ddd;">' + t + "</td>"
                })
                i.append("<tr>" + d + "</tr>");

                deals_cnt.forEach(function (t) {
                    o = o + '<td style="border: 1px solid #ddd;">' + t + "</td>"
                })
                i.append("<tr>" + o + "</tr>");
                if (!obj.find('.dzt-table-box').length) obj.append(i);
            },
            render_area_views: function (obj) {
                var chart_box = $(obj).find(".area_container").find(".chart");
                $(obj).find(".area_container").show();
                setTimeout(function () {
                    $(obj).find(".area_container").addClass("area_container_show")
                }, 15);
                // if (chart_box.attr("loaded") == "false") {
                var chart = echarts.init(chart_box.get(0));
                chart.showLoading(loading_opt);
                var locations = [];
                var deals_cnt = []
                var locations_info = [];
                if ($('#spudetail-itemlist').length) {
                    $('#spudetail-itemlist').find('.item:not(:has(.icon-service-remai))').each(function () {
                        if ($(this).attr('location') && $(this).attr('location') != '')
                            var loc = $(this).attr('location');
                        if (loc) locations.push(loc);
                    })
                } else {
                    $('#mainsrp-itemlist').find('.item:not(:has(.icon-service-remai))').each(function () {
                        var loc = $(this).find('.location').text();
                        var deal_cnt = $(this).find('.deal-cnt').text().match(/\d+/);
                        if (deal_cnt) {
                            deal_cnt = deal_cnt[0];
                            if (loc) locations.push(loc);
                            locations_info.push([loc, parseInt(deal_cnt)]);
                        }
                    })
                }
                var location = DAMY.loader.dzt_arr_statistics(locations_info);
                setOptionS.title.text = '本页面宝贝卖家所在地分布和付款人数(不包括直通车宝贝)';
                setOptionS.legend.data[0] = '卖家数量';
                setOptionS.legend.data[1] = '付款人数';
                setOptionS.xAxis[0].data = location.name;
                setOptionS.series[0].data = location.count;
                setOptionS.series[1].data = location.deals_cnt;
                setOptionS.yAxis[0].data = location.count;
                // setOptionS.xAxis[0].name = "卖家所在地";
                setOptionS.series[0].name = "卖家数量";
                setOptionS.yAxis[1].name = "付款人数(人)";
                setOptionS.yAxis[0].name = "卖家数量(个)";
                setOptionS.tooltip.formatter = function (params, ticket, callback) {
                    var res = '卖家所在地：' + '<span style="color:#4184f3;">' + params[0].name + '</span>';
                    res += '<br/>卖家数量：<span style="color:#029719;">' + params[0].value + ' 个</span>';
                    res += '<br/>付款人数：<span style="color:#f35a4a;">' + params[1].value + ' 人</span>';
                    return res;
                }

                chart.hideLoading();
                chart.setOption(setOptionS);

                if ($('#dzt_area_views').hasClass('dzt_pin')) {
                    $('#dzt_area_views .area_container').find('.dzt-table-box').remove();
                    DAMY.loader.render_table_data($('#dzt_area_views .area_container'), location.name, location.count, location.deals_cnt, '1');
                }

            },
            render_endtime_views: function (obj) {
                var chart_box = $(obj).find(".area_container").find(".chart");
                $(obj).find(".area_container").show();
                setTimeout(function () {
                    $(obj).find(".area_container").addClass("area_container_show")
                }, 15);
                // if (chart_box.attr("loaded") == "false") {
                var chart = echarts.init(chart_box.get(0));
                chart.showLoading(loading_opt);
                var endtimes = [];
                var endtimes_info = [];
                if ($('#mainsrp-itemlist,#spudetail-itemlist').length) {
                    $('#mainsrp-itemlist,#spudetail-itemlist').find('.item:not(:has(.icon-service-remai)) .dzt-ext-info-bar').each(function () {
                        var et = $(this).find('.dzt-mr5').attr('et');
                        var deal_cnt = $(this).parent('.item').find('.J_IconMoreNew .deal-cnt').text();
                        if (deal_cnt == '') deal_cnt = '0';
                        var deal_cnt = deal_cnt.match(/\d+/)[0];
                        if (et) endtimes.push(et);
                        endtimes_info.push([et, parseInt(deal_cnt)]);
                    })
                }
                setTimeout(function () { //页面一打开马上看下架图有可能最后12个宝贝尚未加载数据未计算入内，问题暂未完全解决
                    if (endtimes.length > 0) {

                        function format_number(number_arr) {
                            var numbers = [];
                            for (var i in number_arr) {
                                if (parseInt(number_arr[i]) == 0) {
                                    number_arr[i] = '0 ~ 01';
                                } else if (parseInt(number_arr[i]) > 0 && parseInt(number_arr[i]) < 9) {
                                    number_arr[i] = number_arr[i] + ' ~ 0' + (parseInt(number_arr[i]) + 1);
                                } else if (parseInt(number_arr[i]) == 9) {
                                    number_arr[i] = number_arr[i] + ' ~ ' + (parseInt(number_arr[i]) + 1);
                                } else if (parseInt(number_arr[i]) >= 10 && parseInt(number_arr[i]) <= 23) {
                                    number_arr[i] = number_arr[i] + ' ~ ' + (parseInt(number_arr[i]) + 1);
                                }
                                numbers.push(number_arr[i]);
                            }
                            return numbers;
                        }

                        var chart = echarts.init(chart_box.get(0));
                        var endtime = DAMY.loader.dzt_arr_statistics(endtimes_info);
                        setOptionS.title.text = '本页面宝贝下架时间段分布和付款人数(不包括直通车宝贝)';
                        setOptionS.legend.data[0] = '宝贝数量';
                        setOptionS.legend.data[1] = '付款人数';
                        setOptionS.xAxis[0].data = format_number(endtime.name);
                        setOptionS.series[0].data = endtime.count;
                        setOptionS.series[1].data = endtime.deals_cnt;
                        setOptionS.yAxis[0].data = endtime.count;
                        // setOptionS.xAxis[0].name = "下架时间/小时";
                        setOptionS.series[0].name = "宝贝数量";
                        setOptionS.yAxis[0].name = "宝贝数量(个)";
                        setOptionS.yAxis[1].name = "付款人数(人)";
                        setOptionS.tooltip.formatter = function (params, ticket, callback) {
                            var res = '下架时间：' + '<span style="color:#4184f3;">' + params[0].name + ' 时</span>';
                            res += '<br/>宝贝数量：<span style="color:#029719;">' + params[0].value + ' 个</span>';
                            res += '<br/>付款人数：<span style="color:#f35a4a;">' + params[1].value + ' 人</span>';
                            return res;
                        }

                        chart.hideLoading();
                        chart.setOption(setOptionS);

                        if ($('#dzt_endtime_views').hasClass('dzt_pin')) {
                            $('#dzt_endtime_views .area_container').find('.dzt-table-box').remove();
                            DAMY.loader.render_table_data($('#dzt_endtime_views .area_container'), endtime.name, endtime.count, endtime.deals_cnt, '2');
                        }
                        // chart_box.attr("loaded", "true");

                    } else {
                        var chart = echarts.init(chart_box.get(0));
                        chart.hideLoading();
                        $(obj).find(".area_container .chart>div:eq(0):not(:has(.endtime_500))").append('<div class="endtime_500">维护中，请稍后查看！</div>');

                    }
                }, 500)
                // }
            },

            render_price_views: function (obj) {
                var chart_box = $(obj).find(".area_container").find(".chart");
                $(obj).find(".area_container").show();
                setTimeout(function () {
                    $(obj).find(".area_container").addClass("area_container_show")
                }, 15);
                var chart = echarts.init(chart_box.get(0));
                var saleprice = [];
                var saleprice_info = [];
                if ($('#spudetail-itemlist').length) {
                    $('#spudetail-itemlist').find('.item:not(:has(.icon-service-remai))').each(function () {
                        if ($(this).attr('price') && $(this).attr('price') !== "") {
                            saleprice.push(parseFloat($(this).attr('price')));
                        }
                    })
                } else {
                    $('#mainsrp-itemlist').find('.item:not(:has(.icon-service-remai))').each(function () {
                        if ($(this).find('.price strong').text() !== "") {
                            var deal_cnt = $(this).find('.deal-cnt').text().match(/\d+/);
                            if (deal_cnt) {
                                deal_cnt = deal_cnt[0];
                                saleprice.push($(this).find('.price strong').text());
                                if (deal_cnt) saleprice_info.push([$(this).find('.price strong').text(), parseInt(deal_cnt)]);
                            }
                        }

                    })

                }
                var max_sp = Math.max.apply(Math, saleprice);
                var min_sp = Math.min.apply(Math, saleprice);
                var mean = Math.ceil(max_sp / 10);
                var price_arr = [];
                var price_ret = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var areaInfo = '';
                for (var i = 0, ret_len = price_ret.length; i < ret_len; i++) {
                    if (i == 0) {
                        areaInfo = '0 ~' + (i + 1) * mean;
                    } else {
                        areaInfo = (i * mean) + '~' + (i + 1) * mean;
                    }
                    price_arr.push(areaInfo);
                }
                var sales_ret = [];
                for (var i = 0, pr_len = price_arr.length; i < pr_len; i++) {
                    var arrayRegion = price_arr[i].split("~");
                    var deals_cnt = [];
                    for (var j = 0, sp_len = saleprice_info.length; j < sp_len; j++) {
                        var startNum = Number(arrayRegion[0]);
                        var endNum = Number(arrayRegion[1]);
                        if (saleprice_info[j][0] > startNum && saleprice_info[j][0] <= endNum) {
                            price_ret[i] += 1;
                            deals_cnt.push(saleprice_info[j][1]);
                        }
                    }
                    deals_cnt = DAMY.loader.get_arr_sum(deals_cnt);
                    sales_ret.push([price_arr[i], price_ret[i], deals_cnt]);
                }
                var name = [];
                var count = [];
                var deals_cnt = [];
                for (var i = 0; i < sales_ret.length; i++) {
                    name.push(sales_ret[i][0]);
                    count.push(sales_ret[i][1]);
                    deals_cnt.push(sales_ret[i][2]);
                }
                // console.log(price_arr);
                setOptionS.title.text = '本页面宝贝价格区间分布和付款人数(不包括直通车宝贝)';
                setOptionS.legend.data[0] = '宝贝数量';
                setOptionS.legend.data[1] = '付款人数';
                setOptionS.xAxis[0].data = name;
                setOptionS.series[0].data = count;
                setOptionS.series[1].data = deals_cnt;
                setOptionS.yAxis[0].data = name;
                // setOptionS.xAxis[0].name = "价格区间 / 元";
                setOptionS.series[0].name = "宝贝数量";
                setOptionS.yAxis[0].name = "宝贝数量(个)";
                setOptionS.yAxis[1].name = "付款人数(人)";
                setOptionS.tooltip.formatter = function (params, ticket, callback) {
                    var res = '价格区间：' + '<span style="color:#4184f3;">' + params[0].name + ' 元</span>';
                    res += '<br/>宝贝数量：<span style="color:#029719;">' + params[0].value + ' 个</span>';
                    res += '<br/>付款人数：<span style="color:#f35a4a;">' + params[1].value + ' 人</span>';
                    return res;
                }
                chart.setOption(setOptionS);

                if ($('#dzt_price_views').hasClass('dzt_pin')) {
                    $('#dzt_price_views .area_container').find('.dzt-table-box').remove();
                    DAMY.loader.render_table_data($('#dzt_price_views .area_container'), name, count, deals_cnt, '3');
                }

            },
            dzt_get_itemInfo: function () {
                var content;
                var content_reg, ret;
                content = document.getElementsByTagName('html')[0].innerHTML;
                content_reg = /g_page_config = (.*);/g;
                content_reg.exec(content);
                ret = RegExp.$1;
                ret = JSON.parse(ret);
                // console.log(ret)
                var itemlist = ret.mods.itemlist.data.auctions;
                // console.log(ret.mods.p4p.data);
                var p4p_data = ret.mods.p4p.data.p4pdata;
                var p4p_r_data = JSON.parse(p4p_data).right.data.ds1;
                if (typeof(JSON.parse(p4p_data).bottom) != 'undefined') var p4p_b_data = JSON.parse(p4p_data).bottom.data.ds1;
                return {
                    itemlist: itemlist,
                    p4p_r_data: p4p_r_data,
                    p4p_b_data: p4p_b_data
                }
            },
            get_arr_sum: function (arr) {
                var s = 0;
                for (var i = arr.length - 1; i >= 0; i--) {
                    s += arr[i];
                }
                return s;
            },
            dzt_arr_statistics: function (arr) {
                arr.sort();
                var res = [];
                for (var i = 0; i < arr.length;) {
                    var count = 0;
                    var deals_cnt = []
                    for (var j = i; j < arr.length; j++) {
                        if (arr[i][0] == arr[j][0]) {
                            count++;
                            deals_cnt.push(arr[j][1]);
                        }
                    }
                    deals_cnt = DAMY.loader.get_arr_sum(deals_cnt);
                    res.push([arr[i][0], count, deals_cnt]);
                    i += count;
                }
                var name = [];
                var count = [];
                var deals_cnt = [];
                for (var i = 0; i < res.length; i++) {
                    name.push(res[i][0]);
                    count.push(res[i][1]);
                    deals_cnt.push(res[i][2]);
                }
                return json = {
                    name: name,
                    count: count,
                    deals_cnt: deals_cnt
                }
            },
            itemList_ck_rank: function (obj) { //淘宝列表页区域图、下架图、价格图、找宝贝
                obj.find('#dzt_area_views').hoverDelay({
                    hoverEvent: function () {
                        $(this).addClass('dzt_pin');
                        DAMY.loader.render_area_views(this);
                    },
                    outEvent: function () {
                        var view = $(this);
                        view.removeClass('area_container_show');
                        setTimeout(function () {
                            view.removeClass('dzt_pin');
                        }, 200);
                    }
                });
                obj.find('#dzt_endtime_views').hoverDelay({
                    hoverEvent: function () {
                        $(this).addClass('dzt_pin');
                        DAMY.loader.render_endtime_views(this);
                    },
                    outEvent: function () {
                        var view = $(this);
                        view.removeClass('area_container_show');
                        setTimeout(function () {
                            view.removeClass('dzt_pin');
                        }, 200);
                    }
                });
                obj.find('#dzt_price_views').hoverDelay({
                    hoverEvent: function () {
                        $(this).addClass('dzt_pin');
                        DAMY.loader.render_price_views(this);
                    },
                    outEvent: function () {
                        var view = $(this);
                        view.removeClass('area_container_show');
                        setTimeout(function () {
                            view.removeClass('dzt_pin');
                        }, 200);
                    }
                });
                obj.find('.dzt_tool_ck_rank').hoverDelay({
                    hoverEvent: function () {
                        DAMY.loader.ck_rank_on(this);
                        $('.dzt_tool_ck_rank').find('.dzt_zwf').css('display', 'block');
                    },
                    outEvent: function () {
                        if (!$(this).is(".dzt_pin")) {
                            DAMY.loader.ck_rank_out(this);
                            $('.dzt_tool_ck_rank').find('.dzt_zwf').css('display', 'none');
                        }
                    }
                });

                obj.find('.dzt_tool_ck_rank').click(function (e) {
                    var trigger = (e.target == $('.dzt_tool_ck_rank>a').get(0));
                    ($(this).is(".dzt_pin") && trigger) ? DAMY.loader.ck_rank_out(this) : DAMY.loader.ck_rank_on(this);
                    if (trigger) $(this).toggleClass('dzt_pin');
                });

                obj.find('.dzt_input_clear').click(function () { //清空输入框
                    $('#dzt_search_ck_rank_kw').val('');
                    $('#dzt_search_ck_rank_ret').html('初始化完毕，可以开始搜索宝贝。');
                })
                obj.find('#dzt_search_tool_start_ck_rank').click(function () {

                    var kw = $.trim($('#dzt_search_ck_rank_kw').val());
                    var itemList_ck_reg = /item\.htm\?.*id=(\d+)/i;
                    var kw_val = itemList_ck_reg.test(kw);
                    if (kw == '') {
                        $('#dzt_search_ck_rank_ret').html('请输入宝贝链接！');
                        return;
                    } else if (!kw_val) {
                        $('#dzt_search_ck_rank_ret').html('对不起，您输入的宝贝链接格式不正确！');
                        return;
                    }
                    $(this).removeClass('dzt_btn_danger').attr('disabled', 'disabled').text('搜索中...');
                    var selType = $('#dzt_search_ck_type').val(); //  搜索类型
                    if (selType) {
                        var pid = $('#dzt_search_ck_rank_kw').val().match(/id=\d+/);
                        if (pid) {
                            pid = (pid + '').replace('id=', '').replace('&', ''); //宝贝id
                        }
                        var hrefKey = window.location.href.match(/q=.+/);
                        if (hrefKey) {
                            hrefKey = decodeURI((hrefKey + '').replace('q=', '').split('&')[0]); //页面搜索关键词
                        }
                        if (pid && hrefKey && selType) {
                            DAMY.loader.ck_rank(hrefKey, selType, pid, 0, !1);
                        }
                    }

                });
            },

            render_itemList_top: function () {
                search_top_html = $(search_top_html);
                if ($('#main').length) { //淘宝列表页
                    var url = window.location.href;
                    $('#main').find('.grid-total:first:not(:has(.search-top-tool-box))').prepend(search_top_html);
                    if (!(/q=.+/.test(url))) {
                        search_top_html.find('.dzt_tool_ck_rank').remove(); //类目搜索页面取消找宝贝功能
                    }
                    if ($('#spulist-grid').length || $('#imgsearch-header').length) {
                        search_top_html.remove(); //产品搜索页面&&淘宝图片搜索页面取消顶部统计条
                    }
                    var dzt_price_len = $('.price').find('strong').length;
                    var price_arr = [];
                    $('.price').find('strong').each(function () {
                        price_arr.push(Math.floor($(this).text()));
                    });
                    var price_count = DAMY.loader.item_count(price_arr);
                    var dzt_price_max = price_count.max;
                    var dzt_price_min = price_count.min;
                    var dzt_price_sum = price_count.sum;
                    if (dzt_price_len == 1) {
                        var dzt_price_text = $('.price').find('strong').text();
                        dzt_price_sum = dzt_price_max = dzt_price_min = dzt_price_text;
                    }
                    var dzt_price_average = (dzt_price_sum / dzt_price_len).toFixed(2);
                    //今日发现
                    var dzt_sales_text = $('.deal-cnt').text();
                    var dzt_sales_reg = /今日/;
                    var dzt_deal_cnt = dzt_sales_reg.test(dzt_sales_text);
                    if (dzt_deal_cnt || $('.deal-cnt').text() == '') { //今日发现页面中可能会出现没销量数据
                        var dzt_cnt = true;
                    } else {
                        var dzt_cnt = false;
                    }
                    DAMY.loader.itemList_price_html(dzt_price_average, dzt_price_max, dzt_price_min, dzt_price_len, dzt_cnt);

                    var sales_arr = [];
                    var dzt_sales_len = $('.deal-cnt').length;

                    $('.deal-cnt').each(function () {
                        var dzt_sales_text = $(this).text();
                        dzt_sales = dzt_sales_text.match(/\d+/g);
                        sales_arr.push(Math.floor(dzt_sales));
                    })
                    var sales_count = DAMY.loader.item_count(sales_arr);
                    var dzt_sales_max = sales_count.max;
                    var dzt_sales_min = sales_count.min;
                    var dzt_sales_sum = sales_count.sum;
                    var dzt_sales_average = Math.round(dzt_sales_sum / dzt_sales_len);
                    DAMY.loader.itemList_sales_html(dzt_sales_average, dzt_sales_max, dzt_sales_min, dzt_price_len, 'tb', dzt_cnt);

                } else if ($('#J_ItemList').length) { //天猫列表页

                    if (!$('a.fType-w').hasClass('fType-cur')) {

                        $('.main:not(:has(.search-top-tool-box))').find('#J_ItemList').before(search_top_html);

                        if ($('#J_CrumbSlideCon').find('li:eq(0)').find('a.crumbStrong').text() == '逛。发现') {
                            $('.search-top-tool-box').remove();
                        }
                    }
                    search_top_html.find('#dzt_area_views,#dzt_endtime_views,#dzt_price_views,.dzt_tool_ck_rank').remove();
                    if ($('em.proSell-price').length) {
                        var dzt_price_len = $('em.proSell-price').length;
                        var price_arr = [];
                        $('em.proSell-price').each(function () {
                            var dzt_prosell_val = $(this).text().split('¥')[1];
                            price_arr.push(Math.floor(dzt_prosell_val));
                        })
                    } else {
                        var dzt_price_len = $('p.productPrice').find('em').length;
                        var price_arr = [];
                        $('p.productPrice').find('em').each(function () {
                            price_arr.push(Math.floor($(this).attr('title')));
                        })

                    }
                    var price_count = DAMY.loader.item_count(price_arr);
                    var dzt_price_max = price_count.max;
                    var dzt_price_min = price_count.min;
                    var dzt_price_sum = price_count.sum;
                    var dzt_price_average = (dzt_price_sum / dzt_price_len).toFixed(2);
                    DAMY.loader.itemList_price_html(dzt_price_average, dzt_price_max, dzt_price_min);

                    var dzt_sales_len = $('p.productStatus').find('em').length;
                    var sales_arr = [];
                    $('p.productStatus').find('em').each(function () {
                        var dzt_sales_text = $(this).text();
                        var dzt_sales_reg = /万笔/;
                        var t = dzt_sales_reg.test(dzt_sales_text);
                        if (t) {
                            var sales = dzt_sales_text.split('万')[0];
                            var dzt_sales = sales * 10000;
                        } else {
                            var dzt_sales_reg = /\d+/g;
                            var dzt_sales = dzt_sales_text.match(dzt_sales_reg);
                        }
                        sales_arr.push(Math.floor(dzt_sales));
                    })
                    var sales_count = DAMY.loader.item_count(sales_arr);
                    var dzt_sales_max = sales_count.max;
                    var dzt_sales_min = sales_count.min;
                    var dzt_sales_sum = sales_count.sum;
                    var dzt_sales_average = Math.round((dzt_sales_sum / dzt_sales_len));
                    if (dzt_sales_max >= 10000) dzt_sales_max = (dzt_sales_max / 10000) + '万';
                    if (dzt_sales_min >= 10000) dzt_sales_min = (dzt_sales_min / 10000) + '万';
                    if (dzt_sales_average >= 10000) dzt_sales_average = (dzt_sales_average / 10000) + '万';
                    DAMY.loader.itemList_sales_html(dzt_sales_average, dzt_sales_max, dzt_sales_min);

                }

            },

            item_count: function (arr) {
                var max = Math.max.apply(Math, arr);
                var min = Math.min.apply(Math, arr);
                var sum = 0;
                for (var i in arr) {
                    sum += arr[i]
                }
                return {
                    'max': max,
                    'min': min,
                    'sum': sum
                }
            },

            itemList_price_html: function (average, max, min, len, cnt) {
                if (cnt) $('.search-top-tool-box').find('.dzt_price_title').html('今日价格<span class="dzt-arrow-r">&nbsp;</span>');
                if (len == 0) {
                    $(search_top_html).find('.dzt_val_a').html('0').attr('title', '');
                } else {
                    $('#dzt_price_average a').html(average + '元').attr('title', '平均价格' + average + '元');
                    $('#dzt_price_max a').html(max + '元').attr('title', '最高价格' + max + '元');
                    $('#dzt_price_min a').html(min + '元').attr('title', '最低价格' + min + '元');
                }

            },
            itemList_sales_html: function (average, max, min, len, type, cnt) {

                if (cnt) $('.search-top-tool-box').find('.dzt_sales_title').html('今日销量<span class="dzt-arrow-r">&nbsp;</span>');
                if (len == 0) {
                    $(search_top_html).find('.dzt_val_a').html('0').attr('title', '');
                } else {
                    if (type) {
                        $('#dzt_sales_average a').html(average + '人').attr('title', '平均销量' + average + '人');
                        $('#dzt_sales_max a').html(max + '人').attr('title', '最高销量' + max + '人');
                        $('#dzt_sales_min a').html(min + '人').attr('title', '最低销量' + min + '人');
                    } else {
                        $('#dzt_sales_average a').html(average + '笔').attr('title', '平均销量' + average + '笔');
                        $('#dzt_sales_max a').html(max + '笔').attr('title', '最高销量' + max + '笔');
                        $('#dzt_sales_min a').html(min + '笔').attr('title', '最低销量' + min + '笔');
                    }
                }

            },
            render_world_search: function () {
                var itemlist_class = '#list-itemList .items';
                if ($(itemlist_class).length <= 0) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    if ($('#q').length) kw = $('#q').val();
                    $(itemlist_class).find('.item:not(:has(.dzt-ext-info-bar))').each(function () {
                        var id = $(this).attr('data-itemid');
                        if (typeof id == 'undefined') {
                            var reg = /item\.htm\?id=(\d+)&/i;
                            $(this).find('a').each(function () {
                                var url = $(this).attr('href');
                                if (typeof id == 'undefined' && reg.test(url)) {
                                    var ret = reg.exec(url);
                                    id = ret[1];
                                }
                            });
                        }
                        if (id) ids.push(id);
                        var nick = $(this).find('.nick.J_NickPopup').html();
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.insertAfter($(this).children('div:last'));

                    });
                    //console.log(ids)
                    if (ids.length > 0) {
                        DAMY.loader.search_kws(ids, 'tb');
                    }
                }

                setTimeout(function () {
                    DAMY.loader.render_world_search();
                }, 2000);
            },
            render_same: function () {
                var itemlist_class = '.m-recitem,.container';
                if ($(itemlist_class).length <= 0 || $(itemlist_class).attr('dzt-load')) {
                    //
                } else {
                    var ids = new Array();
                    var kw = '';
                    $(itemlist_class).attr('dzt-load', 'dzt');
                    $(itemlist_class).find('.recitem,.item').each(function () {
                        // 先获取宝贝ID
                        var id = $(this).find('a').eq(0).attr('href').match(/id=\d+/)[0].match(/\d+/)[0];
                        ids.push(id);
                        var nick = $(this).find('.info1__shop,.info__shop').find('span:first').attr('data-nick');
                        var html = DAMY.loader.render_search(id, kw, nick, 'tb');
                        html.insertAfter($(this).children('div:last'));
                    });
                    if (is_append_sale_box) DAMY.loader.append_sale_box(itemlist_class);
                    this.search_kws(ids, 'tb');
                }
                setTimeout(function () {
                    DAMY.loader.render_same();
                }, 1000);
            },
            seach_item_id: function (obj) {
                var id = '';
                var reg = /item\.htm\?.*id=(\d+)/i;
                $(obj).find('a').each(function () {
                    var url = $(this).attr('href');
                    if (reg.test(url)) {
                        var ret = reg.exec(url);
                        id = ret[1];
                        return false;
                    }
                });
                return id;
            },
            delist_remaintime: function (ts, now_ts) {
                // 根据下架时间的时间戳返回剩余时间
                if (ts < now_ts) {
                    ts = ts + 7 * 86400;
                }
                var re_ts = parseInt(ts - now_ts);
                var day = parseInt(re_ts / 86400);
                var hour = parseInt(re_ts / 3600);
                var minute = parseInt(re_ts / 60);
                var d = day;
                var h = hour - day * 24;
                var m = minute - hour * 60;
                if (d > 7) {
                    d = d - 7;
                }
                if (!d && !h && m <= 1) {
                    return '少于1分钟';
                }
                if (!d && !h && m && m <= 3) {
                    return '少于3分钟';
                }
                if (!d && !h) {
                    return m + '分';
                }
                if (!d) {
                    return h + '时' + m + '分';
                }
                return d + '天' + h + '时' + m + '分';
            },
            delayload_time: function (tid) {
                var count = 1;
                function render_delayload_time() {
                    var i = [];
                    var e = k();
                    i[u](e.e, e.v, e.w, 'tid' + tid);
                    i = s(i[z(r)]()[z(x)]('&'));
                    $.get(dzt_url + '/api/4.0/times/', {
                        'ver': v,
                        't': w,
                        'tid': tid,
                        'sign': i,
                        'kdb': 'dzt'
                    }, function (data) {
                        if (data) {
                            for (var i in data) {
                                // console.log((data[i]).t);
                                if (i != 'r' && i != 'ct') {
                                    var tmp = $('.dzt_time_' + i).find('.dzt-mr5 b');
                                    if (data[i].t != -100) {
                                        if (data[i].t == -99) {
                                            tmp.html('维护中,稍后使用');
                                        } else {
                                            if (data[i].t != '-') {
                                                var unixTimestamp = new Date(data[i].t * 1e3);
                                                var del_time = unixTimestamp.format('MM-dd HH:mm EEE');
                                                var remain_time = DAMY.loader.delist_remaintime(data[i].t, data.ct);
                                                if (window.location.href.indexOf('.taobao.com/search.htm') >= 0 || window.location.href.indexOf('.tmall.com/search.htm') >= 0 || window.location.href.indexOf('.taobao.com/category.htm') >= 0 || window.location.href.indexOf('.tmall.com') >= 0 || window.location.href.indexOf('jupage.taobao.com') >= 0) {
                                                    // 天猫页面和天天特价页面、店铺列表页不显示剩余时间
                                                    tmp.html(del_time);
                                                } else {
                                                    tmp.html(del_time + ' [' + remain_time + ']');
                                                }
                                                tmp.parent('.dzt-mr5').attr('et', unixTimestamp.format('HH'));
                                                tmp.attr('title', '下架时间为：' + del_time + '，剩余：' + remain_time);
                                            }
                                        }

                                    } else {
                                        tmp.html('<span style="color:#f35a4a;">获取失败</span>');
                                    }
                                    $('.dzt_time_' + i).show();
                                }
                                if (data.r > 0 && count <= 5) {
                                    count++;
                                    var task_id = tid;
                                    setTimeout(function () {
                                        render_delayload_time(task_id);
                                    }, 1500);
                                }
                            }
                        }
                    });
                }

                render_delayload_time();
            },
            
            search_kws: function (ids, type) {
                if (!ids.length) {
                    return;
                }
                var delayload = false;
                var i = [];
                var l = k();
                i[u](l.e, l.v, l.w, 'ids' + ids.join(','), 'f' + type, 'dztzt');
                i = s(i[z(r)]()[z(x)]('&'));
                
                $.get(dzt_url + '/api/4.0/kws/', {
                    'ver': v,
                    't': w,
                    'ids': ids.join(','),
                    'f': type,
                    'sign': i,
                    'dzt': 'zt'
                }, function (data) {
                    for (var i in data) {
                        if (i == 'tid') {
                            delayload = true;
                            var tid = data[i];
                            setTimeout(function () {
                                DAMY.loader.delayload_time(tid);
                            }, 1500);
                        } else if (i != 'r' && i != 'ct') {
                            var tmp = $('.dzt_time_' + i).find('.dzt-mr5 b');
                            if (data[i].t != -100) {
                                if (data[i].t == -99) {
                                    tmp.html('维护中,稍后使用');
                                } else {
                                    if (data[i].t != '-') {
                                        var unixTimestamp = new Date(data[i].t * 1e3);
                                        var del_time = unixTimestamp.format('MM-dd HH:mm EEE');
                                        var remain_time = DAMY.loader.delist_remaintime(data[i].t, data.ct);
                                        if (window.location.href.indexOf('.taobao.com/search.htm') >= 0 || window.location.href.indexOf('.tmall.com/search.htm') >= 0 || window.location.href.indexOf('.taobao.com/category.htm') >= 0 || window.location.href.indexOf('.tmall.com') >= 0 || window.location.href.indexOf('jupage.taobao.com') >= 0) {
                                            // 天猫页面和天天特价页面、店铺列表页不显示剩余时间
                                            tmp.html(del_time);
                                        } else {
                                            tmp.html(del_time + ' [' + remain_time + ']');
                                        }

                                        tmp.parent('.dzt-mr5').attr('et', unixTimestamp.format('HH'));
                                        tmp.attr('title', '下架时间为：' + del_time + '，剩余：' + remain_time);
                                    }
                                }

                            } else {
                                tmp.html('<span style="color:#f35a4a;">获取失败</span>');
                            }
                            $('.dzt_time_' + i).show();

                        }
                        if (data[i].tb == '-' && data[i].z == '-' && data[i].m == '-' && data[i].zm == '-') {
                            $('.dzt-list-tb-' + i + ',.dzt-list-ztc-' + i + ',.dzt-list-mobile-' + i + ',.dzt-list-ztc-mobile-' + i).html(0);
                        } else {
                            $('.dzt-list-tb-' + i).html(data[i].tb);
                            $('.dzt-list-ztc-' + i).html(data[i].z);
                            $('.dzt-list-mobile-' + i).html(data[i].m);
                            $('.dzt-list-ztc-mobile-' + i).html(data[i].zm);
                        }
                    }

                });

                //实时查销量
                if (http == 'http') {
                    if(ids.length) DAMY.loader.render_sales_list(ids);

                } else {

                    if (typeof bg != 'undefined') {
                        if(ids.length) DAMY.loader.render_sales_list(ids);
                    } else {
                        console.log('error!');
                    }

                }

                //获取类目：
                var right_host = window.location.href;
                if (type == 'tb') {
                    // console.log('tb');
                    if (right_host.indexOf('app=theme') < 0) { //淘宝专题市场页面宝贝数量较多，暂时关闭类目
                        // console.log('tb');
                        if (typeof window.jsonp_data == 'undefined') {
                            var content_reg, ret;
                            content = document.getElementsByTagName('html')[0].innerHTML;
                            content_reg = /g_page_config = (.*);/g;
                            content_reg.exec(content);
                            ret = RegExp.$1;
                            if (ret && isJSON(ret)) {
                                ret = JSON.parse(ret);
                            }
                            // console.log(ret)
                            if (ret && isJSON(ret)) {
                                // console.log('tb111')
                                if (typeof(ret.mods.itemlist) != 'undefined') {
                                    // console.log('#$#')
                                    if (typeof(ret.mods.itemlist.data.collections) != 'undefined') {
                                        var auctions = ret.mods.itemlist.data.collections[0].auctions;
                                    } else {

                                        var auctions = ret.mods.itemlist.data.auctions;

                                        if (typeof(ret.mods.p4p) != 'undefined') {

                                            var p4pdata_ret = ret.mods.p4p.data.p4pdata;
                                            if (p4pdata_ret) {
                                                p4pdata_ret = JSON.parse(p4pdata_ret);
                                                var p4pdata_r_cat = p4pdata_ret.right.data.ds1;
                                                if (typeof(p4pdata_ret.bottom) != 'undefined') var p4pdata_b_cat = p4pdata_ret.bottom.data.ds1;
                                            }
                                        }
                                    }
                                }
                                if ($('.tab-item.first').hasClass('active')) {
                                    $('#i2i-recitem').addClass('dzt_active');
                                }
                                DAMY.loader.get_cat_data(ids, auctions, p4pdata_r_cat, p4pdata_b_cat);
                                // }
                            } else {
                                // console.log('tb222')
                                DAMY.loader.get_cat_data(ids);
                            }
                        } else {
                            if (typeof(window.jsonp_data.itemlist) != 'undefined') {
                                var auctions = window.jsonp_data.itemlist.data.auctions;
                                // console.log(auctions);
                                // console.log(window.jsonp_data.itemlist.data);
                                if (typeof(window.jsonp_data.p4p) != 'undefined') {
                                    var p4pdata_jsonp = window.jsonp_data.p4p.data.p4pdata;
                                    if (p4pdata_jsonp) {
                                        p4pdata_jsonp = JSON.parse(p4pdata_jsonp);
                                        var p4pdata_r_cat = p4pdata_jsonp.right.data.ds1;
                                        if (typeof(p4pdata_jsonp.bottom) != 'undefined') var p4pdata_b_cat = p4pdata_jsonp.bottom.data.ds1;
                                    }

                                }
                                // console.log(p4pdata_r_cat)
                            }

                            DAMY.loader.get_cat_data(ids, auctions, p4pdata_r_cat, p4pdata_b_cat);
                        }
                    }
                } else {

                    DAMY.loader.get_cat_data(ids);

                    if (right_host.indexOf('new=1') != -1) {
                        $('#J_ItemList .product').attr('style', 'height:410px !important;')
                    }
                }


            },
            render_sales_list: function(ids){
                for (var id in ids) {
                    DAMY.loader.render_sales_text(ids[id]);
                }
                if(window.dzt_ver >= 40 || window.ste > 0){
                    $('.dzt-batch-sales-btn.login').click(function () {
                        for (var id in ids) {
                            $('.sales_count_' + ids[id]).parent('.dzt-sales-viewer').find('.dzt-loading-po').removeAttr('style').end().find('.sales_count span').attr('style', 'display:none;');
                        }
                        DAMY.loader.render_sales(ids.join(','));
                    });
                }
            },
            remainTime: function (st, ed) {
                if (ed < st) {
                    ed = ed + 7 * 86400000;
                }
                var ts = ed / 1000 - st / 1000;
                var day = parseInt(ts / 86400);
                var hour = parseInt(ts / 3600);
                var minute = parseInt(ts / 60);
                return day + "天" + (hour - day * 24) + "时" + (minute - hour * 60) + "分";
            },
            get_cat_data: function (ids, auctions, p4pdata_r_cat, p4pdata_b_cat) {
                var cat_data = {};
                var cat_set = new Set();
                if (auctions) {
                    // console.log(auctions);
                    for (i in auctions) {
                        if (auctions[i].nid && auctions[i].category) {
                            // console.log(auctions[i].nid);
                            // console.log(auctions[i].category);
                            cat_data[auctions[i].nid] = parseInt(auctions[i].category);
                            var item_id = auctions[i].nid;
                            var item_cid = parseInt(auctions[i].category);
                            $('.dzt_cat_info_' + item_id).attr('catId', item_cid);
                        }
                        if (auctions[i].category) {
                            cat_set.add(parseInt(auctions[i].category));
                        }
                    }
                }
                if (p4pdata_r_cat) {
                    // console.log(p4pdata_r_cat);
                    for (i in p4pdata_r_cat) {
                        if (p4pdata_r_cat[i].RESOURCEID && p4pdata_r_cat[i].CATID.split(' ').pop()) {
                            cat_data[p4pdata_r_cat[i].RESOURCEID] = parseInt(p4pdata_r_cat[i].CATID.split(' ').pop());
                            var p4p_r_id = p4pdata_r_cat[i].RESOURCEID;
                            var p4p_r_cid = parseInt(p4pdata_r_cat[i].CATID.split(' ').pop());
                            $('.dzt_cat_info_' + p4p_r_id).attr('catId', p4p_r_cid);
                        }
                        if (p4pdata_r_cat[i].CATID.split(' ').pop()) {
                            cat_set.add(parseInt(p4pdata_r_cat[i].CATID.split(' ').pop()));
                        }
                    }
                }
                if (p4pdata_b_cat) {
                    // console.log(p4pdata_b_cat);
                    for (i in p4pdata_b_cat) {
                        if (p4pdata_b_cat[i].RESOURCEID && p4pdata_b_cat[i].CATID.split(' ').pop()) {
                            cat_data[p4pdata_b_cat[i].RESOURCEID] = parseInt(p4pdata_b_cat[i].CATID.split(' ').pop());
                            var p4p_b_id = p4pdata_b_cat[i].RESOURCEID;
                            var p4p_b_cid = parseInt(p4pdata_b_cat[i].CATID.split(' ').pop());
                            $('.dzt_cat_info_' + p4p_b_id).attr('catId', p4p_b_cid);
                        }
                        if (p4pdata_b_cat[i].CATID.split(' ').pop()) {
                            cat_set.add(parseInt(p4pdata_b_cat[i].CATID.split(' ').pop()));
                        }
                    }
                }
                setTimeout(function () {
                    DAMY.loader.init_cat(ids);
                }, 500)

            },
            init_cat: function (ids) {
                // console.log(ids)
                var ids_json = {};
                if (ids.length > 0) {
                    for (i in ids) {
                        ids_json[ids[i]] = parseInt($('.dzt_cat_info_' + ids[i]).attr('catId'));
                    }
                    var ids = JSON.stringify(ids_json);
                    var i = [];
                    var l = k();
                    i[u](l.e, l.v, l.w, 'ids' + ids);
                    i = s(i[z(r)]()[z(x)]('&'));
                    $.get(dzt_url + '/api/4.0/tc_itemscat/', {
                        'ver': v,
                        't': w,
                        'ids': ids,
                        'sign': i
                    }, function (data) {
                        var cat_list = data.l;
                        for (i in data) {
                            if (i == 'tid') {
                                var tid = data[i];
                                setTimeout(function () {
                                    DAMY.loader.render_catInfo(tid);
                                }, 1500);
                            }
                            if (i != 'l' && data[i] >= 0) {
                                var full_cat = cat_list[data[i]];
                                try {
                                    var short_cat = full_cat.split('>').pop();
                                } catch (err) {
                                    var short_cat = full_cat;
                                }

                            }
                            DAMY.loader.render_cat(short_cat, full_cat, i);

                        }

                    })

                }
            },
            render_catInfo: function (tid) {
                if (tid != 0) {
                    var i = [];
                    var l = k();
                    i[u](l.e, l.v, l.w, 'tid' + tid);
                    i = s(i[z(r)]()[z(x)]('&'));
                    var count = 1;
                    function get_itemscat(tid) {
                        $.get(dzt_url + '/api/4.0/itemscat/', {
                            'ver': v,
                            't': w,
                            'tid': tid,
                            'sign': i
                        }, function (data) {
                            // console.log(data)
                            var cat_list = data.l;
                            for (i in data) {
                                if (i != 'l' && data[i] >= 0) {
                                    var full_cat = cat_list[data[i]]
                                    try{
                                        var short_cat = full_cat.split('>').pop();
                                    } catch (err) {
                                        var short_cat = full_cat;
                                    }                                    
                                }
                                DAMY.loader.render_cat(short_cat, full_cat, i);
                            }
                            if (data.r > 0 && count <= 10) {
                                // console.log('再次加载');
                                count++;
                                var task_id = tid;
                                // console.log(task_id);
                                setTimeout(function () {
                                    get_itemscat(task_id);
                                }, 1500);
                            }
                        })
                    }

                    get_itemscat(tid);

                } else {
                    var short_cat = '<b>维护中</b>';
                    var full_cat = '服务器维护中，请稍后查看!';
                    DAMY.loader.render_cat(short_cat, full_cat);
                }

            },
            render_cat: function (short_cat, full_cat, i) {
                if (i) {
                    $('.dzt_cat_info_' + i).html(short_cat);
                    $('.dzt-tip-container_' + i).html(full_cat);
                    $('.dzt_cat.dzt_cat_' + i).attr('style', 'display:inline-block;');
                    $('.dzt_cat_' + i).hoverDelay({
                        hoverEvent: function () {
                            $(this).find('.dzt-tip-container').css('display', 'block');
                        },
                        outEvent: function () {
                            $(this).find('.dzt-tip-container').css('display', 'none');
                        }
                    });
                } else {
                    $('.dzt_cat_info').html(short_cat).attr('style', 'color:#404040;');
                    $('.dzt-tip-container').html(full_cat);
                    $('.dzt_cat').attr('style', 'display:inline-block;');
                    $('.dzt_cat').hoverDelay({
                        hoverEvent: function () {
                            $(this).find('.dzt-tip-container').css('display', 'block');
                        },
                        outEvent: function () {
                            $(this).find('.dzt-tip-container').css('display', 'none');
                        }
                    });
                }

                // DAMY.loader.adapt_width();
            },
            // adapt_width: function () {
            //     var host = window.location.href;
            //     if (host.indexOf('.taobao.com') != -1 && host.indexOf('search1.taobao.com') == -1) {
            //         //淘宝页面位置比较宽松
            //         $('.dzt-ext-info-bar').find('span[class^="dzt_cat_info_"]').css('max-width', '220px');
            //         if (host.indexOf('.taobao.com/category-') != -1) {
            //             $('.dzt-ext-info-bar').find('span[class^="dzt_cat_info_"]').css('max-width', '150px');
            //         }
            //     } else if (host.indexOf('suning.tmall.com') != -1) {
            //         //苏宁易购页面位置较小
            //         $('.dzt-ext-info-bar').find('span[class^="dzt_cat_info_"]').css('max-width', '180px');
            //     }

            // },
            render_search: function (id, kw, nick, type, dzt_html) {
                var tmp;
                if (typeof dzt_html == 'undefined') {
                    tmp = search_html;
                } else {
                    tmp = dzt_html;
                }
                tmp = tmp.replace('<!--ztc_search_html-->', ztc_search_html);
                tmp = tmp.replace('<!--mobile_html-->', mobile_kw_html);
                if (type == 'tmall') {
                    // tmp = tmp.replace(/下架:<b class="b">-<\/b><\/span>/g, '下架:<b class="b">-</b></span><br/>');
                    tmp = tmp.replace(/<!--search-type-->/g, '<span>天猫</span>').replace(/<!--search-client-->/g, '<span>天猫</span>');
                } else {
                    // tmp = tmp.replace(/<span class="ext-logo14 online-logo14"><\/span>/g, '');
                    tmp = tmp.replace(/<!--search-type-->/g, '<span>淘宝</span>').replace(/<!--search-client-->/g, '<span>PC</span>');
                }
                tmp = tmp.replace(/-pid-/g, id);
                tmp = tmp.replace(/-dzt-t-/g, type);

                //tmp = tmp.replace(/-dzt-ztc-count-/g, 'ztc_tb');

                tmp = $(tmp);
                tmp.attr('id', 'dzt-ext-info-bar-' + id);
                tmp.find('.dzt-list-tb-val').attr('id', 'dzt-list-tb-' + id).addClass('dzt-list-tb-' + id).attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=' + type);
                tmp.find('.dzt-list-ztc-val').attr('id', 'dzt-list-ztc-' + id).addClass('dzt-list-ztc-' + id).attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=ztc_' + type);
                tmp.find('.dzt-list-mobile-val').attr('id', 'dzt-list-mobile-' + id).addClass('dzt-list-mobile-' + id).attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=mobile');
                tmp.find('.dzt-list-ztc-mobile-val').attr('id', 'dzt-list-ztc-mobile-' + id).addClass('dzt-list-ztc-mobile-' + id).attr('href', 'http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=ztc_mobile');
                if (!kw) {
                    tmp.find('.kdb-search').attr('href', 'https://www.kandianbao.com/?z=sug');
                } else {
                    tmp.find('.kdb-search').attr('href', 'https://so.kandianbao.com/' + kw + '/?z=sug');
                }
                if (!nick) {
                    tmp.find('.kdb-shop').attr('href', 'https://www.kandianbao.com/?z=sug');
                } else {
                    tmp.find('.kdb-shop').attr('href', 'https://dian.kandianbao.com/' + nick + '/?z=sug');
                }
                tmp.find('.kdb-item').attr('href', 'https://item.kandianbao.com/' + id + '/?z=sug');
                tmp.find('.price_link').hoverDelay({
                    hoverEvent: function () {
                        DAMY.loader.price_on(this);
                    },
                    outEvent: function () {
                        if ($(this).is(":not(.dzt_pin)")) DAMY.loader.price_out(this);
                    }
                });

                tmp.find('.dzt-ci-hover').hoverDelay({
                    hoverEvent: function () {
                        var dzt_ci_table = $(this).find('.dzt-ci-table');
                        if (window.dzt_ver >= 40) {
                            dzt_ci_table.addClass('dzt-ci-yes');
                        }
                        dzt_ci_table.css('display', 'block');
                        setTimeout(function () {
                            dzt_ci_table.addClass("dzt-ci-table-show");
                        }, 15);
                        $(this).find('.dzt-ci-nav li.nav-ci-curr a').trigger('click');
                    },
                    outEvent: function () {
                        var dzt_ci_table = $(this).find('.dzt-ci-table');
                        dzt_ci_table.removeClass("dzt-ci-table-show");
                        setTimeout(function () {
                            dzt_ci_table.css('display', 'none');
                        }, 200);
                    }
                });
                tmp.find('.dzt-ci-nav li a').click(function () {
                    $(this).parents('.dzt-ci-nav').find('li.nav-ci-curr').removeClass('nav-ci-curr');
                    $(this).parent().addClass('nav-ci-curr');
                    $(this).parents('.dzt-ci-nav').next('table').find('tbody:not(.dzt_hide)').addClass('dzt_hide');
                    $(this).parents('.dzt-ci-nav').next('table').find('#' + $(this).attr('data-type') + '_' + $(this).attr('data-ts') + '_' + $(this).attr('data-pid')).removeClass('dzt_hide');
                    if ($(this).attr('load') != '1') {
                        DAMY.loader.get_kwlist(this, $(this).attr('data-pid'), $(this).attr('data-type'), $(this).attr('data-ts'));

                    }
                });
                return tmp;
            },

            get_kwlist: function (obj, id, f, d) {
                obj = $(obj);
                var type_des = '';
                obj.attr('load', 1);
                var i = [];
                var q = k();
                i[u](q.e, q.v, q.w, 'id' + id, 'f' + f, 'd' + d);
                i = s(i[z(r)]()[z(x)]('&'));
                $.get(dzt_url + '/api/4.0/kw/', {
                    'ver': v,
                    't': w,
                    'id': id,
                    'f': f,
                    'd': d,
                    'sign': i
                }, function (response) {
                    if (typeof response.status != 'undefined' && response.status == 500) {
                        var html = '<tr><td colspan="3" style="text-align:center;color:red;">维护中，稍后查看！</td></tr>';
                        $('#' + f + '_' + d + '_' + id).empty().append(html);
                        return;
                    }
                    var tmp_f;
                    var list_f;
                    switch (f) {
                        case 'tb':
                            type_des = '淘宝';
                            tmp_f = f;
                            list_f = 'list-tb-' + id;
                            break;
                        case 'ztc_tb':
                            type_des = '淘宝直通车';
                            tmp_f = 'tb-ztc';
                            list_f = 'list-ztc-' + id;
                            break;
                        case 'mobile':
                            type_des = '无线淘宝搜索';
                            tmp_f = 'mobile';
                            list_f = 'list-mobile-' + id;
                            break;
                        case 'ztc_mobile':
                            type_des = '无线淘宝直通车';
                            tmp_f = 'mobile-ztc';
                            list_f = 'list-ztc-mobile-' + id;
                            break;
                        case 'tmall':
                            type_des = '天猫搜索';
                            tmp_f = 'tmall';
                            list_f = 'list-tb-' + id;
                            break;
                        case 'ztc_tmall':
                            type_des = '天猫直通车';
                            tmp_f = 'tmall-ztc';
                            list_f = 'list-ztc-' + id;
                            break;
                    }
                    var html = '';
                    data = JSON.parse(response);
                    if (window.dzt_ver == -1 || window.dzt_ver < 40) {
                        var colspan_num = 4;
                        var colspan_num_b = 1;
                    } else if (window.dzt_ver >= 40) {
                        var colspan_num = 9;
                        var colspan_num_b = 5;
                    }
                    if (!data.length) {
                        html += '<tr class="last_tr dzt_arey"><td colspan="' + colspan_num + '" style="text-align:center;background: #fff;">10页中没有找到展现关键词，</td></tr>' +
                            '<tr class="last_tr dzt_arey"><td colspan="' + colspan_num + '" style="text-align:center;background: #fff;">亲可前往店侦探查看7天内的展现关键词！</td></tr>' +
                            '<tr class="last_tr dzt_arey"><td colspan="' + colspan_num + '" style="text-align:center;background: #fff;"><a href="http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=' + f + '&d=' + d + '" target="_blank">点击进入店侦探</a></td></tr>';
                        html = $(html);
                    } else {
                        $.each(data, function (index, item) {
                            if (typeof(this.r) != 'undefined') {
                                var r = this.r;
                                r = r.split(',');
                                if (r[1].search(/\d+/) != 0) {
                                    // console.log('直通车');
                                    var rank = '第 <b>' + r[0] + '</b> 页 <b>' + r[1] + '</b> 位';
                                } else {
                                    // console.log('非直通车');
                                    var rank = '第 <b>' + r[0] + '</b> 页 第 <b>' + r[1] + '</b> 位';
                                }

                            } else {
                                var rank = this.rank;
                            }
                            if (typeof(this.k) != 'undefined') {
                                var kw = this.k;
                            } else {
                                var kw = this.kw;
                            }

                            var l_ztc_html = '<span class="dzt_l_ztc">左侧直通车</span>';
                            if (window.dzt_ver == -1) {
                                var dzt_html = '<td class="text-center"><span class="relative"><a href="//www.dianzhentan.com/base/" target="_blank" class="dzt-hover-tip">请登录</a><span class="dzt-arrow-bottom">&nbsp;</span></span></td>';
                            } else if (window.dzt_ver < 40) {
                                var dzt_html = '<td class="text-center"><span class="relative"><a href="//www.dianzhentan.com/buy/" target="_blank" title="店侦探企业版及以上可查看，你可以立即升级">升级查看</a></span></td>';
                            } else if (window.dzt_ver >= 40) {
                                if ((this.pv == 0 && this.cl == 0 && this.ctr == 0 && this.cov == 0 && this.cpc == 0 && this.com == 0) || (this.pv == undefined && this.cl == undefined && this.ctr == undefined && this.cov == undefined && this.cpc == undefined && this.com == undefined)) {
                                    var dzt_html = '<td class="text-center">-</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">-</td>';
                                } else {
                                    var dzt_html = '<td class="text-center">' + this.pv + '</td><td class="text-center">' + this.cl + '</td><td class="text-center">' + this.ctr + '%</td><td class="text-center">' + this.cov + '%</td><td class="text-center">￥' + Math.round(this.cpc) / 100 + '</td><td class="text-center">' + this.com + '</td>';
                                }
                            }
                            if (index % 2 != 0) {
                                var dzt_class = '';
                            } else {
                                var dzt_class = 'dzt-ci';
                            }
                            if (this.p4 == 1) {
                                html += '<tr class="' + dzt_class + '"><td>' + kw + l_ztc_html + '</td><td class="text-center">' + rank + '</td><td class="dzt_trend close" kid="' + this.id + '"><span>趋势</span></td>' + dzt_html + '</tr>';
                            } else {
                                html += '<tr class="' + dzt_class + '"><td>' + kw + '</td><td class="text-center">' + rank + '</td><td class="dzt_trend close" kid="' + this.id + '"><span>趋势</span></td>' + dzt_html + '</tr>';
                            }
                        });

                        var tmphtml =
                            '<tr class="dzt_ci_bottom">' +
                            '<td>' +
                            '<a href="http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=' + f + '&d=' + d + '" target="_blank">' +
                            '<span class="dzt_page_number">&lt;&lt;</span>' +
                            '<span class="dzt_page_number active p_one">1</span>' +
                            '<span class="dzt_page_number p_two" href="javascript:void(0)">2</span>' +
                            '<span class="dzt_page_number p_three" href="javascript:void(0)">3</span>' +
                            '<span class="dzt_page_number p_more" href="javascript:void(0)">...</span>' +
                            '<span class="dzt_page_number p_max" href="javascript:void(0)">5</span>' +
                            '<span class="dzt_page_number" href="javascript:void(0)">&gt;&gt;</span>' +
                            '</a>' +
                            '</td>' +
                            '<td colspan="' + colspan_num_b + '"></td>' +
                            '<td colspan="3">' +
                            '<a href="http://ci.dianzhentan.com/item/' + id + '/?z=sug&f=' + f + '&d=' + d + '" target="_blank">' +
                            '<span class="more">查看更多</span>' +
                            '<span class="export">导出excel</span>' +
                            '</a>' +
                            '</td>' +
                            '</tr>' +
                            '<tr class="dzt_ci_date">' +
                            '<td><span style="color:#f35a4a;">' + new Date(d * 1000).format("MM-dd") + '</span></td>' +
                            '</tr>';


                        html += tmphtml;
                        //判断详情页还是列表页
                        if ($('#dzt-' + tmp_f + '-count').length) {
                            var oNum = $('#dzt-' + tmp_f + '-count').text();
                        } else {
                            var oNum = $('#dzt-' + list_f).text();
                        }

                        html = '<tbody>' + html + '</tbody>';
                        html = DAMY.loader.pageNumber($(html), parseInt(oNum));
                        html = $(html);

                        html.find('.dzt_trend').click(function () { //点击趋势按钮执行

                            DAMY.loader.toggle_trend(this);

                        })

                    }
                    $('.dzt-ci-tbody[id=' + f + '_' + d + '_' + id + ']').empty().append(html);
                });

            },

            trend_chart_build: function (self) {
                _this = $(self);
                var chart_box = _this.parent().next().find('.trend_chart_container');
                var chart = echarts.init(chart_box.get(0));

                if (chart_box.attr('loader') == 'loading') {
                    chart.showLoading(loading_opt);
                }
                var kid = _this.attr('kid');
                var f = _this.parents('.dzt-ci-hover').attr('data-t');
                if ($('.dzt-detail-top-bar').length) {
                    var pid = _this.parents('.dzt-detail-top-bar').attr('pid'); //详情页
                } else {
                    var pid = _this.parents('.dzt-ext-info-bar').attr('id'); //列表页
                    pid = pid.split('-')[4];
                }
                var i = [];
                var o = k();
                i[u](o.e, o.v, o.w, 'kid' + kid, 'pid' + pid, 'f' + f);
                i = s(i[z(r)]()[z(x)]('&'));
                $.get(dzt_url + '/api/4.0/kwr/', {
                    'ver': v,
                    't': w,
                    'pid': pid,
                    'kid': kid,
                    'f': f,
                    'sign': i
                }, function (data) {
                    var d = data.d;
                    var r = data.r;
                    var rank = data.rank;
                    var tmp_r = [];
                    for (var i = 0; i < r.length; i++) {
                        if (r[i] == '-') {
                            tmp_r.push(-1);
                        } else {
                            tmp_r.push(r[i]);
                        }
                    }

                    var tmp_max = Math.max.apply(Math, tmp_r) + 10;
                    var dzt_tmp_r = [];
                    for (var i = 0; i < tmp_r.length; i++) {
                        if (tmp_r[i] == -1) {
                            dzt_tmp_r.push(tmp_max);
                        } else {
                            dzt_tmp_r.push(tmp_r[i]);
                        }
                    }

                    for (var i = 0; i < window.ts_lst.length; i++) {
                        var ts = window.ts_lst[i];
                        var date = new Date(ts * 1000);
                        for (var j = 0; j < d.length; j++) {
                            d[i] = date.format("yyyy-MM-dd");
                        }
                    }
                    d = d.reverse();
                    chart_opt_t.xAxis[0].data = d;
                    chart_opt_t.series[0].data = dzt_tmp_r;
                    chart_opt_t.yAxis[0].inverse = true;
                    chart_opt_t.yAxis[0].min = 1;
                    chart_opt_t.yAxis[0].max = tmp_max;
                    chart_opt_t.yAxis[0].axisLabel.formatter = function (value) {
                        if (value == tmp_max) {
                            return '十页外';
                        }
                        return parseInt(value) + ' 名';
                    }
                    chart_opt_t.series[0].markPoint.data[0].label.normal.formatter = function (params) {
                        if (params.data.value == tmp_max) {
                            return '十页外';
                        } else {
                            return params.data.value + '名';
                        }

                    }
                    chart_opt_t.series[0].markPoint.data[1].label.normal.formatter = function (params) {
                        return params.data.value + '名';

                    }

                    chart_opt_t.tooltip.formatter = function (params, ticket, callback) {
                        var p = rank[params[0].dataIndex],
                            a, b;
                        var res = '日期： <span style="color:#35aa47;">' + params[0].name + '</span>';

                        if (p != '-') {
                            p = p.split(':');
                            a = p[0];
                            b = p[1];
                            res += '<br/>' + '名次：第 <span style="color:#4184f3;">' + params[0].value + '</span> 名';
                            if (_this.parents('#dzt-product-ztc-info,.dzt-ci-hover').attr('data-t') == 'ztc_tb' || _this.parents('#dzt-product-ztc-info,.dzt-ci-hover').attr('data-t') == 'ztc_tmall') {
                                res += '<br/>' + '排位 : 第<span style="color:#4184f3;">' + a + '</span>页' + ' <span style="color:#4184f3;">' + b + '</span>位';
                            } else {
                                res += '<br/>' + '排位 : 第<span style="color:#4184f3;">' + a + '</span>页' + ' 第<span style="color:#4184f3;">' + b + '</span>位';
                            }
                        } else {
                            res += '<br/>' + '排位：<spna style="color:#f35a4a;"> 十页外</spna>';

                        }

                        return res;
                    }

                    if (d && r) {
                        _this.parent().next().find('.trend_chart_container').attr('loader', 'true');
                        chart.hideLoading();
                        chart.setOption(chart_opt_t);
                        chart_box.before('<span style="display:block;width:430px;text-align:center;color:#f35a4a;margin:0 auto;">宝贝该关键词下的排名趋势(每天定时抓取，非当前即时排名)</span>');

                    } else {
                        chart.showLoading(nodata_loading_opt);
                    }
                })
            },

            toggle_trend: function (btn) {

                btn = $(btn);
                if (btn.hasClass('close')) {
                    $('.open').each(function () {
                        DAMY.loader.toggle_trend(this);
                    });
                    if (window.dzt_ver == -1 || window.ver < 40) {
                        var colspan_num = 4;
                    } else {
                        var colspan_num = 9;
                    }

                    var html = '<tr class="dzt_trend_chart">' +
                        '<td colspan="' + colspan_num + '">' +
                        '<strong class="trend_chart_container" loader="loading"></strong>' +
                        '</td>' +
                        '</tr>';

                    if (!(btn.parent().next('.dzt_trend_chart').length)) {
                        btn.parent().after(html);
                        DAMY.loader.trend_chart_build(btn);

                    } else {
                        btn.parent().next('.dzt_trend_chart').show();
                    }

                    btn.removeClass('close').addClass('open');
                    btn.find('span').text('收起');

                } else if (btn.hasClass('open')) {

                    btn.parent().next().hide();
                    btn.removeClass('open').addClass('close');
                    btn.find('span').text('趋势');
                }

            },

            pageNumber: function (h, Num) {

                if (Num > 0 && Num <= 10) {
                    //
                } else if (Num > 10 && Num <= 20) {
                    h.find('.p_two').css('display', 'inline-block');
                } else if (Num > 20 && Num <= 30) {
                    h.find('.p_two,.p_three').css('display', 'inline-block');
                } else if (Num > 30) {
                    h.find('.p_two,.p_more,.p_max').css('display', 'inline-block');
                    h.find('.p_max').html(parseInt(Math.ceil(Num / 10)));
                } else {
                    h.find('.p_max').css('display', 'none');
                }
                return h.html();
            },

            check_tbcc: function () {
                if ($('tbcc').length) {
                    var ids = new Array();
                    $('tbcc').find('ul>li').each(function () {
                        var id = $(this).find('a').eq(0).attr('atpanel');
                        id = id.split(',')[1];
                        ids.push(id);
                        var tmp = $(ztc_html);
                        tmp.find('.dzt-tmall-val').attr('id', 'dzt-tmall-' + id);
                        tmp.find('.dzt-mobile-val').attr('id', 'dzt-mobile-' + id);
                        tmp.insertBefore($(this).children('div:last'));
                    });
                    $.get(dzt_url + '/api/ztc', {'ids': ids.join(',')}, function (data) {

                        for (var i in data) {
                            $('#dzt-tmall-' + i).html(data[i].tmall);
                            $('#dzt-mobile-' + i).html(data[i].mobile);
                        }
                    });
                } else {
                    setTimeout(this.check_tbcc, 1000);
                }
            },
            trim_all: function (str) {
                return str.replace(/[\n\s*\r]*/g, '');
            },
            getDate: function (ns) {
                return new Date(parseInt(ns));
            },

            price_on: function (obj) {
                var chart_box = $(obj).find(".chart");
                $(obj).find('.chart_container').show();
                setTimeout(function () {
                    $(obj).find('.chart_container').addClass("chart_container_show");
                }, 15);
                if (chart_box.attr("loaded") == "false") {
                    if (typeof bg != 'undefined') {
                        // var chart = echarts.init(chart_box.get(0));
                        // chart.showLoading(loading_opt);
                        var pid = chart_box.attr("pid");
                        //var url = "http://gouwudai.360.cn/api.html?path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D" + pid + "%26ali_refid%3Da3_420432_1006%3A1121045195%3AN%3A%25E7%2594%25B7%25E5%25A4%2596%25E5%25A5%2597%3A015b3b5494f006a30e6ebbe28767ddc1%26ali_trackid%3D1_015b3b5494f006a30e6ebbe28767ddc1%26spm%3Da230r.1.14.1.qiGfhu%23detail&v=v5&bfrom=normal&pop=1&cv=4.2.0.3&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0&ref=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D" + pid + "%26ali_refid%3Da3_420432_1006%3A1121045195%3AN%3A%25E7%2594%25B7%25E5%25A4%2596%25E5%25A5%2597%3A015b3b5494f006a30e6ebbe28767ddc1%26ali_trackid%3D1_015b3b5494f006a30e6ebbe28767ddc1%26spm%3Da230r.1.14.1.qiGfhu%23detail";
                        //var url = 'https://gouwudai.360.cn/api.html?path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fdetail.tmall.com%2Fitem.htm%3Fid%3D'+ pid +'%26ali_refid%3Da3_420984_1006%3A1104919845%3AN%3A%25E5%25A5%25B3%25E5%2587%2589%25E9%259E%258B%3Ab0afd7357f0e9a16a782cfa8d66889d1%26ali_trackid%3D1_b0afd7357f0e9a16a782cfa8d66889d1%26spm%3Da230r.1.1957635.2.JmulPx&v=v5&bfrom=normal&pop=1&cv=4.2.0.3&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0&ref=https%3A%2F%2Fdetail.tmall.com%2Fitem.htm%3Fid%3D'+ pid +'%26ali_refid%3Da3_420984_1006%3A1104919845%3AN%3A%25E5%25A5%25B3%25E5%2587%2589%25E9%259E%258B%3Ab0afd7357f0e9a16a782cfa8d66889d1%26ali_trackid%3D1_b0afd7357f0e9a16a782cfa8d66889d1%26spm%3Da230r.1.1957635.2.JmulPx'
                        //var url = 'https://zhushou.huihui.cn/productSense?phu=http%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fspm%3Da230r.1.14.45.tDARny%26id%3D'+ pid +'%26ns%3D1%26abbucket%3D13%23detail&type=canvas'
                        //var url = 'https://ext.miaomiaoz.com/api.html?path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fdetail.tmall.com%2Fitem.htm%3Fid%3D' + pid + '%26ali_refid%3Da3_420432_1006%3A1102228814%3AN%3A%25E5%2587%2589%25E9%259E%258B%25E5%25A5%25B3%3Ac9fac06e8ab629323b3dcfb3bcabda90%26ali_trackid%3D1_c9fac06e8ab629323b3dcfb3bcabda90%26spm%3Da230r.1.14.1.JmulPx%26sku_properties%3D-1%3A-1&v=v5&bfrom=normal&pop=1&cv=4.2.1.3&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0&ref=https%3A%2F%2Fdetail.tmall.com%2Fitem.htm%3Fid%3D' + pid + '%26ali_refid%3Da3_420432_1006%3A1102228814%3AN%3A%25E5%2587%2589%25E9%259E%258B%25E5%25A5%25B3%3Ac9fac06e8ab629323b3dcfb3bcabda90%26ali_trackid%3D1_c9fac06e8ab629323b3dcfb3bcabda90%26spm%3Da230r.1.14.1.JmulPx%26sku_properties%3D-1%3A-1';
                        // var url = "http://gouwudai.360.cn/api.html?path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D" + pid + "&v=v5&bfrom=normal&pop=1&cv=4.2.0.3&hisOpn=0&toolbar_state=open&isGulike=false&fromTp=0&ref=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D" + pid;
                        //var url = "http://gouwudai.360.cn/api.html?path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fspm%3Da230r.1.14.248.dRhs0g%26id%3D" + pid + "%26ns%3D1%26abbucket%3D17%23detail&v=v5&bfrom=normal&pop=1&cv=4.2.0.3&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0&ref=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fspm%3Da230r.1.14.248.dRhs0g%26id%3D" + pid + "%26ns%3D1%26abbucket%3D17%23detail";
                        // var url = "https://gouwudai.360.cn/api.html?path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fitem.taobao.com%2Fitem.html%3Fid%3D" + pid + "&v=v5&bfrom=normal&pop=1&cv=4.2.0.2&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0";
                        // var url = "https://ext.henzanapp.com/api.html?tplmd5=-3012585956224588407&path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fdetail.tmall.com%2Fitem.htm%3Fid%3D" + pid + "%26ali_refid%3Da3_420432_1006%3A1106248539%3AN%3A%25E8%25A5%25BF%25E8%25A3%2585%25E5%25A5%2597%25E8%25A3%2585%25E5%25A5%25B3%3A378149c09641214784b936d5c6da8dcf%26ali_trackid%3D1_378149c09641214784b936d5c6da8dcf%26spm%3Da230r.1.14.1%23WdEsCXGluM9WK0pvdV&v=v5&bfrom=normal&pop=1&cv=6.0.0.8&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0&ref=https%3A%2F%2Fdetail.tmall.com%2Fitem.htm%3Fid%3D" + pid + "%26ali_refid%3Da3_420432_1006%3A1106248539%3AN%3A%25E8%25A5%25BF%25E8%25A3%2585%25E5%25A5%2597%25E8%25A3%2585%25E5%25A5%25B3%3A378149c09641214784b936d5c6da8dcf%26ali_trackid%3D1_378149c09641214784b936d5c6da8dcf%26spm%3Da230r.1.14.1%23WdEsCXGluM9WK0pvdV"
                        var url= 'https://ext.henzanapp.com/api.html?tplmd5=7935105993154557932&path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fspm%3Da1z10.3-c.w4002-19942844826.84.39af1daccX9Zk2%26id%3D' + pid + '&v=v5&bfrom=normal&pop=1&cv=6.0.1.3&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0&ref=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fspm%3Da1z10.3-c.w4002-19942844826.84.39af1daccX9Zk2%26id%3D' + pid;
                        bg.postMessage({
                            act: 'POST',
                            url: url,
                            data: {"pid": pid},
                            flag: 'URL_PRICE_HISTORY'
                        });
                        bg_price_callback_post = function (data) {
                            if (data != 'error') data = JSON.parse(data);
                            var chart = echarts.init(chart_box.get(0));
                            chart.showLoading(loading_opt);
                            if (data && data.pcinfo && data.pcinfo.info) {
                                DAMY.loader.price_build(data.pcinfo.info, data.pcinfo.lpr, data.pcinfo.hpr, chart, chart_box, '360');
                            } else {
                                var url = 'https://zhushou.huihui.cn/productSense?phu=https://item.taobao.com/item.htm?id=' + pid + '&type=canvas';
                                bg.postMessage({
                                    act: 'GET',
                                    url: url,
                                    other: {"pid": pid, "init_chart": false},
                                    flag: 'URL_PRICE_HISTORY2'
                                });
                                hh_price_on = function (data) {
                                    if (data != 'error') data = JSON.parse(data.data);
                                    if (data && data.priceHistoryData && data.priceHistoryData.list.length > 0) {
                                        DAMY.loader.price_build(data.priceHistoryData.list, data.min ? data.min : null, data.max ? data.max : null, chart, chart_box, 'hh', data.priceHistoryData.curTime ? data.priceHistoryData.curTime : null, data.today ? data.today : null);
                                    } else {
                                        chart.showLoading(nodata_loading_opt);
                                    }
                                }
                            }
                        }
                    } else {
                        console.error('getPrice error!');
                    }

                }
            },

            price_build: function (items, lowest, heights, chart, chart_box, type, today, today_p) {
                var x_axis = new Array();
                var series = new Array();
                if (type == '360') {
                    $.each(items, function (i, item) {
                        x_axis.push(item.dt.replace(/\//g, '-'));
                        series.push(item.pr);
                    });
                } else {
                    $.each(items, function (i, item) {
                        x_axis.push(item.time);
                        series.push(item.price);
                    })
                    if (today) x_axis.push(today);
                    if (today_p) series.push(today_p);
                }
                chart_opt.xAxis[0].data = x_axis;
                chart_opt.series[0].data = series;
                chart.hideLoading();
                chart.setOption(chart_opt);
                chart_box.attr("loaded", "true");
                if (lowest && !chart_box.find('.price-box').length) {
                    chart_box.before('<div class="price-box"><span style="float:left;">历史最低：<span class="red">￥' + lowest + '</span> | 最高：<span class="red">￥' + heights + '</span></span><span style="float:right;margin-right:20px;">价格数据由 <a href="http://www.henzan.com/mmz" target="_blank">喵喵折</a> 提供</span></div>');
                }
            },
            price_out: function (obj) {
                var chart_box = $(obj).find(".chart_container");
                chart_box.removeClass("chart_container_show");
                setTimeout(function () {
                    chart_box.hide();
                }, 200);
            },
            getFullDate: function (st, ed, price_ret) {
                var data_arr = [];
                var st_arr = st.split("-");
                var ed_arr = ed.split("-");
                var st_d = new Date(parseInt(st_arr[0]), parseInt(st_arr[1]) - 1, parseInt(st_arr[2]));
                var ed_d = new Date(parseInt(ed_arr[0]), parseInt(ed_arr[1]) - 1, parseInt(ed_arr[2]));
                var l = (ed_d.getTime() - st_d.getTime()) / (86400 * 1000) + 1;
                for (var i = 0; i < l; i++) {
                    var tmp = new Date(st_d.getFullYear(), st_d.getMonth(), st_d.getDate() + i);
                    var d = (tmp.getDate() >= 10) ? tmp.getDate() : ('0' + tmp.getDate());
                    var tmp_data = [tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + d];
                    if (i > 0) {
                        for (var j = 0; j < price_ret.length; j++) {
                            var tmp_d_arr = price_ret[j][0].split("-");
                            var tmp_ret_d = new Date(parseInt(tmp_d_arr[0]), parseInt(tmp_d_arr[1]) - 1, parseInt(tmp_d_arr[2]));
                            if (tmp.getTime() <= tmp_ret_d.getTime()) {
                                if (tmp.getTime() === tmp_ret_d.getTime()) {
                                    tmp_data[1] = price_ret[j][1];
                                    break;
                                }
                            } else {
                                continue;
                            }
                        }
                        if (tmp_data.length == 1) {
                            tmp_data[1] = data_arr[data_arr.length - 1][1];
                        }
                    } else {
                        tmp_data[1] = price_ret[0][1];
                    }
                    data_arr.push(tmp_data);
                }
                return data_arr;
            },
            aliEncode: function (str) {
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var out, i, len;
                var c1, c2, c3;
                len = str.length;
                i = 0;
                out = "";
                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        out += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    out += base64EncodeChars.charAt(c3 & 0x3F);
                }
                return out;
            },
            load_same_item: function () {
                // var same_item_on = 1;  //同款货源数据开关
                // if(same_item_on){
                var loaded = $("#dzt_tool_same_item_lst").attr('loaded');
                if (loaded != 'true' && loaded != 'loading') {
                    $("#dzt_tool_same_item_lst").attr('loaded', 'loading');
                    $("#dzt_tool_same_item_lst").html('<span class="one-line-txt">加载中，请稍后...</span>');
                    var pid = $('.dzt-detail-top-bar').attr('pid');
                    var appkey = DAMY.loader.aliEncode('taosellerran;' + window.curr_date);
                    //var url = 'https://open-s.1688.com/openservice/taoOfferSameSimilarBusinessService?appName=taosellerran&appKey=' + appkey + '&fromOfferId=' + pid
                    var url = 'https://open-s.1688.com/openservice/taoOfferSameSimilarBusinessService?fromOfferId=' + pid + '&nick=&_input_charset=utf-8&appName=taosellerran&appKey=' + appkey;
                    bg.postMessage({
                        act: "GET",
                        url: url,
                        flag: "URL_1688_SAME_ITEM"
                    })
                }

            },
            load_same_item_callback: function (data) {
                data = JSON.parse(data);
                var str = "";
                var item_num = -1;
                if (data && data.data.offerList && data.data.totalCount > 0) {
                    str += '<ul>';
                    offerList = data.data.offerList;
                    item_num = offerList.length > 5 ? 5 : offerList.length;
                    for (var i = 0; i < item_num; i++) {
                        str += '<li><a class="dzt_same_item" href="' + offerList[i].detailUrl + '" target="_blank"><img src="' + offerList[i].imageUrl.replace('summ', '120x120xz') + '"/></a><div class="dzt_same_item_p">￥' + offerList[i].price + '</div></li>';
                    }
                    str += '</ul>';
                    if (item_num > 5) {
                        var reg = /key=[0-9a-f]+/ig;
                        var ret = reg.exec(offerList[0].detailUrl);
                        if (ret) {
                            var moreUrl = "https://s.1688.com/youyuan/collaboration_search.htm?tab=similarDesign&showStyle=shopwindow&fromOfferId=" + pid + "&" + ret[0];
                            str += '<div class="dzt_more_same_item">共' + data.data.totalCount + '件 <a class="hover-link" href="' + moreUrl + '" target="_blank">查看更多货源</a></div>';
                        }
                    }
                    str += '<div class="dzt_more_same_item">货源数据由 <a href="https://shen.1688.com/" target="_blank" class="hover-link">1688找货神器</a> 提供</div>';
                } else {
                    str += '<span class="one-line-txt">暂无数据</span>';
                }
                if (item_num > 0 && item_num <= 5) {
                    $("#dzt_tool_same_item_lst").css('width', (136 * item_num) + 'px');
                }
                $("#dzt_tool_same_item_lst").html(str);
                $("#dzt_tool_same_item_lst").attr('loaded', 'true');
            },
            same_item_on: function (obj) {
                DAMY.loader.load_same_item();
                $("#dzt_tool_same_item_lst").show();
                setTimeout(function () {
                    $("#dzt_tool_same_item_lst").addClass("dzt_same_item_lst_show");
                }, 15);
            },
            same_item_out: function (obj) {
                $("#dzt_tool_same_item_lst").removeClass("dzt_same_item_lst_show");
                setTimeout(function () {
                    $("#dzt_tool_same_item_lst").hide();
                }, 200);
            },
            ck_rank_on: function (obj) {
                $("#dzt_tool_ck_rank_detail").show();
                $('#dzt_search_tool_ck_rank').show();
                setTimeout(function () {
                    $("#dzt_tool_ck_rank_detail").addClass("dzt_ck_rank_show");
                    $('#dzt_search_tool_ck_rank').addClass("dzt_ck_rank_show");
                }, 15);
                $('.search-top-tool-box').find('.dzt-arrow-bottom').css('display', 'block');
            },
            ck_rank_out: function (obj) {
                $("#dzt_tool_ck_rank_detail").removeClass("dzt_ck_rank_show");
                $('#dzt_search_tool_ck_rank').removeClass("dzt_ck_rank_show");
                $('.search-top-tool-box').find('.dzt-arrow-bottom').css('display', 'none');
                setTimeout(function () {
                    $("#dzt_tool_ck_rank_detail").hide();
                    $('#dzt_search_tool_ck_rank').hide();
                }, 200);

            },
            lm_hd_on: function (obj) {
                $("#dzt_tool_lm_hd_lst").show();
                setTimeout(function () {
                    $("#dzt_tool_lm_hd_lst").addClass("dzt_tool_lm_hd_lst_show");
                }, 15);

            },
            lm_hd_out: function (obj) {
                $("#dzt_tool_lm_hd_lst").removeClass("dzt_tool_lm_hd_lst_show");
                setTimeout(function () {
                    $("#dzt_tool_lm_hd_lst").hide();
                }, 200);
            },
            ck_rank: function (l_kw, l_type, pid, page, s_url) {
                page++;
                $('#dzt_ck_rank_ret,#dzt_search_ck_rank_ret').html('正在搜索：第 <b>' + page + '</b> 页');
                var s;
                if (page == 1) {
                    ret_t_set = new Set();
                    s = 48;
                    $('.dzt_tool_ck_rank>a').addClass('d_warning');
                    rank_array = new Array();
                } else {
                    s = (page - 1) * 44 + 48;
                }
                if (!s_url) {

                    s_url = 'https://s.taobao.com/search?q=' + encodeURIComponent(l_kw) + '&ie=utf8';

                }
                $.ajax({
                    dataType: 'text',
                    url: s_url,
                    success: function (data, ts, xhr) {
                        if (xhr.status == 200) {
                            var search_ret;
                            if (page == 1) {
                                var content_reg = /g_page_config = \{.*\};/g;
                                var ret = content_reg.exec(data);
                                if (ret && ret.length > 0) {
                                    search_ret = JSON.parse(ret[0].replace('g_page_config = ', '').replace("};", "}"));
                                }
                            } else {
                                var content_reg = /search_ret_callback\((.*)\);/g;
                                var ret = content_reg.exec(data);
                                if (ret) search_ret = JSON.parse(ret[1]);
                            }
                            if (search_ret && search_ret.url && search_ret.url.indexOf('https://sec.taobao.com/query.htm?action=QueryAction') >= 0) {
                                $('#dzt_ck_rank_ret,#dzt_search_ck_rank_ret').html('访问频繁，请歇一歇或登录后再试');
                                $('#dzt_tool_start_ck_rank,#dzt_search_tool_start_ck_rank').addClass('dzt_btn_danger').removeAttr('disabled').text('开始查询');
                                $('.dzt_tool_ck_rank>a').removeClass('d_warning');
                                return;
                            }
                            var auctions;
                            if (search_ret && search_ret.mods.itemlist.data && search_ret.mods.itemlist.data.auctions) {
                                auctions = search_ret.mods.itemlist.data.auctions;
                                // console.log(auctions)
                                if (l_type == 'org' || l_type == 'both') {
                                    for (var i = 0; i < auctions.length; i++) {
                                        if (auctions[i].nid == pid) {
                                            var rk = i + 1;
                                            var rank_item = new Object();
                                            rank_item['t'] = 'tb';
                                            rank_item['page'] = page;
                                            rank_item['rank'] = rk;
                                            rank_item['item'] = auctions[i];
                                            var line = parseInt(rk / 4) + 1;
                                            var po = (rk % 4 == 0) ? 4 : rk % 4;
                                            rank_item['txt'] = '淘宝搜索（第' + page + '页' + line + '排' + po + '位）';
                                            rank_array.push(rank_item);
                                            break;
                                        }
                                    }
                                }

                                if (l_type == 'simba' || l_type == 'both') {
                                    for (var i = 0; i < auctions.length; i++) {
                                        if (auctions[i].nid == pid && auctions[i].p4p == 1) {
                                            var rk = i + 1;
                                            var rank_item = new Object();
                                            rank_item['t'] = 'simba';
                                            rank_item['page'] = page;
                                            rank_item['rank'] = rk;
                                            rank_item['item'] = auctions[i];
                                            rank_item['txt'] = '淘宝搜索直通车（左' + rk + '位）';
                                            rank_array.push(rank_item);
                                            break;
                                        }
                                    }

                                    var p4pdata = JSON.parse(search_ret.mods.p4p.data.p4pdata);
                                    var p4p_right = p4pdata.right.data.ds1;
                                    for (var i = 0; i < p4p_right.length; i++) {
                                        var rk = i + 1;
                                        if (p4p_right[i].RESOURCEID == pid) {
                                            var rank_item = new Object();
                                            rank_item['t'] = 'simba';
                                            rank_item['page'] = page;
                                            rank_item['rank'] = rk;
                                            rank_item['item'] = p4p_right[i];
                                            rank_item['txt'] = '直通车（右' + rk + '位）';
                                            rank_array.push(rank_item);
                                            break;
                                        }
                                    }
                                    if (typeof p4pdata.bottom != 'undefined') { //搜索类似指纹胶关键词没有bottom
                                        var p4p_bottom = p4pdata.bottom.data.ds1;
                                        for (var i = 0; i < p4p_bottom.length; i++) {
                                            if (p4p_bottom[i].RESOURCEID == pid) {
                                                var rk = i + 1;
                                                rank_item = new Object();
                                                rank_item['t'] = 'simba';
                                                rank_item['page'] = page;
                                                rank_item['rank'] = rk;
                                                rank_item['item'] = p4p_bottom[i];
                                                rank_item['txt'] = '直通车（下' + rk + '位）';
                                                rank_array.push(rank_item);
                                                break;
                                            }
                                        }
                                    }

                                }

                                var next_url = search_ret.mainInfo.modLinks.pager + '&data-key=s&data-value=' + s + '&ajax=true&callback=search_ret_callback';
                                if (l_type == 'both') {
                                    for (var i = 0; i < rank_array.length; i++) {
                                        ret_t_set.add(rank_array[i].t);
                                    }
                                }
                            }
                            if ((rank_array.length == 0 && page < 10 && auctions) || (l_type == 'both' && ret_t_set.size < 2 && page < 10 && auctions)) {
                                setTimeout(function () {
                                    DAMY.loader.ck_rank(l_kw, l_type, pid, page, next_url);
                                }, 300);
                            } else if ((rank_array.length == 0 && page >= 10) || (rank_array.length == 0 && !auctions)) {
                                $('#dzt_tool_start_ck_rank,#dzt_search_tool_start_ck_rank').addClass('dzt_btn_danger').removeAttr('disabled').text('开始查询');
                                $('.dzt_tool_ck_rank>a').removeClass('d_warning');
                                $('#dzt_ck_rank_ret').html('查询结果：<b>' + l_kw + '</b> 关键词 在<b>前10页</b>未发现此宝贝。');
                                $('#dzt_search_ck_rank_ret').html('查询结果：<b>前10页</b>未发现此宝贝。');
                            } else if ((rank_array.length > 0 && l_type != 'both') || (rank_array.length >= 1 && l_type == 'both') || (rank_array.length > 0 && !auctions)) {
                                var ret_str = '查询结果：';
                                for (var i = 0; i < rank_array.length; i++) {
                                    ret_str += rank_array[i].txt + ' ';
                                }
                                $('#dzt_ck_rank_ret,#dzt_search_ck_rank_ret').html(ret_str);
                                $('#dzt_tool_start_ck_rank,#dzt_search_tool_start_ck_rank').addClass('dzt_btn_danger').removeAttr('disabled').text('开始查询');
                                $('.dzt_tool_ck_rank>a').removeClass('d_warning');
                            }
                        } else {
                            $('#dzt_ck_rank_ret,#dzt_search_ck_rank_ret').html('访问频繁，请歇一歇或登录后再试');
                            $('#dzt_tool_start_ck_rank,#dzt_search_tool_start_ck_rank').addClass('dzt_btn_danger').removeAttr('disabled').text('开始查询');
                            $('.dzt_tool_ck_rank>a').removeClass('d_warning');
                        }
                    }
                });
            }
        };
        DAMY.loader.init_page();
    })
    function k() {
        return {
            i: [],
            e: g.e + e + 'm',
            v: g.v + v,
            w: g.t + w
        }
    }
    function isJSON (str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }
    
            } catch(e) {
                return false;
            }
        }
    }
    function stc (_s){
        _s = _s.replace(/(^\s*)|(\s*$)/g, "");
        var _r = "";
        for(var i=0;i<_s.length;i++){
            _r += i==0 ? _s.charCodeAt(i) : "." + _s.charCodeAt(i);
        }
        return _r;
    }
    function gs(){
        var tinfo = sessionStorage[gi]('DZT_SESSION_INFO');
        if (tinfo) {
            tinfo = JSON.parse(tinfo);
            if (tinfo[nc] && tinfo[ui]) {
                return parseInt(sis(tinfo[ui])) + nm() + '.' + stc(tinfo[nc]);
            }
        }
        return '';
    }
}

function fill_version(data) {
    $('body').append('<span id="dzt-installed" version="' + data.version + '" exid="' + data.exid + '"></span>');
    init_main(data.version, data.exid);
}
function sis (str) {
    if (str) return str[lit]('')[re]()[oi]('')
}
function nm () { 
    return 123456;
}

function check_domain(dzt_load_href) {
    if (dzt_load_href.indexOf('://list.tmall.com/search_product.htm') >= 0 ||
        dzt_load_href.indexOf('.tmall.com/category') >= 0 ||
        dzt_load_href.indexOf('.tmall.com/view_shop.htm') >= 0 ||
        dzt_load_href.indexOf('.tmall.com/search.htm') >= 0 ||
        dzt_load_href.indexOf('subject.tmall.com/subject/subject.htm') >= 0 ||
        dzt_load_href.indexOf('://s.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/search.htm') >= 0 ||
        dzt_load_href.indexOf('.jiyoujia.com/search.htm') >= 0 ||
        dzt_load_href.indexOf('://list.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('://style.taobao.com') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/markets/style/qiangdiao2016') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/go/market/') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/markets/nvzhuang') >= 0 ||
        dzt_load_href.indexOf('://nz.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/markets/nanzhuang') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/markets/xie/nvxie') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/markets/bao/xiangbao') >= 0 ||
        dzt_load_href.indexOf('://world.taobao.com/search/search.htm') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/category') >= 0 ||
        dzt_load_href.indexOf('.jiyoujia.com/category') >= 0 ||
        dzt_load_href.indexOf('://qiang.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('://qing.taobao.com') >= 0 ||
        dzt_load_href.indexOf('://ju.taobao.com/qing') >= 0 ||
        dzt_load_href.indexOf('ju.taobao.com') >= 0 ||
        dzt_load_href.indexOf('jusp.tmall.com') >= 0 ||
        dzt_load_href.indexOf('guang.taobao.com') >= 0 ||
        dzt_load_href.indexOf('taotelaisi.taobao.com') >= 0 ||
        dzt_load_href.indexOf('://q.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('://www.taobao.com/markets/quality/v2') >= 0 ||
        dzt_load_href.indexOf('://www.taobao.com/market/p/') >= 0 ||
        dzt_load_href.indexOf('://pp.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('://taojinbi.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('://chi.taobao.com/itemlist/') >= 0 ||
        dzt_load_href.indexOf('://tejia.taobao.com/') >= 0 ||
        dzt_load_href.indexOf('://www.taobao.com/market/tejia/') >= 0 ||
        dzt_load_href.indexOf('://g.taobao.com/brand_detail.htm') >= 0 ||
        dzt_load_href.indexOf('://list.tmall.hk/search_product.htm') >= 0 ||
        dzt_load_href.indexOf('.taobao.com/markets/tbhome') >= 0 ||
        dzt_load_href.indexOf('://detail.alitrip.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://hotel.alitrip.com/') >= 0 ||
        dzt_load_href.indexOf('://tuan.alitrip.com/detail.htm') >= 0 ||
        dzt_load_href.indexOf('://chaoshi.detail.tmall.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://items.alitrip.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://detail.tmall.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://detail.tmall.com//item.htm') >= 0 ||
        dzt_load_href.indexOf('://detail.tmall.hk/item.htm') >= 0 ||
        dzt_load_href.indexOf('://detail.tmall.hk/hk/item.htm') >= 0 ||
        dzt_load_href.indexOf('://detail.yao.95095.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://item.taobao.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://traveldetail.taobao.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://world.taobao.com/item/') >= 0 ||
        dzt_load_href.indexOf('://world.tmall.com/item/') >= 0 ||
        dzt_load_href.indexOf('.fliggy.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('://detail.liangxinyao.com/item.htm') >= 0 ||
        dzt_load_href.indexOf('kandianbao.com') >= 0 ||
        dzt_load_href.indexOf('dianzhentan.com') >= 0 ||
        dzt_load_href.indexOf('kandianbao.cn') >= 0 ||
        dzt_load_href.indexOf('xuedianshang.com') >= 0 ||
        dzt_load_href.indexOf('kandianshang.com') >= 0 ||
        dzt_load_href.indexOf('kandianshang.net') >= 0 ||
        dzt_load_href.indexOf('kandianshang.cn') >= 0 ||
        dzt_load_href.indexOf('dianshangyi.com') >= 0 ||
        dzt_load_href.indexOf('tuan.fliggy.com/detail.htm') >= 0 ||
        dzt_load_href.indexOf('search1.taobao.com/itemlist/') >= 0 ||
        dzt_load_href.indexOf('.fliggy.com/search.htm') >= 0 ||
        dzt_load_href.indexOf('jupage.taobao.com') >= 0) {
        return true;
    } else {
        return false;
    }
}







