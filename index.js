/* jshint esnext:true */
const Vue = require('vue');
const pug = require('pug');
const _ = require('lodash');
const thousands = require('thousands');
const MONTH = 30.4;

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
    template: pug.render(require('./form.pug.js'))
});

window.form=form;

if (window.location.hash.match('smartygrants')) {
    // SmartyGrants needs
    Object.assign(form, {
        public: true,
        bulkJobs: true,
        geocodesMonthly: 40000,
        geocodesDaily: 10000,
        geocodesSecondly: 2,
        autoComplete: true,
        autocompleteMultiplier: 10,
        reverseGeocode: true,
        mappingLibrary: true,
        payAnnually: true
    });
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
        return Math.max(monthlyCost(plan, monthlyRequests) * 12, def(plan.minDollarsYearly, 0));
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
        (p.permanent === true || !form.permanent) &&
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
                    if (!p.extra && p.extraPer1000) {
                        p.extra = '+ ' + (p.currencySymbol || '$') + p.extraPer1000 + '/1k';
                    }
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
            // console.log(plans.map(p => [p.group, p.name, p._annualCost, p.sortDollars]));
            return plans;
        }
    }, template: pug.render(require('./results.pug.js'))
});
window.plans = results.plans;
