exports.fsBg = function(S) {
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
    var currentTab, currentFrameId, imgData = [];
    var pendingCapFunction, capCallbackCompleted;
    var commPortName = "jtdsPort#" + Math.ceil(Math.random() * 45309714203);
    var capId = 0, processedId = 0;
    var executeScriptTO;
    var guiItemsLocked = false;
    function lockItems() {
        guiItemsLocked = true;
    }
    function unlockItems() {
        guiItemsLocked = false;
    }
    function capturePage(Action, Mode, Data, CallbackCompleted, tab, frameId) {
        if (executeScriptTO !== undefined) {
            clearTimeout(executeScriptTO);
            executeScriptTO = undefined;
        }
        capId++;
        currentTab = tab;
        currentFrameId = frameId;
        capCallbackCompleted = CallbackCompleted;
        pendingCapFunction = function pendingCapFunction() {
            doCapturing(Action, Mode, Data, CallbackCompleted);
        };
        if (Mode == cModeBrowser && tab.url !== undefined && tab.title !== undefined) {
            setTimeout(function() {
                lockItems();
                pluginCommand("captureBrowser", {
                    action: Action + ":-",
                    url: tab.url,
                    title: tab.title
                });
                unlockItems();
                if (capCallbackCompleted) capCallbackCompleted();
            }, 100);
        } else {
            executeScriptTO = setTimeout(function() {
                pendingCapFunction();
            }, 1e3);
        }
    }
    function doCapturing(Action, Mode, Data, CallbackCompleted) {
        function getEmulationWidth(resultCB) {
            chrome.tabs.captureVisibleTab(currentTab.windowId, {
                format: "jpeg"
            }, function(data) {
                var width = -1, height = -1;
                if (!chrome.runtime.lastError) {
                    try {
                        var extents = getJpegExtents(data);
                        width = extents[0];
                        height = extents[1];
                    } catch (e) {}
                }
                resultCB(width, height);
            });
        }
        if (capId <= processedId++) {
            capId = processedId;
            return;
        }
        try {
            port = chrome.tabs.connect(currentTab.id, {
                name: commPortName,
                frameId: currentFrameId
            });
            var isEmulation = false, connecting = true;
            port.postMessage({
                topic: "init",
                mode: Mode,
                options: localStorage,
                p: localStorage[cPluginProModePref] == "true",
                native: false,
                frameMode: currentFrameId > 0
            });
            port.onMessage.addListener(function(msg) {
                switch (msg.topic) {
                  case "initAborted":
                    if (CallbackCompleted) CallbackCompleted();
                    return;
                    break;

                  case "initDone":
                    tabURL = msg.url;
                    tabTitle = msg.title;
                    connecting = false;
                    switch (Mode) {
                      case cModeVisible:
                      case cModeEntire:
                        getEmulationWidth(function(width, height) {
                            var ratioW = closestToInt(width / msg.cw);
                            var ratioH = closestToInt(height / msg.ch);
                            isEmulation = true;
                            pluginCommand("captureInit");
                            port.postMessage({
                                topic: "setRatio",
                                ratioW: ratioW,
                                ratioH: ratioH
                            });
                            port.postMessage({
                                topic: "scrollNext"
                            });
                        });
                        break;

                      case cModeSelected:
                        getEmulationWidth(function(width, height) {
                            var ratioW = closestToInt(width / msg.cw);
                            var ratioH = closestToInt(height / msg.ch);
                            isEmulation = true;
                            pluginCommand("captureInit");
                            port.postMessage({
                                topic: "setRatio",
                                ratioW: ratioW,
                                ratioH: ratioH
                            });
                            port.postMessage({
                                topic: "selectArea"
                            });
                        });
                        break;

                      case cModeBrowser:
                        lockItems();
                        pluginCommand("captureBrowser", {
                            action: Action + ":-",
                            url: tabURL,
                            title: tabTitle
                        });
                        unlockItems();
                        break;
                    }
                    break;

                  case "areaSelected":
                    port.postMessage({
                        topic: "scrollNext"
                    });
                    break;

                  case "areaSelectionCanceled":
                    port.onMessage.removeListener(arguments.callee);
                    break;

                  case "scrollDone":
                    chrome.tabs.captureVisibleTab(currentTab.windowId, {
                        format: "png"
                    }, function(data) {
                        if (!chrome.runtime.lastError) {
                            pluginCommand("captureTabPNG", {
                                dataurl: data,
                                datasize: data.length,
                                x: msg.x,
                                y: msg.y
                            });
                        }
                        port.postMessage({
                            topic: "scrollNext"
                        });
                    });
                    break;

                  case "scrollFinished":
                    msg.url = tabURL;
                    msg.title = tabTitle;
                    msg.key = "-";
                    msg.action = Action;
                    msg.browserVersion = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
                    msg.usrData = Data;
                    pendingResponse = function(_pendingResponse) {
                        function pendingResponse(_x) {
                            return _pendingResponse.apply(this, arguments);
                        }
                        pendingResponse.toString = function() {
                            return _pendingResponse.toString();
                        };
                        return pendingResponse;
                    }(function(base64Data) {
                        pendingResponse = undefined;
                        port.postMessage({
                            topic: "sendJTDSCompleteEvent",
                            data: base64Data
                        });
                    });
                    lockItems();
                    pluginCommand("captureDone", msg);
                    unlockItems();
                    port.onMessage.removeListener(arguments.callee);
                    if (CallbackCompleted) CallbackCompleted(true);
                    break;
                }
            });
            port.onDisconnect.addListener(function() {
                if (connecting) {
                    if (CallbackCompleted) {
                        CallbackCompleted(false);
                    }
                }
            });
        } catch (e) {
            if (CallbackCompleted) {
                CallbackCompleted(false);
            }
        }
    }
    function initMessaging() {
        try {
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                switch (request.message) {
                  case "getPortName":
                    sendResponse({
                        portName: commPortName
                    });
                    break;

                  case "checkFSAvailabilityEvt":
                    {
                        console.log("checkFSAvailabilityEvt");
                        sendResponse({
                            FSAvailable: true,
                            FSNative: isNativeSupported(),
                            FSUpgraded: localStorage[cPluginProModePref] === "true"
                        });
                        return true;
                    }

                  case "getScreenshotsForGmail":
                    {
                        sendResponse(pendingGMailJSON);
                        return true;
                    }

                  case "switchToNativeEvt":
                    {
                        installNative();
                        break;
                    }

                  case "setOption":
                    {
                        localStorage[request.optionName] = request.optionValue;
                        break;
                    }
                }
            });
        } catch (e) {}
    }
    initMessaging();
    return {
        executeGrabber: function executeGrabber(action, mode, data, callback, frameId) {
            frameId = frameId || 0;
            if (guiItemsLocked) return;
            chrome.tabs.query({
                currentWindow: true,
                active: true
            }, function(tabs) {
                if (tabs.length > 0) capturePage(action, mode, data, callback, tabs[0], frameId);
            });
        },
        openOptionPage: function openOptionPage() {
            chrome.tabs.create({
                url: "options.html"
            });
        }
    };
}(exports);