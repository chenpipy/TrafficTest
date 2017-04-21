/**
 * Created by Administrator on 2017/3/8.
 */
'use strict'

var gulp=require('gulp');
var browserSync=require('browser-sync').create();
var reload=browserSync.reload;

gulp.task('serve',function() {

    browserSync.init({
        server: {
            baseDir:"./"
        }
    });
    //监视trafficText
    gulp.watch("./*.css").on('change',reload);
    gulp.watch("./sixmap/traffic/*.html").on('change', reload);
    gulp.watch("./sixmap/libs/olMap/*.js").on('change',reload);
    gulp.watch("./sixmap/libs/js/*.js").on('change',reload)
    gulp.watch("./sixmap/Test/*.html").on('change', reload);
    //监视vue
    gulp.watch("./vue-test/vueProject/*.html").on('change', reload);
    gulp.watch("./geoserver/geoserver-project/*.html").on('change', reload);
});

// scss编译后的css将注入到浏览器里实现更新
/*gulp.task('sass', function() {
    return gulp.src("app/scss/!*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(reload({stream: true}));
});*/

gulp.task('default', ['serve']);