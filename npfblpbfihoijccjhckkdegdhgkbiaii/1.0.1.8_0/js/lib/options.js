chrome.runtime.getBackgroundPage(function(bg) {
    if (!bg) return;
    var exports = bg.exports;
    var foldPref = "浏览器默认下载路径/" + getOption(cDefaultFolderPref, cDefaultFolderValue) + "/";
    function initApp() {
        var vm = new Vue({
            el: "#app",
            data: {
                foldPref: foldPref,
                chkDoNotShowSaveAsDialog: getOption(cNoFilenamePromptPref, "false") === "true",
                chkOpenFolder: getOption(cOpenFolderAterSavingPref, "false") === "true",
                chkCloseTab: getOption(cCloseTabAfterSaving, "false") === "true"
            },
            mounted: function mounted() {},
            methods: {
                applySet: function applySet(completedCB) {
                    localStorage[cNoFilenamePromptPref] = this.chkDoNotShowSaveAsDialog;
                    localStorage[cOpenFolderAterSavingPref] = this.chkOpenFolder;
                    localStorage[cCloseTabAfterSaving] = this.chkCloseTab;
                    console.log(this.chkCloseTab);
                    if (completedCB) completedCB();
                },
                saveAndClose: function saveAndClose() {
                    this.applySet(function() {
                        window.close();
                    });
                }
            }
        });
    }
    function init() {
        if (exports.config.ps == 1) {
            exports.ct.gcfc("getPicPath", function(data) {
                if (data) {
                    $("body").addClass("client");
                    foldPref = data;
                }
                initApp();
            });
        } else {
            initApp();
        }
    }
    init();
});