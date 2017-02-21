/**
 * Created by Administrator on 2016/11/16 0016.
 */
    OLMap=function () {
        var Map={};
        var olViewportDiv;
        //底图所在服务器地址
        var gloableParams={
            urlGeoServerHOME: 'http://pc-niefeng:9090/geoserver/',  //GeoServer地图服务地址
            urlGeoServerWMS: 'http://pc-niefeng:9090/geoserver/hh/wms/',    //GeoServer WMS地图服务地址,hh为工作区
            urlGeoServerWFS: 'http://pc-niefeng:9090/geoserver/hh/wfs/',    //GeoServer WFS地图服务地址,hh为工作区
            urlDataDirectory: 'http://pc-niefeng:8080/data/',  //资源文件服务目录，矢量数据文件.geojson
            urlSldsDirectory: 'http://pc-niefeng:8080/slds/',  //资源文件服务目录，地图符号样式文件.sld
            urlImgsDirectory: 'http://pc-niefeng:8080/imgs/',  //资源文件服务目录，图片图标资源文件.png
            urlTileDirectory: 'http://pc-niefeng:8080/tile/',   //Tomcat服务根目录，天地图瓦片数据
            urlTileRoadMap: 'http://pc-niefeng:8080/tile/roadmap/{z}/{y}/{x}.png',   //天地图电子地图URL
            urlTileRoadLabel: 'http://pc-niefeng:8080/tile/label/{z}/{y}/{x}.png',   //天地图电子地图注记URL
            urlTileSatellite: 'http://pc-niefeng:8080/tile/satellite/{z}/{y}/{x}.png',  //天地图影像地图URL
            urlTileAnnotation: 'http://pc-niefeng:8080/tile/annotation/{z}/{y}/{x}.png',   //天地图影像地图注记URL
        }
        //根据图名获取相应的服务器地址
        Map.getgloableParam=function (paramName) {
            return gloableParams[paramName];
        }


        Map.project=ol.proj.get('ESPG:3857');//定义默认的坐标系统
        Map.center=ol.proj.transform([109.983,27.547],'ESPG:4326',Map.projection);//定义中心点

        //初始化地图
        Map.initialize=function () {









            //加载底图

        }
    }


