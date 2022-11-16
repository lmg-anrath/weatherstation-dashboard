<template>
  <div id="container">
    <MapOverlay v-if="over" id="overlay" :data="data" :name="name" />
    <!--<div v-if="over" id="overlay"></div>-->
    <div id="map" ref="map-root">
    </div>
  </div>
</template>

<script>
  import View from 'ol/View'
  import Map from 'ol/Map'
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'
  import Vector from 'ol/layer/Vector'
  import Point from 'ol/geom/Point'
  import Style from 'ol/style/Style'
  import Icon from 'ol/style/Icon'
  import {getVectorContext} from 'ol/render';
  import 'ol/ol.css'
  import { fromLonLat } from 'ol/proj'
  import SourceVector from 'ol/source/Vector'
  import Feature from 'ol/Feature'
  import MapOverlay from '../components/MapOverlay.vue';

  export default {
    name: 'MapContainer',
    components: {
      MapOverlay
    },
    props: {
      current_data: { type: Object },
      key: String
    },
    data() {
      return {
        over: true,
        data: {},
        name: ''
      }
    },
    async mounted() {
      const station_keys = await (await fetch('https://api.wetterstation-lmg.de/stations')).json();
      const points = {
        "Stations":[
          {
            "lat":"51.2503512",
            "long":"6.6907173",
            "name":"Meerbusch",
          },
          {
            "lat":"51.3387609",
            "long":"6.5853417",
            "name":"Krefeld",
          },
          {
            "lat":"51.19818",
            "long":"6.69165",
            "name":"Neuss",
          },
          {
            "lat":"51.19470",
            "long":"6.43536",
            "name":"Mönchengladbach"
          },
          {
            "lat":"51.26583",
            "long":"6.69644",
            "name":"Schwalmtal"
          },
          {
            "lat":"51.36421",
            "long":"6.41950",
            "name":"Kempen"
          },
        ]
      }
      const markers = new Vector({
        source: new SourceVector(),
        style: new Style({
          image: new Icon({
            anchor: [0.5,1],
            scale: 0.1,
            src: 'map.svg',
            color: '#5c5c5c'
          })
        }),
      });
      const map = new Map({
        target: this.$refs['map-root'],
        layers: [
          new TileLayer({
            source: new OSM()
          }),
        ],
        view: new View({
          zoom: 12,
          center: fromLonLat([6.462390,51.278439]),
          constrainResolution: true
        }),
      });
      map.addLayer(markers);
      for (let i = 0; i < points.Stations.length; i++) {
        const station = points.Stations[i];
        var marker = new Feature(new Point(fromLonLat([parseFloat(station.long),parseFloat(station.lat)])))
        marker.setId(station.name)
        markers.getSource().addFeature(marker)
      }
      for (let i = 0; i < station_keys.length; i++) {
        const marker = new Vector({
          source: new SourceVector(),
          style: new Style({
            image: new Icon({
              anchor: [0.5,1],
              scale: 0.1,
              src: 'map.svg',
              color: `rgb(${station_keys[i].color})`
            })
          }),
        })
        var new_marker = new Feature(new Point(fromLonLat([station_keys[i].position.lon,station_keys[i].position.lat])))
        new_marker.setId(station_keys[i].name + '_own')
        marker.getSource().addFeature(new_marker)
        map.addLayer(marker)
      }
      map.on('movestart', (e) => {
        this.over = false;
      })
      var can_upd = true;
      document.getElementById('map').onmouseenter = () => {
        if (!can_upd) return;
        can_upd = false
        setTimeout(() => {
          map.updateSize();
          window.scrollTo(0, document.body.scrollHeight);
        },200)
      }
      document.getElementById('map').onmouseleave = () => {
        setTimeout(() => {
          map.updateSize();
          can_upd = true;
        },200)
      }
      map.on('click', async (e) => {
        const v = map.getFeaturesAtPixel(e.pixel, {hitTolerance: 10})
        if (v.length == 0) {
          this.over = false;
          return;
        }
        if (v[0].getId().includes('own')) {
          this.over = true;
          this.name = v[0].getId().split('_')[0];
          const res = {
            'temp': 0,
            'humidity': 0,
            'pressure': 0
          }
          for (let i = 0; i < this.current_data[0].station_data.length; i++) {
            if (this.name == this.current_data[0].station_data[i].station) {
              if (this.current_data[0].station_data[i].data.length == 0) continue;
              res.temp = this.current_data[0].station_data[i].data[this.current_data[0].station_data[i].data.length - 1].y;
              res.humidity = this.current_data[1].station_data[i].data[this.current_data[0].station_data[i].data.length - 1].y;
              res.pressure = this.current_data[2].station_data[i].data[this.current_data[0].station_data[i].data.length - 1].y;
            }
          }
          this.data = res;
          return;
        }
        var station = {}
        for (let i = 0; i < points.Stations.length; i++) {
          if (v[0].getId() == points.Stations[i].name) {
            station = points.Stations[i];
          }
        }
        const res = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${station.lat}&lon=${station.long}&appid=${this.key}&units=metric`)).json();
        this.over = true;
        this.name = station['name'];
        this.data = res.main;
      })
    },
  }
</script>

<style>
#container {
  position: relative;
}

#map {
  position: absolute;
  width: 100%;
  height: 60vw;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.1s;
}

#overlay {
  --w: 333px;
  --h: 200px;
  height: var(--h);
  width: var(--w);
  z-index: 10;
  top: 0;
  left: 0;
  position: absolute;
  margin-left: calc(100vw - (50vw + var(--w) / 2) - 10vw);
  margin-top: calc(90vh - (50vh + var(--h) / 2)); 
  pointer-events: none;
}

@media screen and (min-width: 775px) {
  #map:hover {
    height: 80vh;
  }
  #map {
    height: 350px;
  }
}

@media screen and (max-width: 775px) {
  #overlay {
    --w: 220px;
    --h: 170px;
    height: var(--h);
    width: var(--w);
    z-index: 10;
    top: 0;
    left: 0;
    position: absolute;
    margin-left: calc(100% - (50% + var(--w) / 2));
    margin-top: calc(50vw - var(--h) / 2); 
    pointer-events: none;
    font-size: 14px;
  }
  #map {
    height: 100vw;
  }
}


</style>