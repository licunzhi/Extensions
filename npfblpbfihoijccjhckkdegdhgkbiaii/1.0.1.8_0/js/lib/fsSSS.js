var fsPlugin = {
    port: undefined,
    inited: false,
    captures: undefined,
    init: function init() {
        this.inited = true;
    },
    launchFunction: function launchFunction(cmd, obj) {
        if (cmd == "captureInit") this.captureInit(obj); else if (cmd == "captureTabPNG") this.captureTabPNG(obj); else if (cmd == "captureDone") this.loadImages(obj, this.captureDone);
    },
    captureInit: function captureInit(data) {
        this.captures = [];
        this.imagesLoaded = 0;
    },
    captureTabPNG: function captureTabPNG(data) {
        this.captures.push(data);
    },
    loadImages: function loadImages(data, callback) {
        var cntr;
        var imagesPending = this.captures.length;
        for (cntr = 0; cntr < this.captures.length; ++cntr) {
            var img = new Image(), captures = this.captures;
            img.onload = function(id, img) {
                return function() {
                    captures[id].dataurl = "";
                    captures[id].img = img;
                    if (--imagesPending == 0) fsPlugin.captureDone(data);
                };
            }(cntr, img);
            img.src = captures[cntr].dataurl;
        }
    },
    captureDone: function captureDone(data) {
        var wszURL = data.url, wszTitle = data.title, nLeft = data.left, nTop = data.top, nWidth = data.width, nHeight = data.height, fCrop = data.crop, fDiv = data.div, nCropLeft = data.cropLeft || 0, nCropTop = data.cropTop || 0, nCropRight = data.cropRight || 0, nCropBottom = data.cropBottom || 0, nShiftX = 0, nShiftY = 0;
        this.pBitmapForChrome = document.createElement("canvas");
        var cntr;
        for (cntr = 0; cntr < this.captures.length; ++cntr) {
            var nSliceX = this.captures[cntr].x, nSliceY = this.captures[cntr].y, pObject = this.captures[cntr].img;
            if (cntr == 0) {
                nShiftX = nSliceX;
                nShiftY = nSliceY;
                this.pBitmapForChrome.width = Math.max(1, fCrop ? nCropRight - nCropLeft : nWidth);
                this.pBitmapForChrome.height = Math.max(1, fCrop ? nCropBottom - nCropTop : nHeight);
            }
            var nX = nSliceX - nShiftX;
            var nY = nSliceY - nShiftY;
            var ctx = this.pBitmapForChrome.getContext("2d");
            ctx.drawImage(pObject, nX - nCropLeft, nY - nCropTop);
        }
        capResult = this.pBitmapForChrome;
        capLinks = data.links;
        capResultDataURL = this.pBitmapForChrome.toDataURL("image/png");
        capResultFileNameLite = getFilenameLite();
        exports.cache.get("jtdsCf", function(config) {
            var jtdsCf = config.jtdsCf;
            if (jtdsCf) {
                jtdsCf = jtdsCf.value || {};
            } else {
                jtdsCf = {};
            }
            var hist = {
                title: getExtension().tabTitle,
                time: getTime(),
                url: getExtension().tabURL
            };
            exports.cache.get("jtdsHistory", function(history) {
                var jtdsHistory = history.jtdsHistory;
                if (jtdsHistory) {
                    jtdsHistory = jtdsHistory.value || [];
                } else {
                    jtdsHistory = [];
                }
                hist.shotTimeStr = hist.time;
                jtdsHistory.unshift(hist);
                exports.cache.set("jtdsHistory", jtdsHistory);
            });
            if (jtdsCf.autoSynchro !== false) {
                $.ajax({
                    url: "http://www.jietu365.com/jietu/in.htm",
                    type: "post",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        u: exports.config.uid,
                        h: [ hist ]
                    })
                });
            }
        });
        function getTime() {
            var date = new Date();
            var now = "";
            now = date.getFullYear() + "-";
            var month = date.getMonth() + 1;
            now += month > 9 ? month + "-" : "0" + month + "-";
            var day = date.getDate();
            now += day > 9 ? day + " " : "0" + day + " ";
            var hour = date.getHours();
            now += hour > 9 ? hour + ":" : "0" + hour + ":";
            var minute = date.getMinutes();
            now += minute > 9 ? minute + ":" : "0" + minute + ":";
            now += date.getSeconds() + "";
            return now;
        }
        try {
            if (data.action == 21) {
                saveTo("startEdit", capResultFileNameLite + ".png", capResultDataURL.split("base64,")[1]);
            } else if (data.action == 22) {
                saveTo("startPrint", capResultFileNameLite + ".png", capResultDataURL.split("base64,")[1]);
            } else if (data.action == 23) {
                saveTo("saveTo", capResultFileNameLite + ".png", capResultDataURL.split("base64,")[1]);
            } else if (data.action == 24) {
                saveTo("saveTo", capResultFileNameLite + ".jpg", capResult.toDataURL("image/jpeg").split("base64,")[1]);
            } else if (data.action == 25) {
                saveTo("saveTo", capResultFileNameLite + ".pdf", new window.fsPDF(capResult, capLinks).toDataURL().split("base64,")[1]);
            } else {
                chrome.tabs.create({
                    url: "captured.html"
                });
            }
        } catch (e) {
            chrome.tabs.create({
                url: "captured.html"
            });
        }
    }
};

function wrongCB(data) {
    if (data.length > 0) {
        try {
            port.postMessage({
                topic: "showCompleteTip"
            });
        } catch (e) {}
        console.log("suc");
    } else {
        console.log("wrong");
    }
}

function saveTo(action, capResultFileNameLite, capResultDataBase64) {
    var maxStr = 95 * 1024;
    var cur = 1;
    var max = Math.ceil(capResultDataBase64.length / maxStr);
    while (cur <= max) {
        exports.ct.gcfc({
            action: action,
            param: [ capResultFileNameLite, {
                cur: cur,
                max: max,
                buf: capResultDataBase64.slice((cur - 1) * maxStr, cur * maxStr)
            } ]
        }, cur == max ? wrongCB : null);
        cur++;
    }
}

function getJSPlugin() {
    if (!fsPlugin.inited) fsPlugin.init();
    return fsPlugin;
}