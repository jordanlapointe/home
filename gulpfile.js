/* Load Dependencies
*************************************************/
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss    = require('gulp-minify-css');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var notify       = require('gulp-notify');
var cache        = require('gulp-cache');
var livereload   = require('gulp-livereload');
var sourcemaps   = require('gulp-sourcemaps');
var del          = require('del');

/* File Locations
*************************************************/
var paths = {
    dist: 'dist/',
    scripts: {
        src:  'src/scripts/**/*',
        dist: 'dist/scripts/',
        app:  'src/scripts/app.js'
    },
    styles: {
        src:  'src/styles/**/*.scss',
        dist: 'dist/styles/'
    },
    images: {
        src:  'src/images/**/*',
        dist: 'dist/images/'
    },
    templates: {
        src:  'src/templates/**/*.html',
        dist: 'dist/'
    }
};

/* Compile order for scripts
*************************************************/
var scriptList = [
    paths.scripts.app
];

/* Task: Styles
*************************************************/
gulp.task('styles', function() {
    return gulp.src(paths.styles.src)
    .pipe(
        sourcemaps.init()
    )
    .pipe(
        sass({
            style: 'expanded'
        })
    )
    .pipe(
        autoprefixer('last 3 version')
    )
    .pipe(
        minifycss()
    )
    .pipe(
        sourcemaps.write(
            '/',
            { sourceMappingURLPrefix: '/assets/styles' }
        )
    )
    .pipe(
        gulp.dest(
            paths.styles.dist
        )
    )
    .pipe(
        livereload()
    )
    .pipe(
        notify({
            message: 'Styles task complete.'
        })
    );
});

/* Task: Scripts
*************************************************/
gulp.task('scripts', function() {
    return gulp.src(scriptList)
    .pipe(
        sourcemaps.init()
    )
    .pipe(
        concat('app.js')
    )
    .pipe(
        uglify()
    )
    .pipe(
        sourcemaps.write(
            '/',
            { sourceMappingURLPrefix: '/assets/scripts' }
        )
    )
    .pipe(
        gulp.dest(paths.scripts.dist)
    )
    .pipe(
        notify({
            message: 'Scripts task complete.'
        })
    );
});

/* Task: Images
*************************************************/
gulp.task('images', function() {
    return gulp.src(paths.images.src)
    .pipe(
        imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })
    )
    .pipe(
        gulp.dest(paths.images.dist)
    )
    .pipe(
        notify({
            message: 'Images task complete.'
        })
    );
});

/* Task: Templates
*************************************************/
gulp.task('templates', function() {
    return gulp.src(paths.templates.src)
    .pipe(
        gulp.dest(paths.templates.dist)
    )
    .pipe(
        notify({
            message: 'Templates task complete.'
        })
    );
});

/* Task: Clean
*************************************************/
gulp.task('clean', function() {
    del(
        [
            paths.dist
        ],
        {
            force: true
        }
    );
});

/* Task: Watch
*************************************************/
gulp.task('watch', function() {

    // Initiate Livereload
    livereload.listen();

    // Watch SCSS files
    gulp.watch(
        paths.styles.src, ['styles']
    );

    // Watch JavaScript files
    gulp.watch(
        paths.scripts.src, ['scripts']
    );

    // Watch image files
    gulp.watch(
        paths.images.src, ['images']
    );

    // Watch templates files
    gulp.watch(
        paths.templates.src, ['templates']
    );

});

/* Task: Default
*************************************************/
gulp.task('default', ['clean'], function() {

    gulp.start(
        'styles',
        'scripts',
        'images',
        'templates',
        'watch'
    );

});
