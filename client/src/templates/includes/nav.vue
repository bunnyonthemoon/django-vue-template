<template lang="pug">

.nav

</template>
<script>
export default {
    data: () => ({
    }),
    computed: {
        user() {
            return this.$store.state.user.user
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
