var cActionEdit = 0;

var _cActionEdit = 21;

var _cActionPrint = 22;

var _cActionSavePng = 23;

var _cActionSaveJpg = 24;

var _cActionSavePdf = 25;

var cModeVisible = 0;

var cModeEntire = 1;

var cModeSelected = 2;

var cModeBrowser = 3;

var cPluginProModePref = "pluginProMode";

var cRegisteredPref = "registeredMode";

var cFirstTimeRun = "firstTimeRunFlag";

var cCurrentVersion = "curVersion";

var cTemplatePref = "filenameTemplate";

var cTemplateNumberPref = "filenameNumber";

var cTemplateNumberPadCheckPref = "filenameNumberPadCheck";

var cTemplateNumberPadValuePref = "filenameNumberPadValue";

var cContextMenuIntegrationPref = "contextMenuIntegration";

var cDefaultFolderPref = "defaultFolderLite";

var cDefaultFolderValue = "JTDS";

var cOpenFolderAterSavingPref = "openFolderAfterSavingLite";

var cNoFilenamePromptPref = "noFilenamePrompt";

var cCloseTabAfterSaving = "closeTabAfterSavingLite";

var cTemplateFilenameMaxLen = "filenameMaxLen";

var cDefaultTemplate = "截图大师 Capture %n - %t - %u";

function getJpegExtents(image) {
    var width, height;
    if (image.substring(0, 23) === "data:image/jpeg;base64,") {
        image = atob(image.replace("data:image/jpeg;base64,", ""));
    }
    if (!image.charCodeAt(0) === 255 || !image.charCodeAt(1) === 216 || !image.charCodeAt(2) === 255 || !image.charCodeAt(3) === 224 || !image.charCodeAt(6) === "J".charCodeAt(0) || !image.charCodeAt(7) === "F".charCodeAt(0) || !image.charCodeAt(8) === "I".charCodeAt(0) || !image.charCodeAt(9) === "F".charCodeAt(0) || !image.charCodeAt(10) === 0) {
        throw new Error("getJpegSize requires a binary jpeg file");
    }
    var blockLength = image.charCodeAt(4) * 256 + image.charCodeAt(5);
    var i = 4, len = image.length;
    while (i < len) {
        i += blockLength;
        if (image.charCodeAt(i) !== 255) {
            throw new Error("getJpegSize could not find the size of the image");
        }
        if (image.charCodeAt(i + 1) === 192) {
            height = image.charCodeAt(i + 5) * 256 + image.charCodeAt(i + 6);
            width = image.charCodeAt(i + 7) * 256 + image.charCodeAt(i + 8);
            return [ width, height ];
        } else {
            i += 2;
            blockLength = image.charCodeAt(i) * 256 + image.charCodeAt(i + 1);
        }
    }
}

function isNativeSupported() {
    return false;
}

function getOption(optionName, defaultValue) {
    var val = localStorage[optionName];
    if (val == undefined) return defaultValue; else return val;
}

function getPlugin() {
    return isNativeSupported() ? null : getJSPlugin();
}

function closestToInt(value) {
    if (Math.abs(value - Math.floor(value)) < .009) value = Math.floor(value);
    return value;
}

function pluginCommand(cmd, param1) {
    try {
        var obj = param1 ? param1 : {}, plugin = getPlugin();
        obj.JSONCommand = cmd;
        return isNativeSupported() ? plugin.launchJSON(obj) : plugin.launchFunction(cmd, obj);
    } catch (e) {
        return false;
    }
}

function getExtension() {
    return chrome.extension.getBackgroundPage();
}

function isWindows() {
    return navigator.appVersion.indexOf("Win") != -1;
}

function addDownloadsPermission(callbackSuccess, callbackFail) {
    chrome.permissions.contains({
        permissions: [ "downloads" ]
    }, function(result) {
        if (result) {
            callbackSuccess();
        } else {
            chrome.permissions.request({
                permissions: [ "downloads" ]
            }, function(granted) {
                console.log(chrome.runtime.lastError);
                if (granted) {
                    callbackSuccess();
                } else {
                    console.log("未授权，无法下载");
                    if (callbackFail) callbackFail();
                }
            });
        }
    });
}

function getFilenameLite() {
    function padString(str, padString, length) {
        str = str.toString();
        while (str.length < length) {
            str = padString + str;
        }
        return str;
    }
    var maxLen = getOption(cTemplateFilenameMaxLen, 100), i = 0;
    do {
        var template = getOption(cTemplatePref, cDefaultTemplate), d = new Date(), n = getOption(cTemplateNumberPref, 1);
        var url = getExtension().tabURL, title = getExtension().tabTitle;
        template = template.replace("%n", getOption(cTemplateNumberPadCheckPref, true) === "true" ? padString(n, 0, getOption(cTemplateNumberPadValuePref, 3)) : n);
        template = template.replace("%y", d.getFullYear());
        template = template.replace("%m", padString(d.getMonth() + 1, 0, 2));
        template = template.replace("%d", padString(d.getDate(), 0, 2));
        template = template.replace("%H", padString(d.getHours(), 0, 2));
        template = template.replace("%M", padString(d.getMinutes(), 0, 2));
        template = template.replace("%S", padString(d.getSeconds(), 0, 2));
        if (i == 1) url = url.substr(0, Math.max(14, maxLen - template.length + 1)); else if (i == 2) {
            url = url.replace(/(.*)\?.*/gi, "$1");
            template = template.replace("%u", url);
            title = title.substr(0, Math.max(14, maxLen - template.length + 1)) + "_";
        } else if (i == 3) {
            url = url.substr(0, (maxLen - template.length) / 2 - 1);
            template = template.replace("%u", url);
            title = title.substr(0, maxLen - template.length - 1) + "_";
        }
        template = template.replace("%u", url);
        template = template.replace("%t", title);
        template = template.replace(/[:\/\\\*\?"]/g, "_");
        template = template.replace("<", "{");
        template = template.replace(">", "}");
        template = template.replace("|", "I");
    } while (++i < 4 && template.length > maxLen);
    if (template == "") template = "Untitled";
    localStorage[cTemplateNumberPref] = parseInt(n) + 1;
    return template;
}