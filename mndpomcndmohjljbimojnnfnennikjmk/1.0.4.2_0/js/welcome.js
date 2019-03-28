
$(function(){
    
    setTimeout(function(){
        var urlArr = ['连衣裙', '女包', '皮鞋'];
        var random = parseInt(Math.random()*3); 
        $('.dzt_go').attr('href','https://s.taobao.com/search?q=' + urlArr[random]);
    },200);
    var bg = chrome.runtime.connect({name: "welcome"});
    chrome.runtime.sendMessage({});
})
