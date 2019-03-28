chrome.runtime.getBackgroundPage(function(bg) {
    if (!bg) return;
    var exports = bg.exports, pendingDID, onChangedEventActivated = false;
    function _downloadToFile(data, filename, failcb, fallback) {
        addDownloadsPermission(function() {
            if (!onChangedEventActivated) {
                onChangedEventActivated = true;
                chrome.downloads.onChanged.addListener(function(delta) {
                    if (!delta.state || delta.state.current != "complete") {
                        return;
                    }
                    if (getOption(cOpenFolderAterSavingPref) === "true") chrome.downloads.show(pendingDID);
                    if (getOption(cCloseTabAfterSaving) === "true") window.close();
                });
            }
            chrome.downloads.download({
                url: data,
                saveAs: getOption(cNoFilenamePromptPref) !== "true",
                filename: fallback ? filename : getOption(cDefaultFolderPref, cDefaultFolderValue) + "/" + filename,
                conflictAction: "overwrite"
            }, function(downloadId) {
                if (!chrome.runtime.lastError) pendingDID = downloadId; else if (!fallback) {
                    _downloadToFile(data, filename, failcb, true);
                }
            });
        }, failcb);
    }
    function initApp() {
        var vm = new Vue({
            el: "#app",
            data: {},
            mounted: function mounted() {},
            methods: {
                downloadToFile: function downloadToFile(type) {
                    var self = this;
                    var filename = bg.capResultFileNameLite + "." + type;
                    var imgUrl = bg.capResultDataURL;
                    var failCb = function failCb() {
                        self.$message({
                            message: "您未选择授权下载，请先授权哦",
                            type: "warning"
                        });
                    };
                    switch (type) {
                      case "jpg":
                        imgUrl = bg.capResult.toDataURL("image/jpeg");

                      case "png":
                        _downloadToFile(imgUrl, filename, failCb);
                        break;

                      case "pdf":
                        _downloadToFile(new bg.fsPDF(bg.capResult, bg.capLinks).toDataURL(), filename, failCb);
                        break;
                    }
                },
                downloadExe: function downloadExe() {
                    this.$message({
                        message: "暂未开放下载，敬请期待",
                        type: "warning"
                    });
                },
                openOption: function openOption() {
                    exports.fsBg.openOptionPage();
                }
            }
        });
    }
    function init() {
        document.getElementById("imgResult").onload = function() {
            var img = bg.capResult;
            var div = document.getElementById("divImgResult");
            if (img.width < $(div).width()) {
                $("#imgResult").css("width", "auto");
                $("#divImgResult").css("overflow-y", div.clientHeight < div.scrollHeight ? "scroll" : "hidden");
                div.style.zoom = 1.0000001;
                setTimeout(function() {
                    div.style.zoom = 1;
                }, 50);
            } else if (div.clientHeight >= div.scrollHeight) {
                $(div).css("overflow-y", "hidden");
                div.style.zoom = 1.0000001;
                setTimeout(function() {
                    div.style.zoom = 1;
                }, 50);
            }
        };
        $("#imgResult").attr("src", bg.capResultDataURL);
        document.title = bg.capResultFileNameLite;
        initApp();
    }
    init();
});