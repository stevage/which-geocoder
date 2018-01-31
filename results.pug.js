module.exports = `
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
                        li(v-if="plan.permanent === true") ✅ Storing geocodes ok
                        li(v-if="typeof plan.permanent === 'string'") 🚫 Storing geocodes: {{ plan.permanent }}
                        li(v-if="!plan.permanent") 🚫 Must not store geocodes.
                        li(v-if="plan.thirdParty") ✅ Third-party basemaps ok
                        li(v-else) 🚫 Must not combine with third-party basemaps
                        li(v-if="plan.humanOnly") 🚫 No scripted queries
                        li(v-if="plan.freeRequired") <del>$</del> Free apps only
                        li(v-if="plan.publicRequired") App must be public
                        li.con(v-for="con in plan.provider.cons") 👎 {{ con }}
                        li(v-if="plan.provider.quality") {{ plan.provider.quality }}
                        li(v-if="plan.autocompleteMultiplier !== undefined") 1 autocomplete = {{ plan.autocompleteMultiplier }} transactions.
                        li(v-if="plan.termsUrl")
                            a(:href="plan.termsUrl") Terms and conditions
                        
                    div 
                        a(v-if="plan.provider.api.docs" :href="plan.provider.api.docs") API
                        span(v-else) API
                        
                    ul.api
                        li(v-if="plan.provider.api.autocomplete") ✓ Auto-complete
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
                        li(v-if="plan.provider.playUrl")
                            a(:href="plan.provider.playUrl") Test area


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

`;