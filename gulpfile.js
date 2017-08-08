var gulp         = require('gulp'),
    connect      = require('gulp-connect'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    fileinclude  = require('gulp-file-include'),
    minify       = require('gulp-minify'),
    imageop      = require('gulp-image-optimization'),
    plumber      = require('gulp-plumber'),
    prettify     = require('gulp-prettify'),
    contentsCSS  = require('contentsCSS/css-contents.js');

/* Server */

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

/* HTML files */

gulp.task('html', function () {
    gulp.src(['html/*.html', '!html/_*.html'])
        .pipe(plumber())
        .pipe(fileinclude({
            context: {
                'page': '',
                'title': ''
            }
        }
        ))
        .pipe(prettify({
            indent_size: 3,
            indent_inner_html: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

/* Sass files (sass() + autoprefix()) */

gulp.task('sass', function() {
    gulp.src("scss/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions','ie 9'],
            cascade: false
        }))
        .pipe(contentsCSS())
        .pipe(gulp.dest("css"))
        .pipe(connect.reload());
});

/* Image Optimization */

gulp.task('images', function(cb) {
    gulp.src(['images/demo/*.*']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('images/demo-optimized')).on('end', cb).on('error', cb);
});

/* Watch files */

gulp.task('watch', function () {
    gulp.watch(['html/*.html'], ['html']);
    gulp.watch(['scss/**/*.scss'], ['sass']);
});

/* Default function */

gulp.task('default', ['connect', 'watch']);