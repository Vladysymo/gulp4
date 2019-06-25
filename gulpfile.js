const { series, parallel, src, dest, watch } = require("gulp")

const sass = require('gulp-sass')
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()
const htmlMin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const uglify = require('gulp-uglify-es').default
const concat = require('gulp-concat')
const image = require('gulp-image')
const fontmin = require('gulp-fontmin')


exports.default = () => {
	browserSync.init({
		server: "src/",
		notify: false
	})
	
	watch('src/*.html').on('change', browserSync.reload)
	watch('src/css/*.css').on('change', browserSync.reload)
	watch('src/js/*.js').on('change', browserSync.reload)
	watch('src/sass/*.sass|scss', compileSass)
}

function compileSass() {
	return src('src/sass/*.sass')
		.pipe(sass({
			outputStyle: 'expanded', 
			indentType: 'tab',
			indentWidth: 1
		}).on('error', sass.logError))
		.pipe(dest('src/css/'))
		.pipe(browserSync.stream())
}



function libsCSS() {
	return src('libraries/*.css')
		.pipe(concat('lib.css'))
		.pipe(csso())
		.pipe(dest('src/lib'))
}

function libsJS() {
	return src('libraries/*.js')
		.pipe(concat('lib.js'))
		.pipe(uglify())
		.pipe(dest('src/lib'))
}



function minifyHTML() {
	return src('src/*.html')
		.pipe(htmlMin({ collapseWhitespace: true}))
		.pipe(dest('dist'))
}

const minifyCSS = series(compileSass, function cssMinify() {
	return src('src/css/*.css')
		.pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
		}))
		.pipe(csso())
		.pipe(dest('dist/css'))
})

function minifyJS() {
	return src('src/js/*.js')
		.pipe(uglify())
		.pipe(dest('dist/js'))
}

const buildLibs = series(parallel(libsCSS, libsJS), function move() {
	return src('src/lib/*')
		.pipe(dest('dist/lib'))
})

function minifyIMG() {
	return src('src/img/*')
		.pipe(image({
			pngquant: true,
			optipng: true,
			zopflipng: true,
			jpegRecompress: true,
			mozjpeg: true,
			guetzli: true,
			gifsicle: true,
			svgo: true,
			concurrent: 10,
			quiet: true
		}))
		.pipe(dest('dist/img'))
}

function minifyFonts() {
	return src('src/fonts/*')
		.pipe(fontmin())
		.pipe(dest('dist/fonts'))
}

function moveConfig() {
	return src('src/config/*')
		.pipe(dest('dist/config'))
}



exports.lib   = parallel(libsCSS, libsJS)

// exports.htmlm = minifyHTML
// exports.cssm  = minifyCSS
// exports.jsm   = minifyJS
// exports.imgm  = minifyIMG

exports.build = parallel(minifyHTML, minifyCSS, minifyJS, buildLibs, minifyIMG, minifyFonts, moveConfig)