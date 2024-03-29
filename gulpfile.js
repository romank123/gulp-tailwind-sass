"use strict";

const gulp = require('gulp');

const sass = require('gulp-sass');
const bs = require('browser-sync');
const rename = require('gulp-rename');
const prefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const bulkSass = require('gulp-sass-bulk-importer');
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const size = require('gulp-size');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const recompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const svgmin = require('gulp-svgmin');
const svgcss = require('gulp-svg-css-pseudo');
const svgsprite = require('gulp-svg-sprite');
const svgInclude = require('gulp-embed-svg');
const ttf2woff2 = require('gulp-ttftowoff2');
const ttf2woff = require('gulp-ttf2woff');
const ttf2eot = require('gulp-ttf2eot');
const options = require("./config"); //paths and other options from config.js
const postcss = require('gulp-postcss'); //For Compiling tailwind utilities with tailwind config
const tailwindcss = require('tailwindcss');
const clean = require('gulp-clean');
const fs = require('fs');
const ftp = require('vinyl-ftp');


const js_plugins = ['src/js/libs/*.js'];
const css_plugins = [

];
let settings_size = {
		'gzip': false,
		'pretty': true,
		'showFiles': true,
		'showTotal': true
	},
	svgmin_plugins = {
		plugins: [{
				removeComments: true
			},
			{
				removeEmptyContainers: true
			}
		]
	},
	connect = ftp.create({
		host: '',
		user: '',
		pass: '',
		parallel: 10,
		log: ''
	});

gulp.task('libs_styles', () => {
	if (css_plugins.length > 0) {
		return gulp
			.src(css_plugins)
			.pipe(map.init())
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(concat('libs.min.css'))
			.pipe(map.write('../sourcemaps/'))
			.pipe(size(settings_size))
			.pipe(gulp.dest('build/css/'))
	} else {
		return true;
	}
});

// gulp.task('dev_styles', () => {
// 	return gulp
// 		.src('src/scss/*.scss', '!src/scss/libs.scss')
// 		.pipe(map.init())
// 		.pipe(bulkSass())
// 		.pipe(sass({
// 			outputStyle: 'compressed'
// 		}).on('error', sass.logError))
// 		.pipe(prefixer({
// 			overrideBrowserslist: ['last 8 versions'],
// 			browsers: [
// 				'Android >= 4',
// 				'Chrome >= 20',
// 				'Firefox >= 24',
// 				'Explorer >= 11',
// 				'iOS >= 6',
// 				'Opera >= 12',
// 				'Safari >= 6',
// 			],
// 		}))
// 		.pipe(cleanCss({
// 			level: 2
// 		}))
// 		.pipe(concat('style.min.css'))
// 		.pipe(map.write('../sourcemaps/'))
// 		.pipe(gulp.dest('build/css/'))
// 		.pipe(size(settings_size))
// 		.pipe(bs.stream())
// });

gulp.task('dev_styles', () => {
	return gulp
		.src('src/scss/*.scss', '!src/scss/libs.scss')
		.pipe(map.init())
		.pipe(bulkSass())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(gulp.dest('build/css/'))
		.pipe(postcss([
			tailwindcss({
					mode: 'jit',
					purge: ['./src/**/*.html'],
					darkMode: false,
					theme: {
						screens: {
							'sm': {'min': '384px'},
							'md': {'min': '868px'},
							'lg': {'min': '1290px'},
						},
						fontFamily: {
							'GothamProRegular': ['"GothamProRegular"'],
							'GothamProMedium': ['"GothamProMedium"'],
							'GothamProLight': ['"GothamProLight"'],
							'GothamProBold': ['"GothamProBold"'],
						},
						fontSize: {
							// 'xxs': '.625rem',
							// 'xs': '.75rem',
							// 'sm': '.875rem',
							// 'tiny': '.875rem',
							// 'base': '1rem',
							// 'lg': '1.125rem',
							// 'xl': '1.25rem',
							// '2xl': '1.5rem',
							// '3xl': '1.875rem',
							// '4xl': '2.25rem',
							// '5xl': '3rem',
							// '6xl': '4rem',
							// '7xl': '5rem',
						}
					},
			}),
			require('autoprefixer'),
		]))
		// .pipe(cleanCss({
		// 	level: 0
		// }))
		.pipe(concat('style.min.css'))
		.pipe(map.write('../sourcemaps/'))
		.pipe(gulp.dest('build/css/'))
		.pipe(size(settings_size))
		.pipe(bs.stream())
});


