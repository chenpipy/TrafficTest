/**
 * Created by Administrator on 2017/2/22 0022.
 */

    $(document).ready(function() {
        $(document).keydown(function(e) {
            e = e || window.event;
            var keycode = e.which ? e.which : e.keyCode;
            if (keycode == 38) {
                if (jQuery.trim($("#append").html()) == "") {
                    return;
                }
                movePrev();
            } else if (keycode == 40) {
                if (jQuery.trim($("#append").html()) == "") {
                    return;
                }
                $("#kw").blur();
                if ($(".item").hasClass("addbg")) {
                    moveNext();
                } else {
                    //addClass() 方法向被选元素添加一个或多个类名
                    $(".item").removeClass('addbg').eq(0).addClass('addbg');
                }
            } else if (keycode == 13) {
                dojob();
            }
        });
        var movePrev = function() {
            $("#kw").blur();
            //prevAll() 获得当前匹配元素集合中每个元素的前面的同胞元素，使用选择器进行筛选是可选的。
            var index = $(".addbg").prevAll().length;
            if (index == 0) {
                $(".item").removeClass('addbg').eq($(".item").length - 1).addClass('addbg');
            } else {
                //:eq() 选择器选取带有指定 index 值的元素
                $(".item").removeClass('addbg').eq(index - 1).addClass('addbg');
            }
        }
        var moveNext = function() {
            var index = $(".addbg").prevAll().length;
            //item元素的个数
            if (index == $(".item").length - 1) {
                $(".item").removeClass('addbg').eq(0).addClass('addbg');
            } else {
                $(".item").removeClass('addbg').eq(index + 1).addClass('addbg');
            }
        }
        var dojob = function() {
            $("#kw").blur();
            var value = $(".addbg").text();
            $("#kw").val(value);
            $("#append").hide().html("");
        }
    });
function getContent(obj) {
    $.get('../Testlibs/gis_tollgate.json',function (data){
        var kw = jQuery.trim($(obj).val());
        if (kw == "") {
            $("#append").hide().html("");
            return false;
        }
        var html = "";
        for (var i=0;i<data.length;i++) {
            if (data[i].tollgate_name.indexOf(kw)>=0) {
                //onmouseenter 事件在鼠标指针移动到元素上时触发
                html = html + "<li class='item' onmouseenter='getFocus(this)' onClick='getCon(this);' value='i'>" + data[i].tollgate_name + "</li>"
            }
        }
        if (html != "") {
            $("#append").show().html(html);
        } else {
            $("#append").hide().html("");
        }

    })
    /*for (var i = 0; i < Tesedata.length; i++)  {
     if (Tesedata[i].indexOf(kw) >= 0) {
     //onmouseenter 事件在鼠标指针移动到元素上时触发
     html = html + "<div class='item' onmouseenter='getFocus(this)' onClick='getCon(this);'>" + data[i] + "</div>"
     }
     }*/

}

function getFocus(obj) {
    $(".item").removeClass("addbg");
    $(obj).addClass("addbg");
}
function getCon(obj) {
    var value = $(obj).text();
    $("#kw").val(value);
    $("#append").hide().html("");
}
