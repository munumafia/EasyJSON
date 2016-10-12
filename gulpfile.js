"use strict"

let gulp = require("gulp");
let sourcemaps = require("gulp-sourcemaps");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");

gulp.task("default", () => {
    let tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
});

gulp.task("watch", ["default"], () => {
    gulp.watch("*.ts", ["default"]);
});