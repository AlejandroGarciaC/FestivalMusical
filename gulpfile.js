
const {src, dest, watch,parallel} = require("gulp"); 

//CSS
const sass = require ("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber');
const autoprefixer=require('autoprefixer');
const postcss=require('gulp-postcss');
const cssnano=require('cssnano');
const sourcemaps =require('gulp-sourcemaps');


//imagenes
const cache = require('gulp-cache');
const imagenmin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
// JS
const terser = require('gulp-terser-js'); 

function css(callback){
    src('src/scss/**/*.scss')// Identificar el archivo de sass
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())// Compilar el archivo de sass
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));// Guardar en el disco duro
    callback();// Avisa a gulkp cuando llegamos al final de la ejecucion
}

function versionWebp(done){

    const opciones = {
        quality : 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));

    done();
}

function versionAvif(done){

    const opciones = {
        quality : 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));

    done();
}

function imagenes(done){
    const opciones = {
        optimizationLevel : 3
    }
    src('src/img/**/*.{png,jpg}')
    .pipe( cache(imagenmin(opciones)))
    .pipe( dest('build/img'))
    done();
}

function javascript (done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(dest('build/js'))
        .pipe(sourcemaps.write('.'))

    done();
}

function dev(done) {
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);
    done();
}


exports.css= css;
exports.js= javascript;
exports.imagenes = imagenes;
exports.versionWebp=versionWebp;
exports.versionAvif=versionAvif;
exports.dev = parallel(imagenes, versionWebp,versionAvif, javascript, dev);
