/**
 * Created by Administrator on 2017/3/8.
 */
'use strict'

var gulp=require('gulp');
var browserSync=require('browser-sync').create();
var reload=browserSync.reload;

gulp.task('serve',function() {

    browserSync.init({
        server: "./"
    });
    gulp.watch("./css/*.css").on('change',reload);
    gulp.watch("./*.html").on('change', reload);
});

// scss编译后的css将注入到浏览器里实现更新
/*gulp.task('sass', function() {
    return gulp.src("app/scss/!*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(reload({stream: true}));
});*/
