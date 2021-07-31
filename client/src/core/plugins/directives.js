export const mousewheel = {
	directives: {
		mousewheel: {
			inserted: function (el, binding) {
				const f = function (evt) {
					if (binding.value(evt, el)) {
						el.removeEventListener('wheel', f)
					}
				}
				el.addEventListener('wheel', f)
			}
		}
	}
}
export const scroll = {
	directives: {
		scroll: {
			inserted: function (el, binding) {
				const f = function (evt) {
					if (binding.value(evt, el)) {
						el.removeEventListener('scroll', f)
					}
				}
				el.addEventListener('scroll', f)
			}
		}
	}
}