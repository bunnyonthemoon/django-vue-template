<template lang="pug">

.icon.g-icon
    svg(v-if="component" :is="component")

</template>
<script>
export default {
    props: {
        name: {
            required: true,
            type: String
        }
    },
    computed: {
        component() {
            let name = this.name
            return () => import('./' + name)
        }
    }
}
</script>
