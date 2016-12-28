var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// Static Server
gulp.task('serve', function() {
    browserSync.init({
        server: "."
    });
    gulp.watch("*.html").on("change", reload);
});

gulp.task('server', ['serve']);
gulp.task('dev', ['watch']);