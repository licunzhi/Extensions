"use strict";

/**
 * 接口参数的操作工具
 */

var thisRequest;
function Request(activeTab) {

    thisRequest = this;
    this.activeTab = activeTab;
    this.method = activeTab.find('.ext-method input').val().trim().toLowerCase();
    this.bodyType = activeTab.find('.ext-body-type').find('input').val().trim();
    this.rawContentType = activeTab.find('.ext-raw-content-type').find('input').val().trim();
    this.isPost = isPostType(this.method);
    this.url = this.getUrl();
}

Request.prototype.isPostType = function () {
    return this.isPost;
};

Request.prototype.getMethod = function () {
    return this.method;
};
Request.prototype.getRawContentType = function () {
    return this.rawContentType;
};

Request.prototype.getBodyType = function () {
    return this.bodyType;
};

Request.prototype.getUrl = function () {
    
    this.url = this.activeTab.find('.ext-url').children('input').val().trim();
    this.url = this.renderEnv(this.url); // 绑定环境变量
    this.renderUrl(); // 绑定 queryParams

    var urlLower = this.url.toLowerCase()
    if(urlLower.startsWith('http://')||urlLower.startsWith('https://')) {}else{
        this.url = 'http://'+ this.url
    }
    
    return this.url;
};

// 获取请求中的 ProcessData
Request.prototype.getProcessData = function () {
    
    if(this.isPost && this.bodyType=='form-data'){
        return false;
    }
    return null;
};

// 请求中 content-type
Request.prototype.getContentType = function () {
    
    // 只有form-data处理为false,其他都为空
    
    if(this.isPost){
        if(this.bodyType == 'raw'){
           var ct = getContentType(this.rawContentType);
           return ct;
        }else if(this.bodyType=='form-data'){
            return false;
        }else if(this.bodyType=='x-www-form-urlencoded'){
            return null;
        }
    }else{
        return null;
    }
};

Request.prototype.getData = function () {

    if(this.isPost){
        if(this.bodyType == 'raw'){
            return this.getBodyRaw();
        }else if(this.bodyType=='form-data'){
            return this.getBodyParams();
        }else if(this.bodyType=='x-www-form-urlencoded'){
            return this.getBodyParams();
        }
        
    }else{
        return null;
    }
};

Request.prototype.getHeaders = function () {

    var paramTable = this.activeTab.find('.ext-header-params .dragArea');
    var lines = paramTable.children();
    var params = {};

    $.each(lines, function (i, line) {
        
        line = $(line);

        var key = AForm.getValue(line, 'key')
        key = thisRequest.renderEnv(key);
        
        var checked = AForm.getValue(line, 'checked');
        if(key==''||isNULL(checked)) return true;
        
        var value = AForm.getValue(line, 'value');
        value = thisRequest.renderEnv(value);
        params[key] = value;
    });
    
    if($.isEmptyObject(params)) {
        return null;
    }else {
        return params;
    }
};

Request.prototype.getQueryParams = function () {
    
    var paramTable = this.activeTab.find('.ext-query-params .dragArea');
    var lines = paramTable.children();
    
    var params = [];
    $.each(lines, function (i, line) {
        
        line = $(line);
        var checked = AForm.getValue(line, 'checked');
        
        var key = AForm.getValue(line, 'key');
        key = thisRequest.renderEnv(key);
        
        if(key==''||isNULL(checked)) return true;
        
        var value = AForm.getValue(line, 'value');
        value = thisRequest.renderEnv(value);
        
        params.push({key:key,value:value});
    });

    return params;
};

Request.prototype.getBodyParams = function () {
    
    var paramTable = this.activeTab.find('.ext-body-params .dragArea');
    var lines = paramTable.children();
    
    var params = [];
    $.each(lines, function (i, line) {
        
        line = $(line);
        var key = thisRequest.renderEnv(AForm.getValue(line, 'key'));
        var checked = AForm.getValue(line, 'checked');
        var value = AForm.getValue(line, 'value');

        if(key==''||isNULL(checked)) return true;
        
        if(thisRequest.bodyType == 'form-data'){
            
            var rtype = AForm.getValue(line,'rtype');
            
            if(rtype.toUpperCase()=='FILE'){
                
                var file = AForm.getValue(line,'file');
                if(isNULL(file.data)) return true;

                params.push({
                    key:key,
                    value:file.data,
                    rtype:"FILE",
                    filename:file.name
                });
                
            }else{
                value = thisRequest.renderEnv(value);
                params.push({key:key, value:value,rtype:"TEXT"});
            }
            
        }else {
            value = thisRequest.renderEnv(value);
            params.push({key:key, value:value,rtype:"TEXT"});
        }
    });
    
    return params;
};

Request.prototype.getBodyRaw = function () {
    
    var textarea = this.activeTab.find('.ext-body-raw').find('textarea.hide');
    var v = textarea.val();
    v = this.renderEnv(v);
    
    if(isNULL(v)){
        return '';
    }else{
        return v;
    }
};

// 渲染环境变量
Request.prototype.renderEnv = function(str){

    if((typeof str)!='string'){
        return str;
    }
    
    var json = $('.ext-choose-env').attr('choose-env-json');
    
    if(isNULL(json)){
        return str;
    }
    
    var params = $.parseJSON(json);
    for(var i=0;i<params.length;i++){
        var tt = params[i];
        var key = "{{"+tt.key+"}}";
        var value= tt.value;
        str = str.replace(new RegExp(key,'g'),value);
    }
    return str;
};
    
// :id => 替换到url值,将get参数赋值到url上
Request.prototype.renderUrl = function(){

    var queryParams = this.getQueryParams();
    for(var i=0;i<queryParams.length;i++){
        
        var qp = queryParams[i];
        var key = qp.key;
        var value = qp.value;
        
        var rkey = ":"+key;
        var exp = new RegExp(rkey,'g');

        if(this.url.contains(rkey)){
            this.url = this.url.replace(exp,value);
        }else{
            this.addOrReplaceGetParam(key,value);
        }
    }
}

// 添加或者更新参数
Request.prototype.addOrReplaceGetParam = function(param, value) {
    
    param = encodeURIComponent(param);
    var r = "([&?]|&amp;)" + param + "\\b(?:=(?:[^&#]*))*";
    var a = document.createElement('a');
    var regex = new RegExp(r);
    var str = param + (value ? "=" + encodeURIComponent(value) : "");
    a.href = this.url;
    var q = a.search.replace(regex, "$1"+str);
    if (q === a.search) {
        a.search += (a.search ? "&" : "") + str;
    } else {
        a.search = q;
    }
    
    this.url = a.href;
    return decodeURIComponent(a.href);
}