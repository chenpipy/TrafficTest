/**
 * Created by Administrator on 2017/2/7 0007.
 */
/*左侧下拉菜单控制*/
$(".leftsidebar_box dt img").attr("src","images/left/select_x101.png");
$(function(){
    $(".leftsidebar_box dd").hide();
   /* find() 方法返回被选元素的后代元素。后代是子、孙、曾孙，依此类推。*/
    /*$(".first_dt img").parent().find('dd').show();*/
    $(".first_dt img").attr("src", "images/left/select_xl.png"); //当前焦点一级菜单项图标
    $(".first_dt").css({ "background-color": "#1f6b75" }); // 焦点一级菜单项的样式
})
$(".leftsidebar_box dt").click(function () {
    //判断当前一级菜单下的二级菜单项是否隐藏
    if ($(this).parent().find('dd').is(":hidden")) {
        $(this).parent().find('dd').slideToggle(); //滑动方式展开子菜单
        $(this).css({ "background-color": "#1f6b75" }); //焦点一级菜单项背景颜色
        $(this).parent().find('img').attr("src", "images/left/select_xl.png"); //当前焦点一级菜单项图标
    }
    else {
        $(this).parent().find('dd').slideUp(); //滑动方式隐藏子菜单
        $(this).css({ "background-color": "#339999" }); //非焦点一级菜单项背景颜色
        $(this).parent().find('img').attr("src", "images/left/select_xl01.png"); //非焦点一级菜单项图标
    }
});