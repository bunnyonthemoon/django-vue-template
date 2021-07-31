<template lang="pug">

.checkbox(:class="{ active, disabled }" @click="set")
    .box
        g-icon(name="ui/check")
    .text
        slot(name="default")

</template>
<script>
export default {
    props: {
        active: Boolean,
        disabled: Boolean
    },
    methods: {
        set() {
            if (this.disabled) return
            else this.$emit('set')
        }
    }
}
</script>
<style lang="stylus" scoped>

.checkbox
    display flex
    align-items center
    cursor pointer
    .text
        font-size 14px
        line-height 1
        a
            color $grey
    .box
        width 18px
        height 18px
        margin-right 10px
        border-radius 3px
        border 1px solid #d8d6de
        display flex
        align-items center
        justify-content center
        flex-shrink 0
        .icon
            fill none
            stroke #fff
            width 11px
            height 11px
            opacity 0
            transition opacity .15s
    &.active
        .box
            background-color $primary
            border-color $primary
            .icon
                opacity 1
        &.color-success
            .box
                background-color $success
                border-color $success
        &.color-danger
            .box
                background-color $danger
                border-color $danger
    &.disabled
        cursor default

</style>
