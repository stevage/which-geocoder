<template lang="pug">
#map.absolute.absolute--fill
</template>

<script>
import mapboxgl from 'mapbox-gl';
import U from 'mapbox-gl-utils';
import { sheets2geojson } from 'sheets2geojson';

export default {
    async mounted() {
        // replace this Mapbox access token with your own
        mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmFnZSIsImEiOiJjazNmNGV5enAwMTF1M2tuejhtc2twcXo5In0.mLPrYIYJ2FiFZ3KMqVIj6w';
        const map = new mapboxgl.Map({
            container: 'map',
            center: [144.96, -37.81],
            zoom: 14,
            style: 'mapbox://styles/mapbox/light-v9',
        });
        U.init(map, mapboxgl);
        window.map = map;
        window.app.Map = this;


        // const sheetNo = 1;
        // I don't know in which context json1 works vs json2. 
        // https://medium.com/dali-lab/google-sheets-and-json-easy-backend-e29e9ef3df2
        // const json1 = `https://spreadsheets.google.com/feeds/cells/${sheetsId}/${sheetNo}/public/full?alt=json`
        // const json2 = `https://spreadsheets.google.com/feeds/cells/${sheetsId}/${sheetNo}/od6/public/values?alt=json`
        const sheetID = (window.location.hash.match(/sheet=([a-zA-Z0-9_-]+)/) || [])[1] || '2PACX-1vR9qYMju-qqH_IL8e2ksN0wpVXfHBUEKF079WX1eSAgPFRG5z0RAmpjVwS8sVrZSC0fVrNpSMjaB5Cu';
        const points = await sheets2geojson(sheetID);

        map.U.addGeoJSON('points', points);
        map.U.addCircle('points-circles', 'points', {
            circleColor: 'hsl(330,100%,40%)',
            circleRadius: { stops: [[10,3], [12, 10]] }
        });
        map.U.hoverPointer('points-circles');
        map.on('click', 'points-circles', e => {
            console.log(e);
            window.app.FeatureInfo.feature = e.features[0];
        });
        
    }
}
import 'mapbox-gl/dist/mapbox-gl.css';

</script>

<style scoped>
</style>