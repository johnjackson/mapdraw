<template>
    <div>
        <div id="map" class="map-main"></div>
        <div id="info">
            <p style="margin: 0">图形几何信息如下：</p>
            <div id="result">
                <div @click="save">### save ###</div>
                <router-link to="/preview"> go to preview </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet-draw';
import '@/Leaflet.draw.cn.js';

export default {
    data() {
        return {
            map: null,
            drawControl: null,
            drawLayerGrounp: {} // 图形图层组
            // type: ''
        };
    },
    mounted() {
        this.ininMap(); // 初始化地图
        this.initDrawCtrl(); // 初始化绘制控件
        this.draw();
    },
    methods: {
        save() {
            let info = [];
            for (let id in this.drawLayerGrounp._layers) {
                console.log('layer', this.drawLayerGrounp._layers);
                let layer = this.drawLayerGrounp._layers[id];
                let data;
                if (layer.layerType == 'circle') {
                    data = {
                        radius: layer.getRadius(),
                        ...layer._latlng
                    };
                } else if (layer.layerType == 'rectangle') {
                    data = layer._bounds;
                } else if (layer.layerType == 'polygon') {
                    data = layer._latlngs[0];
                }
                info.push({
                    id: id,
                    layerType: layer.layerType,
                    latlng: data
                });
            }
            console.log('aa', info);
            sessionStorage.setItem('info', JSON.stringify(info));
        },
        // 初始化地图
        ininMap() {
            this.map = L.map('map', {
                attributionControl: false, // 隐藏右下角的版权
                maxBoundsViscosity: 1.0,
                minZoom: 1,
                maxZoom: 4,
                center: [0, 0],
                zoom: 1
            });
            // .setView([36.09, 120.35], 13);
            // var tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
            // tiles.addTo(this.map);

            let url = `/p.jpeg`;
            const image = new Image();
            image.onload = () => {
                const { width, height } = image;
                var southWest = this.map.unproject([0, height], 2); //像素 转 坐标
                var northEast = this.map.unproject([width, 0], 2);
                var bounds = new L.LatLngBounds(southWest, northEast);
                L.imageOverlay(url, bounds).addTo(this.map);
                this.map.setMaxBounds(bounds);
                this.map.fitBounds(bounds);
            };
            image.src = url;
        },

        // 初始化绘制控件
        initDrawCtrl() {
            //添加绘制图层到地图
            this.drawLayerGrounp = new L.FeatureGroup();
            // this.$set(this, "drawLayerGrounp", new L.FeatureGroup());
            this.map.addLayer(this.drawLayerGrounp);

            //初始化绘制控件
            this.drawControl = new L.Control.Draw({
                // position: "topleft", //控件位置 'topleft'(默认), 'topright', 'bottomleft' or 'bottomright'
                draw: {
                    polyline: false,
                    polygon: true,
                    rectangle: true,
                    circle: true,
                    marker: false,
                    circlemarker: false
                },
                edit: {
                    //绘制图层
                    featureGroup: this.drawLayerGrounp,
                    //图形编辑控件
                    edit: true,
                    //图形删除控件
                    remove: true
                }
            }).addTo(this.map); // 要添加到 L.map 对象中
            // 添加绘制完监听事件
            this.map.on(L.Draw.Event.CREATED, this.drawCreatedBack);
        },
        // 交互绘制回调
        drawCreatedBack(e) {
            console.log('绘制完成', e);
            // 绘制的图形图层对象
            let drawLayer = e.layer;
            drawLayer.layerType = e.layerType;
            // 添加到图层组
            this.drawLayerGrounp.addLayer(drawLayer);
        },
        draw() {
            let info = JSON.parse(sessionStorage.getItem('info'));
            let drawLayer;
            info.forEach(item => {
                if (item.layerType == 'polygon') {
                    var latlngs = item.latlng.map(node => {
                        return [node.lat, node.lng];
                    });
                    drawLayer = L.polygon(latlngs);
                } else if (item.layerType == 'rectangle') {
                    var bounds = [
                        [item.latlng._northEast.lat, item.latlng._northEast.lng],
                        [item.latlng._southWest.lat, item.latlng._southWest.lng]
                    ];
                    drawLayer = L.rectangle(bounds);
                    // L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);
                } else if (item.layerType == 'circle') {
                    drawLayer = L.circle([item.latlng.lat, item.latlng.lng], { radius: item.latlng.radius });
                }
                drawLayer.layerType = item.layerType;
                this.drawLayerGrounp.addLayer(drawLayer);
            });
        }

        //获取线几何信息
        // getDrawInfo(type) {
        //     if (type == "polygon") {
        //         this.type = "线";
        //     } else if (type == "rectangle") {
        //         this.type = "矩形";
        //     } else if (type == "rectangle") {
        //         this.type = "圆形";
        //     }
        //     console.log("drawLayerGrounp", this.drawLayerGrounp);
        // },

        // 销毁绘制控件
        // destoryDrawCtr() {
        //     // L.Control.Draw 控件对象
        //     this.drawControl = null;

        //     // 删除全部绘制的图层
        //     if (this.drawLayerGrounp) {
        //         this.drawLayerGrounp.clearLayers();
        //     }
        //     // 取消绘制完监听事件，避免在真正开发中，其它地方也监听了 CREATED 事件
        //     this.container.map.off(L.Draw.Event.CREATED, this.drawCreatedBack);
        // },
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
    right: 500px;
    bottom: 0;
    border: 1px solid #000;
    /* background: #ccc; */
}
#info {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    /* height: 200px; */
    width: 500px;
    z-index: 999;
    border: solid 1px;
}
</style>