gulp.task('style',
	gulp.series(
		'libs_styles',
		'dev_styles'
	)
);

gulp.task('libs_js', () => {
	if (js_plugins.length) {
		return gulp
			.src(['src/js/libs/*.js','!src/js/libs/_*.js'])
			.pipe(map.init())
			.pipe(concat('libs.min.js'))
			//.pipe(uglify())
			.pipe(map.write('../sourcemaps/'))
			.pipe(size(settings_size))
			.pipe(gulp.dest('build/js/libs/'))
	} else {
		return true
	}
});

gulp.task('dev_js', () => {
	return gulp
		.src(['src/js/*.js', 'src/components/**/*.js', 'src/page/**/*.js','!src/page/**/_*.js'])
		.pipe(map.init())
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(map.write('../sourcemaps/'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/js/'))
		.pipe(bs.stream())
});

gulp.task('build_js', () => {
	return gulp
		.src(['src/js/main.js', 'src/components/**/*.js'])
		.pipe(map.init())
		.pipe(uglify())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.min.js'))
		.pipe(map.write('../sourcemaps/'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/js/'))
});

gulp.task('js',
	gulp.series(
		'libs_js',
		'dev_js'
	)
);

gulp.task('html', () => {
	return gulp
		.src(['src/page/*.html', '!src/**/_*.html', '!src/components/**/*.html'])
		.pipe(include())
		.pipe(svgInclude({
			selectors: '.include-svg',
			root: './src/svg/include'
		}))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build'))
		.pipe(bs.stream())
});

gulp.task('php', () => {
	return gulp
		.src('src/**/*.php')
		.pipe(svgInclude({
			selectors: '.include-svg',
			root: './src/svg/include'
		}))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/'))
		.pipe(bs.stream())
});

gulp.task('json', function () {
	return gulp
		.src('src/**/*.json', '!src/components/**/*.json')
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/'))
		.pipe(bs.stream())
});

gulp.task('svg2css', () => {
	return gulp
		.src('src/svg/css/**/*.svg')
		.pipe(svgmin(svgmin_plugins))
		.pipe(svgcss({
			fileName: '_05-svg',
			fileExt: 'scss',
			cssPrefix: '--svg__',
			addSize: false
		}))
		.pipe(gulp.dest('src/scss/global'))
		.pipe(size(settings_size));
});

gulp.task('svg2sprite', () => {
	return gulp
		.src('src/svg/sprite/**/*.svg')
		.pipe(svgmin(svgmin_plugins))
		.pipe(svgsprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			},
		}))
		.pipe(gulp.dest('src/img/'))
		.pipe(size(settings_size))
});

gulp.task('img', () => {
	return gulp
		.src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)')
		.pipe(changed('build/img'))
		.pipe(imagemin({
 				interlaced: true,
 				progressive: true,
 				optimizationLevel: 5,
 			},
 			[
 				recompress({
 					loops: 6,
 					min: 50,
 					max: 90,
 					quality: 'high',
 					use: [pngquant({
 						quality: [0.7, 0.9],
 						strip: true,
 						speed: 1
 					})],
 				}),
 				imagemin.gifsicle(),
 				imagemin.optipng(),
 				imagemin.svgo()
 			], ), )
		.pipe(gulp.dest('build/img'))


});

// gulp.task('img', () => {
// 	return gulp
// 		.src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)')
// 		.pipe(imagemin({
// 				interlaced: true,
// 				progressive: true,
// 				optimizationLevel: 5,
// 			},
// 			[
// 				recompress({
// 					loops: 6,
// 					min: 50,
// 					max: 90,
// 					quality: 'high',
// 					use: [pngquant({
// 						quality: [0.7, 0.9],
// 						strip: true,
// 						speed: 1
// 					})],
// 				}),
// 				imagemin.gifsicle(),
// 				imagemin.optipng(),
// 				imagemin.svgo()
// 			], ), )
// 		.pipe(gulp.dest('build/img'))
// 		.pipe(size(settings_size))
// 		.pipe(bs.stream())
// });

gulp.task('images',
	gulp.parallel(
		'svg2css',
		'svg2sprite',
		'img'
	));

gulp.task('font-woff', () => {
	return gulp
		.src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: '.woff',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff())
		.pipe(gulp.dest('build/fonts/'))
});

gulp.task('font-woff2', () => {
	return gulp
		.src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: '.woff2',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff2())
		.pipe(gulp.dest('build/fonts/'))
});

gulp.task('font-eot', () => {
	return gulp
		.src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: '.eot',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2eot())
		.pipe(gulp.dest('build/fonts/'))
});

gulp.task('clean', () => {
	return gulp
		.src('build/')
		.pipe(clean({force: true}))

});

const cb = () => {}

let srcFonts = 'src/scss/_local-fonts.scss';
let appFonts = 'build/fonts/';

gulp.task('fontsgen', (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, (err, items) => {
		if (items) {
			let c_fontname;
			for (let i = 0; i < items.length; i++) {
				let fontname = items[i].split('.'),
					fontExt;
				fontExt = fontname[1];
				fontname = fontname[0];
				if (c_fontname != fontname) {
					if (fontExt == 'woff' || fontExt == 'woff2' || fontExt == 'eot') {
						fs.appendFile(srcFonts, `@include font-face("${fontname}", "${fontname}", 400);\r\n`, cb);
						console.log(`Added font ${fontname}.
----------------------------------------------------------------------------------
Please, move mixin call from src/scss/_local-fonts.scss to src/scss/_fonts.scss and then change it, if font from this family added ealy!
----------------------------------------------------------------------------------`);
					}
				}
				c_fontname = fontname;
			}
		}
	})
	done();
})

gulp.task('fonts', gulp.series(
	'font-woff2',
	'font-woff',
	'font-eot',
	'fontsgen'
));

gulp.task('server_html', () => {
	bs.init({
		server: {
			baseDir: "./build",
			directory: true

		},
		port: 3000,
		browser: "chrome",
		notify: false,
		//server: {
		//	baseDir: 'build/',
		//	host: '192.168.0.104',
		//},
		//browser: 'chrome',
		//logPrefix: 'BS-HTML:',
		//logLevel: 'info',
		//open: false
	})
});

gulp.task('server_php', () => {
	bs.init({
		browser: ['chrome'],
		watch: true,
		proxy: '',
		/* set local domain of your project */
		logLevel: 'info',
		logPrefix: 'BS-PHP:',
		logConnections: true,
		logFileChanges: true,
	})
});

gulp.task('deploy', () => {
	return gulp
		.src('build/**/*.*')
		.pipe(connect.newer('html/'))
		.pipe(connect.dest('html/'))
});

gulp.task('watch_html', () => {
	gulp.watch('src/**/*.{sass,scss}', gulp.parallel('dev_styles'));
	gulp.watch('src/**/*.html', gulp.parallel('html','dev_styles'));
	gulp.watch('src/**/*.js', gulp.parallel('dev_js','libs_js'));
	gulp.watch('src/**/*.json', gulp.parallel('json', 'html'));
	gulp.watch('src/img/**/*.*', gulp.parallel('img'));
	gulp.watch('src/svg/css/**/*.svg', gulp.parallel('svg2css'));
	gulp.watch('src/svg/sprite/**/*.svg', gulp.parallel('svg2sprite'));
	gulp.watch('src/svg/include/**/*.svg', gulp.parallel('html'));
	gulp.watch('src/fonts/**/*.ttf', gulp.parallel('fonts'));
});

// gulp.task('watch_php', () => {
// 	gulp.watch('src/**/*.scss', gulp.parallel('dev_styles'));
// 	gulp.watch('src/**/*.php', gulp.parallel('php'));
// 	gulp.watch('src/**/*.js', gulp.parallel('dev_js','libs_js'));
// 	gulp.watch('src/**/*.json', gulp.parallel('json'));
// 	gulp.watch('src/img/**/*.*', gulp.parallel('img'));
// 	gulp.watch('src/svg/css/**/*.svg', gulp.parallel('svg2css'));
// 	gulp.watch('src/svg/sprite/**/*.svg', gulp.parallel('svg2sprite'));
// 	gulp.watch('src/svg/include/**/*.svg', gulp.parallel('php'));
// 	gulp.watch('src/fonts/**/*.ttf', gulp.parallel('fonts'));
// });

gulp.task('default',
	gulp.parallel(
		'style',
		'html',
		'js',
		'json',
		'images',
		'fonts',
		'watch_html',
		'server_html'
	)
);

gulp.task('dev-php',
	gulp.parallel(
		'style',
		'php',
		'js',
		'json',
		'images',
		'fonts',
		//'watch_php',
		'server_php'
	)
);
