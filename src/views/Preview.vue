<template>
    <div class="preview">
        <h1>this is preview</h1>
        <div id="map" class="map-main"></div>
    </div>
</template>

<script>
import L from 'leaflet';

export default {
    data() {
        return {
            map: null
        };
    },
    mounted() {
        this.ininMap(); // 初始化地图

        this.map.on('zoom', () => {
            console.log(this.map.getZoom());
        });
    },
    methods: {
        // 初始化地图
        ininMap() {
            this.map = L.map('map', {
                attributionControl: false, // 隐藏右下角的版权
                maxBoundsViscosity: 1.0,
                minZoom: 1,
                maxZoom: 4,
                center: [0, 0],
                zoom: sessionStorage.getItem('zoom'),
                crs: L.CRS.Simple
            });
            // .setView([36.09, 120.35], 13);
            // var tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
            // tiles.addTo(this.map);

            let url = `/p.jpeg`;
            const image = new Image();
            image.onload = () => {
                const { width, height } = image;
                var southWest = this.map.unproject([0, height], 2);
                var northEast = this.map.unproject([width, 0], 2);
                var bounds = new L.LatLngBounds(southWest, northEast);
                L.imageOverlay(url, bounds).addTo(this.map);
                this.map.setMaxBounds(bounds);
                // this.map.fitBounds(bounds);
                this.draw();
            };
            image.src = url;
        },
        draw() {
            let info = JSON.parse(sessionStorage.getItem('info'));
            // let zoom = sessionStorage.getItem('zoom');
            info.forEach(item => {
                if (item.layerType == 'polygon') {
                    var latlngs = item.latlng.map(node => {
                        return [node.lat, node.lng];
                    });
                    L.polygon(latlngs).addTo(this.map);
                } else if (item.layerType == 'rectangle') {
                    var bounds = [
                        [item.latlng._northEast.lat, item.latlng._northEast.lng],
                        [item.latlng._southWest.lat, item.latlng._southWest.lng]
                    ];
                    L.rectangle(bounds).addTo(this.map);
                    // L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);
                } else if (item.layerType == 'circle') {
                    let radius = item.latlng.radius;
                    // if (zoom == '1') {
                    //     radius = item.latlng.radius / 2;
                    // } else if (zoom == '2') {
                    //     radius = item.latlng.radius / 4;
                    // } else if (zoom == '3') {
                    //     radius = item.latlng.radius / 8;
                    // } else if (zoom == '4') {
                    //     radius = item.latlng.radius / 16;
                    // }
                    L.circle([item.latlng.lat, item.latlng.lng], { radius: radius }).addTo(this.map);
                }
            });
            // var polygon = L.polygon(latlngs, { color: "red" }).addTo(map);
        }
    }
};
</script>

<style>
@import '~leaflet/dist/leaflet.css';
@import '~leaflet-draw/dist/leaflet.draw.css';
.map-main {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #000;
}
</style>
