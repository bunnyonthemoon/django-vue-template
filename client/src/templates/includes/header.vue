<template lang="pug">

.header
    .statuses
        g-checkbox.status.color-success(:active="user.online" @set="setStatus('online', !user.online)") Онлайн
        g-checkbox.status(:active="user.duty" @set="setStatus('duty', !user.duty)") Дежурный
        g-checkbox.status.color-danger(:active="user.busy" @set="setStatus('busy', !user.busy)") Занят
    .profile(@click="menu = !menu")
        .name {{ user.fio }}
        .img(:style="{ backgroundImage: `url(${user.photo})` }")
        .menu(:class="{ active: menu }")
            router-link.link(:to="{ name: 'doctor', params: { id: user.id } }") Профиль
            .link(@click="$store.dispatch('user/logout')") Выйти

</template>
<script>
export default {
    data: () => ({
        duty: false,
        online: false,
        busy: false,
        menu: false
    }),
    computed: {
        user() {
            return this.$store.state.user.user
        },
    },
    methods: {
        setStatus(name, value) {
            this.$store.dispatch('user/setStatus', { name, value })
        }
    }
}
</script>
<style lang="stylus" scoped>

.header
    top 20px
    right 30px
    height 60px
    flex-shrink 0
    width calc(100% - 320px)
    position fixed
    z-index 20
    box-shadow 0 4px 24px 0 rgba(34,41,47,.1)
    background-color #fff
    border-radius 6px
    display flex
    align-items center
    padding 0 20px
    justify-content space-between

.statuses
    display flex
    align-items center
    .status
        margin-right 15px

.profile
    display flex
    align-items center
    cursor pointer
    position relative
    height 100%
    .name
        margin-right 10px
        font-weight 500
    .img
        width 40px
        height 40px
        background-size cover
        background-position center
        border-radius 100%
    .menu
        display none
        position absolute
        z-index 20
        top 100%
        right 0
        width 170px
        margin-top 10px
        background-color #fff
        box-shadow 0 5px 25px rgba(34,41,47,.1)
        border-radius 5px
        padding 8px 15px
        &.active
            display block
        .link
            height 35px
            align-items center
            display flex

</style>
