/* jshint esnext:true */
const Vue = require('vue');
const pug = require('pug');
const _ = require('lodash');
const thousands = require('thousands');

const formTemplate = pug.render(`
#form
    .form.container
        h4 I use about
        .form-row
            
            input#monthly-geocodes.form-control(type="number" placeholder="5000" v-model="geocodesMonthly")
            label(for=monthly-geocodes) geocodes per month
        h4 My app is...
        .form-group
            input.form-check-input#public-facing(type="checkbox" v-model="public")
            label.form-check-label(for="public-facing") Accessible to the public
        .form-group
            input.form-check-input#free(type="checkbox" v-model="free")
            label.form-check-label(for="free") Free of charge
        h4 I need to
        .form-group
            input.form-check-input#permanent-geocodes(type="checkbox" v-model="permanent")
            label.form-check-label(for="permanent-geocodes") Store geocodes permanently
        .form-group
            input.form-check-input#bulk-jobs(type="checkbox" v-model="bulkJobs")
            label.form-check-label(for="bulk-jobs") Carry out bulk jobs not triggered by users
        .form-group
            input.form-check-input#third-party(type="checkbox" v-model="thirdParty")
            label.form-check-label(for="third-party") Show results on third-party maps
        h4 Open data:
        .form-check.form-check-inline
            input.form-check-input#open-data-ok(type="radio" name="open-data" v-model="openData")
            label.form-check-label(for="open-data-ok") It's ok
        .form-check.form-check-inline
            input.form-check-input#open-data-love(type="radio" value='true' name="open-data" v-model="openData")
            label.form-check-label(for="open-data-love") Love it
        .form-check.form-check-inline
            input.form-check-input#open-data-hate(type="radio" value='false' name="open-data" v-model="openData")
            label.form-check-label(for="open-data-hate") Hate it

        
`);

const form = new Vue({
    el: '#form',
    data: {
        public: false,
        free: false,
        permanent: false,
        openData: null,
        geocodesMonthly: undefined,
        bulkJobs: false,
        thirdParty: false
    }, 
    template: formTemplate
});
window.form=form;


Vue.filter('money', function(x, currency='$') {
    if (x === undefined) {
        return '?';
    } else if (typeof x === 'number') {
        return currency + thousands(x.toFixed(0));
    } else {
        return currency + x;
    }
});

Vue.filter('integer', function(x) {
    if (x === 1e12)
        return 'unlimited'
    else if (typeof x === 'number')
        return thousands(x.toFixed(0));
    else
        return x;
});

const resultsTemplate = pug.render(`
#results
    .row
        .col-sm-3.mb-3.mr-1.border-secondary.border.rounded(v-for="plan in plans")
            // h4.card-title {{ plan.name }} 
            // h6.mb-3.card-subtitle.text-muted {{ plan.group }}
            h4.card-title {{ plan.group }} 
            h6.mb-3.card-subtitle.text-muted {{ plan.name }}
            p
                b {{ plan.dollarsMonthly | money(plan.currency) }} 
                span for 
                span(v-if="plan.includedRequestsMonthly !== undefined")
                    b {{ plan.includedRequestsMonthly | integer }} 
                    span /mo.
                span(v-else-if="plan.includedRequestsDaily")
                    b {{ plan.includedRequestsDaily | integer }} 
                    span /day ({{ plan.includedRequestsDaily * 30 | integer}} /mo.)
                .extra(v-if="plan.extra")
                    p {{ plan.extra }}
                    p {{ plan.bonuses }}
                div(v-if="plan.requestsPerSecond")
                    p Rate limit: {{ plan.requestsPerSecond }} per sec
                ul.bonuses.alert.alert-success(v-if="plan.bonuses")
                    li(v-for="bonus in plan.bonuses") {{ bonus }}
                ul.conditions.alert.alert-warning(v-if="plan.conditions")
                    li(v-for="condition in plan.conditions") {{ condition }}
            p.more-info(v-if="plan.url")
                a(v-bind:href="plan.url") More info...
                        
            // p.alert.alert-info Annual: {{ plan._annualCost | money(plan.currency) }}
            h5.annual-price {{ plan._annualCost | money(plan.currency) }} <small>yearly</small>

`);                               
console.log(resultsTemplate);

function def(a, b, c) {
    if (a === undefined)
        return def(b,c);
    return a;
}

const results = new Vue({
    el: '#results',
    computed: {
        plans: function() {
            let plans = _.clone(require('./plans'))
                .filter(p => !p.publicRequired || form.public)
                .filter(p => !p.freeRequired || form.free)
                .filter(p => p.permanent || !form.permanent)
                .filter(p => !p.humanOnly || !form.bulkJobs)
                .filter(p => p.thirdParty || !form.thirdParty)
                .filter(p => !(form.openData==='true' && !p.openData || form.openData === 'false' && p.openData))
                .filter(p => {
                    let limit = (p.maxRequestsMonthly === false) ? 1e20 : p.maxRequestsMonthly;
                    limit = limit || def (p.includedRequestsMonthly, p.includedRequestsDaily ? p.includedRequestsDaily * 30 : 1e20);
                    return limit  > (form.geocodesMonthly || 0);
                }).map(p => {
                    if (p.dollarsMonthly !== undefined) {
                        if (p.totalMonthly) {
                            p._annualCost = p.totalMonthly(form.geocodesMonthly || 0) * 12;
                        } else {
                            p._annualCost = 12 * p.dollarsMonthly; 
                        }
                        // console.log(p.name, p.sortDollars, p._annualCost);
                    } else {
                        p._annualCost = '???';
                    }
                    return p;
                }).sort((p1, p2) => {
                    // console.log(p1.name, 'v', p2.name,':', p1.sortDollars, p1._annualCost, p2.sortDollars, p2._annualCost, def(p1.sortDollars, p1._annualCost) - def(p2.sortDollars, p2._annualCost));
                    return def(p1.sortDollars, p1._annualCost) - def(p2.sortDollars, p2._annualCost)

                });
            console.log(plans.map(p => p.name));
            return plans;
        }
    },
    template: resultsTemplate
});
window.plans = results.plans;
