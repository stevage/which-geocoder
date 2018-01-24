/* jshint esnext:true */
const Vue = require('vue');
const pug = require('pug');
const _ = require('lodash');
const thousands = require('thousands');
const MONTH = 30.4;
const formTemplate = pug.render(`
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
            label.form-check-label(for="pay-annually") Happy to pay anually
        

    h5#caveats.background-light Caveats
    ul
        li Annual-payment discounts are not included.
        li No assessment of quality.
        li Not all known plans are included.
        li Data on Google and Bing is pretty sparse.
        li All prices in USD unless noted.

`);

const form = new Vue({
    el: '#form',
    data: {
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
        autocompleteMultiplier: undefined
    },
    template: formTemplate
});

window.form=form;

if (window.location.hash.match('smartygrants')) {
    // SmartyGrants needs
    form.public = true;
    form.bulkJobs = true;
    form.geocodesMonthly = 40000;
    form.geocodesDaily = 10000;
    form.geocodesSecondly = 5;
    form.autoComplete = true;
    form.autocompleteMultiplier = 10;
    form.reverseGeocode = true;
    form.mappingLibrary = true;
}

Vue.filter('money', function(x, currencySymbol='$') {
    if (x === undefined) {
        return '?';
    } else if (typeof x === 'number') {
        return currencySymbol + thousands(x.toFixed(0));
    } else {
        return currencySymbol + x;
    }
});

Vue.filter('integer', function(x) {
    if (x === 1e12)
        return 'unlimited';
    else if (typeof x === 'number')
        return thousands(x.toFixed(0));
    else
        return x;
});
//🚫

const resultsTemplate = pug.render(`
#results
    .row
        .col-sm-3.mb-3.mr-1.border-secondary.border.rounded(v-for="plan in plans")
            // h4.card-title {{ plan.name }} 
            // h6.mb-3.card-subtitle.text-muted {{ plan.group }}
            h4.card-title {{ plan.group }} 
            h6.mb-3.card-subtitle.text-muted {{ plan.name }}
            .plan-details
                .plan-details-inner
                    div(v-if="!plan.custom")
                        b {{ plan.dollarsMonthly | money(plan.currencySymbol) }} 
                        span(v-if="plan.includedRequestsMonthly !== undefined")
                            span for 
                            b {{ plan.includedRequestsMonthly | integer }} 
                            span /mo.
                        span(v-else-if="plan.includedRequestsDaily")
                            span for 
                            b {{ plan.includedRequestsDaily | integer }} 
                            span /day ({{ plan.includedRequestsDaily * MONTH | integer}} /mo.)
                        .extra(v-if="plan.extra")
                            p {{ plan.extra }}
                            // p {{ plan.bonuses }}
                        p(v-if="plan.maxRequestsDaily")
                            span {{ plan.maxRequestsDaily | integer}} requests per day max.
                    div(v-else)
                        p Custom plan by negotiation.
                    div(v-if="plan.requestsPerSecond")
                        p Rate limit: {{ plan.requestsPerSecond }} per sec
                    ul.details
                        li(v-if="plan.openData") ℹ Based on open data
                        li(v-if="plan.permanent") ✅ Storing geocodes ok
                        li(v-else) 🚫 Must not store geocodes.
                        li(v-if="plan.thirdParty") ✅ Third-party basemaps ok
                        li(v-else) 🚫 Must not combine with third-party basemaps
                        li(v-if="plan.humanOnly") 🚫 No scripted queries
                        li(v-if="plan.freeRequired") <del>$</del> Free apps only
                        li(v-if="plan.publicRequired") App must be public
                        li.con(v-for="con in plan.provider.cons") 👎 {{ con }}
                        li(v-if="plan.provider.quality") {{ plan.provider.quality }}
                        li(v-if="plan.autocompleteMultiplier !== undefined") 1 autocomplete = {{ plan.autocompleteMultiplier }} transactions.
                        
                    div 
                        a(v-if="plan.provider.api.docs" :href="plan.provider.api.docs") API
                        span(v-else) API
                        
                    ul.api
                        li(v-if="plan.provider.api.autocomplete") ✓Auto-complete
                            a(v-if="typeof plan.provider.api.autocomplete === 'string'" :href="plan.provider.api.autocomplete") &nbsp;ℹ
                        li(v-if="plan.provider.api.autocomplete === undefined") ? Auto-complete unknown
                        li(v-if="plan.provider.api.autocomplete === false") 𐄂 No auto-complete

                        li(v-if="plan.provider.api.reverse") ✓ Reverse-geocode
                            a(v-if="typeof plan.provider.api.reverse === 'string'" :href="plan.provider.api.reverse") &nbsp;ℹ
                        li(v-if="plan.provider.api.reverse === undefined") ? Reverse-geocode unknown
                        li(v-if="plan.provider.api.reverse === false") 𐄂 No reverse-geocode

                        li(v-if="plan.provider.api.locationWeighting") ✓ Location-weighting
                            a(v-if="typeof plan.provider.api.locationWeighting === 'string'" :href="plan.provider.api.locationWeighting") &nbsp;ℹ
                        li(v-if="plan.provider.api.locationWeighting === undefined") ? Location-weighting unknown
                        li(v-if="plan.provider.api.locationWeighting === false") 𐄂 No location-weighting


                    ul.bonuses.alert.alert-success(v-if="plan.bonuses")
                        li(v-for="bonus in plan.bonuses") {{ bonus }}
                    ul.conditions.alert.alert-warning(v-if="plan.conditions")
                        li(v-for="condition in plan.conditions") {{ condition }}
            p.spacer
            // p.more-info(v-if="plan.url")
                
                        
            // p.alert.alert-info Annual: {{ plan._annualCost | money(plan.currencySymbol) }}
            h5
                a(v-bind:href="plan.url")
                    .annual-price {{ plan._annualCost | money(plan.currencySymbol) }}<small>/yr</small>

`);                               
// console.log(resultsTemplate);

