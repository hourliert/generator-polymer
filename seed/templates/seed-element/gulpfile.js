var gulp      = require('gulp'),
  bs          = require('browser-sync').create(),
  bg          = require("gulp-bg"),
  ps          = require('ps-node'),
  git         = require('gulp-git'),
  bump        = require('gulp-bump'),
  tag_version = require('gulp-tag-version'),
  filter      = require('gulp-filter'),
  ts          = require('gulp-typescript'),
  sourcemaps  = require('gulp-sourcemaps');

var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });

var POLYSERVE_PORT = 8080,
    elementName = 'seed-element';

var browserSyncConfig = function(path, cb) {
  bs.init({
    proxy: 'localhost:' + POLYSERVE_PORT,
    startPath: path
  });

  bs.reload;

  process.on('exit', function() {
    bs.exit();
  });
};

gulp.task('reload', ['typescript'], function () {
  bs.reload();
});

var watchComponent = function() {
  gulp.watch(['./*.html', './*.ts', 'demo/**/*.html', 'test/**/*.html'], ['reload']);
};

gulp.task('typescript', function() {
  var tsResult = gulp.src([
      '*.ts'
    ])
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject));

  return tsResult.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('.'));
});

gulp.task('polyserve', ['typescript'], function(cb) {
  ps.lookup({
    command: 'polyserve',
    psargs: '-f'
  }, function(err, resultList) {
    if (err) {
      throw new Error(err);
    }

    if (!resultList.length) {
      bg('./node_modules/polyserve/bin/polyserve', '-p ' + POLYSERVE_PORT)();
    }
    cb();
  });
});

gulp.task('serve', ['polyserve'], function(cb) {
  browserSyncConfig('/components/' + elementName + '/demo/', cb);
  watchComponent();
});

gulp.task('serve:doc', ['polyserve'], function(cb) {
  browserSyncConfig('/components/' + elementName + '/', cb);
  watchComponent();
});

gulp.task('test:watch', ['polyserve'], function(cb) {
  browserSyncConfig('/components/' + elementName + '/test/', cb);
  watchComponent();
});

try { require('web-component-tester').gulp.init(gulp); } catch (err) {}

function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe(bump({type: importance}))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    // commit the changed version number
    .pipe(git.commit('bumps package version'))
    // read only one file to get the version number
    .pipe(filter('bower.json'))
    // **tag it in the repository**
    .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });
