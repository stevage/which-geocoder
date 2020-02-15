<template lang="pug">
    #app.flex.flex-column.vh-100.avenir
        #top.bb.b--gray.bg-washed-blue.ph3.pv1
            h1.fw5.ma0 getlon.lat
                span.fw4  — Help! I need a geocoder.
            h2.tag.i.fw1.f4 {{ planCount }} geocoding service plans to choose from. 
                a(href="https://github.com/stevage/which-geocoder") More information
                | 
        #middle.flex.flex-auto
            #sidebar.br.b--light-gray.overflow-auto.w3.w-25-ns.pa2
                FilterForm
            #results-container.overflow-auto.flex-auto
                Results
        #bottom.bt.b--gray.flex-none.pa2.bg-washed-blue
            | Built by <b><a href="https://stevebennett.me">Steve Bennett</a></b> (<a href="https://twitter.com/stevage1">@stevage1</a>). 
            | Source code on <a href="https://github.com/stevage/which-geocoder">Github</a>. 
            | Disclaimer: Geocoder plans change all the time. Obviously. Use at your own risk.</div>
</template>

<script>
import { EventBus } from './EventBus';
import FilterForm from './components/FilterForm.vue'
import Results from './components/Results.vue'
import plans from './plans';
window.app = {
}
export default {
    name: 'app',
    components: {
      FilterForm,
      Results
    },
    data: () => ({
        planCount: plans.length
    }),

    created() {
        window.app.App = this;
    }
}

require('tachyons/css/tachyons.min.css');
</script>

<style scoped>
html, body {
  height: 100vh;
  width: 100%;
  margin:0;
  padding:0;

    font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

}
#sidebar {
    min-width:250px;
}

h1 {
    font-size:40px;
}
.tag {
    font-family:Bodoni MT, Didot, Didot LT STD, Hoefler Text, Garamond, Times New Roman, serif;
}

</style>
