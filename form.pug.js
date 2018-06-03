module.exports = `
#form
    .form.container
        h4 I use about
        .usage
            .form-row            
                input#monthly-geocodes.form-control(type="number" placeholder="5000" v-model.number="geocodesMonthly")
                label(for=monthly-geocodes) geocodes per month
            .form-row            
                input#daily-geocodes.form-control(type="number" placeholder="1000" v-model.number="geocodesDaily")
                label(for=daily-geocodes) geocodes on busy days
            .form-row            
                input#secondly-geocodes.form-control(type="number" placeholder="1" v-model.number="geocodesSecondly")
                label(for=secondly-geocodes) geocodes per second
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
            .form-row 
                input#autocomplete-multiplier.form-control(type="number" placeholder="10" v-model.number="autocompleteMultiplier" :disabled="!autoComplete")
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
        h4 Random
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
        

    h5#caveats.background-light Caveats
    ul
        li Annual-payment discounts are not included.
        li No assessment of quality.
        li Not all known plans are included.
        li Data on Google and Bing is pretty sparse.
        li All prices in USD unless noted.

`;
