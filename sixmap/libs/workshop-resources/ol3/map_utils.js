/**
 * Created by escore on 2016/11/3.
 */
/**
 * Elements that make up the popup.
 */
    var map,vectorLayer;
    var highlightStyleCache={},highlight;
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250   //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度. 单位为毫秒（ms）
    }
}));


/**
 * Add a click handler to the map to render the popup.
 */

map.on('click', function(evt) {
    var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
        coordinate, 'EPSG:3857', 'EPSG:4326'));
    content.innerHTML = '<p>你点击的坐标是：</p><code>' + hdms + '</code>';
    overlay.setPosition(coordinate);
    map.addOverlay(overlay);
});

    var style=new ol.style.Style({
        fill:new ol.style.Fill({color:'rgba(255, 255, 255, 0.6)',
        }),
        stroke:new ol.style.Stroke({
            color:'#319FD3',
            width:1
        }),
        text:new ol.style.Text({
            font:'12px Calibri,sans-serif',
            fill:new ol.style.Fill({
                color:'#000'
            }),
            stroke:new ol.style.Stroke({
                color:'#fff',
                width:3
            })
        })

    });
    vectorLayer=new ol.layer.Vector({
        source:new ol.source.GeoJSON({
            projection:'EPSG:3857',
            url:''
        }),
        style:function(feature,resolution){
            style.getText().setText(resolution<5000?feature.get('name'):'');
        return [style];
        }
    })
    map.addLayer(vectorLayer);
    var featureOerlay=new ol.FeatureOverlay({
        map:map,
        style:function(feature,resolution){
            var text=resolution<5000?feature.get('name'):'';
            if(!highlightStyleCache[text]){
                highlightStyleCache[text]=[new ol.style.Style({
                    stroke:new ol.style.Stroke({
                        color:'#f00',
                        width:1
                    }),
                    fill:new ol.style.Fill({
                        color:'rgba(255,0,0,0.1)'
                    }),
                    text:new ol.style.Text({
                        font:'12px Calibri,sans-serif',
                        text:text,
                        fill:new ol.style.FILL({
                             color:'#f00',
                            width:3
                            })
                    })
                })]
            }
            return highlightStyleCache[text];
        }
    })
        var displayFeatureInfo=function(pixel){
            var feature=map.forEachFeatureAtPixel(pixel,function(feature,layer){
                return feature;
            })
        if(feature!==highlight){
            if(highlight){
                featureOerlay.removeFeature(highlight);
            }
            if(feature){
                featureOerlay.addFeature(feature);
            }
            highlight=feature;
        }
        };
        map.on('pointermove',function(evt){
            if(evt.dragging){
                return;
            }
            var pixel=map.getEventPixel(evt.originalEvent);
            displayFeatureInfo((pixel))

        });
/**
 * 鼠标点击的事件
 */
map.on('click', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        return feature;
    });
    var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
        coordinate, 'EPSG:3857', 'EPSG:4326'));
    if(feature!==undefined){
        content.innerHTML = '<p>你点击的坐标是：</p><code>' + hdms + '</code><p>这里属于：'+ feature.get('name') + '</p>';
    }
    else{
        content.innerHTML = '<p>你点击的坐标是：</p><code>' + hdms + '</code><p>这里是大海！</p>';
    }
    overlay.setPosition(coordinate);
    map.addOverlay(overlay);
});

/**
 * 隐藏弹出框的函数
 */
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
