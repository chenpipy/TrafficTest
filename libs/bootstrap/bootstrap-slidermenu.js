/*! =======================================================
                      VERSION  4.4.1              
========================================================= */

/*! =======================================================
                      VERSION  4.4.1              
========================================================= */

/*! =======================================================
                      VERSION  4.4.1              
========================================================= */

/*! =========================================================
 * bootstrap-slidermenu.js
 * ========================================================= */
/**
 * Bridget makes jQuery widgets
 * v1.0.1
 * MIT license
 */
(function (root, factory) {
    root.SliderMenu = factory(root.jQuery);
}(this, function ($) {
	
    /*************************************************

     SliderMenu Default Options View

     **************************************************/
    var defOptions = {
    	base:"",
    	currentValue: "",
    	maxWidth: '224.5px',
    	minWidth: '70px',
    	onToggleMenu: function(flag){},
        arrowClass: {
            def: 'fa fa-angle-right',
            open: 'fa fa-angle-down'
        },
        exclution: false,
        data: []
    };
    // Reference to SliderMenu constructor
    var SliderMenu;
    (function ($) {

        'use strict';

        // -------------------------- utils -------------------------- //

        var slice = Array.prototype.slice;

        function noop() {
        }

        // -------------------------- definition -------------------------- //

        function defineBridget($) {

            // bail if no jQuery
            if (!$) {
                return;
            }

            // -------------------------- addOptionMethod -------------------------- //

            /**
             * adds option method -> $().plugin('option', {...})
             * @param {Function} PluginClass - constructor class
             */
            function addOptionMethod(PluginClass) {
                // don't overwrite original option method
                if (PluginClass.prototype.option) {
                    return;
                }
                // option setter
                PluginClass.prototype.option = function (options) {
                    // bail out if not an object
                    if (!$.isPlainObject(options)) {
                        return;
                    }
                    options = options ? options : {};
                    var optionTypes = Object.keys(this.defaultOptions);

                    for (var i = 0; i < optionTypes.length; i++) {
                        var optName = optionTypes[i];

                        // First check if an option was passed in via the constructor
                        var val = options[optName];
                        // If no data attrib, then check data atrributes
                        val = (typeof val !== 'undefined') ? val : getDataAttrib(this.element, optName);
                        // Finally, if nothing was specified, use the defaults
                        val = (val !== null) ? val : this.defaultOptions[optName];

                        // Set all options on the instance of the SliderMenu
                        if (!this.options) {
                            this.options = {};
                        }
                        this.options[optName] = val;
                    }
                    function getDataAttrib(element, optName) {
                        var dataName = "data-SliderMenu-" + optName;
                        var dataValString = element.getAttribute(dataName);

                        try {
                            return JSON.parse(dataValString);
                        }
                        catch (err) {
                            return dataValString;
                        }
                    }
                };
            }


            // -------------------------- plugin bridge -------------------------- //

            // helper function for logging errors
            // $.error breaks jQuery chaining
            var logError = typeof console === 'undefined' ? noop :
                function (message) {
                    console.error(message);
                };

            /**
             * jQuery plugin bridge, access methods like $elem.plugin('method')
             * @param {String} namespace - plugin name
             * @param {Function} PluginClass - constructor class
             */
            function bridge(namespace, PluginClass) {
                // add to jQuery fn namespace
                $.fn[namespace] = function (options) {
                    if (typeof options === 'string') {
                        // call plugin method when first argument is a string
                        // get arguments for method

                        var args = slice.call(arguments, 1);
                        for (var i = 0, len = this.length; i < len; i++) {
                            var elem = this[i];
                            var instance = $.data(elem, namespace);
                            if (!instance) {
                                logError("cannot call methods on " + namespace + " prior to initialization; " +
                                    "attempted to call '" + options + "'");
                                continue;
                            }
                            if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                                logError("no such method '" + options + "' for " + namespace + " instance");
                                continue;
                            }

                            // trigger method with arguments
                            var returnValue = instance[options].apply(instance, args);

                            // break look and return first value if provided
                            if (returnValue !== undefined && returnValue !== instance) {
                                return returnValue;
                            }
                        }
                        // return this if no return value
                        return this;
                    } else {
                        var objects = this.map(function () {
                            var instance = $.data(this, namespace);
                            if (instance) {
                                // apply options & init
                                instance.option(options);
                                instance._init();
                            } else {
                                // initialize new instance
                                instance = new PluginClass(this, options);
                                $.data(this, namespace, instance);
                            }
                            return $(this);
                        });

                        if (!objects || objects.length > 1) {
                            return objects;
                        } else {
                            return objects[0];
                        }
                    }
                };

            }

            // -------------------------- bridget -------------------------- //

            /**
             * converts a Prototypical class into a proper jQuery plugin
             *   the class must have a ._init method
             * @param {String} namespace - plugin name, used in $().pluginName
             * @param {Function} PluginClass - constructor class
             */
            $.bridget = function (namespace, PluginClass) {
                addOptionMethod(PluginClass);
                bridge(namespace, PluginClass);
            };

            return $.bridget;

        }

        // get jquery from browser global
        defineBridget($);

    })($);
    /*************************************************

     BOOTSTRAP-SliderMenu SOURCE CODE

     **************************************************/

    (function ($) {

        /*************************************************

         CONSTRUCTOR

         **************************************************/
        SliderMenu = function (element, options) {
            createNewSliderMenu.call(this, element, options);
            return this;
        };

        function createNewSliderMenu(element, options) {
            /*************************************************

             Create Markup

             **************************************************/
            if (typeof element === "string") {
                this.element = $(element).get(0);
            } else if (element instanceof HTMLElement) {
                this.element = element;
            }
            /******************************************

             Invoke Widget Init

             ******************************************/
            this.option(options);
            this._init();
        }

        /*************************************************

         INSTANCE PROPERTIES/METHODS

         **************************************************/
        SliderMenu.prototype = {
            _init: function () {
                this._initView(this.options.data);
                this._buildEvent();
                this.openByUri(location.pathname)
                //this.openById(this.options.currentValue);

            }, // NOTE: Must exist to support bridget

            constructor: SliderMenu,

            defaultOptions: defOptions,

            openById: function(id){
                var $this = this;
                $(this.element).find("li").each(function(){
                    var curid = $(this).attr("switch-id");
                    if(id == curid){
                        $this._open( $(this).children(".list-switch"));
                        $this._open($(this).parents("ul").siblings(".list-switch"));
                        $(this).addClass("open");
                    }
                });
            },
            /*当前选中的菜单根据浏览器的请求URI来设置*/
            openByUri:function(curUri){
                var $this = this;
                $(this.element).find("li").each(function(){
                    var uri = $(this).children().attr("href");
                    if(uri.indexOf(curUri) > -1 ){
                        $this._open( $(this).children(".list-switch"));
                        $this._open($(this).parents("ul").siblings(".list-switch"));
                        $(this).addClass("open");
                    }
                });
            },
            getOpenId: function(){
                return this.options.openId;
            },
            closeMenu: function(call){
            	var _this = this;
            	var $subMenu = $("li[switch-id].open>.sub-menu",_this.element);
            	if($subMenu.size() == 0){
            		$(_this.element).addClass('slider-close');
                	$("body").addClass('slider-close');
                	$(_this.element).find(".slider-footer .btn .text").hide();
                	$(_this.element).animate({
                		width: _this.options.minWidth
                	},'fast',function(){
                		if(call){
                    		call.call(_this,false);
                		}
                	});
            	}else{
            		$subMenu.slideUp('fast',function(){
	                	$(_this.element).addClass('slider-close');
	                	$("body").addClass('slider-close');
	                	$(_this.element).find(".slider-footer .btn .text").hide();
	                	$(_this.element).animate({
	                		width: _this.options.minWidth
	                	},'fast',function(){
	                		if(call){
	                    		call.call(_this,false);
	                		}
	                	});
	            	});
            	}
            	this.options.onToggleMenu.call(_this,false);
            },
            openMenu: function(call){
            	var _this = this;
            	$(_this.element).animate({
            		width: _this.options.maxWidth
            	},'fast',function(){
            		$(_this.element).removeClass('slider-close');
                	$("body").removeClass('slider-close');
                	$("li[switch-id].open>.sub-menu",_this.element).slideDown('fast');
            		if(call){
                		call.call(_this,true);
            		}
            	});
            	this.options.onToggleMenu.call(_this,true);
            },
            toggleMenu: function(call){
            	var _this = this;
            	if($(this.element).hasClass('slider-close')){
            		this.openMenu(call);
            	}else{
            		this.closeMenu(call);
            	}
            },
            /******************************+

             HELPERS

             - Any method that is not part of the public interface.
             - Place it underneath this comment block and write its signature like so:

             _fnName : function() {...}

             ********************************/
            _open: function($e,call){
                var _this = this;
                var $parent = $e.parent("li");
                if(this.options.closeOther){
                    $parent.siblings("li.open").find(".list-switch").each(function(){
                    	_this._close($(this));
                    });	
                }
                $e.parent("li").addClass("open");
                $e.next("ul").slideDown("fast",function(){
                	if(call) {
                		call.call(_this);
                	}
                });
                $e.find("i.icon-arrow").attr("class", "icon-arrow " + this.options.arrowClass.open);

            },
            _close: function($e,call){
                var _this = this;
            	var $parent = $e.parent("li");
                $e.next("ul").stop().slideUp('fast', function () {
                    $parent.removeClass("open");
                    if(call) {
                		call.call(_this);
                	}
                });
                $e.find("i.icon-arrow").attr("class", "icon-arrow " + this.options.arrowClass.def);
            },
            _initView: function (data) {
                var $element = $(this.element);
                $element.addClass('bootstrap-slidermenu');
                $element.width(this.options.maxWidth);
                var $menu = $('<div></div>');
                var $mc = $('<ul class="slider-menu"></ul>');
                $menu = this._createList(data,$mc);
                $menu.append($mc);
//                $element.append(this._createFooter());
                $element.prepend($menu);

            },
            _createList: function (data,$parent) {
                var $list = $parent  || $('<ul class="sub-menu"></ul>');

                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var $item = $("<li switch-id ='"+dataItem.id+"' ></li>");
                    if (dataItem.children) {
                        var icon = '';
                        if (dataItem.icon) {
                            icon = '<i class="icon ' + dataItem.icon + '"></i>';
                        } else {
                            icon = '<i></i>';
                        }
                        var title = '<a class="list-switch" href="javascript:void(0)">' + icon +
                            '<span class="title"> ' + dataItem.title + ' </span><i class="icon-arrow ' + this.options.arrowClass.def + '"></i></a>';
                        $item.append(title);
                        $item.append(this._createList(data[i].children));
                    } else {
                        $item = this._createListItem(dataItem);
                    }
                    $list.append($item);
                }
                return $list;
            },
            _createListItem: function (data) {
                var $item = $("<li switch-id ='"+data.id+"' ></li>");
                var _this = this;
                var base = this.options.base||"";
                var delegate = function(data){return function(){
                	data.func.call(_this,data);
                }};
                if(data.func && typeof data.func === 'function'){
                    $item.append('<a href="javascript:void(0)"><span class="title">' + data.title + '</span></a>');
                    $item.click(delegate(data));
                }else{
                    $item.append('<a href="' + (base+data.url) + '"><span class="title">' + data.title + '</span></a>');
                }
                return $item;
            },
            _createFooter: function(){
            	var $footer = $('<div class="slider-footer">'+
			                	'<a href="javascript:void(0)" class="btn btn-menu-toggle">'+
			                		'<i class="fa fa-compress"></i>'+
			                		'<span class="text">收起菜单</span>'+
			                	'</a></div>');
            	$footer.width(this.options.maxWidth);
            	return $footer;
            },
            _buildEvent: function () {
                var _this = this;
                var $switchList = $(this.element).find("li a.list-switch");
                $switchList.click(function () {
                    var $this = $(this);
                    var $parent = $this.parent("li");
                    if($(_this.element).hasClass('slider-close')){
                    	_this.openMenu(function(){
                        	if ($parent.hasClass("open")) {
                                _this._close($this);
                            } else {
                                _this._open($this);
                            }	
                    	});
                    }else{
                    	if ($parent.hasClass("open")) {
                            _this._close($this);
                        } else {
                            _this._open($this);
                        }	
                    }
                });
                $(".slider-menu", this.element).find("ul").css("display", "none");
                
//                var $footBtn = $(_this.element).find(".slider-footer .btn-menu-toggle");
//                $footBtn.click(function(){
//                	_this.toggleMenu();
//                });
            }
        };

        /*********************************

         Attach to global namespace

         *********************************/
        if ($) {
            var namespace = 'sliderMenu';
            $.bridget(namespace, SliderMenu);
        }
    })($);
    return SliderMenu;
}));