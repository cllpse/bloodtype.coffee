"use strict";


var fs = require("fs");
var regexp = require("node-regexp");
var through = require("through2");
var gulp = require("gulp");
var runSequence = require("run-sequence");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");
var inlineSource = require("gulp-inline-source");
var del = require("del");


var svgCssInject = function ()
{
    var pathExpression = /background-image: url\("[./a-z]+"\);?/gmi;
    var linebreakExpression = /(?:\r\n|\r|\n)/g;

    return through.obj(function (file, enc, cb)
    {
        if (file.isNull())
        {
            return cb(null, file);
        }

        if (file.isBuffer())
        {
            var contents = new Buffer(file.contents).toString();

            var matches = contents.match(pathExpression);

            if (matches)
            {
                var i = matches.length || 0;

                while(i--)
                {
                    var match = matches[i];
                    var path = match.replace('background-image: url("', "").replace('");', "");
                    var svg = fs.readFileSync(path, "utf8");

                    var s = 'background-image:url("data:image/svg+xml;utf8,' + escape(svg.replace(linebreakExpression, "")) + '");';

                    contents = contents.replace(match, s);
                }

                file.contents = new Buffer(contents);
            }
        }

        if (file.isStream())
        {
            // file.contents = file.contents.pipe(prefixStream(""));
        }

        cb(null, file);
    });
};


gulp.task("js-compile", function ()
{
    return gulp
    .src("./js/index.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));
});


gulp.task("scss-compile", function ()
{
    return gulp
    .src("./scss/index.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(svgCssInject())
    // .pipe(minifyCss())
    .pipe(gulp.dest("./dist"));
});


gulp.task("html-compile", function ()
{
    return gulp
    .src("index.html")
    .pipe(minifyHTML())
    .pipe(inlineSource())
    .pipe(gulp.dest("./dist"));
});


gulp.task("dist-clean-up", function ()
{
    del(["./dist/*.js", "./dist/*.css"]);
});


gulp.task("build", function ()
{
    runSequence("js-compile", "scss-compile", "html-compile", "dist-clean-up");
});


gulp.task("watch", function ()
{
    gulp.run("build");

    gulp.watch(["./js/**/*.js", "./scss/**/*.scss", "./index.html"], ["build"]);
});
