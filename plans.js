    /*
group: provider name
name: plan name
thirdParty=false: can combine results with third party maps? Defaults to no.
humanOnly=false: must queries be triggered by human actions? (ie, no bulk queries?) Defaults to no.
permanent=false: can geocodes be stored indefinitely? Defaults to no.
includedRequestsMonthly: how many requests included in monthly plan (defaults to 30*includedRequestsDaily)
includedRequestsDaily: how many requests per day included in monthly plan.
maxRequestsMonthly: cap on monthly requests, defaults to includedRequestsMonthly
conditions: array of dot points, things to be aware of
bonuses: array of dot points, good things
publicRequired=false: does your app have to be public facing to qualify
freeRequired=false: does your app have to be available at zero cost to qualify
dollarsMonthly: base monthly rate
sortDollars: annual price, for complicated plans, used for sorting only.
currencySymbol="$": currencySymbol symbol (just for display)
    
*/
const MONTH = 30.4;

module.exports = 
[
    {   
        group: 'HERE',
        name: 'Public Basic',
        includedRequestsMonthly: 15e3,
        maxRequestsMonthly:  15e3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 0,
        thirdParty: false,
        publicRequired: true
    },
    {   group: 'HERE',
        name: 'Public Starter',
        includedRequestsMonthly: 100e3,
        maxRequestsMonthly:  100e3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 49,
        thirdParty: false,
        publicRequired: true
    },
    {   
        group: 'HERE',
        name: 'Public Standard',
        includedRequestsMonthly: 250e3,
        maxRequestsMonthly:  250e3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 119,
        thirdParty: false,
        publicRequired: true
    },
    {   
        group: 'HERE',
        name: 'Public Pro',
        includedRequestsMonthly: 1e6,
        maxRequestsMonthly:  1e6,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 449,
        thirdParty: false,
        publicRequired: true
    },
    {   
        group: 'HERE',
        name: 'Public Custom',
        includedRequestsMonthly: undefined,
        maxRequestsMonthly:  undefined,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: undefined,
        custom: true,
        publicRequired: true,
        thirdParty: false, //?
        sortDollars: 5000
    },
    {   group: 'HERE',
        name: 'Business Starter',
        includedRequestsMonthly: 50e3,
        maxRequestsMonthly:  50e3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 199,
        thirdParty: false,
        publicRequired: false
    },
    {   
        group: 'HERE',
        name: 'Business Standard',
        includedRequestsMonthly: 100e3,
        maxRequestsMonthly:  100e3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 349,
        publicRequired: false,
        thirdParty: false,
    },
    {   
        group: 'HERE',
        name: 'Business Pro',
        includedRequestsMonthly: 150e3,
        maxRequestsMonthly:  150e3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 499,
        thirdParty: false,
        publicRequired: false
    },
    {   
        group: 'HERE',
        name: 'Business Custom',
        includedRequestsMonthly: undefined,
        maxRequestsMonthly:  undefined,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: undefined,
        bonuses: ['Permanent storage possible.'],
        custom: true,
        publicRequired: false,
        permanent: true,
        thirdParty: false, // presumably not
        sortDollars: 5500
    },
    {
        group: 'BING',
        name: 'Consumer, Free',
        includedRequestsMonthly: 125e3/12,
        maxRequestsMonthly:  125e3/12,
        dollarsMonthly: 0,
        publicRequired: true,
        freeRequired: true,
        thirdParty: false, // not certain but I think so
        conditions: ['Max 125,000 transactions per year'],
        url: 'https://www.microsoft.com/en-us/maps/licensing/options'
    }, {
        group: 'BING',
        name: 'Non-profit, Free',
        includedRequestsDaily: 50000,
        maxRequestsMonthly:  50000*MONTH,
        dollarsMonthly: 0,
        publicRequired: true,
        freeRequired: true, // "Applications that qualify for a limited website and consumer application use, which will be free of charge as defined in the SDKs"
        conditions: [
            'Must be non-profit.',
            'Less than 50k transactions per 24 hours.'
        ],
        thirdParty: false,
        url: 'https://www.microsoft.com/en-us/maps/licensing/options'

    },  {
        group: 'BING',
        name: 'Quote #1',
        includedRequestsMonthly: 500e3 / 12, // annually
        dollarsMonthly: 4620 / 12,
        sortDollars: 3680,
        thirdParty: false
    },  {
        group: 'BING',
        name: 'Quote #2',
        includedRequestsMonthly: 1e6 / 12, // annually
        dollarsMonthly: 6050 / 12,
        sortDollars: 4818,
        thirdParty: false
    }, {
        group: 'Mapbox',
        name: 'Pay-as-you-go',
        includedRequestsMonthly: 50e3,
        maxRequestsMonthly:  false,
        dollarsMonthly: 0,
        extra: '+ 50c/1000',
        extraPer1000: 0.5,
        publicRequired: true,
        requestsPerSecond: 600 / 60,
        freeRequired: true,
        thirdParty: false,
        conditions: ['No bulk jobs.', 'Mapbox maps only'],
        // totalMonthly: requests => 0 + 0.50 * (Math.max(requests - 50e3, 0) / 1000),
        humanOnly: true,
        url: 'https://www.mapbox.com/pricing/'

  }, {
        group: 'Mapbox',
        name: 'Commercial',
        includedRequestsMonthly: 50e3,
        maxRequestsMonthly:  false,
        dollarsMonthly: 499,
        publicRequired: false,
        thirdParty: false,
        requestsPerSecond: 600 / 60,
        conditions: ['Max 250 seats (unique users).','No bulk jobs.', 'Mapbox maps only'],
        extraPer1000: 0.5,
        extra: '+$0.50 per 1000 requests',
        // totalMonthly: requests => 499 + 0.50 * (Math.max(requests - 50e3, 0) / 1000),
        humanOnly: true,
        url: 'https://www.mapbox.com/pricing/',

    }, {
        group: 'Mapbox',
        name: 'Enterprise',
        includedRequestsMonthly: undefined,
        maxRequestsMonthly:  false,
        dollarsMonthly: undefined,
        custom:true,
        publicRequired: false,
        thirdParty: false,
        requestsPerSecond: 1200 / 60,
        permanent: true,
        bonuses: ['50 locations per request','Permanent storage ok'],
        sortDollars: 12500, // I think?
        humanOnly: true,
        url: 'https://www.mapbox.com/pricing/'

    },
    {
        group: 'OpenCage',
        name: 'Free Trial',
        includedRequestsDaily: 2500,
        requestsPerSecond: 1,
        dollarsMonthly: 0,
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://geocoder.opencagedata.com/pricing'
    },
    {
        group: 'OpenCage',
        name: 'X-Small',
        includedRequestsDaily: 10e3,
        requestsPerSecond: 10,
        dollarsMonthly: 50,
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://geocoder.opencagedata.com/pricing'
    },
    {
        group: 'OpenCage',
        name: 'Small',
        includedRequestsDaily: 20e3,
        requestsPerSecond: 12,
        dollarsMonthly: 100,
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://geocoder.opencagedata.com/pricing'
    },
    {
        group: 'OpenCage',
        name: 'Medium',
        includedRequestsDaily: 100e3,
        requestsPerSecond: 15,
        dollarsMonthly: 500,
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://geocoder.opencagedata.com/pricing'
    },
    {
        group: 'OpenCage',
        name: 'Large',
        includedRequestsDaily: 1e6,
        // includedRequestsMonthly: 1e6 * MONTH,
        requestsPerSecond: 15,
        dollarsMonthly: 1000,
        permanent: true,
        url: 'https://geocoder.opencagedata.com/pricing',
        openData: true,
        thirdParty: true,
    },
    {
        group: 'Google',
        name: 'Standard',
        includedRequestsDaily: 2500,
        includedRequestsMonthly: 2500 * MONTH,
        maxRequestsMonthly: 100e3,
        freeRequired: true,
        publicRequired: true,
        totalMonthly: requests => 0 + 0.5 * Math.max(requests - 2500 * MONTH, 0) / 1000,
        url: 'https://developers.google.com/maps/pricing-and-plans/#details',
        thirdParty: false,
        conditions: ['Very restrictive terms of use'],
        bonuses: ['Excellent worldwide quality'],
    },
    {
        group: 'Google',
        name: 'Premium',
        includedRequestsMonthly: 100e3 * MONTH,
        custom: true,
        url: 'https://developers.google.com/maps/premium/usage-limits',
        sortDollars: 20000,
        thirdParty: false,
        conditions: ['Very restrictive terms of use'],
        bonuses: ['Excellent worldwide quality'],
        // 1 geocoding request=0.25 credits
        // maxRequsetsMonthly: 100e3
        // totalMonthly: requests => 0 + 0.5 * Math.max(requests - 2500 * MONTH, 0) / 1000
    },
    {
        group: 'Mapzen (RIP)',
        name: 'Flex',
        includedRequestsMonthly: 25000,
        maxRequestsMonthly: false,
        dollarsMonthly: 0,
        extraPer1000: 0.5,
        extra: '+ 50c / 1,000',
        conditions: ['⚠ Service is shutting down'],
        totalMonthly: requests => 0 + 0.5 * Math.max(requests - 25000, 0) / 1000,
        url: 'https://mapzen.com/pricing/',
        thirdParty: true,
        openData: true,
        permanent: true
    },
    {
        group: 'SmartyStreets',
        name: 'International 1000',
        includedRequestsMonthly: 1e3,
        dollarsMonthly: 65,
        url: 'https://smartystreets.com/pricing/international',
        thirdParty: true,
        autocomplete: false
    },
    {
        group: 'SmartyStreets',
        name: 'International 10,000',
        includedRequestsMonthly: 10e3,
        dollarsMonthly: 592,
        url: 'https://smartystreets.com/pricing/international',
        thirdParty: true,
        autocomplete: false
    },
    {
        group: 'SmartyStreets',
        name: 'International 100,000',
        includedRequestsMonthly: 100e3,
        dollarsMonthly: 5400,
        url: 'https://smartystreets.com/pricing/international',
        thirdParty: true,
        autocomplete: false
    },
    {
        group: 'SmartyStreets',
        name: 'International 1,000,000',
        includedRequestsMonthly: 1e6,
        dollarsMonthly: 50000,
        url: 'https://smartystreets.com/pricing/international',
        thirdParty: true,
        autocomplete: false
    },
    {
        group: 'Geocode.xyz',
        name: 'Throttled API',
        dollarsMonthly: 0,
        requestsPerSecond: 1,
        maxRequestsDaily: 86400,// in principle...
        includedRequestsMonthly: 1e12,
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://geocode.xyz/pricing',
    },
    {
        group: 'Geocode.xyz',
        name: 'Pay-per-use',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        includedRequestsMonthly: 0,
        extraPer1000: 2.5,
        extra: '+ €2.50/1000 requests',
        // totalMonthly: requests => 0 + 0.0025 * requests,
        currencySymbol: '€',
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://geocode.xyz/pricing',
    },
    {
        group: 'Geocode.xyz',
        name: 'Monthly unlimited',
        dollarsMonthly: 100,
        maxRequestsMonthly: false,
        includedRequestsMonthly: 1e12,
        // extras: '€2.50/1000 requests',
        extras: 'Unlimited requests',
        // totalMonthly: requests => 0 + 0.0025 * requests,
        currencySymbol: '€',
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://geocode.xyz/pricing',
    },
    {
        group: 'LocationIQ',
        name: 'Developer',
        dollarsMonthly: 0,
        includedRequestsDaily: 10e3,
        requestsPerSecond: 60/60,
        freeRequired: true,
        url: 'https://locationiq.org/',
        openData: true,
        permanent: false,
        thirdParty: true,
        humanOnly: true
    },
    {
        group: 'LocationIQ',
        name: 'Professional',
        dollarsMonthly: 50,
        includedRequestsDaily: 20e3,
        requestsPerSecond: 600/60,
        freeRequired: false,
        url: 'https://locationiq.org/',
        openData: true,
        permanent: false,
        thirdParty: true,
        humanOnly: true
    },
    {
        group: 'LocationIQ',
        name: 'Startup',
        dollarsMonthly: 100,
        includedRequestsDaily: 50e3,
        requestsPerSecond: 720/60,
        freeRequired: false,
        url: 'https://locationiq.org/',
        openData: true,
        permanent: false,
        thirdParty: true,
        humanOnly: true
    },
    {
        group: 'LocationIQ',
        name: 'Business',
        dollarsMonthly: 200,
        includedRequestsDaily: 100e3,
        requestsPerSecond: 900/60,
        freeRequired: false,
        url: 'https://locationiq.org/',
        openData: true,
        permanent: false,
        thirdParty: true,
        humanOnly: true
    },
    {
        group: 'LocationIQ',
        name: 'Business Plus',
        dollarsMonthly: 500,
        includedRequestsDaily: 500e3,
        requestsPerSecond: 1200/60,
        freeRequired: false,
        url: 'https://locationiq.org/',
        openData: true,
        permanent: false,
        thirdParty: true,
        humanOnly: true
    },
    {
        group: 'LocationIQ',
        name: 'Enterprise',
        custom:true,
        // dollarsMonthly: 0,
        // includedRequestsDaily: 10e3,
        url: 'https://locationiq.org/',
        openData: true,
        thirdParty: true,
        permanent: false,
        sortDollars: 1000
        //humanOnly: true // I'm guessing...
    },
    {
        group: 'Mapquest',
        name: 'Free',
        dollarsMonthly: 0,
        includedRequestsMonthly: 15e3,
        thirdParty: false,
        permanent: false,
        humanOnly: true,
        url: 'https://developer.mapquest.com/plans'
    },
    {
        group: 'Mapquest',
        name: 'Basic',
        dollarsMonthly: 99,
        includedRequestsMonthly: 30e3,
        thirdParty: false,
        permanent: false,
        humanOnly: true,
        conditions: ['Excess usage billed as "overage"'],
        url: 'https://developer.mapquest.com/plans'
    },
    {
        group: 'Mapquest',
        name: 'Plus',
        dollarsMonthly: 199,
        includedRequestsMonthly: 75e3,
        thirdParty: false,
        permanent: false,
        humanOnly: true,
        conditions: ['Excess usage billed as "overage"'],
        url: 'https://developer.mapquest.com/plans'
    },
    {
        group: 'Mapquest',
        name: 'Business',
        dollarsMonthly: 399,
        includedRequestsMonthly: 200e3,
        thirdParty: false,
        permanent: false,
        humanOnly: true,
        conditions: ['Excess usage billed as "overage"'],
        url: 'https://developer.mapquest.com/plans'
    },
    {
        group: 'Mapquest',
        name: 'Business Plus',
        dollarsMonthly: 799,
        includedRequestsMonthly: 500e3,
        thirdParty: false,
        permanent: false,
        humanOnly: true,
        conditions: ['Excess usage billed as "overage"'],
        url: 'https://developer.mapquest.com/plans'
    },
    {
        group: 'Mapquest',
        name: 'Business Enhanced',
        dollarsMonthly: 499,
        includedRequestsMonthly: 200e3,
        bonuses: ['Store results (US+Canada)','Bulk queries, third-party-maps'],
        conditions: ['6 month commitment'],
        thirdParty: true,
        conditions: ['Excess usage billed as "overage"'],
        url: 'https://developer.mapquest.com/plans',
        permanent: true
    },
    {
        group: 'Mapquest',
        name: 'Business Plus Enhanced',
        dollarsMonthly: 899,
        includedRequestsMonthly: 500e3,
        bonuses: ['Store results (US + Canada)','Bulk queries, third-party-maps'],
        conditions: ['6 month commitment'],
        thirdParty: true,
        conditions: ['Excess usage billed as "overage"'],
        url: 'https://developer.mapquest.com/plans',
        permanent: true
    },
    {
        group: 'Mapquest',
        name: 'Enterprise',
        custom: true,
        thirdParty: true,
        conditions: ['Excess usage billed as "overage"'],
        url: 'https://developer.mapquest.com/plans',
        permanent: true,
        sortDollars: 12000
    },
    {
        group: 'Yandex',
        name: 'Free',
        thirdParty: false,
        humanOnly: true,
        publicRequired: true,
        freeRequired: true,
        permanent: false,
        includedRequestsMonthly: 25e3,
        dollarsMonthly: 0,
        url: 'https://tech.yandex.com/maps/doc/jsapi/2.1/terms/index-docpage/?from=geocoder#conditions'
    },
    {
        group: 'Yandex',
        name: 'API for Business',
        thirdParty: false,
        humanOnly: true,
        permanent: true,
        includedRequestsMonthly: 100000,
        conditions: ['Primarily eastern Europe', 'Storing geocodes "On request"', 'Processing without showing "On request"'],
        publicRequired: false,
        dollarsMonthly: 100000,
        sortDollars:1772*12,//USD
        currencySymbol: '₽', //rubles!
        url: 'https://tech.yandex.com/maps/commercial/?from=geocoder'
    },
    {
        group: 'Pitney-Bowes',
        name: 'Geocode Premium',
        url: 'https://locate.pitneybowes.com/',
        custom: true,
        sortDollars:20000, // https://locate.pitneybowes.com/ // wonder how much it is
        conditions: ['No public plan information']
    },
    {
        group: 'Geocode.farm',
        name: 'Bronze',
        includedRequestsDaily: 25e3,
        dollarsMonthly: 100,
        currencySymbol: '£',
        url: 'https://geocode.farm/our-packages/',
        conditions:['Based in Belize','⚠ "No chargebacks ever" policy'],
        permanent: true,
        thirdParty: true
    },
    {
        group: 'Geocode.farm',
        name: 'Silver',
        includedRequestsDaily: 50e3,
        dollarsMonthly: 200,
        currencySymbol: '£',
        url: 'https://geocode.farm/our-packages/',
        conditions:['Based in Belize','⚠"No chargebacks ever" policy'],
        permanent: true,
        thirdParty: true
    },
    {
        group: 'Geocode.farm',
        name: 'Gold',
        includedRequestsDaily: 100e3,
        dollarsMonthly: 300,
        currencySymbol: '£',
        url: 'https://geocode.farm/our-packages/',
        conditions:['Based in Belize','⚠"No chargebacks ever" policy'],
        permanent: true,
        thirdParty: true
    },
    {
        group: 'Geocode.farm',
        name: 'Platinum',
        includedRequestsDaily: 1e6,
        dollarsMonthly: 1000,
        currencySymbol: '£',
        url: 'https://geocode.farm/our-packages/',
        conditions:['£1000 setup fee', 'Based in Belize','⚠"No chargebacks ever" policy'],
        permanent: true,
        thirdParty: true
    },
    {
        group: 'Yahoo BOSS PlaceFinder',
        name: '0-10,000',
        includedRequestsDaily: 0,
        maxRequestsDaily: 10e3,
        dollarsMonthly: 0,
        url: 'https://developer.yahoo.com/boss/geo/#pricing',
        extra: '+ $6/1000',
        extraPer1000: 6,
        totalMonthly: requests => 0 + (requests /1000) * 6
    },
    {
        group: 'Yahoo BOSS PlaceFinder',
        name: '10,0001-35,000',
        includedRequestsDaily: 10000,
        maxRequestsDaily: 35000,
        dollarsMonthly: (10000 / 1000) * 4 * MONTH,
        extra: '+ $4/1000',
        extraPer1000: 4,
        url: 'https://developer.yahoo.com/boss/geo/#pricing',
        totalMonthly: requests => 0 + Math.max(requests, 10001) /1000 * 4
    },
    {
        group: 'Yahoo BOSS PlaceFinder',
        name: '35,000+',
        includedRequestsDaily: 35000,
        maxRequestsDaily: false,
        dollarsMonthly: (35000 / 1000 * 3) * 30,
        extra: '+ $3/1000',
        extraPer1000: 3,
        url: 'https://developer.yahoo.com/boss/geo/#pricing',
        totalMonthly: requests => 0 + Math.max(requests, 35000) /1000 * 3
    },
    {
        group: 'Maplarge',
        name: 'Bulk upload',
        dollarsMonthly: 0,
        extra: '+ $4/1000',
        extraPer1000: 4,
        bonuses: ['Cheaper at higher rates'],
        conditions: ['Pricing of API unknown'],
        url: 'http://www.maplarge.com/geocoder#pricing',
        thirdParty: true, // probably
        // totalMonthly: requests => requests / 1000 * 4
    },
    {
        group: 'Nominatim',
        name: 'Public API',
        dollarsMonthly: 0,
        maxRequestsDaily: 1000,
        requestsPerSecond: 1,
        bonuses: ['No hard limits'],
        conditions: ['Caching strongly urged','No big jobs','Attribution required', 'No autocomplete'],
        permanent: true,
        humanOnly: false,
        openData: true,
        thirdParty: true
    },
    {
        group: 'Tomtom',
        name: '50,000 public',
        dollarsMonthly: 25,
        includedRequestsMonthly: 50e3,
        thirdParty: false,
        permanent: false,
        publicRequired: true,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '1,000,000 public',
        dollarsMonthly: 449,
        includedRequestsMonthly: 1e6,
        thirdParty: false,
        permanent: false,
        publicRequired: true,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '10,000,000 public',
        dollarsMonthly: 4199,
        includedRequestsMonthly: 10e6,
        thirdParty: false,
        permanent: false,
        publicRequired: true,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '50,000 private',
        dollarsMonthly: 0,
        extraPer1000: 199 / 50,
        extra: '+ $199/50k',
        // includedRequestsMonthly: 50e3,
        thirdParty: false,
        permanent: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '100,000 private',
        dollarsMonthly: 0,
        extraPer1000: 379 / 100,
        extra: '+ $379/100k',
        thirdParty: false,
        permanent: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '250,000 private',
        dollarsMonthly: 0,
        extraPer1000: 909 / 250,
        extra: '+ $909/250k',
        thirdParty: false,
        permanent: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '500,000 private',
        dollarsMonthly: 0,
        extraPer1000: 1719 / 500,
        extra: '+ $1719/500k',
        thirdParty: false,
        permanent: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '1,000,000 private',
        dollarsMonthly: 0,
        extraPer1000: 3249 / 1000,
        extra: '+ $3249 / 1000k',
        // includedRequestsMonthly: 1e6,
        thirdParty: false,
        permanent: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },
    {
        group: 'Tomtom',
        name: '10,000,000 private',
        dollarsMonthly: 27499,
        includedRequestsMonthly: 10e6,
        thirdParty: false,
        permanent: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last indefinitely']
    },

    
    
    ];

console.log(module.exports.length + ' plans loaded.');