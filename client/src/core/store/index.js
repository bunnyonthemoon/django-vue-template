import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import ui from './ui'
import user from './user'

const store = new Vuex.Store({
	modules: {
		ui,
		user,
	},
	actions: {
		async init({ dispatch, commit, state, getters }) {
			await dispatch('user/init')
			dispatch('ui/init')
		}
	}
})

export default store
