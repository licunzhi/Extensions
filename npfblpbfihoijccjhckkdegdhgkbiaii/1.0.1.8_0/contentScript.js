if (!window.com) window.com = {};

if (!com.jtds) com.jtds = {};

if (!com.jtds.jtds) com.jtds.jtds = {};

(function(S) {
    var port;
    var contentWrapper = {
        sendMessage: function sendMessage(request, callback) {
            chrome.runtime.sendMessage(request, callback);
        },
        addListener: function addListener(topic, callback) {
            chrome.runtime.onMessage.addListener(function(message) {
                if (message.topic == topic) callback(message);
            });
        },
        postMessage: function postMessage(msg) {
            port.postMessage(msg);
        },
        onMessage: function onMessage(callback) {
            port = chrome.runtime.connect({
                name: "port-jtds"
            });
            port.onMessage.addListener(function(resp) {
                callback(resp);
            });
        }
    };
    for (var k in contentWrapper) {
        S[k] = contentWrapper[k];
    }
    S.extInfo = {
        bgResource: 1
    };
    S.exec = function() {
        S.sendMessage({
            topic: "insert",
            options: {}
        }, function() {});
    };
})(com.jtds.jtds);

if (!window.com) window.com = {};

if (!com.jtds) com.jtds = {};

if (!com.jtds.jtds) com.jtds.jtds = {};

(function(S) {
    S.inContent = true;
})(com.jtds.jtds);

(function(S) {
    S.param = function(params) {
        var _p = [];
        for (var k in params) {
            _p.push(k + "=" + encodeURIComponent(params[k]));
        }
        return _p.join("&");
    };
    S.extend = function(original, extended, overwrite, keys) {
        if (!original || !extended) return original;
        if (overwrite === undefined) overwrite = true;
        var i, p, l;
        if (keys && (l = keys.length)) {
            for (i = 0; i < l; i++) {
                p = keys[i];
                if (p in extended && (overwrite || !(p in original))) {
                    original[p] = extended[p];
                }
            }
        } else {
            for (p in extended) {
                if (overwrite || !(p in original)) {
                    original[p] = extended[p];
                }
            }
        }
        return original;
    };
})(com.jtds.jtds);

if (!window.com) window.com = {};

if (!com.jtds) com.jtds = {};

if (!com.jtds.jtds) com.jtds.jtds = {};

(function(S) {
    S.inject = function() {
        var now = new Date();
        var expire = 24 * 60 * 60 * 1e3 - now.getHours() * 60 * 60 * 1e3 - now.getMinutes() * 60 * 1e3 - now.getSeconds() * 1e3;
        S.sendMessage({
            topic: "siteSkipList",
            options: {
                expire: expire
            }
        }, function(list) {
            var host = domain = location.hostname;
            try {
                domain = domain.match(/([-\w]+\.\b(?:net\.cn|com\.hk|com\.cn|com|cn|net|org|cc|tv$|hk)\b)/)[1];
            } catch (e) {}
            var site;
            if (list && (site = list[domain])) {
                if (!site.whitelist || site.whitelist.length === 0) {
                    return;
                } else {
                    var b = true, wl = site.whitelist;
                    for (var i = 0, l = wl.length; i < l; i++) {
                        if (location.href.match(new RegExp(wl[i]))) {
                            b = false;
                            break;
                        }
                    }
                    if (b) return;
                }
            }
            S.exec();
        });
    };
    if (!S.runs) S.runs = [ function() {} ];
    S.runs.push(S.inject);
})(com.jtds.jtds);

(function(S) {
    if (!S.runs) S.runs = [ function() {} ];
    var count = 0;
    function convertParams(params) {
        var _p = {
            u: params.uid,
            c: params.cl,
            v: params.ver,
            v1: params.v1,
            v2: params.v2,
            s: params.ps,
            ss: params.ss,
            t: params.ad,
            sd: params.sd,
            bl: params.bl,
            cp: params.cp,
            de: params.de,
            mv: params.mv,
            a: params.ci,
            tms: +parseInt(new Date().getTime() / (1e3 * 60 * 10))
        };
        for (var k in _p) {
            if (!_p[k] && typeof _p[k] != "number") delete _p[k];
        }
        return _p;
    }
    function getEnv() {
        S.sendMessage({
            topic: "getEnv",
            options: {
                skip: true
            }
        }, function(data) {
            if (!data || !data.isReady) {
                if (count < 30) {
                    setTimeout(getEnv, 100);
                }
            } else {
                S.env = data;
                S.params = convertParams(data);
                S.runs.forEach(function(run) {
                    run(data);
                });
            }
        });
        count++;
    }
    getEnv();
    S.onMessage(function(resp) {
        var data = resp.data;
        var request = resp.request;
        var detail = {
            resp: data,
            callback: request.callback
        };
        var event = new CustomEvent("jtds-content", {
            detail: JSON.stringify(detail)
        });
        window.dispatchEvent(event);
    });
    window.addEventListener("jtds-page", function(event) {
        var msg = JSON.parse(event.detail);
        S.postMessage(msg);
    });
    window.addEventListener("message", function(message) {
        if (message.data.from == "page") {
            var request = {};
            S.extend(request, message.data);
            request.options = {
                skipCache: true
            };
            S.sendMessage(request, function(data) {
                window.postMessage({
                    data: data,
                    source: request,
                    from: "content"
                }, "*");
            });
        }
    });
    chrome.runtime.onMessage.addListener(function(request, sender, cb) {
        switch (request.topic) {
          case "net":
            var settings = $.extend({}, request.settings, {
                success: cb,
                error: function error() {
                    cb();
                }
            });
            $.ajax(settings);
            break;
        }
        return true;
    });
})(com.jtds.jtds);