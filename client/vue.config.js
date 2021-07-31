const path = require("path")
const BundleTracker = require("webpack-bundle-tracker")

const SERVER_INTEGRATION = true

const PUBLIC_PATH = SERVER_INTEGRATION ? '/static/' : './'
const OUTPUT_PATH = SERVER_INTEGRATION ? '../server/public/client/' : './client/'
const BUNDLE_PATH = SERVER_INTEGRATION ? '../server/public/client-files.json' : './client-files.json'

process.env.VUE_APP_SERVER = process.env.NODE_ENV == 'production' ? 'PROD DOMEN' : '127.0.0.1:8000'
process.env.VUE_APP_SERVER_URL = process.env.NODE_ENV == 'production' ? 'PROD URL' : 'http://127.0.0.1:8000'

module.exports = {
	pages: {
		index: 'src/core/index.js'
	},
	publicPath: process.env.NODE_ENV == 'production' ? PUBLIC_PATH :"http://127.0.0.1:8080/",
	outputDir: OUTPUT_PATH,
	devServer: {
		public: 'localhost:8080',
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
	},
	configureWebpack: {
		// Создание бандла для подгрузки с сервера
		plugins: [
			new BundleTracker({ filename: BUNDLE_PATH }),
		],
		resolve: {
			// Короткие ссылки
			alias: {
				'__STATIC__': 'static',

				'src': path.resolve(__dirname, 'src'),
				'core': path.resolve(__dirname, 'src/core'),
				'plugins': path.resolve(__dirname, 'src/core/plugins'),

				'styles': path.resolve(__dirname, 'src/assets/styles'),
				'img': path.resolve(__dirname, 'src/assets/images'),
				'icons': path.resolve(__dirname, 'src/assets/icons'),
				'fonts': path.resolve(__dirname, 'src/assets/fonts'),
				'data': path.resolve(__dirname, 'src/assets/data'),

				'templates': path.resolve(__dirname, 'src/templates'),
				'pages': path.resolve(__dirname, 'src/templates/pages'),
				'global': path.resolve(__dirname, 'src/templates/global'),
				'includes': path.resolve(__dirname, 'src/templates/includes'),
				'layouts': path.resolve(__dirname, 'src/templates/layouts'),
			},
			extensions: ['*', '.js', '.vue', '.json']
		},
	},
	chainWebpack: config => {
		const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
		types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
	},
}
function addStyleResource(rule) {
	rule.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				path.resolve(__dirname, './src/assets/styles/var.styl'),
			],
		})
}
