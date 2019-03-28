var cf = String.fromCharCode;

function getAjax(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                msg_cache = xhr.responseText;
                cb(xhr.responseText);
            } else {
                cb('error');
            }
        }
    };
    xhr.send();
}

function init_extension() {
    var views = chrome.extension.getViews();
    for (var i in views) {
        if (views[i].location.pathname == '/welcome.html') {
            var class_name = 'dzt_go';
        } else if (views[i].location.pathname == '/upgrade.html') {
            var class_name = 'dzt_upgrade';
        }
        var keywords = ['连衣裙', '女包', '男士外套', '夹克', '半身裙'];
        var kw = keywords[Math.floor(Math.random() * keywords.length)];
        var dzt_suc = '<a class="' + class_name + '" href="https://s.taobao.com/search?q=' + kw + '"><div class="container"><span class="dzt_version"></span></div></a>';
        $(views[i].document).find('#welcome_container').remove();
        $(views[i].document).find('body').html(dzt_suc);
        $(views[i].document).find('body .dzt_version').html(chrome.runtime.getManifest().version);
    }

}



chrome.runtime.onInstalled.addListener(function (details) {

    var _hmt = _hmt || [];
    if (details.reason == 'install') {
        chrome.tabs.create({url: "welcome.html"});
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?481d6965881eb0ec88b28a004792e37e";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();

    } else if (details.reason == 'update') {
        chrome.tabs.create({ url: 'upgrade.html' });
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?764a37579c7c9fb9714bbf866d7f1ac1";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    }
});


if (!chrome.cookies) {
    chrome.cookies = chrome.experimental.cookies;
}

function get_url(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
        prefix += "www";

    return prefix + cookie.domain + cookie.path;
}

function get_suffix(url) {
    var cookiestr = '';
    var domain = url.replace('http://', '').replace('https://').split('/')[0];
    var segs = domain.split('.');
    if (segs.length < 2) {
        return null;
    }

    var suffix = '.' + [segs[segs.length - 2], segs[segs.length - 1]].join('.');
    return suffix;
}

function get_domain(url) {
    var domain = url.replace('http://', '').replace('https://').split('/')[0];
    return domain;
}

function clear_cookie(url, callback) {
    chrome.cookies.getAll({}, function (cookies) {
        var suffix = get_suffix(url);
        var sub_domain = get_domain(url);

        for (var i in cookies) {
            if (cookies[i].domain == suffix || cookies[i].domain == sub_domain) {
                chrome.cookies.remove({url: get_url(cookies[i]), name: cookies[i].name}, function () {
                });
            }
        }
        callback('');
    });
}


function get_cookie(url, callback) {
    chrome.cookies.getAll({}, function (cookies) {
        var cookiestr = '';
        var suffix = get_suffix(url);
        var sub_domain = get_domain(url);
        var subcookie = '';
        for (var i in cookies) {
            if (cookies[i].domain == suffix || cookies[i].domain == '.taobao.com') {
                cookiestr += (cookies[i].name + '=' + cookies[i].value + ';');
            } else if (cookies[i].domain == sub_domain) {
                subcookie += (cookies[i].name + '=' + cookies[i].value + ';');
            }
        }
        callback({'suffix': cookiestr, 'subdomain': subcookie});

    });
}


function postAjax(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            msg_cache = xhr.responseText;
            cb(xhr.responseText);
        }
    };
    xhr.send(data);
}

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    // chrome.tabs.sendRequest(details.tabId, { act: 'url', data: details.url });
    chrome.tabs.sendMessage(details.tabId, { act: 'url', data: details.url });
}, { types: ['script'], urls: ['*://s.taobao.com/search*', '*://s.taobao.com/api*', '*://s.taobao.com/list*'] });

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    function parseUrlArg(str) {
        if (typeof(str) == 'string') {
            var str_len = str.length;
        } else {
            return;
        }
        var str_ret = '';
        for (var i = 0; i < str_len; i++) {
            if (i % 2 == 0) {
                str_ret += str[i];
            }
        }
        function randomStr(len) {
            len = len || 5;
            var $chars = '.ABCDEFGHIJKL.MNOPQRSTUVWX.YZa.bcdefghij.klmnop.rstuvw.xyz123456789';
            var maxPos = $chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }

        var rand = (function () {
            var t = new Date();
            var s = t.getTime();
            function rnd() {
                s = ( s * 9301 + 49297 ) % 233280;
                return s / ( 233280.0 );
            };
            return function rand(number) {
                return Math.ceil(rnd(s) * number);
            };
        })();
        var randomStr = rand(2) + '.' + rand(100) + '.' + rand(999);
        var end_str = str_ret.slice(0, 6).toUpperCase();
        var start_str = str_ret.slice(-5);
        str_ret = start_str + '.' + randomStr + '.' + end_str;
        return str_ret;
    }
    var gotRef = false;
    for (var n in details.requestHeaders) {
        gotRef = details.requestHeaders[n].name.toLowerCase() == 'referer';
        if(gotRef){
            var request_url = details.url;
            var ref = details.requestHeaders[n].value;
            var reqArg = getUrlArg(request_url);
            newRef = changeUrlArg(ref, 'spm', parseUrlArg(reqArg.sign));
            details.requestHeaders[n].value = newRef;
            break;
        }
    }
    if (!gotRef && details.url.indexOf('ssl.dianzhentan.com/api') >= 0){
        var request_url = details.url;
        var reqArg = getUrlArg(request_url);
        var spm = parseUrlArg(reqArg.sign);
        if(spm != undefined){
            details.requestHeaders.push({name: 'Referer', value: 'https://www.taobao.com?spm=' + spm});
        }
    }
    return {requestHeaders: details.requestHeaders};
}, {
    urls: ['*://ssl.dianzhentan.com/api/*']
}, [
    'requestHeaders',
    'blocking'
]);


chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == 'welcome') {
        init_extension();
    } else {
        port.onMessage.addListener(function (msg) {
            if (msg.act == 'GET') {
                getAjax(msg.url, function (data) {
                    port.postMessage({content: {data: data, other: msg.other}, flag: msg.flag, act: msg.act, cb: msg.cb});
                });
            } else if (msg.act == 'POST') {
                postAjax(msg.url, msg.data, function (data) {
                    port.postMessage({content: data, flag: msg.flag, act: msg.act, cb: msg.cb});
                });

            } else if (msg.act == 'EXINFO') {
                port.postMessage({
                    act: msg.act,
                    content: {
                        'version': chrome.runtime.getManifest().version,
                        'exid': chrome.runtime.id
                    }
                });

            } else if (msg.act == 'GET_COOKIE') {
                get_cookie(msg.url, function (data) {
                    port.postMessage({content: data, flag: msg.flag, act: msg.act, cb: msg.cb});
                });
            } else if (msg.act == 'CLEAR_COOKIE') {
                clear_cookie(msg.url, function (data) {
                    port.postMessage({content: data, flag: msg.flag, act: msg.act, cb: msg.cb});
                });
            } else if (msg.act == 'GET_SELLER_LEVEL') {
                var userid = msg.userid;
                localStorage.setItem('DZT_SELLER_ID', userid);
                var seller_level = getStorage(userid);
                if (!seller_level) {
                    if (userid) {
                        $.get('https://shopsearch.taobao.com/search?app=shopsearch&user_id=' + userid + '&java=on&ajax=true', function(data){
                            var data = data.mods;
                            if (data && data.similarcombo.status == 'show') {
                                var shopInfo = data.similarcombo.data.shopItem;
                                if (shopInfo.shopIcon.title == '天猫') {
                                    var seller_level = '3';
                                } else {
                                    var srn = parseInt(shopInfo.dsrInfo.dsrStr.srn);
                                    if (srn <= 250) {
                                        var seller_level = '1';
                                    } else if (srn <= 10000) {
                                        var seller_level = '2';
                                    } else {
                                        var seller_level = '3';
                                    }
                                }
                                setStorage(userid, seller_level);
                                port.postMessage({act: msg.act, data: seller_level});
                            } else {
                                port.postMessage({act: msg.act, data: '0'});
                            }
                        })
                    } else {
                        port.postMessage({act: msg.act, data: '0'});
                    }
                } else {
                    port.postMessage({act: msg.act, data: seller_level});
                }
            }else if (msg.act == 'GET_ITEM_ID'){
                if(get_item_id(msg.item_url)){
                    chrome.contextMenus.create({
                        'id':'get_item_id',
                        'type':'normal',
                        'title':'复制宝贝ID',
                    }, function(){
                        if (chrome.extension.lastError) {  
                            console.log("Got expected error: " + chrome.extension.lastError.message);  
                        }
                    });
                }

            }else {
                console.debug('error msg');
            }
        });
    }


});
chrome.contextMenus.onClicked.addListener(function(info){
    if(info.menuItemId == 'get_item_id'){
        copy_item_id(info.pageUrl);
    }
});

