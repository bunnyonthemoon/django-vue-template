export default {
	methods: {
		$_format_formatText(text){
			return formatText(text)
		},
		$_format_maskInput(e, text){
			let input = e.target || e
			text = text || input.value
			maskInput(input, text)
		},
		$_format_maskText(text){
			return maskText(text)
		}
	}
}

function formatText(text) {
	let type = typeof(text)
	if (type == 'string' || type == 'symbol') text = parseInt(text.split(' ').join('').replace(/[^-0-9]/gim, ''))
	return text || 0
}

function maskText(text) {
	text = formatText(text) + ''
	let res = ''
	for (let i = text.length - 1, j = 0; i >= 0; i-- , j++) {
		if (j > 0 && j % 3 == 0) {
			res = ' ' + res
		}
		res = text[i] + res
	}
	return res
}

function maskInput(input, text) {
	let caret = getCaretPosition(input),
		spacesOld = getSpacesCaret(text, caret.start)

	input.value = maskText(text)

	let spacesNew = getSpacesCaret(input.value, caret.start)
	setCaretPosition(input, caret.start + spacesNew - spacesOld, caret.end + spacesNew - spacesOld)

	function getSpacesCaret(text, pos) {
		let count = 0
		for (let i = 0; i < pos; i++)
			if (text[i] == ' ') count++
		return count
	}
	function getCaretPosition(input) {
		if (document.selection) {
			input.focus();
			let range = document.selection.createRange(),
				rangelen = range.text.length;
			range.moveStart('character', -input.value.length)
			return {
				start: range.text.length - rangelen,
				end: range.text.length
			}
		}
		else if (input.selectionStart || input.selectionStart == '0')
			return {
				start: input.selectionStart,
				end: input.selectionEnd
			}
		else return {
			start: 0,
			end: 0
		}
	}
	function setCaretPosition(input, start, end) {
		if (input.setSelectionRange) {
			input.focus()
			input.setSelectionRange(start, end)
		} else if (input.createTextRange) {
			var range = input.createTextRange()
			range.collapse(true)
			range.moveEnd('character', end)
			range.moveStart('character', start)
			range.select()
		}
	}
}