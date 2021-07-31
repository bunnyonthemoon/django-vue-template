import axios from 'axios'
import router from 'core/router'
import Cookies from 'js-cookie'

export default {
    namespaced: true,
    state: () => ({
        user: null,
        auth: false,
        loaded: false,
    }),
    getters: {
        loaded(state) {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (state.loaded) {
                        resolve(true)
                        clearInterval(interval)
                    }
                }, 50)
            })
        },
    },
    mutations: {
        setUser(state, user) {
            sessionStorage.setItem('auth', true)
            state.auth = true
            state.user = user
        },
        clearUser(state) {
            state.user = null
        },
        setToken() {
            axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken')
        }
    },
    actions: {
        init({ commit, dispatch, state }) {
            
            commit('setToken')
            state.loaded = true
        },

        async login({ state, commit }, { username, password }) {
            try {
                const { data } = await axios.post('/api/auth/login/', { username, password })

                if (data.error)
                    return data

                commit('setUser', data.user)
                commit('setToken')
                commit('ui/redirect', { name: 'main' }, { root: true })

                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },

        async signup({ state, commit}, { username, password }) {
            try {
                const { data } = await axios.post('/api/auth/signup/', { username, password })

                if (data.error)
                    return data

                commit('setUser', data.user)
                commit('setToken')
                commit('ui/redirect', { name: 'main' }, { root: true })

                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },

        async logout({ state, commit }) {
            await axios.post('/api/auth/doctor/logout/')

            commit('setToken')
            state.auth = false
            await router.push({ name: 'auth' })

            commit('clearUser')
            return true
        },
    }
}