function toUSD(amount, plan) {
    const currencies = {
        '€': 1.23,
        '£': 1.38,
        '$A': 0.8,
        'AUD': 0.8 // I know, I know
    }
    if (Number.isNaN(amount)) {
        console.log(amount, plan.currencySymbol + ' = ' + (currencies[plan.currencySymbol] || 1) * amount + '$');
        console.log(plan.sortDollars);
        console.log(plan)
    }

    return (currencies[plan.currencySymbol] || currencies[plan.currency] || 1) * amount;
}

function def(a, b, c) {
    if (a !== undefined && !Number.isNaN(a))
        return a;
    if (b !== undefined && !Number.isNaN(b))
        return b;
    return c;
}

function annualCost(plan, monthlyRequests) {

    if (monthlyCost(plan, monthlyRequests) !== undefined) {
        return monthlyCost(plan, monthlyRequests) * 12;
    }
}

function dollarsMonthly(plan) {
    if (form.payAnnually && plan.dollarsAnnually) {
        return plan.dollarsAnnually / 12;
    }
    return plan.dollarsMonthly;
}

function monthlyCost(plan, monthlyRequests=0) {
    if (plan.totalMonthly !== undefined) {
        return plan.totalMonthly(monthlyRequests) * 12;
    } else if (dollarsMonthly(plan) !== undefined) {
        const chargedRequests = Math.max(monthlyRequests - def(plan.includedRequestsMonthly, plan.includedRequestsDaily * MONTH, 0), 0);
        return dollarsMonthly(plan) + def(plan.extraPer1000, 0) * chargedRequests / 1000 ;
    }
}
window.monthlyCost = monthlyCost;

// How many transactions, including autocompletes, given how the plan calculates them
function monthlyTransactions(plan) {
    return def(form.geocodesMonthly, 0) + def(form.geocodesMonthly,0) * def(form.autocompleteMultiplier, 0) * def(plan.autocompleteMultiplier, 1);
}

function dailyTransactions(plan) {
    return def(form.geocodesDaily, 0) + def(form.geocodesDaily,0) * def(form.autocompleteMultiplier, 0) * def(plan.autocompleteMultiplier, 1);
}



function planMeetsFilter(plan, form) {
    const p = plan;
    return (!p.publicRequired || form.public) && 
        (!p.freeRequired || form.free) &&
        (p.permanent || !form.permanent) &&
        (!p.humanOnly || !form.bulkJobs) &&
        (p.thirdParty || !form.thirdParty) &&
        (!(form.openData==='true' && !p.openData || form.openData === 'false' && p.openData)) &&
        (p.maxRequestsDaily === false || def(p.maxRequestsDaily, p.includedRequestsDaily) === undefined || def(p.maxRequestsDaily, p.includedRequestsDaily) >= dailyTransactions(plan)) &&
        (p.requestsPerSecond  === undefined || p.requestsPerSecond >= def(form.geocodesSecondly,0)) &&
        (def(p.provider.api, {}).autocomplete !== false || !form.autoComplete) &&
        (def(p.provider.api, {}).reverse !== false || !form.reverseGeocode) &&
        (!p.libraryRequired || !form.mappingLibrary);
}
window.planMeetsFilter = planMeetsFilter;




const results = new Vue({
    el: '#results',
    computed: {
        MONTH: () => MONTH,
        plans: function() {
            let plans = _.clone(require('./plans'))
                .filter(p => planMeetsFilter(p, form))
                .filter(p => {
                    let limit = ((p.maxRequestsMonthly === false) ? 1e20 : p.maxRequestsMonthly) ||
                        p.maxRequestsDaily * MONTH ||
                        p.includedRequestsMonthly ||
                        p.includedRequestsDaily * MONTH ||
                        1e20;
                    return limit  >= monthlyTransactions(p);
                }).map(p => {
                    p._annualCost = def(annualCost(p, monthlyTransactions(p)), '?');
                    return p;
                    /*if (p.dollarsMonthly !== undefined) {
                        if (p.totalMonthly) {
                            p._annualCost = p.totalMonthly(form.geocodesMonthly || 0) * 12;
                        } else {
                            p._annualCost = 12 * (p.dollarsMonthly + (p.extraPer1000 || 0) * (form.geocodesMonthtly || 0) / 1000) ; 
                        }
                        // console.log(p.name, p.sortDollars, p._annualCost);
                    } else {
                        p._annualCost = '?';
                    }
                    return p;*/
                }).sort((p1, p2) => {
                    // console.log(p1.name, 'v', p2.name,':', p1.sortDollars, p1._annualCost, p2.sortDollars, p2._annualCost, def(p1.sortDollars, p1._annualCost) - def(p2.sortDollars, p2._annualCost));
                    return def(p1.sortDollars, toUSD(+p1._annualCost, p1)) - def(p2.sortDollars, toUSD(+p2._annualCost, p2));

                });
            console.log(plans.map(p => [p.group, p.name, p._annualCost, p.sortDollars]));
            return plans;
        }
    },
    template: resultsTemplate
});
window.plans = results.plans;
