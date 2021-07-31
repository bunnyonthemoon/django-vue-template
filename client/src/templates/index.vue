<template lang="pug">

router-view.layout

</template>
<script>
import lDefault from 'layouts/default'
import lAuth from 'layouts/auth'
export default {
	components: { lDefault, lAuth },
    methods: {
    }
}
</script>
<style lang="stylus" scoped>

.layout
	position relative
	min-height 100vh

</style>
