<template lang="pug">
div
    img.image(v-if="imageUrl" :src="imageUrl")
    table#FeatureInfo(v-if="feature").bg-white.b--gray.ba.helvetica.ma1
        tr(v-for="(value, prop) in p")
            template(v-if="ignoreProps.indexOf(prop) === -1")
                th.f6 {{ prop }}
                td.f6 {{ value }}
</template>

<script>
export default {
    name: "FeatureInfo",
    data: () => ({
        feature: undefined,
        ignoreProps: ['id','Longitude','Latitude', 'image_url']
    }),
    computed: {
        p() {
            return this.feature && this.feature.properties;
        },
        imageUrl() {
            return this.p && this.p.image_url
        },
    },
    created() {
        window.app.FeatureInfo = this;
    }
}
</script>

<style scoped>
#FeatureInfo th {
    text-align:  right;
}

.image {
    width: 100%;
}

</style>