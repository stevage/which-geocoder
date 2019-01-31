    /*
providers:

api: {
    docs: url to documentation
    autocomplete: is there an autocomplete API? (false if no support, true or url to documentation for it)
    geocode: is there a geocoder API? (false/true/url)
    reverse: is there a reverse geocoder API? (false/true/url)
    locationWeighting: does the geocoder API have a mechanism to bias towards a particular location? (false/true/url)
}
quality: string, description of quality of data.


Plans:
termsUrl: URL to terms and conditions
group: provider name
name: plan name
thirdParty=false: can combine results with third party maps? Defaults to no.
humanOnly=false: must queries be triggered by human actions? (ie, no bulk queries?) Defaults to no.
humanOnlyNote: string, a text annotation to the above value.
permanent=false: boolean or string, can geocodes be stored indefinitely? Defaults to no.
includedRequestsMonthly: how many requests included in monthly plan (defaults to 30*includedRequestsDaily)
includedRequestsDaily: how many requests per day included in monthly plan.
maxRequestsMonthly: cap on monthly requests, defaults to includedRequestsMonthly
conditions: array of dot points, things to be aware of
bonuses: array of dot points, good things
publicRequired=false: does your app have to be public facing to qualify
freeRequired=false: does your app have to be available at zero cost to qualify
dollarsMonthly: base monthly rate
currencySymbol="$": currencySymbol symbol (just for display)
cacheLimitDays: 30 
requestsPerSecond: number, an additional constraint of requests per second (usually in addition to monthly or daily limits)
openData: boolean, is the service based heavily on open data such as OpenStreetMap and OpenAddresses?
extra: string describing how much extra transactions cost. `extra: per(3, 5)` means "$3 per 5000 extra transactions".
extraPer1000: number, dollars per thousand extra transactions. (0.6 in the above case)
autocompleteMultiplier=1: number. 0.1 means that 10 autocomplete requests count as 1 regular geocode request.

// Don't fill this out unless the default sort is incorrect.
sortDollars: number. Where there is not a precise publicly available dollar figure, this is an approximate annual fee for sorting.


*/
const MONTH = 30.4;

