/**
 * Created by Administrator on 2016/11/16 0016.
 */
/region /
OLMap = function (targetDiv) {

//判断map的div容器是否存在，不存在则直接返回
    if (!targetDiv) return null;

    var Map = {};
    var olViewportDiv;  //地图控件的div容器 ol-viewport

//region /*地图全局常量，地图服务地址、数据及文件资源地址、常量访问方法*/
    //定义地图全局常量
    var GlobalParams = {
        //本机测试环境
        urlGeoServerHOME: 'http://pc-niefeng:9090/geoserver/',  //GeoServer地图服务地址
        urlGeoServerWMS: 'http://pc-niefeng:9090/geoserver/hh/wms/',    //GeoServer WMS地图服务地址,hh为工作区
        urlGeoServerWFS: 'http://pc-niefeng:9090/geoserver/hh/wfs/',    //GeoServer WFS地图服务地址,hh为工作区
        urlDataDirectory: 'http://pc-niefeng:8080/data/',  //资源文件服务目录，矢量数据文件.geojson
        urlSldsDirectory: 'http://pc-niefeng:8080/slds/',  //资源文件服务目录，地图符号样式文件.sld
        urlImgsDirectory: 'http://192.168.1.155:8080/imgs/',  //资源文件服务目录，图片图标资源文件.png
        urlTileDirectory: 'http://pc-niefeng:8080/tile/',   //Tomcat服务根目录，天地图瓦片数据
        urlTileRoadMap: 'http://pc-niefeng:8080/tile/roadmap/{z}/{y}/{x}.png',   //天地图电子地图URL
        urlTileRoadLabel: 'http://pc-niefeng:8080/tile/label/{z}/{y}/{x}.png',   //天地图电子地图注记URL
        urlTileSatellite: 'http://pc-niefeng:8080/tile/satellite/{z}/{y}/{x}.png',  //天地图影像地图URL
        urlTileAnnotation: 'http://pc-niefeng:8080/tile/annotation/{z}/{y}/{x}.png',   //天地图影像地图注记URL
        urlMyTest: 'http://192.168.1.155:8082/geoserver/MyTest/wms ',
        urlTianDiTu:'http://192.168.1.155:8080/tianditu/{z}/{y}/{x}.png',
        urlImage:'http://192.168.1.155:8080/imgs/',
        urlTileTianditu: 'http://192.168.1.155:8080/TianDiTu/tianditu/{z}/{y}/{x}.png'
        };
    //获取常量的方法
    Map.getGlobalParam = function (paramName) {
        return GlobalParams[paramName];
    };

    Map.projection = ol.proj.get('EPSG:3857');  //定义默认坐标系统（WGS 1984 Web Mercator）
//定义地图视图的初始化中心
    Map.center = ol.proj.transform([109.983, 27.547], 'EPSG:4326', Map.projection);   //坐标中心（WGS 1984经纬度转投影）
//初始化地图
    Map.initialize=function () {
       Map.view=new ol.View({
        projection:Map.projection,
           center:Map.center,
           zoom:13,
           minZoom:8,
           maxZoom:18
       });

        //地图图例div
        Map.legend=document.createElement('div');
        Map.legend.className='map-legend';
        Map.legend.id='map-legend';

        var div=document.createElement('div');
        div.className='tittle';
        div.innerHTML='<label class="map-legend-labelTitle">图例</label ><label class="map-legend-labelClose">×</label>';

        var ui=document.createElement('div');
        ui.className='map-legend-ui';
        ui.id='map-legend-ui';
        Map.legend.appendChild(div);
        Map.legend.appendChild(ui);

        //地图测距div
        Map.measuretool=document.createElement('div');
        Map.measuretool.id='map-measuretool';
        Map.measuretool.className='map-measuretool';


        //地图右下角logo控件
        Map.logo=document.createElement('a');
        Map.logo.href='';
        Map.logo.target='_blank';
        var logoImage=document.createElement('img');
        logoImage.src='http://192.168.1.155:8080/imgs/logo.png';
        Map.logo.appendChild(logoImage);

        //初始化气泡图层
        Map.popup=document.createElement('div');
        Map.popup.id='popup';
        Map.popup.className='ol-popup';
        Map.popup.innerHTML='<label class="ol-popup-closer" id="popup-closer"></label><div id="popup-content"></div>'
        Map.popup.style.display='none';
        //添加地图比例尺
        Map.scaleLine=document.createElement('div');
        Map.scaleLine.id='scale-line';
        Map.scaleLine.className='scale-line';
        //添加地图底图切换控件
        Map.mapSwitch=document.createElement('div');
        Map.mapSwitch.className='map-switch';
        Map.mapSwitch.id='map-switch';

        Map.mapSwitch.innerHTML='<div class="map-switch-card roadmap" id="RoadMap Group"><div class="map-switch-box">'+
            '<input type="checkbox" class="map-switch-label" id="RoadMap Label" checked="checked">'+
            '<p>显示注记</p></div><span>地图</span></div><div class="map-switch-card satellite" id="Satellite Group"><div class="map-switch-box">'+
            '<input type="checkbox" class="map-switch-label" id="Satellite Annotation" checked="checked">'+
            '<p>显示注记</p></div><sapn>影像</sapn></div>'
        Map.fullScreen=document.createElement('div');
        Map.fullScreen.id='fullscreen';
        Map.fullScreen.className='fullscreen';

        Map.controls=new ol.control.defaults().extend([
            new ol.control.ScaleLine({
               className:'ol-scale-line',
                target:Map.scaleLine
            }),
            new ol.control.ZoomSlider({
                minResolution:Map.view.minResolution,
                maxResolution:Map.maxResolution
            }),
            new ol.control.FullScreen({
                source:Map.fullScreen
            })
        ]);
        //选中要素交互方式
        Map.interactiveSelect=new ol.interaction.Select({
            condition:ol.events.condition.click,
            style:Map.styleFeatureSelected()
        });
        Map.interactiveDraw=new ol.interaction.Draw({
            type:'point'
        })
        Map.interactiveModify=new ol.interaction.Modify({
            features:Map.interactiveSelect.getFeatures()
        });
         Map.interacions=[Map.interactiveSelect];

        //添加地图
        /*Map.roadMapLayer=new ol.layer.Image({
            title:'RoadMap',
            visible:true,
            source:new ol.source.ImageWMS({
                url:Map.getGlobalParam('urlMyTest'),
                params:{"LAYERS":'MyTest:gis_segment_double'}
            })
        });*/
        Map.roadMapLayer=new ol.layer.Tile({
            title:'RoadMap',
            visible:true,
            source:new ol.source.XYZ({
                url:Map.getGlobalParam('urlTileRoadMap'),
            })
        });
        //添加地图注记
        Map.roadLabelLayer=new ol.layer.Tile({
           title:'RoadMap Label',
            visible:true,
            source:new ol.source.XYZ({
                url:Map.getGlobalParam('urlTileRoadLabel')
            })
        });
        //添加影像图
        Map.satelliteLayer=new ol.layer.Tile({
           title:'Satellite',
            visible:true,
            source:new ol.source.XYZ({
                url:Map.getGlobalParam('urlTileSatellite')
            })
        });
        //添加影像图注记
        Map.annotationLayer=new ol.layer.Tile({
            title:'Satellite Annotation',
            visible:true,
            source:new ol.source.XYZ({
                url:Map.getGlobalParam('urlTileAnnotation')
            })
        });
        //添加地图图层组（包含地图和注记）
        Map.roadMapLayerGroup=new ol.layer.Group({
            title:'RoadMap Group',
            visible:true,
            isBaseLayer:true,
            layers:[Map.roadMapLayer,Map.roadLabelLayer]
        });
        //添加影像图层组（包括影像图和注记）
        Map.satelliteLayerGroup=new ol.layer.Group({
           title:'Satellite Group',
            visible:false,
            isBaseLayer:true,
            layers:[Map.satelliteLayer,Map.annotationLayer]
        });

        Map.map=new ol.Map({
            target:targetDiv,
            loadTilesWhileAnimating: true,
            interactions:ol.interaction.defaults().extend(Map.interacions),
            layers:[Map.roadMapLayerGroup,Map.satelliteLayerGroup],
            view:Map.view,
            controls:Map.controls,
            logo:Map.logo,

        });
        //将将地图的相关控件加载到div容器ol-viewport中去，作为其子节点
        olViewportDiv=targetDiv[targetDiv.firstElementChild ? 'firstElementChild':'firstChild'];
        olViewportDiv.appendChild(Map.popup);
        olViewportDiv.appendChild(Map.scaleLine);
        

        // olViewportDiv.appendChild(Map.legend);
       // olViewportDiv.appendChild(Map.mapSwitch);
    };
    //坐标转换，将WGS84经纬度坐标转换至系统的投影坐标
    Map.transformCoordinate = function (coordinate, sourceProj, targetProj) {
        if (!sourceProj) {
            sourceProj = 'EPSG:4326';
        }
        if (!targetProj) {
            targetProj = Map.projection;
        }
        return ol.proj.transform(coordinate, sourceProj, targetProj);
    }
    //region /* 地图交互，视图平移，缩放，动画效果要素选取，绘制，编辑等操作 */
        //开关地图要素选取工具
        Map.canSelectFeature=function (canSelect) {
            canSelect ? Map.interactions[0]=Ma.interactiveSelect : Map.interacions[0]=null;
        };

        //开关绘图工具
        Map.canDrawFeature=function (canDraw) {
            canDraw ? Map.interactions[1]=Map.interactiveDraw : Map.interactions[1]=null;
        };
        //开关编辑当前选中要素
        Map.canModifyFeature=function (canModify) {
            canModify ? Map.interactions[2] = Map.interactiveModify : Map.interactions[2]=null;
        };
        /*
        //地图视图平移效果，效果的持续时间，毫秒
        Map.animationPan=function (duration) {
            var pan=ol.animation.pan({
                duration:duration,
                source:Map.view.getCenter()
            });
            return pan;
        }
        //地图视屏变化的缩放效果
        Map.animationZoom=function (duration) {
            var zoom=new ol.animation.zoom({
                duration:duration,
                resolution:Map.view.getResolution()
            });

        };
        //地图范围变化的旋转效果
        Map.animationRotate=function (duration) {
          var rotate=new ol.animation.rotate({
              duration:duration,
              rotation:Map.view.getRotation()
          });
            return rotate;
        };
        //视图范围变化的弹跳动画效果
        Map.animationBounce=function (duration) {
            var bounce=new ol.animation.bounce({
                duration:duration,
                resolution:Map.view.getResolution()
            });
        };
        //不改变缩放级别，设置当前视图的中心坐标点
        Map.zoomToCenter=function (x,y) {
          Map.map.beforeRender(Map.animationPan(1000));
            Map.view.setCenter(ol.proj.transform((x,y),'ESPG:4326',Map.projection));
        };

        //改变缩放级别，并涉设置当前的坐标中心点
        Map.zoomToCenterLevel=function (level,x,y) {
          Map.map.beforeRender(Map.animationPan(1000),Map.animationZoom(1000));
            Map.view.setCenter(ol.proj.transform((x,y),'ESPG:4326',Map.projection));
            Map.view.setZoom(level);
        };
        //设置当前视图范围，缩放至当前选中要素
        //features:当前选中要素的集合
        Map.zoomToFeatures=function (features) {
          if(features){
              var feature=features.item(0);
              var size=Map.map.getSize();
              Map.map.beforeRender(Map.animationPan(1000),Map.animationZoom(1000));
              Map.view.fitExtent(feature.getGeometry(),size);
          }
        };
        //将地图缩放至指定的视图范围
        //extent:指定的视图范围[]
        Map.zoomToExtent=function (extent) {
          if(extent){
            extent=ol.proj.transformExtent(extent,'ESPG:4326',Map.projection);
              var size=Map.map.getSize();
              Map.map.beforeRender(Map.animationPan(1000),Map.animationZoom(1000));
              Map.view.fitExtent(extent,size);
          }
        };
        */
    //endregion

    //region /*  地图控件的控制，导航条，比例尺、地图底图切换，logo，坐标，属性信息popup*/

    //显示测距
    /*olViewportDiv.appendChild(Map.measuretool);
    var measureui=document.getElementById('map-measuretool');*/



   //开关地图图例栏
    Map.showLegendControl=function (isShow,json,currentMap) {
        var legend=document.getElementById('map-legend');
        if(isShow){
            if(!legend){
                olViewportDiv.appendChild(Map.legend);
                var legendui=document.getElementById('map-legend-ui');
                legendui.innerHTML=null;
                if(json){
                    for(var i=0;i<json.length;i++ ){
                        var li=document.createElement('li');

                        var ckb=document.createElement('input');//选择控件
                        ckb.name=json[i].layer;
                        ckb.className='map-legend-input';
                        ckb.type='checkbox';
                        ckb.checked=true;
                        li.appendChild(ckb);
                        
                        var img=document.createElement('img')
                        img.src=json[i].src;
                        img.alt=json[i].text;
                        li.appendChild(img);
                        
                        var label=document.createElement('label');
                        label.innerText=json[i].text;
                        li.appendChild(label);
                        
                        legendui.appendChild(li);
                    }
                }
                //图例的控制图层显示隐藏
                $('.map-legend-input').click(function () {
                });
                $('.map-legend-labelClose').click(function () {
                    $('#map-legend-ui').hide();
                    $('.map-legend-labelClose').hide();
                });
                $('.map-legend-labelTitle').click(function () {
                    $('#map-legend-ui').show();
                    $('.map-legend-labelClose').show();
                    }
                    );
            }
        }
        else
        {
            if(legend)
                olViewportDiv.removeChild(legend);
        }
    };
    //开关底图切换控件（显示地图还是影像图）
    Map.showMapSwitchControl=function(isShow,currentMap){
        var mapswitch=document.getElementById('map-switch');
        if(isShow){
            if(!mapswitch){
                olViewportDiv.appendChild(Map.mapSwitch);
                //注册底图注记开关事件
                $('.map-switch-label').click(function () {
                    var currName=$(this).attr('id');
                    var roadLabelName=currentMap.roadLabelLayer.get('title');
                    var annotationName=currentMap.annotationLayer.get('title');
                    if(currName==roadLabelName){
                        currentMap.roadLabelLayer.setVisible(this.checked);
                    }else if(currName==annotationName){
                        currentMap.annotationLayer.setVisible(this.checked);
                    }
                });

                //注册底图切换事件
                $('.map-switch-card').click(function(){
                    var currName=$(this).attr('id');
                    var roadMapGroupName=currentMap.roadMapLayerGroup.get('title');
                    var satelliteGroupName=currentMap.satelliteLayerGroup.get('title');
                    if(currName==roadMapGroupName){
                        document.getElementById(roadMapGroupName).style.border="2px solid #3385FF";
                        document.getElementById(satelliteGroupName).style.border="none";
                        currentMap.roadMapLayerGroup.setVisible(true);
                        currentMap.satelliteLayerGroup.setVisible(false);
                    }else if(currName==satelliteGroupName){
                        document.getElementById(roadMapGroupName).style.border = "none";
                        document.getElementById(satelliteGroupName).style.border = "2px solid #3385FF";
                        currentMap.roadMapLayerGroup.setVisible(false);
                        currentMap.satelliteLayerGroup.setVisible(true);
                    }
                });
            }
        }else{
            olViewportDiv.removeChild(mapswitch);
        }
    };
    //开关右下角图标超链接控件
        Map.showLogoControl=function(isShow){
          isShow ? Map.controls.getArray()[2].setMap(Map.map):Map.controls.getaray()[2].setMap(null);
        }
        //开关左下角地图比例尺控件
    Map.showScalelingControl=function(isShow){
        isShow ? Map.controls.getArray()[3].setMap(Map.map):Map.controls.getArray()[3].setMap(null);
        }
    //开关左上角地图缩放控件
    Map.showZoomSliderControl=function (isShow) {
        isShow ? Map.controls.getArray()[0].setMap(Map.map):Map.controls.getArray()[0].setMap(null);
        isShow ? Map.controls.getArray()[4].setMap(Map.map):Map.controls.getArray()[4].setMap*(null);
    }
    //获取鼠标当前的经纬度坐标
    Map.showCoordinateInfo=function (pixel) {
        var coordSource=Map.map.getCoordinateFromPixel(pixel);
        var coord=ol.proj.transform(coordSource,Map.projection,'ESPG:4326');
        return coord;
    }
    //冒泡，弹出选中要素的相关属性信息
    Map.showFeatureInfo=function (feature,innerHTML) {
        if(feature){
            Map.popup.style.display='';
            var container=document.getElementById('popup');
            var content=document.getElementById('popup-content');
            var closer=document.getElementById('popup-closer');

            //创建一个overlay,将container中的数据装载进去
            var popup=new ol.Overlay({
                element:container,
                autoPan:true,
                positioning:'bottom-center',
                stopEvent:false,
                autoPanAnimation:{duration:250}
            });
            Map.map.addOverlay(popup);

            //添加关闭按钮单击事件
            closer.onclick=function () {
              popup.setPosition(undefined);
                closer.blur();
                return false;
            };
            content.innerHTML=innerHTML;
            if(popup.getPosition()==undefined){
                popup.setPosition(feature.getGeometry().getCoordinates());
            }
            }
        else{
            Map.popup.style.display='none';//隐藏popup栏
        }
    };
   //endregion
    //region /* 地图图层操作，添加、移除、查找图层、获取图层要素、设置图层样式 */
        
    //添加WFS要素图层:
    Map.addWFSLayer=function (geoServerWFSUrl,iLayerName,iTittle,iStyle) {
        var wfssource=Map.getGeoServerWFSSource(geoServerWFSUrl,iLayerName);
        var iLayer=new ol.layer.Vector({
            source:wfssource,
            title:iTittle,
            style:iStyle
        })
        Map.map.addLayer(iLayer);
    };
    
    //添加WMS地图图层
    Map.addWMSLayer=function (geoServerWMSUrl,iLayerName,iTitle) {
        var iLayer=new ol.layer.Tile({
            title:iTitle,
            visible:true,
            isBaseLayer:false,
            source:new ol.source.TileWMS({
                url:geoServerWMSUrl,
                params:{
                    FORMAT:'image/png',
                    VERSION:'1.1.1',
                    TILED:false,
                    LAYERS:iLayerName,
                    STYLES:'',
                    serverType:'geoserver'
                }
            })
        });
        Map.map.addLayer(iLayer);
    }
    //添加本地的矢量Json数据
    Map.addVectorLayer=function (geojsonFile,iTitle,iStyle) {
        var iLayer=new ol.layer.Vector({
            title:iTitle,
            source:new ol.source.Vector({
                url:geojsonFile,
                format:new ol.format.GeoJSON()
            }),
            style:iStyle
        })
        Map.map.addLayer(iLayer);
    }

    //添加热图图层（geojson文件）
//geojsonFile：矢量数据文件的地址，一般为.geojson格式
//iTitle：图层的名称
    Map.addHeatmap = function (geojsonFile, iTitle) {
        var heatmap = new ol.layer.Heatmap({
            title: iTitle,
            source: new ol.source.Vector({
                url: geojsonFile,
                format: new ol.format.GeoJSON()
            }),
            gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
//          minResolution:  2,
//          maxResolution: 45,
            blur: 25,
            radius: 5,
            shadow: 250,
            opacity: 0.75
        });
        Map.map.addLayer(heatmap);
    }
    //添加jsonde 字符串数据为图层
    Map.addVectorLayerJSON=function (geojsonObject,iTitle,iStyle) {
        var features=new ol.format.GeoJSON().readFeatures(geojsonObject,{
            featureProjection:'ESPG:3857'
        });
        if(features){
            var iLayer=new ol.layer.Vector({
                title:iTitle,
                source:new ol.source.Vector({
                    projection:Map.projection,
                    features:features,
                    format:new ol.format.GeoJSON()
                }),
                style:iStyle
            });
            Map.map.addLayer(iLayer);
        }
    };

    //添加图层对象到map
    Map.addLayer=function (iLayer) {
        Map.map.addLayer(iLayer);
    };

    //通过图层的标题，获取图层
    Map.getLayerByTitle=function (iTitle) {
        var iLayers=Map.map.getLayers();
        for(var i=0;i<iLayers.getLength();i++){
            var layer=iLayers.item(i)
            if(layer.get('title')==iTitle){
                return layer;
            }
        }
    };

    //通过图层的标题title，获取矢量图层的图形要素集合(先得到图层，在获取图层包含的要素)
    Map.getVectorLayerFeaturesByTitle=function (iTitle) {
        var features;
        if(iTitle){
            var vLayer=Map.getLayerByTitle(iTitle);
            if(vLayer){
                features=vLayer.getSource().getFeatures();
            }
        }
        return features;
    };
    //获取鼠标当前位置的要素集合及图层名称
    Map.getFeaturesAtPixel=function (pixel) {
        return Map.map.forEachFeatureAtPixel(pixel,function (feature,layer) {
            return{
              feature:feature,
                layer:layer
            };
        });
    }
    //设置图层的地图符号样式
    Map.setLayerStyle=function (iLayer,iStyle) {
        iLayer.setStyle(iStyle);
    }
    
    //设置矢量图层的数据源(就是将json字符串，作为矢量图层的数据源)
    Map.setVectorLayerSource=function (iLayer,geojsonObject) {
        if(iLayer){
            var iSource=new ol.source.Vector({
                projection:Map.projection,
                format:new ol.format.GeoJSON()
            });
            var ifeatures=new ol.format.GeoJSON().readFeaturesFromObject(geojsonObject,{
                featureProjection:'ESPG:3857'
            })
            if(!ifeatures){
                ifeatures=new ol.Collection();
            }
            iSource.addFeatures(ifeatures);
            iLayer.setSource(iSource);
        }
    };
    //添加图层要素集合至矢量图层
    Map.addFeaturesToVectorLayer=function (iLayer,iFeatures) {
        if(iFeatures){
            if(iLayer){
                iLayer.getSource().addFeatures(iFeatures);
            }
        }
    };
    //endregion

    //region /* 地图渲染样式，点线面等地图符号样式*/
    //当前选中要素的额地图符号（点线面）
        Map.styleFeatureSelected=function () {
            return[
                new ol.style.Style({
                    image:new ol.style.Circle({
                        radius:10,
                        fill:new ol.style.Fill({
                            color:'rgba(255,255,0,0.35)'
                        }),
                        stroke:new ol.style.Stroke({
                            width:3.5,
                            lineDash:[2],
                            color:'rgba(255,0,0,1)'
                        })
                    }),
                    stroke:new ol.style.Stroke({
                        width:6,
                        lineDash:[7],
                        color:'rgba(255,0,0,0.8)'
                    }),
                    fill:new ol.style.Fill({
                        color:'rgba(255,255,0,0.4)',//黄色
                        stroke:new ol.style.Stroke({
                            width:2,
                            linDash:[7],
                            color:'rgba(0,0,255,1)'// 红色
                        })
                    })
                })
            ]
        };
        //图片点状符号化
    Map.stylePointIcon=function(src,text){
        return[
            new ol.style.Style({
                image:new ol.style.Icon({
                    src:src
                }),
                text:new ol.style.Text({
                    fill:new ol.style.Fill({
                        color:'#ff0000'
                    }),
                    stroke:new ol.style.Stroke({
                        color:'#ffffff',
                        width:2.5
                    }),
                    offsetX:0,
                    offsetY:-30,
                    font:'bold 14px Microsoft Yahei',
                    textAlign:'center',
                    text:text
                })
            })
        ]
    };
    Map.stylePoint=function(text){
        return[
            new ol.style.Style({
                image:new ol.style.Circle({
                    radius:3,
                    fill:new ol.style.Fill({
                        color:'rgba(255,0,0,0.8)'
                    }),
                }),
                text:new ol.style.Text({
                    fill:new ol.style.Fill({
                        color:'#ff0000'
                    }),
                    stroke:new ol.style.Stroke({
                        color:'#ffffff',
                        width:2.5
                    }),
                    offsetX:0,
                    offsetY:-30,
                    font:'bold 14px Microsoft Yahei',
                    textAlign:'center',
                    text:text
                })
            })
        ]
    };
    //线状地图符号
    Map.setstylePolyLineCommon=function (width,color,zIndex) {
      return[
          new ol.style.Style({
              stroke:new ol.style.Stroke({
                  width:width,
                  color:color
              }),
              zIndex:zIndex
          })
      ]
    };
    //通用面状地图符号化
    Map.stylePolygonCommon=function (fillColor,strokeColor,strokeWidth) {
        return[
            new ol.style.Style({

                fill:new ol.style.Fill({
                    color:fillColor,

                    }),
                stroke:new ol.style.Stroke({
                    width:strokeWidth,
                    color:strokeColor
                }),
                zIndex:-999

            })
        ]
    }

    //行车轨迹地图符号，包括点和线
    Map.styleMonitoring=function(){
        return [
            new ol.style.Style({
                stroke:new ol.style.Stroke({
                    width:4,
                    color:'#86B723'
                }),
                image:new ol.style.Circle({
                    radius:8,
                    fill:new ol.style.Fill({
                        color:'#86B723'
                    }),
                    stroke:new ol.style.Stroke({
                        width:2,
                        color:'#86B723'
                    })
                })
            })
        ]
    };
    //endregion
    //region/*重点车辆监控、车辆历史轨迹*/

    Map.initMonitoring=function (startCoord,showText,carImg) {
        var iMonitoring={};
       var startCoord=Map.transformCoordinate(startCoord);

        //初始化overlay容器控件
        var geoMarkerLabel=document.createElement('label');
        geoMarkerLabel.id='geoMarkerLabel';
        geoMarkerLabel.innerText=showText;
        var geoMakerImg=document.createElement('img');
        geoMakerImg.src=carImg;
        var geoMarker=document.createElement('div');
        geoMarker.id='geoMarker';
        geoMarker.appendChild(geoMarkerLabel);
        geoMarker.appendChild(geoMakerImg);
        olViewportDiv.appendChild(geoMarker);

        //在地图容器中创建Overlay，存储车辆标记
        var iMarker=new ol.Overlay({
        id:'Monitoring',
            element:geoMarker,
            positioning:'center-center',
            autoPan:false,
            stopEvent:false,
        });
        iMarker.setPosition(startCoord);
        Map.map.addOverlay(iMarker);
        iMonitoring.marker=iMarker;

        //创建矢量图层，存储车辆轨迹
        var iLayer=new ol.layer.Vector({
            title:'Trajectory',
            source:new ol.source.Vector(),
            style:Map.styleMonitoring()
        })
        Map.map.addLayer(iLayer);
        iMonitoring.layer=iLayer;

        return iMonitoring;
    }

    //启动车辆监控
    Map.startMonitoring=function(iMonitoring,iCoords){
        var i=0;

        //初始化坐标系

        var iCoords=Map.transformLineCoord(iCoords)

        //自定义起点
        var iLinePoints=[];
        iLinePoints.push(iCoords[i]);
        var iStartPoint=new ol.Feature({
            geometry:new ol.geom.Point(iLinePoints[0])
        });

        //逐点显示车辆的轨迹
        var timer=setInterval(function () {
            i++;
            if (i>=iCoords.length) {
                clearInterval(timer);
            }
            else {
               //标记起始点和轨迹线
                iLinePoints.push(iCoords[i]);
                var iLineFeature=new ol.Feature({
                    geometry:new ol.geom.LineString(iLinePoints)
                });
                var iLineSource=new ol.source.Vector({
                    features:[iStartPoint,iLineFeature]
                });

                iMonitoring.marker.setPosition(iCoords[i]);
                iMonitoring.layer.setSource(iLineSource);
                /*flyLocation(iCoords[i]);*/
            }
        },1000);
        /*function flyLocation(center) {
            var duration = 4000; //持续时间（毫秒）
            var start = +new Date();
            //移动效果
            var pan = ol.animation.pan({
                duration: duration, //设置持续时间
                source: /!** @type {ol.Coordinate} *!/(Map.view.getCenter()),
                start: start
            });
            //反弹效果
            /!*var bounce = ol.animation.bounce({
                duration: duration, //设置持续时间
                resolution: 0.5 * Map.view.getResolution(),  //4倍分辨率
                start: start
            });*!/
            Map.map.beforeRender(pan); //地图渲染前设置动画效果(pan+bounce)
            Map.view.setCenter(center); //平移地图
            Map.view.setZoom(15); //放大地图
        }*/
        iMonitoring.timer=timer;

        return iMonitoring;
        }
        //启动历史轨迹回放
    Map.startTrack=function (iMonitoring,iCoords) {
        var i=0;
        Map.map.center=Map.center;
        var iCoords=Map.transformLineCoord(iCoords);
        //初始化轨迹
        var endPoint=new ol.Feature({
            geometry:new ol.geom.Point(iCoords[iCoords.length-1])
        });
        var route=new ol.Feature({
           geometry: new ol.geom.LineString(iCoords)});
        iMonitoring.layer.getSource().addFeatures([route,endPoint]);

        //逐点显示车辆的运行轨迹
        var timer=setInterval(function() {
            i++;
            if (i >= iCoords.length) {
                clearInterval(timer);
            }
            else {
                iMonitoring.marker.setPosition(iCoords[i]);
            }
        },1000);
        iMonitoring.timer = timer;
        return iMonitoring;
    }
    Map.stopMonitoring = function (iMonitoring) {
        clearInterval(iMonitoring.timer);   //停止监控
        Map.removeLayer(iMonitoring.layer);     //移除轨迹图层
        iMonitoring.marker.setPosition(undefined);  //移除车辆位置标记

        //移除Overlay容器控件
        var geoMarker = document.getElementById('geoMarker');
        geoMarker.parentNode.removeChild(geoMarker);
    }
    //iLayer：要被移除的图层对象
    Map.removeLayer = function (iLayer) {
        Map.map.removeLayer(iLayer);
    };
     //endregion
    //region /*车辆历史轨迹*/
    //转换坐标数组,初始化坐标系
    Map.transformLineCoord=function (coords) {
        var icoords=[];
        for (var i = 0; i < coords.length; i++) {
            icoords.push(Map.transformCoordinate(coords[i]));
        }
        return icoords;
    }
    //endregion
    //region  /* 扩展其他方法*/
    //获取Geoserver的WFS服务数据源
    Map.getGeoServerWFSSource=function (geoServerWFSUrl,iLayerName) {
        var wfsSource;
        wfsSource=new ol.source.Vector({
            format:new ol.format.Geojson(),
            projection:this.projection,
            loader:function (extent,resolution,projection) {
                $.ajax({
                    url:geoServerWFSUrl,
                    data:$.param({
                        service:'WFS',
                        version:'1.1.0',
                        request:'GetFeature',
                        typeName:iLayerName,
                        outputFormat:'text/javascript',
                        format_options:'callback:loadFeatures'
                    }),
                    type:'GET',
                    dataType:'jsonp',
                    crossDomain:true,
                    jsonpCallback:'loadFeatures',
                    success:function(response){
                        wfsSource.addFeatures(new ol.format.GeoJSON().readFeatures(response,{
                            featureProjeceion:'ESPG:3857'
                        }));
                    }

                });
            }
        });

    }
    //endregion
    Map.addInteraction=function (draw) {
        Map.map.addInteraction(draw);
    }
    Map.removeInteraction=function (draw) {
        Map.map.removeInteraction(draw);
    }
    Map.addOverlay=function (overLayer) {
        Map.map.addOverlay(overLayer);
    }
    Map.setViewCenter=function(coords){
        Map.view.setCenter(ol.proj.transform(coords,'ESPG:4326',Map.projection));
    }
    return Map;
};
