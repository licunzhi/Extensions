"use strict";
var AceUtils= {
    
	// 加载编辑器...
    loadEditor:function(id,content,model){

        var idf = $("#"+id);
        if(isNULL(idf.length)) return;
        
        if(isNULL(content)){
            content="";
        }

        if(isNULL(model)==true){
            model="json";
        }

        var editor = ace.edit(id);
        editor.setTheme("ace/theme/eclipse");
        editor.session.setMode("ace/mode/"+model);
        editor.setOption("maxLines", 100);
        editor.setOption("minLines", 10);
        editor.setOption("showPrintMargin", false);
        editor.$blockScrolling = Infinity;
        
        //同步内容
        var textareaHidden = idf.next("textarea.hidden");
        editor.on("change", function(){
            var con= editor.getValue();
            if(textareaHidden.length!=0){
                textareaHidden.text(con);
            }
        });
        
        editor.insert(content);
        return editor;
    },


    // 加载编辑器...
    loadAdvancedEditor:function(id,opt){
        
        var idf = $("#"+id);
        if(isNULL(idf)) return;

        if(isNULL(opt)){
            opt={};
        }

        if(isNULL(opt.content)){
            opt.content="";
        }
        if(isNULL(opt.model)){
            opt.model="json";
        }

        if(isNULL(opt.model)){
            opt.model="json";
        }

        opt.minLines = (isNULL(opt.minLines)==true)?10:opt.minLines;
        opt.maxLines = (isNULL(opt.maxLines)==true)?100:opt.maxLines;
        opt.content = (isNULL(opt.content)==true)?"":opt.content;
        opt.readonly = (isNULL(opt.readonly)==true)?false:opt.readonly;

        var editor = ace.edit(id);
        editor.setTheme("ace/theme/eclipse");
        editor.session.setMode("ace/mode/"+opt.model);
        editor.setOption("maxLines", opt.maxLines);
        editor.setOption("minLines", opt.minLines);
        editor.setOption("highlightActiveLine", false);
        editor.setOption("highlightGutterLine", false);
        editor.setOption("showPrintMargin", false);
        editor.setReadOnly(opt.readonly);
        editor.renderer.$cursorLayer.element.style.display = "none";


        editor.$blockScrolling = Infinity;
        
        //同步内容
        var textareaHidden = idf.next("textarea.hidden");
        editor.on("change", function(){
            var con= editor.getValue();
            if(textareaHidden.length!=0){
                textareaHidden.text(con);
            }
        });
        editor.insert(opt.content);
        return editor;
    },


    insertPosition:function(id,content){
        var editor = ace.edit(id);
        editor.session.insert(editor.getCursorPosition(), content);
    },

    getContent:function(id){
        var editor = ace.edit(id);
        var t = editor.getValue();
        return t;
    },

    setMode:function(id,m){
        var editor = ace.edit(id);
        editor.session.setMode("ace/mode/"+m);
        return editor;
    },

    setContent:function(id,content){
        var editor = ace.edit(id);
        editor.session.setValue(content);
    },

    setModeByContentType:function(id,type){
        var mode = AceUtils.getModeByContentType(type);
        AceUtils.setMode(id,mode);
    },

    getModeByContentType:function(type){

        if(isNULL(type)){
            return 'json';
        }

        if(type.contains("json")){
            return 'json';
        }else if(type.contains("xml")){
            return 'xml';
        }else if(type.contains("html")){
            return 'html';
        }else if(type.contains("script")){
            return 'javascript';
        }else{
            return 'text';
        }
    },

    fomartContent:function(id){
        var content = AceUtils.getContent(id);
        if(isNULL(content)){
            return;
        }
        var type = StringUtils.checkFormat(content);
        var beauty = "";
        if(type=='json'){
            beauty = StringUtils.jsonFormat(content);
            AceUtils.setMode(id,'json');
            AceUtils.setContent(id,beauty);
        }else if(type=='xml'){
            AceUtils.setMode(id,'xml');
            content = StringUtils.xmlCompress(content);
            beauty = StringUtils.xmlFormat(content);
            AceUtils.setContent(id,beauty);
        }else{
            //AceUtils.setMode(id,'xml');
        }
    }
};