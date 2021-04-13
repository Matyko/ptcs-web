<template>
  <div
      id="map"
      v-bind="$attrs"
  />
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default {
  name: 'MapComponent',
  props: {
    width: [Number, String],
    height: [Number, String],
  },
  mounted() {
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/matyikrista/cknfsgjt9448u17oc1ednqpxj',
    });

    const geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl });
    const handleResult = (e) => {
      if (!e.result) return;
      const lng = e.result.center[0];
      const lat = e.result.center[1];
      const address = e.result.place_name;
      this.$emit('update:geo-location', {lng, lat});
      this.$emit('update:address', address);
    }


    map.addControl(geocoder);
    geocoder.on('result', handleResult);

  },
}
</script>

<style scoped>

</style>
