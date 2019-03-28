chrome.runtime.getBackgroundPage(function(bg) {
    var exports = bg.exports;
    var appStatus = {
        supported: true,
        isNativeSupported: exports.config.ps == 1
    };
    var curTab = null;
    var jtdsCf = {};
    var jtdsHistory = [];
    var pageno = 1;
    var pagesize = 10;
    function getReqParams() {
        return {
            uuid: exports.config.uid,
            pageno: pageno++,
            pagesize: pagesize
        };
    }
    function checkAccessibility(cb) {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function(tabs) {
            try {
                if (tabs.length === 0 || !tabs[0].url) {
                    cb(false);
                    return;
                }
                var tab = tabs[0];
                if (/^(http|https|ftp|ftps|file):\/\/.*/.test(tab.url) && !/^https?:\/\/chrome.google.com\/.*$/.test(tab.url)) {
                    curTab = tab;
                    cb(true);
                } else {
                    cb(false);
                }
            } catch (e) {
                cb(false);
            }
        });
    }
    function getJtdsHistory(self, upload) {
        exports.cache.get("jtdsHistory", function(history) {
            jtdsHistory = history.jtdsHistory;
            if (jtdsHistory) {
                jtdsHistory = jtdsHistory.value || [];
            } else {
                jtdsHistory = [];
            }
            self.jtdsHistory = jtdsHistory;
            if (jtdsCf.autoSynchro !== false && upload) {
                $.ajax({
                    url: "http://www.jietu365.com/jietu/in.htm",
                    type: "post",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        u: exports.config.uid,
                        h: jtdsHistory
                    })
                });
            }
        });
    }
    function initApp() {
        var vm = new Vue({
            el: "#app",
            data: {
                appStatus: appStatus,
                actionClass: "",
                actionMode: 0,
                appView: "tools",
                autoSynchro: jtdsCf.autoSynchro !== false,
                jtdsHistory: null,
                getHistorysFlag: false,
                delFlag: false,
                synchroFlag: false
            },
            mounted: function mounted() {
                var self = this;
                if (!this.appStatus.supported) {
                    this.messageObj = this.$message({
                        message: "该网页受到保护，不允许截图哦",
                        type: "error",
                        duration: "0"
                    });
                } else if (appStatus.isNativeSupported) {
                    $(".jtds-btn").hover(function(e) {
                        if (!self.actionClass) {
                            self.actionClass = $(this).attr("actions");
                            self.actionMode = +$(this).attr("mode");
                        }
                    }, function(e) {
                        if (!$(e.toElement).parents(".actions").length) {
                            self.actionClass = "";
                        }
                    });
                    $(".actions").hover(function(e) {}, function(e) {
                        if (!$(e.toElement).parents(".jtds-btn").length) {
                            self.actionClass = "";
                        }
                    });
                }
            },
            methods: {
                capture: function capture(mode) {
                    if (this.appStatus.supported) {
                        window.close();
                        exports.fsBg.executeGrabber(cActionEdit, mode);
                    }
                },
                captureExt: function captureExt(cAction) {
                    if (this.appStatus.supported) {
                        window.close();
                        if (this.actionMode == 3) {
                            if (curTab) {
                                chrome.tabs.update(curTab.id, {
                                    active: true
                                }, function() {
                                    exports.ct.gcfc({
                                        action: "getPicture",
                                        param: cAction
                                    });
                                });
                            }
                        } else {
                            exports.fsBg.executeGrabber(cAction, this.actionMode);
                        }
                    }
                },
                startClt: function startClt() {
                    if (appStatus.isNativeSupported) {
                        exports.ct.gcfc("startClt");
                        window.close();
                    }
                },
                downloadExe: function downloadExe() {
                    this.messageObj = this.$message({
                        message: "暂未开放下载，敬请期待",
                        type: "warning"
                    });
                },
                openOption: function openOption() {
                    exports.fsBg.openOptionPage();
                },
                changeView: function changeView(view) {
                    var self = this;
                    if (this.messageObj) this.messageObj.close();
                    this.appView = view;
                    if (!this.jtdsHistory) {
                        if (jtdsCf.autoSynchro === false) {
                            getJtdsHistory(this);
                        } else {
                            var firstPullTime = window.localStorage.getItem("firstPullTime");
                            var now = new Date().getTime();
                            if (!firstPullTime || firstPullTime - now > 24 * 60 * 60 * 1e3) {
                                window.localStorage.setItem("firstPullTime", now);
                                self.synchro();
                            } else {
                                getJtdsHistory(self);
                            }
                        }
                    }
                },
                synchro: function synchro() {
                    if (this.synchroFlag) return;
                    this.synchroFlag = true;
                    var self = this;
                    $.ajax({
                        url: "http://www.jietu365.com/jietu/history.htm",
                        data: getReqParams(),
                        success: function success(data) {
                            $(".txt-refresh").text("同步成功");
                            setTimeout(function() {
                                self.synchroFlag = false;
                                $(".txt-refresh").text("从云端同步");
                            }, 9e4);
                            if (data && data.length) {
                                jtdsHistory = data;
                                exports.cache.set("jtdsHistory", jtdsHistory);
                                self.jtdsHistory = data;
                            } else {
                                getJtdsHistory(self, true);
                            }
                        },
                        error: function error(e) {
                            $(".txt-refresh").text("同步失败，请2分钟后重试");
                            setTimeout(function() {
                                self.synchroFlag = false;
                                $(".txt-refresh").text("从云端同步");
                            }, 9e4);
                            getJtdsHistory(self);
                        }
                    });
                },
                autoSynchroChange: function autoSynchroChange() {
                    if (this.autoSynchro) {
                        this.autoSynchro = jtdsCf.autoSynchro = false;
                    } else {
                        this.synchro();
                        this.autoSynchro = jtdsCf.autoSynchro = true;
                    }
                    exports.cache.set("jtdsCf", jtdsCf);
                },
                historyScroll: function historyScroll() {
                    if (!this.getHistorysFlag && $(".box6").scrollTop() > ($(".box6 .el-row").length - 2) * 61 + 10 - 300) {
                        this.getHistorysFlag = true;
                        this.getHistorys();
                    }
                },
                getHistorys: function getHistorys() {
                    var self = this;
                    $.ajax({
                        url: "http://www.jietu365.com/jietu/history.htm",
                        data: getReqParams(),
                        success: function success(data) {
                            if (data && data.length) {
                                if (data.length == pagesize) self.getHistorysFlag = false;
                                for (var i = 0; i < data.length; i++) {
                                    self.jtdsHistory.push(data[i]);
                                }
                            }
                        },
                        error: function error(e) {}
                    });
                },
                delHistory: function delHistory(historyId) {
                    if (this.delFlag) return;
                    this.delFlag = true;
                    var self = this;
                    if (jtdsCf.autoSynchro !== false) {
                        $.ajax({
                            url: "http://www.jietu365.com/jietu/del.htm",
                            data: {
                                id: historyId
                            },
                            success: function success(data) {
                                self.delFlag = false;
                                if (data && data.s == 1) {
                                    self.delLocal(historyId);
                                } else {
                                    self.messageObj = self.$message({
                                        message: "删除失败",
                                        type: "error",
                                        duration: "1000"
                                    });
                                }
                            },
                            error: function error(e) {
                                self.delFlag = false;
                                self.messageObj = self.$message({
                                    message: "删除失败",
                                    type: "error",
                                    duration: "1000"
                                });
                            }
                        });
                    } else {
                        self.delFlag = false;
                        self.delLocal(historyId);
                    }
                },
                delLocal: function delLocal(historyId) {
                    for (var i = 0; i < this.jtdsHistory.length; i++) {
                        if (this.jtdsHistory[i].id == historyId) {
                            this.jtdsHistory.splice(i, 1);
                            break;
                        }
                    }
                    for (var i = 0; i < jtdsHistory.length; i++) {
                        if (jtdsHistory[i].id == historyId) {
                            jtdsHistory.splice(i, 1);
                            break;
                        }
                    }
                    exports.cache.set("jtdsHistory", jtdsHistory);
                    this.messageObj = this.$message({
                        message: "删除成功",
                        type: "success",
                        duration: "1000"
                    });
                },
                delLocalAll: function delLocalAll() {
                    this.jtdsHistory.splice(0, this.jtdsHistory.length);
                    jtdsHistory = [];
                    exports.cache.set("jtdsHistory", jtdsHistory);
                    this.messageObj = this.$message({
                        message: "删除成功",
                        type: "success",
                        duration: "1000"
                    });
                },
                delAll: function delAll() {
                    if (this.delFlag) return;
                    this.delFlag = true;
                    var self = this;
                    if (jtdsCf.autoSynchro !== false) {
                        $.ajax({
                            url: "http://www.jietu365.com/jietu/del.htm",
                            data: {
                                uuid: exports.config.uid
                            },
                            success: function success(data) {
                                self.delFlag = false;
                                if (data && data.s == 1) {
                                    self.delLocalAll();
                                } else {
                                    self.messageObj = self.$message({
                                        message: "删除失败",
                                        type: "error",
                                        duration: "1000"
                                    });
                                }
                            },
                            error: function error() {
                                self.delFlag = false;
                                self.messageObj = self.$message({
                                    message: "删除失败",
                                    type: "error",
                                    duration: "1000"
                                });
                            }
                        });
                    } else {
                        self.delFlag = false;
                        self.delLocalAll();
                    }
                }
            }
        });
    }
    function init() {
        checkAccessibility(function(supported) {
            appStatus.supported = supported;
            initApp();
        });
    }
    exports.cache.get("jtdsCf", function(config) {
        jtdsCf = config.jtdsCf;
        if (jtdsCf) {
            jtdsCf = jtdsCf.value || {};
        } else {
            jtdsCf = {};
        }
        init();
    });
});