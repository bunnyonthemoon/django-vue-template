import Vue from 'vue'

import 'styles/base.styl'
import 'global'
import 'icons'

import Axios from 'axios'
import Cookies from 'js-cookie'
Axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken')

import VueMeta from 'vue-meta'
Vue.use(VueMeta)

import Template from 'templates'
import router from 'core/router'
import store from 'core/store'
import { sync } from 'vuex-router-sync'
sync(store, router)

new Vue({
	async beforeCreate() {
		await store.dispatch('init')
	},
	el: '#app',
	router,
	store,
	render: h => h(Template)
})
