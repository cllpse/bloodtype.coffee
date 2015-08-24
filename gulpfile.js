"use strict";


var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");


gulp.task("js", function ()
{
    gulp
    .src("./js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));
});


gulp.task("scss", function ()
{
    gulp
    .src("./scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(minifyCss())
    .pipe(gulp.dest("./dist"));
});


gulp.task("watch", function ()
{
    gulp.watch("./scss/**/*.scss", ["js", "scss"]);
});
