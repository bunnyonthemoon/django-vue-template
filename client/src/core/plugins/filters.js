export const maskNumber = {
	install(Vue) {
		Vue.filter('$_maskNumber', function(text){
			text += ''
			text = text.split(' ').join('').replace(/[^-0-9]/gim, '') || '0'
			let res = ''
			for (let i = text.length - 1, j = 0; i >= 0; i-- , j++) {
				if (j > 0 && j % 3 == 0) {
					res = ' ' + res
				}
				res = text[i] + res
			}
			return res
		})
	}
}
export const maskTel = {
	install(Vue) {
		Vue.filter('$_maskTel', function(tel){
			return `${tel.substr(0, 2)} ${tel.substr(2, 3)} ${tel.substr(5, 3)} ${tel.substr(8, 2)} ${tel.substr(10, 2)}`
		})
	}
}