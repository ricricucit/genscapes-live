// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref');
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    main_scripts = [  'node_modules/socket.io-client/socket.io.js',
                      'bower_components/three.js/three.js',
                      'assets/scripts/libs/*.js'],

    live_scripts = [  'bower_components/recordrtc/RecordRTC.js',
                      'assets/scripts/live.js'],

    stage_scripts = [ 'assets/scripts/stage.js' ];


// Styles
gulp.task('styles', function() {
  return gulp.src('assets/styles/main.scss')
    .pipe(sass()) //{ style: 'expanded', }
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// DEV Styles
gulp.task('dev_styles', function() {
  return gulp.src('assets/styles/main.scss')
    .pipe(sass()) //{ style: 'expanded', }
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('assets/styles')) //create a DEV version for node server to see it
    .pipe(notify({ message: 'DEV Styles task complete' }));
});


// Templates
gulp.task('templates', function() {
  return gulp.src(['templates/**/*'])
    .pipe(useref({ noAssets: true }))
    .pipe(gulp.dest('dist/templates'));
});

//node scripts
gulp.task('node_scripts', function() {
   gulp.src(['./*.js','!./gulpfile.js'])
   .pipe(gulp.dest('dist'))
   .pipe(notify({ message: 'NodeJS Scripts task complete' }));
});

// LIVE Scripts
gulp.task('live_scripts', function() {
  return gulp.src(live_scripts)
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('live.js'))
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(notify({ message: 'Stand-alone Scripts task complete' }));
});

// STAGE Scripts
gulp.task('stage_scripts', function() {
  return gulp.src(stage_scripts)
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('stage.js'))
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(notify({ message: 'Stand-alone Scripts task complete' }));
});

// MAIN (common) Scripts
gulp.task('main_scripts', function() {
  return gulp.src(main_scripts)
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(notify({ message: 'General Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});


// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/assets/styles', 'dist/scripts', 'dist/images', 'dist/templates', 'dist/index.js', 'dist/middleware.js'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean','node_scripts', 'styles', 'main_scripts', 'stage_scripts','live_scripts', 'images', 'templates']).on('change', function() {
    gulp.run();
});


// Watch
gulp.task('watch', function() {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };

    // Watch .scss files
    gulp.watch('assets/styles/**/*.scss', ['styles']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    // Watch .js files
    gulp.watch('assets/scripts/**/*.js', ['main_scripts','stage_scripts','live_scripts']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    // Watch image files
    gulp.watch('assets/images/**/*', ['images']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    // Watch HTML files
    gulp.watch('assets/templates/**/*', ['templates']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    // Watch HTML files
    gulp.watch(['./index.js', './middleware.js'], ['server']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

  });

});


// DEV tasks
gulp.task('dev', ['clean','dev_styles', 'watch_dev']).on('change', function() {
    gulp.run();
});

// Watch
gulp.task('watch_dev', function() {

  // Listen on port 35728
  server.listen(35728, function (err) {
    if (err) {
      return console.log(err)
    };

    // Watch .scss files
    gulp.watch('assets/styles/**/*.scss', ['dev_styles']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

  });

});
