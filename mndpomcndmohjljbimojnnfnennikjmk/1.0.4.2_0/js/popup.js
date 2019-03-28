$(function(){
    $('body').find('#dzt_official_wx').hover(function(){
        $(this).find('#dzt_official_tdc').css('display','block');
    },function(){
        $(this).find('#dzt_official_tdc').css('display','none');
    })
    $("#current_version .ver_num").text(chrome.runtime.getManifest().version);
    $.get('https://ssl.dianzhentan.com/api/version',function(data){
        if(intVersion(chrome.runtime.getManifest().version) < intVersion(data.v)){
            $("#current_version").append('<a class="update_link" href="' + data.link + '" target="_blank">' + data.desc + '</a>');
        }
    });
    var userid = localStorage.getItem('DZT_SELLER_ID');
    var level = '';
    if (userid) level = getStorage(userid);
    if (!level) level = '0';
    $.get('https://ssl.dianzhentan.com/api/4.0/v2/popup', {'l': level}, function (data) {
        // 根据不同卖家等级返回不同菜单内容
        var data = data.data;
        var level = data.l;
        $('.search-box form').attr('action', data.search_box[2]).find('.search-btn').text(data.search_box[0]).end()
                                                                .find('.user-input').attr('placeholder', data.search_box[1]);
        $('.search-box .user-input').change(function(){
            var itemid = get_item_id($(this).val());
            if (itemid) {
                if (level == '3') {
                    $('.search-box .itemid').val(itemid);
                } else {
                    $(this).parent('.search-box form').attr('action', data.search_box[2] + itemid);
                }
            }
        })
        $('.dzt-ext-menu.level' + level).addClass('show').siblings('.dzt-ext-menu').removeClass('show');
        if(data){
            if (data.err_alert){
                $('.kds_news a').html('<span class="dzt-ci-hover dzt-class-link">故障紧急修复中!请稍后使用</span>').attr('href', 'javascript:void(0)');
            }else{
                if (data.kds_news) {
                    $('.kds_news').find('.icon').css('background-image', 'url('+ data.kds_news[2] +')').end().find('a').text(data.kds_news[0]).attr('href', data.kds_news[1]);
                } else {
                    $('.kds_news').css('display', 'none');
                }
            }
            $('.privacypolicy a').text(data.privacypolicy[0]).attr('href', data.privacypolicy[1]);
            $('.dzt_official_wx1 .dzt_official_tdc').find('img').attr({'src': data.qr_code[0][1]}).end().find('.dzt_qr_title').text(data.qr_code[0][0]);
            $('.dzt_official_wx2 .dzt_official_tdc').find('img').attr({'src': data.qr_code[1][1]}).end().find('.dzt_qr_title').text(data.qr_code[1][0]);
            
            if (level == '0') {
                data.level0_body.forEach(function(item){
                    var template = built_template1_html(item);
                    $('.level0 .xds').before(template);
                })
            } else if (level == '1' || level == '3') {
                data.level1_3_body.forEach(function(item){
                    var template = built_template2_html(item);
                    $('.level' + level).find('.dzt-ext-menu-body').append(template);
                })
            } else if (level == '2') {
                data.level2_body.forEach(function(item){
                    var template = built_template3_html(item);
                    $('.level' + level).find('.dzt-ext-menu-body ul').append(template);
                })
                $('.xds').find('.menu_img').css('background', 'url(' + data.xds.icon + ')').end()
                         .find('.url-list b.title').text(data.xds.title);
                data.xds.content.forEach(function(item){
                    $('.xds .url-list span.course').append('<a href="' + item[1] + '" target="_blank">' + item[0] + '</a>');
                })
            }
        }
    })

    $.get('https://ssl.dianzhentan.com/api/4.0/v2/course/', {'icon': 1}, function (data) {
        var course_info = data.data;
        $('.xds .menu_img').css('background-image', 'url(' + data.icon + ')');
        var stick_course = course_info[1];
        if (stick_course) {
            // 是否有需要置顶课程
            var storage = window.localStorage;
            var dzt_key = s(stick_course.image_url);
            var flag = storage.getItem(dzt_key) != undefined ? storage.getItem(dzt_key) : 1;
            if (parseInt(stick_course.top_num) > parseInt(flag)) {
                var show_course = stick_course;
                storage.setItem(dzt_key, parseInt(flag) + 1);
            } else {
                var show_course = course_info[0];
            }
        } else {
            var show_course = course_info[0];
        }
        var jump_url = show_course.jump_url;
        var class_title = show_course.title;
        $('.class-preview').attr('title', class_title).find('a.text-over').attr('href', jump_url).text(class_title);
    })
})

function built_template1_html (data) {
    var template = $('.html-template1').find('.template-body-li').clone();
    template.find('.menu_img').css('background-image', 'url(' + data.icon + ')');
    template.find('.domain').attr('href', data.domain);
    data.content.forEach(function(item){
        template.find('.url-list').append('<a href="' + item[1] + '" target="_blank">' + item[0] + '</a>');
    })
    return template;
}

function built_template2_html (data) {
    var template = $('.html-template2').find('.template-body-div').clone();
    template.find('.menu_img').css('background-image', 'url(' + data.icon + ')');
    template.find('a.level').attr('href', data.content[2] );
    template.find('.url-list b span.text').text(data.content[0]);
    template.find('.url-list span.sub-tit').text(data.content[1]);
    if (data.hot) {
        template.find('b').addClass('hot');
    }
    return template;
}

function built_template3_html (data) {
    var template = $('.html-template3').find('.template-body-li').clone();
    template.find('.icon-img').attr('src', data.icon);
    template.find('.title').text(data.content[0]);
    template.find('a').attr('href', data.content[1]);
    return template;
}

function intVersion(str){
	return parseInt(str.replace(/\./ig,''));
}





