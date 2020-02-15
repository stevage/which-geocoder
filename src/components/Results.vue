<template lang="pug">
#Results
    .flex.flex-wrap
        Result(v-for="plan in results" :plan="plan")

</template>

<script>
import { EventBus } from '../EventBus';
import Result from './Result.vue';
import plans from '../plans';
import * as calcs from '../calcs';
export default {
    name: "Results",
    components: { Result },
    data: () => ({
        results: [],
        
    }),
    created() {
        window.Results = this;
        EventBus.$on('update-form', form => {

            this.results = JSON.parse(JSON.stringify(plans))
                .filter(plan => planMeetsFilter(form, plan))
                .map(plan => {
                    plan._annualCost = def(annualCost(form, plan, monthlyTransactions(form, plan)), '?');
                    if (!plan.extra && plan.extraPer1000) {
                        plan.extra = '+ ' + (plan.currencySymbol || '$') + plan.extraPer1000 + '/1k';
                    }
                    return plan;
                }).sort((p1, p2) => {
                    return def(p1.sortDollars, toUSD(+p1._annualCost, p1)) - def(p2.sortDollars, toUSD(+p2._annualCost, p2));
                })
        });

    }
}

function toUSD(amount, plan) {
    const currencies = {
        // TODO update these live
        '€': 1.083,
        '£': 1.305,
        '$A': 0.67,
        'AUD': 0.67 // I know, I know
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

function annualCost(form, plan, monthlyRequests) {
    if (monthlyCost(form, plan, monthlyRequests) !== undefined) {
        return Math.max(monthlyCost(form, plan, monthlyRequests) * 12, def(plan.minDollarsYearly, 0));
    }
}

function dollarsMonthly(form, plan) {
    if (form.payAnnually && plan.dollarsAnnually) {
        return plan.dollarsAnnually / 12;
    }
    return plan.dollarsMonthly;
}

function monthlyCost(form, plan, monthlyRequests=0) {
    if (plan.totalMonthly !== undefined) {
        return plan.totalMonthly(monthlyRequests) * 12;
    } else if (dollarsMonthly(form, plan) !== undefined) {
        const chargedRequests = Math.max(monthlyRequests - def(plan.includedRequestsMonthly, plan.includedRequestsDaily * calcs.MONTH, 0), 0);
        return dollarsMonthly(form, plan) + def(plan.extraPer1000, 0) * chargedRequests / 1000 ;
    }
}

// How many transactions, including autocompletes, given how the plan calculates them
function monthlyTransactions(form, plan) {
    return def(form.geocodesMonthly, 0) + def(form.geocodesMonthly,0) * def(form.autocompleteMultiplier, 0) * def(plan.autocompleteMultiplier, 1);
}

function dailyTransactions(form, plan) {
    return def(form.geocodesDaily, 0) + def(form.geocodesDaily,0) * def(form.autocompleteMultiplier, 0) * def(plan.autocompleteMultiplier, 1);
}

function planMeetsFilter(form, plan) {
    console.log(calcs.MONTH);
    const p = plan;
    const limit = ((p.maxRequestsMonthly === false) ? 1e20 : p.maxRequestsMonthly) ||
        p.maxRequestsDaily * calcs.MONTH ||
        p.includedRequestsMonthly ||
        p.includedRequestsDaily * calcs.MONTH ||
        1e20;
    
    return (!p.publicRequired || form.public) && 
        (!p.freeRequired || form.free) &&
        (p.permanent === true || !form.permanent) &&
        (!p.humanOnly || !form.bulkJobs) &&
        (p.thirdParty || !form.thirdParty) &&
        (!(form.openData==='true' && !p.openData || form.openData === 'false' && p.openData)) &&
        (p.maxRequestsDaily === false || def(p.maxRequestsDaily, p.includedRequestsDaily) === undefined || def(p.maxRequestsDaily, p.includedRequestsDaily) >= dailyTransactions(form, plan)) &&
        (p.requestsPerSecond  === undefined || p.requestsPerSecond >= def(form.geocodesSecondly,0)) &&
        (def(p.provider.api, {}).autocomplete !== false || !form.autoComplete) &&
        (def(p.provider.api, {}).reverse !== false || !form.reverseGeocode) &&
        (!p.libraryRequired || !form.mappingLibrary) && 
        limit  >= monthlyTransactions(form, p);

}


</script>


<style scoped>

</style>