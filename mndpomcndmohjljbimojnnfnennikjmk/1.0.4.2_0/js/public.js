// storage方法封装，带过期时间
function setStorage(key, value) {
    var curTime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({
        data: value,
        time: curTime
    }));
}

function getStorage(key, expHour) {
    if (!expHour) expHour = 24;
    var exp = expHour * 3600 * 1000;
    var data = localStorage.getItem(key);
    if (!data) return '';
    var dataObj = JSON.parse(data);
    if (new Date().getTime() - dataObj.time > exp) {
        return '';
    } else {
        var dataObjDatatoJson = JSON.parse(dataObj.data)
        return dataObjDatatoJson;
    }
}

// 复制方法封装
function copy_text(text, callback) {
    var tag = document.createElement('input');
    tag.setAttribute('id', 'dzt-copy-input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('dzt-copy-input').select();
    document.execCommand('copy');
    document.getElementById('dzt-copy-input').remove();
    if (callback) {
        callback(text);
    }
}

function copy_cb(text) {
    // 复制后发送信息给contenscrip进行提示
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            act: "showTip",
            item_id: text
        });
    });
}

function get_item_id(item_url) {
    var tb_item = /item\.taobao\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var tmall_item = /detail\.tmall\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var tmall_hk = /detail\.tmall\.hk\/hk\/item\.htm.*?[\?&]id=(\d+)/i;
    var tmall_hk_2 = /detail\.tmall\.hk\/item\.htm.*?[\?&]id=(\d+)/i;
    var alitrip = /items\.alitrip\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var alitrip_2 = /detail\.alitrip\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var yao = /detail\.yao\.95095\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var yao2 = /detail\.liangxinyao\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var fliggy = /items\.fliggy\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var fliggy2 = /traveldetail\.fliggy\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var fliggy3 = /traveldetail\.taobao\.com\/item\.htm.*?[\?&]id=(\d+)/i;
    var item_id = /^[1-9]\d*$/i;
    var regs = [tb_item, tmall_item, tmall_hk, tmall_hk_2, alitrip, alitrip_2, yao, yao2, fliggy, fliggy2, fliggy3];
    for (var i = 0; i < regs.length; i++) {
        if (regs[i].test(item_url)) {
            var ret = regs[i].exec(item_url);
            return ret[1];
        }
    }
    if (item_id.test(item_url)) {
        return item_url
    }
    return '';

}

function copy_item_id(url) {
    var item_id = get_item_id(url);
    copy_text(item_id, copy_cb);

}

function getUrlArg(_url) {
    var parmas = {};
    var url = '';
    var tmp;
    if (_url.indexOf('?') > 0) {
        tmp = _url.split("?");
        url = tmp[0];
        tmp = tmp[1];
    } else {
        url = _url;
    }
    if (tmp && tmp.indexOf('&') > 0) {
        tmp = tmp.split("&");
        for (var i in tmp) {
            if (tmp[i].split('=')[1].indexOf('#') > 0) {
                parmas[tmp[i].split('=')[0]] = tmp[i].split('=')[1].split('#')[0];
            } else {
                parmas[tmp[i].split('=')[0]] = tmp[i].split('=')[1];
            }
        }
    } else if (tmp) {
        if (tmp.split('=').length === 2) {
            if (tmp.split('=')[1].indexOf('#') > 0) {
                parmas[tmp.split('=')[0]] = tmp.split('=')[1].split('#')[0];
            } else {
                parmas[tmp.split('=')[0]] = tmp.split('=')[1];
            }
        }
    }
    return parmas;
}

function clear_loc(str) {
    if (typeof (str) != 'undefined' && str.length) {
        return str.split('').reverse().join('');
    }
}

// function changeUrlArg(url, arg, value) {
//     var str = "";
//     if (url.indexOf('?') != -1) {
//         str = url.substr(url.indexOf('?') + 1);
//     } else {
//         return url + "?" + arg + "=" + value;
//     }
//     var returnurl = "";
//     var setparam = "";
//     var arr;
//     var modify = "0";
//     if (str.indexOf('&') != -1) {
//         arr = str.split('&');
//         for (i in arr) {
//             if (arr[i].split('=')[0] == arg) {
//                 setparam = value;
//                 modify = "1";
//             } else {
//                 setparam = arr[i].split('=')[1];
//             }
//             returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
//         }
//         returnurl = returnurl.substr(0, returnurl.length - 1);
//         if (modify == "0")
//             if (returnurl == str)
//                 returnurl = returnurl + "&" + arg + "=" + value;
//     } else {
//         if (str.indexOf('=') != -1) {
//             arr = str.split('=');
//             if (arr[0] == arg) {
//                 setparam = value;
//                 modify = "1";
//             } else {
//                 setparam = arr[1];
//             }
//             returnurl = arr[0] + "=" + setparam;
//             if (modify == "0")
//                 if (returnurl == str)
//                     returnurl = returnurl + "&" + arg + "=" + value;
//         } else
//             returnurl = arg + "=" + value;
//     }
//     return url.substr(0, url.indexOf('?')) + "?" + returnurl;
// }

function changeUrlArg(url, arg, value) {
    var reg = new RegExp("([?&]" + arg + ")=[^&]+", "gmi");
    if (reg.test(url)) {
        url = url.replace(reg, "$1=" + value);
    } else {
        if (url.indexOf("?") === -1) {
            url += "?";
        } else {
            url += "&";
        }
        url += arg + "=" + value;
    }
    return url;
}

function sis(str) {
    return str.split('_')[0];
}