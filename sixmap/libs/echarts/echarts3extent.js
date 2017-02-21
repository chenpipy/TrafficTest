/**
 * Created by femg on 2016/12/17.
 */

/////////////////////////////////////////////////////////////////////////
//region /** Openlayers3扩展Echarts3地图 */

/**
 * 构造函数
 */
OLMapExtentEcharts = function (map, ec) {
    this._map = map;
    var size = map.getSize();
    var div = this._echartsContainer = document.createElement('div');
    div.id = 'olmap-echarts';
    div.style.position = 'absolute';
    div.style.height = size[1] + 'px';
    div.style.width = size[0] + 'px';
    div.style.top = 0;
    div.style.left = 0;
    map.getViewport().appendChild(div);
    this._init(map, ec);
};

/**
 * echarts 容器元素
 */
OLMapExtentEcharts.prototype._echartsContainer = null;

/**
 * ol地图实例
 */
OLMapExtentEcharts.prototype._map = null;

/**
 * 使用的echarts实例
 */
OLMapExtentEcharts.prototype._ec = null;

/**
 * 坐标集合
 */
OLMapExtentEcharts.prototype._geoCoord = [];

/**
 * 记录地图的偏移量
 */
OLMapExtentEcharts.prototype._mapOffset = [0, 0];

/**
 * 初始化方法
 */
OLMapExtentEcharts.prototype._init = function (map, ec) {
    var self = this;
    self._map = map;

    /**
     * 获取echarts容器
     */
    self.getEchartsContainer = function () {
        return self._echartsContainer;
    };

    /**
     * 获取map实例
     */
    self.getMap = function () {
        return self._map;
    };

    /**
     * 经纬度转换为屏幕像素
     */
    self.geoCoord2Pixel = function (geoCoord) {
        return self._map.getPixelFromCoordinate(ol.proj.fromLonLat(geoCoord));
    };

    /**
     * 屏幕像素转换为经纬度
     */
    self.pixel2GeoCoord = function (pixel) {
        return self._map.getCoordinateFromPixel(pixel);
    };

    /**
     * 初始化echarts实例
     */
    self.initECharts = function () {
        self._ec = ec.init.apply(self, arguments);
        self._bindEvent();
        self._addMarkWrap();
        return self._ec;
    };

    /**
     * 获取ECharts实例
     */
    self.getECharts = function () {
        return self._ec;
    };

    /**
     * 获取地图的偏移量
     */
    self.getMapOffset = function () {
        return self._mapOffset;
    };

    /**
     * 添加点要素
     */
    self._addMarkWrap = function () {
        function _addMark(seriesIdx, markData, markType) {
            var data;
            if (markType == 'markPoint') {
                var data = markData.data;
                if (data && data.length) {
                    for (var k = 0, len = data.length; k < len; k++) {
                        self._AddPos(data[k]);
                    }
                }
            }
            else {
                data = markData.data;
                if (data && data.length) {
                    for (var k = 0, len = data.length; k < len; k++) {
                        self._AddPos(data[k][0]);
                        self._AddPos(data[k][1]);
                    }
                }
            }
            self._ec._addMarkOri(seriesIdx, markData, markType);
        }

        self._ec._addMarkOri = self._ec._addMark;
        self._ec._addMark = _addMark;
    };

    /**
     * 对echarts的setOption加一次处理
     * 用来为markPoint、markLine中添加x、y坐标，需要name与geoCoord对应
     */
    self.setOption = function (option, notMerge) {
        var series = option.series || {};

        // 记录所有的geoCoord
        for (var i = 0, item; item = series[i++];) {
            var geoCoord = item.geoCoord;
            if (geoCoord) {
                for (var k in geoCoord) {
                    self._geoCoord[k] = geoCoord[k];
                }
            }
        }

        // 添加x、y
        for (var i = 0, item; item = series[i++];) {
            var markPoint = item.markPoint || {};
            var markLine = item.markLine || {};

            var data = markPoint.data;
            if (data && data.length) {
                for (var k = 0, len = data.length; k < len; k++) {
                    self._AddPos(data[k]);
                }
            }

            data = markLine.data;
            if (data && data.length) {
                for (var k = 0, len = data.length; k < len; k++) {
                    self._AddPos(data[k][0]);
                    self._AddPos(data[k][1]);
                }
            }
        }

        self._ec.setOption(option, notMerge);
    };

    /**
     * 增加x、y坐标
     */
    self._AddPos = function (obj) {
        var coord = this._geoCoord[obj.name]
        var pos = this.geoCoord2Pixel(coord);
        obj.x = pos[0];//- self._mapOffset[0];
        obj.y = pos[1];//- self._mapOffset[1];
    };

    /**
     * 绑定地图事件的处理方法
     */
    self._bindEvent = function () {
        // self._map.getView().on('change:resolution', _zoomChangeHandler('zoom'));
        self._map.getView().on('change:center', _moveHandler('moving'));
        self._map.on('moveend', _moveHandler('moveend'));
        self._ec.getZr().on('dragstart', _dragZrenderHandler(true));
        self._ec.getZr().on('dragend', _dragZrenderHandler(false));
    };

    /**
     * 地图缩放触发事件
     */
    function _zoomChangeHandler(type) {
        _fireEvent(type);
    };

    /**
     * 地图移动、如拖拽触发事件
     * @param {string} type moving | moveend  移动中|移动结束
     */
    function _moveHandler(type) {
        return function (e) {
            // 记录偏移量
            var offsetEle = self._echartsContainer.parentNode.parentNode.parentNode;
            self._mapOffset = [-parseInt(offsetEle.style.left) || 0, -parseInt(offsetEle.style.top) || 0];
            self._echartsContainer.style.left = self._mapOffset[0] + 'px';
            self._echartsContainer.style.top = self._mapOffset[1] + 'px';
            _fireEvent(type);
        }
    };

    /**
     * Zrender拖拽触发事件
     * @param {boolean} isStart
     */
    function _dragZrenderHandler(isStart) {
        return function () {
            self._map.dragging = isStart;
        }
    };

    /**
     * 触发事件
     * @param {stirng}  type 事件类型
     */
    function _fireEvent(type) {
        var func = self['on' + type];
        if (func) {
            func();
        } else {
            self.refresh();
        }
    };

    /**
     * 刷新页面
     */
    self.refresh = function () {
        if (self._ec) {
            var option = self._ec.getOption();
            var component = self._ec.component || {};
            var legend = component.legend;
            var dataRange = component.dataRange;

            if (legend) {
                option.legend.selected = legend.getSelectedMap();
            }

            if (dataRange) {
                option.dataRange.range = dataRange._range;
            }
            self._ec.clear();
            self.setOption(option);
        }
    };

    return OLMapExtentEcharts;
};
//endregion


/////////////////////////////////////////////////////////////////////////
