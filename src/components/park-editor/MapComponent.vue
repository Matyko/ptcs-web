<template>
  <div class="is-flex is-flex-direction-column">
    <div class="is-flex-grow-0">
      <div
          id="geocoder"
      ></div>
      <p
          v-show="address"
          class="has-text-black mb-2"
      >
        <strong>Address:</strong> {{ address }}
      </p>
    </div>
    <div
        id="map"
        v-bind="$attrs"
        class="is-flex-grow-1"
    />
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default {
  name: 'MapComponent',
  props: {
    geoLocation: Object,
    address: String,
    isEditing: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      editing: false,
    }
  },
  watch: {
    isEditing: {
      handler: function (newVal) {
        this.editing = newVal;
      },
      immediate: true,
    },
  },
  mounted() {
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;
    const { lng, lat } = this.geoLocation;
    const center = (lng && lat) ? [lng, lat] : [-0.12764739999999997, 51.533424999999994];
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/matyikrista/cknfsgjt9448u17oc1ednqpxj',
    });

    const geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl });

    let marker;

    function addMarker(lngLat) {
      if (marker) {
        marker.remove();
      }
      marker = new mapboxgl.Marker()
          .setLngLat(lngLat)
          .addTo(map);
    }

    const handleResult = (e) => {
      if (!e.result) return;
      if (marker) {
        marker.remove();
      }
      const lng = e.result.center[0];
      const lat = e.result.center[1];
      const address = e.result.place_name;
      this.editing = false;
      this.$emit('update:geo-location', { lng, lat });
      this.$emit('update:address', address);
    }
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
    geocoder.on('result', handleResult);
    map.on('load', () => {
      if (center) {
        map.flyTo({ center, zoom: 15 });
        addMarker(center);
      }
    })

  },
}
</script>

<style lang="scss">
#geocoder {
  width: 100%;
}

.mapboxgl-ctrl-geocoder {
  border: 1px solid #dddddd;
  border-radius: 4px;
  box-shadow: none;
  margin-bottom: 0.5rem;
  min-width: 100%;
}
</style>
