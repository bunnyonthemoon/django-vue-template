<template lang="pug">

.layout-main(:class="{ 'disable-scroll': disableScroll }")
    i-nav
    .content
        i-header
        router-view.page
        //- .page-inner(:class="{ loading: loader }")
            //- transition(name="loader")
            //-     .loader(v-if="loader")
            //-         .spin
        i-popup

</template>
<script>
import iNav from 'includes/nav'
import iHeader from 'includes/header'
import iFooter from 'includes/footer'
import iPopup from 'includes/popup'
export default {
	computed: {
		loader() {
			return this.$store.state.ui.loader
		},
		disableScroll() {
			return this.$store.state.ui.disableScroll
		},
		popup() {
			return this.$store.getters['ui/popup'].name
		}
	},
	components: { iNav, iHeader, iFooter, iPopup }
}
</script>
<style lang="stylus" scoped>

.layout-main
    min-height 100vh
    height 100%
    position relative
    display flex
    padding-left 260px
    &.disable-scroll
        overflow-y disable

.content
    position relative
    display flex
    flex-direction column
    width 100%

.page
    position relative
    padding 105px 30px 20px
    height 100%
    z-index 1
    &-inner
        position relative
        height 100%
        width 100%
        transition min-height .2s

.loader
    position absolute
    width 100%
    height 100%
    background-color #fff
    top 0
    left 0
    z-index 2
    transition opacity .2s
    .spin
        position absolute
        width 60px
        height 60px
        left 50%
        margin-left -30px
        top calc(50vh - 120px)
        border 5px solid #ccc
        border-bottom 5px solid transparent
        border-radius 100%
        z-index 2
        animation spin 1.5s linear infinite
    &.loader-enter-to
        opacity 1

    &.loader-leave-to
        opacity 0

@keyframes spin
    from
        transform rotate(0)
    to
        transform rotate(360deg)

</style>
