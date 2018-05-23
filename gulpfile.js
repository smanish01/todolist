var gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('scripts', function () {
    gulp.src('src/index.js')
    .pipe(babel({
        
    }))
    .pipe(gulp.dest('public/assets/js'))

});

gulp.task('watch', function () {
    return gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['scripts']);
});

gulp.task('default', [ 'watch']);