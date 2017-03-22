/**
 * Created by Administrator on 2017/3/17.
 */
function OLMonitor(olMap) {
    //region/*重点车辆监控、车辆历史轨迹*/
    /*    var a=1;*/
    var count = 0;
    var Monitor = {};
    Monitor.animating = false;
    var vehicleImg;
    var rotationRad;
    var iCoords;
    var locationLayer;
    var ifeatures;

    var sliderInput = document.getElementById('slider')
    $('#slider').on('input propertychange', function () {
        var slider = sliderInput.value;
        count = Math.round(slider / 1000 * (iCoords.length-1));
        console.log(count);
        //将所有要素样式清除
        for (var index in ifeatures) {
            ifeatures[index].setStyle(null);
        };

        //设置当前车辆位置
        locationLayer.getSource().getFeatureById(count).setStyle(Monitor.vehicleStyle(vehicleImg, rotations[count]));
    })
    //设置车辆的样式
    Monitor.vehicleStyle = function (vehicleImg, rotation) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                offset: [0, 0],
                opacity: 1.0,
                rotateWithView: true,
                rotation: rotation,
                scale: 1.0,
                src: vehicleImg,
            })
        })
    }
    //初始化车辆的位置信息
    Monitor.initMonitoring = function (Coords, vehicleimg, rotations) {
        /* console.log(a);*/
        vehicleImg = vehicleimg;
        rotationRad = [].concat(rotations);
        var iMonitoring = {};
        //转为墨卡托投影坐标
        iCoords = [].concat(olMap.transformLineCoord(Coords));
        //创建矢量图层，存储车辆轨迹
        var iLayer = new ol.layer.Vector({
            title: 'Trajectory',
            source: new ol.source.Vector(),
            style: olMap.styleMonitoring()
        })
        olMap.addLayer(iLayer);
        iMonitoring.layer = iLayer;
        //初始化轨迹
        var endPoint = new ol.Feature({
            geometry: new ol.geom.Point(iCoords[iCoords.length - 1])
        });
        var route = new ol.Feature({
            geometry: new ol.geom.LineString(iCoords)
        });
        //将featres线要素加入到layer图层中
        iMonitoring.layer.getSource().addFeatures([route, endPoint]);

        //补充通过feature来显示车辆位置

        locationLayer = new ol.layer.Vector({
            title: 'locationLayer',
            source: new ol.source.Vector(),
        });

        //添加各要素点到图层,并设置其样式为null
        for (var j = 0; j < iCoords.length; j++) {
            var feature = new ol.Feature({
                geometry: new ol.geom.Point(iCoords[j]),
            });
            feature.setId(j);
            locationLayer.getSource().addFeature(feature);
        }
        locationLayer.setStyle(null);
        ifeatures = locationLayer.getSource().getFeatures();
        locationLayer.getSource().getFeatureById(0).setStyle(Monitor.vehicleStyle(vehicleimg, rotations[0]));
        olMap.addLayer(locationLayer);

        iMonitoring.locationLayer = locationLayer;

        return iMonitoring;
    }
    //启动历史轨迹回放
    Monitor.startTracking = function (iMonitoring) {
        var speedInput = document.getElementById('speed');
        var speed = 1000 - speedInput.value;
        olMap.map.center = olMap.center;


        //设置定时器
        var timer = setInterval(function () {
            count++;
            if (count >= iCoords.length) {
                //将所有要素样式清除
                for (var index in ifeatures) {
                    ifeatures[index].setStyle(null);
                }
                //车辆回到原点
                iMonitoring.locationLayer.getSource().getFeatureById(0).setStyle(Monitor.vehicleStyle(vehicleImg, rotationRad[0]));
                clearInterval(timer);
              /*  $('slider').attr('value:1')*/

                Monitor.animating = false;
                count = 0;
                $('#slider').val(1001).change();
               /* $('#start-animation').val('开始')*/
                $('#start-animation').css('background-image', 'url("../libs/olMap/imgs/start.png")')
                $('#slider').val(1).change();

            } else {
                //清除所有的样式
                for (var index in ifeatures) {
                    ifeatures[index].setStyle(null);
                }

                var ifeature = iMonitoring.locationLayer.getSource().getFeatureById(count);
                ifeature.setStyle(Monitor.vehicleStyle(vehicleImg, rotationRad[count]));
                //改变滑块的位置
                $('#slider').val(Math.round(count/iCoords.length*1000)).change();
            }
        }, speed);
        iMonitoring.timer = timer;
        return iMonitoring;
    }

    olMap.stopMonitoring = function (iMonitoring) {
        clearInterval(iMonitoring.timer);   //停止监控
        olMap.removeLayer(iMonitoring.layer);     //移除轨迹图层
        iMonitoring.marker.setPosition(undefined);  //移除车辆位置标记

        //移除Overlay容器控件
        var geoMarker = document.getElementById('geoMarker');
        geoMarker.parentNode.removeChild(geoMarker);
    }
    //iLayer：要被移除的图层对象
    //endregion
    return Monitor;
}


