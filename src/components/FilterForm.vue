<template lang="pug">
#FilterForm
    .form.container
        h4 I use about
        .usage
            .form-row            
                input#monthly-geocodes.form-control(type="number" placeholder="5000" v-model.number="geocodesMonthly")
                label(for=monthly-geocodes) per month
            .form-row            
                input#daily-geocodes.form-control(type="number" placeholder="1000" v-model.number="geocodesDaily")
                label(for=daily-geocodes) on busy days
            .form-row            
                input#secondly-geocodes.form-control(type="number" placeholder="1" v-model.number="geocodesSecondly")
                label(for=secondly-geocodes) per second
        h4 My app is:
        .form-group
            input.form-check-input#public-facing(type="checkbox" v-model="public")
            label.form-check-label(for="public-facing") Accessible to the public
        .form-group
            input.form-check-input#free(type="checkbox" v-model="free")
            label.form-check-label(for="free") Free of charge
        h4 I need to:
        .form-group
            input.form-check-input#permanent-geocodes(type="checkbox" v-model="permanent")
            label.form-check-label(for="permanent-geocodes") Store geocodes permanently
        .form-group
            input.form-check-input#bulk-jobs(type="checkbox" v-model="bulkJobs")
            label.form-check-label(for="bulk-jobs") Carry out bulk jobs not triggered by users
        .form-group
            input.form-check-input#third-party(type="checkbox" v-model="thirdParty")
            label.form-check-label(for="third-party") Show results on third-party basemaps
        .form-group
            input.form-check-input#autocomplete(type="checkbox" v-model="autoComplete")
            label.form-check-label(for="autocomplete") Auto-complete addresses as they're typed
            .form-row.f7.ml3 
                input.w3#autocomplete-multiplier.form-control(type="number" placeholder="10" v-model.number="autocompleteMultiplier" :disabled="!autoComplete")
                label(for=autocomplete-multiplier) autocompletes per geocode.
        .form-group
            input.form-check-input#reverse-geocode(type="checkbox" v-model="reverseGeocode")
            label.form-check-label(for="reverse-geocode") Reverse-geocode (find address from a pin drop)
        .form-group
            input.form-check-input#location-weighting(type="checkbox" v-model="locationWeighting")
            label.form-check-label(for="location-weighting") Prioritise results near a provided location
        .form-group
            input.form-check-input#mapping-library(type="checkbox" v-model="mappingLibrary")
            label.form-check-label(for="mapping-library") Use my own mapping library <br><small>(Leaflet, Mapbox-GL-JS, OpenLayers...)</small>
        h4 Miscellaneous
        .radios
            span Open data:&nbsp;
            .form-check.form-check-inline
                input.form-check-input#open-data-ok(type="radio" name="open-data" v-model="openData")
                label.form-check-label(for="open-data-ok") It's ok
            .form-check.form-check-inline
                input.form-check-input#open-data-love(type="radio" value='true' name="open-data" v-model="openData")
                label.form-check-label(for="open-data-love") Love it
            .form-check.form-check-inline
                input.form-check-input#open-data-hate(type="radio" value='false' name="open-data" v-model="openData")
                label.form-check-label(for="open-data-hate") Hate it
        .form-group
            input.form-check-input#pay-annually(type="checkbox" v-model="payAnnually")
            label.form-check-label(for="pay-annually") Happy to pay annually
        

    h4#caveats.background-light Caveats
    ul.caveats
        li Annual-payment discounts are not included.
        li No assessment of quality.
        li Not all known plans are included.
        li Data on Google and Bing is pretty sparse.
        li All prices in USD unless noted.
</template>

<script>
import { EventBus } from '../EventBus';
export default {
    name: "FilterForm",
    data: () => ({
        public: false,
        free: false,
        permanent: false,
        openData: null,
        geocodesMonthly: 5000,//undefined,
        geocodesDaily: 100,//undefined,
        geocodesSecondly: undefined,
        bulkJobs: false,
        thirdParty: false,
        autoComplete: false,
        reverseGeocode: false,
        locationWeighting: false,
        mappingLibrary: false,
        payAnnually: false,
        autocompleteMultiplier: undefined // This is "how many autocompletes do I think I need per geocoded address"
    }),
    created() {
        window.FilterForm = this;
    },
    mounted() {
        this.$nextTick(() =>  EventBus.$emit('update-form', this));
    },
    watch: {
        $data: {
            handler() { 
                EventBus.$emit('update-form', this);
            },
            deep: true
        }
    }
}
</script>

<style scoped>
h4 {
    margin-bottom:0;
    margin-top: 0.5em;
}
.form-group {
    margin-bottom: 10px;
    clear:left;
    margin-left:20px;
}
input[type="number"] {
    border: 1px solid lightgrey;
    padding:8px;
    border-radius:4px;
    width:5em;
    margin-bottom:4px;
}
input[type="checkbox"] {
    margin-left:-20px;
    /* float: left; */
    /* display: inline-block; */
}

.radios .form-check {
    margin-left: 1em;
}

.radios {
    margin-bottom: 1em;
}

.caveats {
    padding-left: 0;
}

label {
    padding: 6px;
    /* line-height: 0; */
    /* margin-left:3em; */
    /* padding-left:3em; */
    /* display:block; */
    /* margin-top:-1em; */
    
    /* float:left; */
    /* text-indent:10px; */
}
</style>