// Used for converting strange transaction quantities into 1000s.
// per(3, 5) = "+ $3 per 5k ($0.60/1k)"
function per(dollars, transK) {
    return '+ $' + dollars + ' per ' + transK + 'k ($' + (dollars / transK).toFixed(2) + '/1k)';
}
const providers = {
    ArcGIS: {
        api: {
            docs: 'https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm',
            geocode: 'https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm',
            reverse: 'https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm',
            autocomplete: 'https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm',
            batch: 'https://developers.arcgis.com/rest/geocode/api-reference/geocoding-geocode-addresses.htm'
        },
        termsUrl: 'https://www.esri.com/en-us/legal/terms/full-master-agreement/mla-e204-e300-english',
        openData: false
    },
    Gisgraphy: {
        api: {
                docs: 'https://www.gisgraphy.com/documentation/index.php',
                autocomplete: 'https://www.gisgraphy.com/documentation/user-guide.php#fulltextservice',
                geocode: 'https://www.gisgraphy.com/documentation/user-guide.php#geocodingservice',
                reverse: 'https://www.gisgraphy.com/documentation/user-guide.php#reversegeocodingservice',
                locationWeighting: true, // 'prox'
            },
        termsUrl: 'https://www.gisgraphy.com/terms.php',
        permanent: true,
        humanOnly: false,
        openData: true,
        batch: 'https://premium.gisgraphy.com/products#batch',
        quality:'★★☆ : OSM, OpenAddresses, Geonames...'
    },
    HERE: {
        api: {
                docs: 'https://developer.here.com/documentation',
                autocomplete: 'https://developer.here.com/documentation/geocoder-autocomplete/topics/quick-start.html',
                geocode: 'https://developer.here.com/documentation/geocoder/topics/quick-start.html',
                reverse: 'https://developer.here.com/documentation/geocoder/topics/resource-reverse-geocode.html',
                locationWeighting: true, // 'prox'
            },
        termsUrl: 'https://developer.here.com/terms-and-conditions',
        permanent: '30 days',
        humanOnly: true,
        humanOnlyNote: "You are not allowed to: ... issue queries (i) not responsive to end user actions; or (ii) that are subsequent or automatic follow-up queries related to an initial query or end user action (such as triggering automatic Request based on an end user's search result); or otherwise modify queries to the HERE Materials; ",

    }, OpenCage: {
        api: {
            docs: 'https://opencagedata.com/api',
            geocode: 'https://opencagedata.com/api#forward-resp',
            reverse: 'https://opencagedata.com/api#reverse-resp',
            autocomplete: false,
        },
        termsUrl: 'https://opencagedata.com/terms',
        quality: "AU: ★★★ GNAF, elsewhere: ★★☆ OSM + other open data sources"
    }, Mapbox: {
        api: {
            geocode: 'https://www.mapbox.com/api-documentation/#geocoding',
            reverse: 'https://www.mapbox.com/api-documentation/#search-for-places',
            autocomplete: 'https://www.mapbox.com/api-documentation/#geocoding',
            locationWeighting: 'Filtering by bounding box, and 5 mile proximity bias.'
        },
        termsUrl: 'https://www.mapbox.com/tos/#geocoding',
    }, 'Geocode.xyz': {
        api: {
            geocode: 'https://geocode.xyz/api',
            reverse: true,
            autocomplete: false,
        }
    }, 'LocationIQ': {
        api: {
            geocode: 'https://locationiq.com/docs',
            reverse: 'https://locationiq.com/docs',
            autocomplete: true,
            batch: 'https://locationiq.com/#batch-geocoding',
            locationWeighting: true
        },
        termsUrl: 'https://locationiq.com/tos',
        quality: '★★☆ OpenStreetMap, OpenAddresses, WhosonFirst, Polylines & Geonames.'
    }, /*'Mapzen (RIP)': {
        api: {
            geocode: true,
            reverse: true,
            autocomplete: true,
            locationWeighting: true
        }
    },*/ 'Tomtom': {
        api: {
            docs: 'https://developer.tomtom.com/online-search/online-search-documentation-search',
            geocode: 'https://developer.tomtom.com/online-search/online-search-documentation-search/fuzzy-search',
            autocomplete: true, // "typeahead"
            reverse: 'https://developer.tomtom.com/online-search/online-search-documentation-search/geometry-search',
            locationWeighting: true
        },
        cons: ['Can\'t display on an OSM or "open source" map.'],
        termsUrl: 'https://developer.tomtom.com/terms-and-conditions',
        permanent: '30 days',

    }, 'Geocode.farm': {
        api: {
            docs: 'https://geocode.farm/geocoding/free-api-documentation/',
            geocode: 'https://geocode.farm/geocoding/free-api-documentation/',
            reverse: 'https://geocode.farm/geocoding/free-api-documentation/',
            autocomplete: false,
            locationWeighting: true
        }
    }, 'BING': {
        api: {
            docs: 'https://msdn.microsoft.com/en-us/library/ff701715.aspx',
            geocode: 'https://msdn.microsoft.com/en-us/library/ff701714.aspx',
            reverse: 'https://msdn.microsoft.com/en-us/library/ff701710.aspx',
            autocomplete: 'https://msdn.microsoft.com/en-us/library/mt712650.aspx',
            locationWeighting: 'https://msdn.microsoft.com/en-us/library/ff701704.aspx', // "User context parameters"
            playUrl: 'http://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk#autoSuggestUi+JS'
        },
        cons: ['"Autosuggest" is not exactly autocomplete.', 'Session management code required for cheapest pricing.'],
        termsUrl: 'https://www.microsoft.com/en-us/maps/product/terms'
    }, 'Mapquest': {
        api: {
            docs: 'https://developer.mapquest.com/documentation/geocoding-api/',
            geocode: 'https://developer.mapquest.com/documentation/geocoding-api/',
            reverse: 'https://developer.mapquest.com/documentation/geocoding-api/reverse/get/',
            locationWeighting: true, // bounding-box
            autocomplete: 'https://developer.mapquest.com/documentation/searchahead-api/', // "Search ahead"
        },
        quality: 'AU: ★★☆ Unit-level',
        playUrl: 'https://developer.mapquest.com/documentation/samples/geocoding/v1/address/',
        termsUrl: 'https://developer.mapquest.com/legal'
    }, 'Maplarge': {
        api: {
            docs: 'http://www.maplarge.com/developer/geocoderapi', // wait for it!
            geocode: true,
            reverse: true,
            autocomplete: false, 
            locationWeighting: false

        },
        cons: ['API documentation looks old and broken.']
    }, 'Yahoo BOSS PlaceFinder': {
        cons: ['Looks out of date and poorly maintained.'],
        api: {}
    }, 'Pitney-Bowes': {
        cons: ['No public plan information'],
        api: {
            docs: 'https://locate.pitneybowes.com/',
            geocode: true, // basic and premium
            reverse: true, // basic and premium
            autocomplete: 'https://locate.pitneybowes.com/geosearch',

            // can't tell about locationWeighting, don't think I can see full API docs
        },
        termsUrl: 'https://www.pitneybowes.com/us/developer/subscription-agreement.html?tab2'
    }, 'geocode.earth': {
        api: {
            geocode: true,
            reverse: true,
            autocomplete: true,
            locationWeighting: true //"Filter results by bounding box, distance from a point, country, and more"
        },
        quality: "AU: ★★★ GNAF, elsewhere: ★☆☆ OSM + OpenAddresses"
    }, 'Google': {
        api: {
            geocode: true,
            reverse: true,
            docs: 'https://developers.google.com/maps/documentation/geocoding/intro',
            locationWeighting: 'https://developers.google.com/maps/documentation/geocoding/intro#Viewports', // viewport biasing
            autocomplete: 'https://developers.google.com/places/web-service/autocomplete',
        }, cons: ['Must use a Google Map (not Leaflet/Mapbox-GL-jS/OL)'],
        quality: '★★★ Top-notch',
        termsUrl: 'https://enterprise.google.com/maps/terms/us/maps_purchase_agreement_emea.html'

    }, 'PSMA': {
        quality: 'AU: ★★★ Authoritative',
        api: {
            geocode: true,
            reverse: false,
            autocomplete: 'https://developer.psma.com.au/api/predictive-address-verification/get/predictive/address'
        },
        playUrl: 'https://demo.psma.com.au/predictive-address-verification'
    },
    'SmartyStreets': {
        api: {
            geocode: true,
            autocomplete: false, // true for US addresses only
            reverse: false,
            locationWeighting: false
        }
    }
};



