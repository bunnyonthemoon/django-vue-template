import axios from 'axios'
import router from 'core/router'

export default {
    namespaced: true,

    state: () => ({
        window: {
            width: 0,
            height: 0
        },
        select: null,
        loader: false,
        redirect: null,
        disableScroll: false,
        notification: null
    }),

    getters: {
        popup() {
            return {
                name: router.history.current.query.popup,
                query: router.history.current.query.popupQuery
            }
        },
    },

    mutations: {
        popup({ popup }, { name = null, query = null }) {
            let values = JSON.parse(JSON.stringify(router.history.current.query))

            if (name) {
                values.popup = name
                values.popupQuery = query
            }
            else {
                delete values.popup
                delete values.popupQuery
            }
            router.push({ query: values })
        },
        resize(state) {
            state.window.width = window.innerWidth
            state.window.height = window.innerHeight
        },
        redirect(state, fallback) {
            router.push(state.redirect || fallback)
            state.redirect = null
        }
    },
    
    actions: {
        init({ commit }) {
            resize()
            window.addEventListener('resize', resize)

            function resize() {
                commit('resize')
            }
        },
        setNotification({ state }, notification) {
            state.notification = notification
            setTimeout(() => {
                if (state.notification == notification)
                    state.notification = null
            }, 5000)
        }
    }
}
