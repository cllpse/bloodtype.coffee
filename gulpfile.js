"use strict";


var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");


gulp.task("js", function ()
{
    gulp
    .src("./js/index.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));
});


gulp.task("scss", function ()
{
    gulp
    .src("./scss/index.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(minifyCss())
    .pipe(gulp.dest("./dist"));
});


gulp.task("html", function ()
{
    gulp
    .src("index.html")
    .pipe(minifyHTML())
    .pipe(gulp.dest("./dist"));
});


gulp.task("watch", function ()
{
    gulp.watch("./js/**/*.js", ["js"]);
    gulp.watch("./scss/**/*.scss", ["scss"]);
    gulp.watch("./index.html", ["html"]);
});