const plans = [
    {
        group: 'ArcGIS',
        name: 'Geosearch, Not Stored',
        dollarsMonthly: 0,
        includedRequestsMonthly: 1e6,
        permanent: false,
        thirdParty: true,
        url: 'https://developers.arcgis.com/features/geocoding/',
        conditions: [ "must display <a href='https://developers.arcgis.com/terms/attribution/'>attribution</a>"]
    },
    {
        group: 'ArcGIS',
        name: 'Geocode, Batch or Stored',
        dollarsMonthly: 0,
        includedRequestsMonthly: 0,
        extraPer1000: 4,
        permanent: true,
        thirdParty: true,
        url: 'https://developers.arcgis.com/features/geocoding/',
        conditions: [ "must display <a href='https://developers.arcgis.com/terms/attribution/'>attribution</a>"]
    },
    {   
        group: 'Gisgraphy',
        name: 'First',
        dollarsMonthly: 93,
        includedRequestsMonthly: 1296000,
        requestsPerSecond: 0.5, // 30 per 60 seconds
        url: 'https://premium.gisgraphy.com/pricing',
        thirdParty: true,
        publicRequired: false,
        bonuses:['Entire SQL database can be downloaded.'],
        freeRequired: false,
    	sortDollars:938,
    	autocompleteMultiplier:1
    },
    {   
        group: 'Gisgraphy',
        name: 'Standard',
        dollarsMonthly: 235,
        includedRequestsMonthly: 5184000,
        requestsPerSecond: 2, // 120 per 60 seconds
        url: 'https://premium.gisgraphy.com/pricing',
        thirdParty: true,
        publicRequired: false,
        bonuses:['Entire SQL database can be downloaded.'],
        freeRequired: false,
    	sortDollars:2347,
    	autocompleteMultiplier:1
    },
    {   
        group: 'Gisgraphy',
        name: 'Business',
        dollarsMonthly: 352,
        includedRequestsMonthly: 12960000,
        requestsPerSecond: 5, // 300 per 60 seconds
        url: 'https://premium.gisgraphy.com/pricing',
        thirdParty: true,
        publicRequired: false,
        bonuses:['Entire SQL database can be downloaded.'],
        freeRequired: false,
    	sortDollars:3522,
    	autocompleteMultiplier:1
    },
    {   
        group: 'Gisgraphy',
        name: 'Expert',
        dollarsMonthly: 586,
        includedRequestsMonthly: 21600000,
        requestsPerSecond: 9, // 500 per 60 seconds
        url: 'https://premium.gisgraphy.com/pricing',
        thirdParty: true,
        publicRequired: false,
        bonuses:['Entire SQL database can be downloaded.'],
        freeRequired: false,
    	sortDollars:5868,
    	autocompleteMultiplier:1
    },
    {   
        group: 'HERE',
        name: 'Public Basic',
        dollarsMonthly: 0,
        includedRequestsMonthly: 15e3,
        requestsPerSecond: 1,
        extra: per(1, 2),
        extraPer1000: 1 / 2,
        maxRequestsMonthly:  false,
        url: 'https://developer.here.com/plans',
        thirdParty: false,
        publicRequired: true,
    },
    {   group: 'HERE',
        name: 'Public Starter',
        requestsPerSecond: 1,
        dollarsMonthly: 49,
        dollarsAnnually: 490,
        includedRequestsMonthly: 100e3,
        extra: per(1, 2),
        extraPer1000: 1 / 2,
        maxRequestsMonthly:  false,
        url: 'https://developer.here.com/plans',
        thirdParty: false,
        publicRequired: true
    },
    {   
        group: 'HERE',
        name: 'Public Standard',
        includedRequestsMonthly: 250e3,
        extra: per(1, 2),
        extraPer1000: 1 / 2,
        maxRequestsMonthly:  false,
        requestsPerSecond: 2,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 119,
        dollarsAnnually: 1190,
        thirdParty: false,
        publicRequired: true
    },
    {   
        group: 'HERE',
        name: 'Public Pro',
        includedRequestsMonthly: 1e6,
        extra: per(1, 2),
        extraPer1000: 1 / 2,
        maxRequestsMonthly:  false,
        requestsPerSecond: 3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 449,
        dollarsAnnually: 4490,
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
        extra: per(1, 0.2),
        extraPer1000: 1 / 0.2, // yep, $1 per 200 trans
        maxRequestsMonthly:  false,
        requestsPerSecond: 1,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 199,
        dollarsAnnually: 1990,
        thirdParty: false,
        publicRequired: false
    },
    {   
        group: 'HERE',
        name: 'Business Standard',
        includedRequestsMonthly: 100e3,
        extra: per(1, 0.2),
        extraPer1000: 1 / 0.2, // yep, $1 per 200 trans
        maxRequestsMonthly:  false,
        requestsPerSecond: 2,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 349,
        dollarsAnnually: 3490,
        publicRequired: false,
        thirdParty: false,
    },
    {   
        group: 'HERE',
        name: 'Business Pro',
        includedRequestsMonthly: 150e3,
        extra: per(1, 0.2),
        extraPer1000: 1 / 0.2, // yep, $1 per 200 trans
        maxRequestsMonthly:  false,
        requestsPerSecond: 3,
        url: 'https://developer.here.com/plans',
        dollarsMonthly: 499,
        dollarsAnnually: 4990,
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
        bonuses: ['Permanent storage +$5k/year.'],
        custom: true,
        publicRequired: false,
        permanent: true,
        thirdParty: false, // presumably not
        sortDollars: 10000 // this should be a formula based on requests...
    },
    {
        group: 'BING',
        name: 'Consumer, Free',
        includedRequestsMonthly: 125e3/12,
        maxRequestsMonthly:  125e3/12,
        dollarsMonthly: 0,
        publicRequired: true,
        freeRequired: true,
        permanent: true, // "except that geocodes may be stored locally only for use with your Company Applications. "
        thirdParty: false, // not certain but I think so
        conditions: ['Max 125,000 transactions per year'],
        url: 'https://www.microsoft.com/en-us/maps/licensing/options',
        autocompleteMultiplier: 0
    }, {
        group: 'BING',
        name: 'Non-profit, Free',
        includedRequestsDaily: 50000,
        maxRequestsMonthly:  50000*MONTH,
        dollarsMonthly: 0,
        publicRequired: true,
        permanent: true, // "except that geocodes may be stored locally only for use with your Company Applications. "
        freeRequired: true, // "Applications that qualify for a limited website and consumer application use, which will be free of charge as defined in the SDKs"
        conditions: [
            'Must be non-profit.',
            'Less than 50k transactions per 24 hours.'
        ],
        thirdParty: false,
        url: 'https://www.microsoft.com/en-us/maps/licensing/options',
        autocompleteMultiplier: 0

    },  {
        group: 'BING',
        name: 'Quote #1',
        includedRequestsMonthly: 500e3 / 12, // annually
        dollarsMonthly: 4620 / 12,
        sortDollars: 3680,
        permanent: true, // "except that geocodes may be stored locally only for use with your Company Applications. "
        thirdParty: false,
        autocompleteMultiplier: 0 // We think, based on the session key thing.
    },  {
        group: 'BING',
        name: 'Quote #2',
        includedRequestsMonthly: 1e6 / 12, // annually
        dollarsMonthly: 6050 / 12,
        sortDollars: 4818,
        permanent: true, // "except that geocodes may be stored locally only for use with your Company Applications. "
        thirdParty: false,
        autocompleteMultiplier: 0
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
        conditions: ['No bulk jobs.', 'Must display on Mapbox map.','May not reveal lat/lon to user.', 'Must not cache at all.'],
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
        conditions: ['No bulk jobs.', 'Must display on Mapbox map.','May not reveal lat/lon to user.', 'Must not cache at all.'],
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
        bonuses: ['50 locations per request'],

        sortDollars: 12500, // I think? Have heard figures of $12.5k and $25k, not sure difference.
        humanOnly: false, // "Batch geocoding is only available with an Enterprise plan." 
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
        url: 'https://opencagedata.com/pricing',

    },
    {
        group: 'OpenCage',
        name: 'X-Small',
        includedRequestsDaily: 10e3,
        requestsPerSecond: 10,
        dollarsMonthly: 66,
        currencySymbol: '$A',
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://opencagedata.com/pricing'
    },
    {
        group: 'OpenCage',
        name: 'Small',
        includedRequestsDaily: 20e3,
        requestsPerSecond: 12,
        dollarsMonthly: 132,
        currencySymbol: '$A',
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://opencagedata.com/pricing'
    },
    {
        group: 'OpenCage',
        name: 'Medium',
        includedRequestsDaily: 100e3,
        requestsPerSecond: 15,
        dollarsMonthly: 660,
        currencySymbol: '$A',
        permanent: true,
        openData: true,
        thirdParty: true,
        url: 'https://opencagedata.com/pricing'
    },
    {
        group: 'OpenCage',
        name: 'Large',
        includedRequestsDaily: 1e6,
        // includedRequestsMonthly: 1e6 * MONTH,
        requestsPerSecond: 15,
        dollarsMonthly: 1320,
        currencySymbol: '$A',
        permanent: true,
        url: 'https://opencagedata.com/pricing',
        openData: true,
        thirdParty: true,
    },
    // TODO Google Free plan
    {
        group: 'Google',
        name: 'Standard',
        includedRequestsDaily: 2500,
        maxRequestsMonthly: 100e3,
        freeRequired: true,
        publicRequired: true,
        totalMonthly: requests => 0 + 0.5 * Math.max(requests - 2500 * MONTH, 0) / 1000,
        url: 'https://developers.google.com/maps/pricing-and-plans/#details',
        thirdParty: false,
        humanOnly: true,
        libraryRequired: true,
        conditions: [
            'Your ToS and Privacy Policy must reference Google\'s',
            'No bulk downloads' //10.5e No mass downloading. You will not use the Service in a manner that gives you or a third party access to mass downloads or bulk feeds of any Content. For example, you are not permitted to offer a batch geocoding service that uses Content contained in the Maps API(s). 
        ],
        autocompleteMultiplier: 1/2.5, // based on I'm-not-sure-what
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
        humanOnly: true,
        libraryRequired: true,
        conditions: [
            'Your ToS and Privacy Policy must reference Google\'s',
            'No bulk downloads' //10.5e No mass downloading. You will not use the Service in a manner that gives you or a third party access to mass downloads or bulk feeds of any Content. For example, you are not permitted to offer a batch geocoding service that uses Content contained in the Maps API(s). 
        ],
        autocompleteMultiplier: 1/2.5, // based on I'm-not-sure-what
        bonuses: ['Excellent worldwide quality'],
        // 1 geocoding request=0.25 credits
        // maxRequsetsMonthly: 100e3
        // totalMonthly: requests => 0 + 0.5 * Math.max(requests - 2500 * MONTH, 0) / 1000
    },
    {
        group: 'Google',
        name: 'ONI Group quote',
        includedRequestsMonthly: 0,
        // "Assume that 500k-1m credits would be ~ $21k", Translating that as 1 million credits for $21k, each credit is 4 geocodes, so 4 million.
        dollarsMonthly: 0,
        currencySymbol: '$A',
        extraPer1000: 21e3 / (4e6 / 1000),
        maxRequestsMonthly: false,
        url: 'https://developers.google.com/maps/premium/usage-limits',
        // sortDollars: 20000,
        thirdParty: false,
        humanOnly: true,
        libraryRequired: true,
        conditions: [
            'Your ToS and Privacy Policy must reference Google\'s',
            'No bulk downloads' //10.5e No mass downloading. You will not use the Service in a manner that gives you or a third party access to mass downloads or bulk feeds of any Content. For example, you are not permitted to offer a batch geocoding service that uses Content contained in the Maps API(s). 
        ],
        autocompleteMultiplier: 1/2.5, // based on I'm-not-sure-what
        bonuses: ['Excellent worldwide quality'],
        // 1 geocoding request=0.25 credits
        // maxRequsetsMonthly: 100e3
        // totalMonthly: requests => 0 + 0.5 * Math.max(requests - 2500 * MONTH, 0) / 1000
    },
    // {
    //     group: 'Mapzen (RIP)',
    //     name: 'Flex',
    //     includedRequestsMonthly: 25000,
    //     maxRequestsMonthly: false,
    //     dollarsMonthly: 0,
    //     extraPer1000: 0.5,
    //     extra: '+ 50c / 1,000',
    //     conditions: ['⚠ Service is shutting down'],
    //     totalMonthly: requests => 0 + 0.5 * Math.max(requests - 25000, 0) / 1000,
    //     url: 'https://mapzen.com/pricing/',
    //     thirdParty: true,
    //     openData: true,
    //     permanent: true,
    //     autocompleteMultiplier: 0.1 // not exactly, you also got 50k free autocompletes per month
    // },
    {
        group: 'geocode.earth',
        name: 'Basic',
        includedRequestsMonthly: 200e3,
        dollarsMonthly: 200,
        requestsPerSecond: 5, //10 for autocomplete or reverse but that's too complicated
        openData: true,
        thirdParty: true,
        permanent: true, // making assumptions HERE
        bonuses: ['Made by the Mapzen team'],
        conditions: ['Brand new company we know nothing about'],
        url: 'https://geocode.earth/',
    },
    {
        group: 'geocode.earth',
        name: 'Advanced',
        includedRequestsMonthly: 2e6,
        dollarsMonthly: 500,
        requestsPerSecond: 10, //20 for autocomplete or reverse but that's too complicated
        openData: true,
        thirdParty: true,
        permanent: true, // making assumptions HERE
        bonuses: ['Made by the Mapzen team'],
        conditions: ['Brand new company we know nothing about'],
        url: 'https://geocode.earth/',
    },
    {
        group: 'geocode.earth',
        name: 'Custom',
        custom: true,
        openData: true,
        thirdParty: true,
        permanent: true, // making assumptions HERE
        bonuses: ['Made by the Mapzen team'],
        conditions: ['Brand new company we know nothing about'],
        url: 'https://geocode.earth/',
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
        name: 'Free',
        dollarsMonthly: 0,
        includedRequestsDaily: 10e3,
        requestsPerSecond: 120/60,
        freeRequired: false,
        url: 'https://locationiq.com/',
        openData: true,
        permanent: true,
        thirdParty: true,
        humanOnly: false
    },
    {
        group: 'LocationIQ',
        name: 'Developer+',
        dollarsMonthly: 50,
        includedRequestsDaily: 20e3,
        requestsPerSecond: 1200/60,
        freeRequired: false,
        url: 'https://locationiq.com/',
        openData: true,
        permanent: true,
        thirdParty: true,
        humanOnly: false
    },
    {
        group: 'LocationIQ',
        name: 'Starter',
        dollarsMonthly: 100,
        includedRequestsDaily: 50e3,
        requestsPerSecond: 1440/60,
        freeRequired: false,
        url: 'https://locationiq.com/',
        openData: true,
        permanent: true,
        thirdParty: true,
        humanOnly: false
    },
    {
        group: 'LocationIQ',
        name: 'Business',
        dollarsMonthly: 200,
        includedRequestsDaily: 100e3,
        requestsPerSecond: 1800/60,
        freeRequired: false,
        url: 'https://locationiq.com/',
        openData: true,
        permanent: true,
        thirdParty: true,
        humanOnly: false
    },
    {
        group: 'LocationIQ',
        name: 'Business+',
        dollarsMonthly: 500,
        includedRequestsDaily: 500e3,
        requestsPerSecond: 2400/60,
        freeRequired: false,
        url: 'https://locationiq.com/',
        openData: true,
        permanent: true,
        thirdParty: true,
        humanOnly: false
    },
    {
        group: 'LocationIQ',
        name: 'Enterprise',
        custom:true,
        // dollarsMonthly: 0,
        // includedRequestsDaily: 10e3,
        url: 'https://locationiq.com/',
        openData: true,
        thirdParty: true,
        permanent: true,
        humanOnly: false,
        sortDollars: 1000 * 12
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
        conditions: ['6 month commitment', 'Excess usage billed as "overage"'],
        thirdParty: true,
        url: 'https://developer.mapquest.com/plans',
        permanent: false
    },
    {
        group: 'Mapquest',
        name: 'Business Plus Enhanced',
        dollarsMonthly: 899,
        includedRequestsMonthly: 500e3,
        bonuses: ['Store results (US + Canada)','Bulk queries, third-party-maps'],
        conditions: ['6 month commitment', 'Excess usage billed as "overage"'],
        thirdParty: true,
        url: 'https://developer.mapquest.com/plans',
        permanent: false
    },
    {
        group: 'Mapquest',
        name: 'Enterprise',
        custom: true,
        thirdParty: true,
        conditions: ['Excess usage billed as "overage"'],
        // probably these apply:
        bonuses: ['Store results (US + Canada)','Bulk queries, third-party-maps'],
        url: 'https://developer.mapquest.com/plans',
        permanent: false,
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
        name: 'Quote #1',
        includedRequestsMonthly: 0,
        dollarsMonthly: 0,
        extraPer1000: 18.13,
        currencySymbol: '$A',
        url: 'https://locate.pitneybowes.com/',
        conditions:['"Premium" geocode API uses 3x credits', '3 credits per autocomplete request!'],
        permanent: '30 days',
        humanOnly: false, // see 3.3 here https://www.pitneybowes.com/us/developer/subscription-agreement.html?tab2
        cacheLimitDays: 30,
        autocompleteMultiplier: 3,
        // custom: true,
        // sortDollars:20000, // https://locate.pitneybowes.com/ // wonder how much it is
        
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
    // where are the tomtom terms? 
    // https://www.tomtom.com/en_au/legal/terms-and-conditions/ ? 
    // https://www.tomtom.com/en_au/legal/terms-of-use/ ?
    // https://developer.tomtom.com/terms-and-conditions ?
    {
        group: 'Tomtom',
        name: 'Free',
        dollarsMonthly: 0,
        requestsPerSecond: 5,
        includedRequestsDaily: 2500,
        maxRequestsDaily: 2500,
        thirdParty: false,
        publicRequired: true,
        url: 'https://developer.tomtom.com/store/maps-api',
    },
    {
        group: 'Tomtom',
        name: '50,000 public',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        // includedRequestsDaily: 2500,
        includedRequestsMonthly: 2500 * MONTH,
        extra: per(25, 50),
        extraPer1000: 25 / 50,
        thirdParty: false,
        publicRequired: true,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom',
        name: '1,000,000 public',
        // extra: '+ $449 per 1M ($' + 449 / (1e6 / 1000) + '/1k)',
        extra: per(449, 1000),
        dollarsMonthly: 0,//449,
        minDollarsYearly: 449,
        includedRequestsDaily: 2500,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        extraPer1000: 449 / 1000,
        thirdParty: false,
        publicRequired: true,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom',
        name: '10,000,000 public',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        minDollarsYearly: 4199,
        includedRequestsDaily: 2500,// * MONTH + 10e6,
        extraPer1000: 4199 / (10e6 / 1000),
        extra: per(4199, 10e6 / 1000),
        // extra: '+ $4,199 per 1M ($' + 4199 / (10e6 / 1000) + '/1k)',
        thirdParty: false,
        publicRequired: true,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom',
        name: '50,000 private',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        includedRequestsMonthly: 2500,// * MONTH + 50e3,
        extraPer1000: 199 / 50,
        extra: '+ $199 per 50k ($3.98/1k)',
        // includedRequestsMonthly: 50e3,
        thirdParty: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom',
        name: '100,000 private',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        minDollarsYearly: 379,
        includedRequestsDaily: 2500,
        extraPer1000: 379 / 100,
        extra: '+ $379 per 100k ($3.79/1k)',
        thirdParty: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom', 
        name: '250,000 private',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        minDollarsYearly: 909,
        includedRequestsDaily: 2500,
        extraPer1000: 909 / 250,
        extra: '+ $909 per 250k ($3.63/1k)',
        thirdParty: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom',
        name: '500,000 private',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        minDollarsYearly: 1719,
        includedRequestsDaily: 2500,
        extraPer1000: 1719 / 500,
        extra: '+ $1719 per 500k ($3.44/1k)',
        thirdParty: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom',
        name: '1,000,000 private',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        minDollarsYearly: 3249,
        includedRequestsDaily: 2500,
        extraPer1000: 3249 / 1000,

        extra: '+ $3249 per 1M ($3.25/1k)',
        thirdParty: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'Tomtom',
        name: '10,000,000 private',
        dollarsMonthly: 0,
        maxRequestsMonthly: false,
        maxRequestsDaily: false,
        minDollarsYearly: 27499,
        includedRequestsDaily: 2500,
        extraPer1000: 27499 / 10e3,
        extra: '+ $27,499 per 10M ($2.75/1k)',
        thirdParty: false,
        url: 'https://developer.tomtom.com/store/maps-api',
        bonuses: ['Credits last 12 months', '2500 free per day']
    },
    {
        group: 'PSMA',
        name: 'Free',
        dollarsMonthly: 0,
        includedRequestsMonthly: 500,
        permanent: true,
        thirdParty: true,
        url: 'https://developer.psma.com.au/pricing',
        bonuses: ['Open data licence applies', 'Free autocomplete'],
        conditions: ['Australia only'],
        autocompleteMultiplier: 0
    },
    {
        group: 'PSMA',
        name: 'Standard',
        dollarsMonthly: 99,
        includedRequestsMonthly: 10e3,
        permanent: true,
        thirdParty: true,
        url: 'https://developer.psma.com.au/pricing',
        bonuses: ['Open data licence applies', 'Free autocomplete'],
        conditions: ['Australia only'],
        currency: 'AUD',
        currencySymbol: '$A',
        autocompleteMultiplier: 0
    },
    {
        group: 'PSMA',
        name: 'Pro',
        dollarsMonthly: 749,
        includedRequestsMonthly: 100e3,
        permanent: true,
        thirdParty: true,
        url: 'https://developer.psma.com.au/pricing',
        bonuses: ['Open data licence applies', 'Free autocomplete'],
        conditions: ['Australia only'],
        currency: 'AUD',
        currencySymbol: '$A',
        autocompleteMultiplier: 0
    },
    {
        group: 'PSMA',
        name: 'Custom',
        permanent: true,
        thirdParty: true,
        url: 'https://developer.psma.com.au/pricing',
        bonuses: ['Open data licence applies', 'Free autocomplete'],
        conditions: ['Australia only'],
        custom: true,
        currency: 'AUD',
        currencySymbol: '$A',
        autocompleteMultiplier: 0
    }


];
let groups = {};
plans.forEach(plan => {
    plan.provider = providers[plan.group] || { api: {} };
    ['termsUrl', 'permanent', 'humanOnly', 'humanOnlyNote', 'openData'].forEach(key => { 
        if (plan[key] === undefined && plan.provider[key] !== undefined) plan[key] = plan.provider[key]; 
    });
    groups[plan.group] = true; // just for counting
});

module.exports = plans;


console.log(module.exports.length + ' plans, from ' + Object.keys(groups).length + ' different providers loaded.');
console.log('Providers: ' + Object.keys(groups));
