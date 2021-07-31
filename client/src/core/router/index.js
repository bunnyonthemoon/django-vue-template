import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from 'core/store'

const router = new VueRouter({
	routes: [
        {
            path: '',
            component: () => import('layouts/default'),
            children: [
                {
                    path: '/',
                    name: 'main',
                    component: () => import('pages/main')
                },
                {
                    path: '*',
                    name: '404',
                    component: () => import('pages/404')
                },
            ]
        },
        {
            path: '/auth/',
            name: 'auth',
            redirect: { name: 'signup' },
            meta: { authPage: true },
            component: () => import('layouts/auth'),
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('pages/auth/login')
                },
                {
                    path: 'signup',
                    name: 'signup',
                    component: () => import('pages/auth/signup')
                },
            ]
        },
	],

	mode: 'history',
	scrollBehavior(to, from, savedPosition) {
		if (to.name == from.name) return
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
})

router.beforeEach(async (to, from, next) => {
    await store.getters['user/loaded']
    
    const auth = store.state.user.auth,
        authPage = to.matched.find(route => route.meta.authPage) ? true : false

    if (auth)
        if (authPage) next({ name: 'main' })
        else next()
    else
        if (authPage) next()
        else {
            store.state.ui.redirect = to
            next({ name: 'auth' })
        }
})
// router.afterEach(async (to, from) => {
// })

export default router
