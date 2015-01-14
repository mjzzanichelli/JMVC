var jmvc = (function(exports) {
	
	if(window===undefined) var window = {};
	if (jmvc !== undefined) return jmvc;
	if (window.jmvc !== undefined) return window.jmvc;
	var _self = {};
	
	var _private = {
		version : "0.0.1",
		defineProperty : (function() {
			var _defineProperty;
			try {
				Object.defineProperty({}, "x", {});
				_defineProperty = function(obj, key, options) {
					Object.defineProperty(obj, key, options);
					return obj;
				};
			} catch(e) {
				_defineProperty = function(obj, key, options) {
					options = options || {};
					obj[key] = options.value || null;
					return obj;
				};
			}
			return _defineProperty;
		})(),
		defineProperties : (function() {
			var _defineProperties;
			try {
				Object.defineProperties({}, {
					"x" : {}
				});
				_defineProperties = function(obj, props) {
					Object.defineProperties(obj, props);
					return obj;
				};
			} catch(e) {
				_defineProperties = function(obj, props) {
					props = props || {};
					for (var p in props) {
						obj[p] = props[p].value || null;
					}
					return obj;
				};
			}
			return _defineProperties;
		})(),
		getJMVCObjectDefinition : function(value, extension) {
			var _props = {
				configurable : false,
				enumerable : true,
				writable : false,
				value : value
			};
			_props = _public.extend(_props, extension);
			return _props;
		},
		iModelPrototype : [],
		dumpInstance : function() {
			var _dumper = function(type) {
				var _obj = this.constructor.objects[this.type], _inst = _obj.inst;
				;
				delete _obj.inst[this.index];

				if (type == undefined || type == "max") {
					
					for (prop in _obj.prototype)
					_private.defineProperty(this, prop, {
						configurable : false,
						enumerable : false,
						writable : false,
						value : null
					});
					
					for (prop in this.constructor.prototype)
					_private.defineProperty(this, prop, {
						configurable : false,
						enumerable : false,
						writable : false,
						value : null
					});
				}
				
				if (type == "min" || type == "max") {
					var _props = Object.getOwnPropertyNames(this);
					i = _props.length;
					while (i--) {
						_private.defineProperty(this, _props[i], _public.extend(Object.getOwnPropertyDescriptor(this, _props[i]), {
							configurable : false,
							enumerable : false,
							writable : false,
							value : null
						}, true));
					}
				}
				
				_private.defineProperty(this, "dumped", {
					configurable : false,
					enumerable : true,
					writable : false,
					value : true
				});

				return undefined;
			};
			return _dumper;
		},
		wrapInstanceMethod : function(method, message) {
			message = message || "Object instance has been dumped";
			var _wrapper = function() {
				if (!this.dumped)
					return method.apply(this, arguments);
				else
					throw new Error(message);
			};
			return _wrapper;
		}
	};

	var _public = {
		version : _private.version,
		clone : function(obj) {
			if (obj == null || typeof (obj) != 'object')
				return obj;
			var temp = obj.constructor();
			// changed
			for (var key in obj)
			temp[key] = _public.clone(obj[key]);
			return temp;
		},
		extend : function(base, add, overwrite) {
			overwrite = overwrite || false;
			var _extend = {}, key;
			for (key in base)
			_extend[key] = base[key];
			for (key in add)
			if (overwrite || !base[key])
				_extend[key] = add[key];
			return _extend;
		},
		stringify : function(obj) {
			var t = typeof (obj);
			if (t != "object" || obj === null) {
				// simple data type
				if (t == "string")
					obj = '"' + obj + '"';
				return String(obj);
			} else {
				// recurse array or object
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				for (n in obj) {
					v = obj[n];
					t = typeof (v);
					//if (t == "string") v = '"'+v.replace(/\"/gi,'%22')+'"';
					if (t == "string")
						v = '"' + v + '"';
					else if (t == "object" && v !== null)
						v = this.stringify(v);
					json.push(( arr ? "" : '"' + n + '":') + String(v));
				}
				return ( arr ? "[" : "{") + String(json) + ( arr ? "]" : "}");
			}
		},
		type : function(object) {
			var _stringConstructor = "".constructor, _arrayConstructor = [].constructor, _objectConstructor = {}.constructor, _functionConstructor = function() {
			}.constructor, _type = "";

			if (object === null) {
				_type = "null";
			} else if (object === undefined) {
				_type = "undefined";
			} else if (object.constructor === _stringConstructor) {
				_type = "string";
			} else if (object.constructor === _arrayConstructor) {
				_type = "array";
			} else if (object.constructor === _objectConstructor) {
				_type = "object";
			} else if (object.constructor === _functionConstructor) {
				_type = "function";
			} else if (object.nodeType !== undefined) {
				_type = "html";
			}
			_stringConstructor = _arrayConstructor = _objectConstructor = null;
			return _type;
		},
		getProto : function(){
			return [].concat(_private.iModelPrototype);
		},
		setModel : function(mType) {
			if (_public.type(mType) != "string" || _public.getModel(mType) !== undefined)
				return undefined;
			var extensions = Array.prototype.slice.call(arguments, 1);
			var _OM = new iModel(mType, extensions);
			return _OM;
		},
		getModel : function(name) {
			return name ? iModel.objects[name] : iModel.objects;
		},
		extendModel : function(name) {
			var extensions = Array.prototype.slice.call(arguments, 1);
			if (_public.type(name) != "string" || iModel.objects[name] === undefined || extensions.length <= 0)
				return false;
			var _model_proto = [""].concat(_private.iModelPrototype).concat([""]).join(), extension;
			for (ext in extensions) {
				if (extensions.hasOwnProperty(ext)) {
					extension = extensions[ext].prototype ? extensions[ext].prototype : extensions[ext];
					for (prop in extension) {
						if (_model_proto.indexOf("," + prop + ",") < 0){
							//delete iModel.objects[name].prototype[prop];
							_private.defineProperty(iModel.objects[name].prototype, prop, _private.getJMVCObjectDefinition(extension[prop], {
								configurable : true/*,
								writable:false*/
							}));
						}
					}
				}
			}

			return iModel.objects[name];
		},
		unextendModel : function(name, extension) {
			//var extensions = Array.prototype.slice.call(arguments,1);
			if (_public.type(name) != "string" || iModel.objects[name] === undefined || _public.type(extension) != "string" || [""].concat(_private.iModelPrototype).concat([""]).join().indexOf("," + extension + ",") >= 0)
				return false;
			delete iModel.objects[name].prototype[extension];
			return iModel.objects[name];
		},
		stopModel : function(name, clean, dump) {
			if (_public.type(name) != "string" || iModel.objects[name] === undefined)
				return false;
			if (clean)for (var i in iModel.objects[name].inst)iModel.objects[name].inst[i].dump(dump);
			var _objects = _public.clone(iModel.objects);
			delete _objects[name];
			_private.defineProperty(iModel, "objects", _private.getJMVCObjectDefinition(_objects, {
				enumerable : false,
				configurable : true
			}));
			return true;
		},
		reset: function(){
			for (var m in _public.getModel())_public.stopModel(m,true,"max");
			return true;
		},
		templ : (function() {
			var _templ_cache = {};
			_templ = function(str, data) {
				var fn = _templ_cache[str] 
						|| (function(_templ_cache,str){
								_templ_cache[str] = new Function("obj", 
									"var p=[]/*,print=function(){p.push.apply(p,arguments);}*/;"
									+ "with(obj||{}){p.push('"+ 
										str
											.replace(/[\r\t\n]/g, " ")
											.split("<%")
											.join("\t")
											.replace(/((^|%>)[^\t]*)'/g, "$1\r")
											.replace(/\t=(.*?)%>/g, "',$1,'")
											.split("\t")
											.join("');")
											.split("%>")
											.join("p.push('")
											.split("\r")
											.join("\\'") 
									+ "');}return p.join('');");
								return _templ_cache[str];
						})(_templ_cache,str);
				return data ? fn(data).replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) : fn;
			};
			return _templ;
		})(),
		loadFile : function(params) {
			params = _public.extend({
				"method" : "GET",
				"dataType" : "application/x-www-form-urlencoded"
			}, params, true);
			if (params["url"]) {
				var xmlhttp;
				if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp = new XMLHttpRequest();
				} else {// code for IE6, IE5
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4) {
						if (xmlhttp.status == 200)
							if (params["success"])
								params["success"](xmlhttp.responseText);
							else {
								if (params["error"])
									params["error"](xmlhttp);
							}
					} else if (xmlhttp.readyState == 2 && xmlhttp.status !== 200 && params["error"])
						params["error"];
				};
				try {
					xmlhttp.open(params["method"], params["url"], true);
					if (params["method"].toUpperCase() == "POST" && params["data"]) {
						xmlhttp.setRequestHeader("Content-type", params["dataType"]);
						//console.log(_public.stringify(params["data"]))
						xmlhttp.send(_public.stringify(params["data"]));
					} else
						xmlhttp.send();
				} catch(e) {
					if (params["error"])
						params["error"](e);
				}
			}
		}
	};

	var iModel = (function() {
		var iModel = function(mType, extensions) {
			var iObject = function(params) {
				params = params || {};
				_private.defineProperties(this, {
					"index" : {
						configurable : true,
						enumerable : true,
						writable : false,
						value : iObject.index
					},
					"parent" : {
						configurable : true,
						enumerable : true,
						writable : false,
						value : undefined
					},
					"data" : {
						configurable : true,
						enumerable : true,
						writable : false,
						value : []
					}
				});
				
				//iObject.inst[iObject.index] = this;
				_private.defineProperty(iObject["inst"], iObject["index"], _private.getJMVCObjectDefinition(this,{configurable:true}));
				
				_private.defineProperty(iObject, "index", _private.getJMVCObjectDefinition(iObject.index+1,{configurable:true}));
				
				
				if (_public.type(params) === "object"){
					if (params.data!==undefined) this.load(params.data);	
					if (params.templ!==undefined) this.templ(params.templ);
				}
				
				return this;
			};
			//iObject.inst = {};
			_private.defineProperty(iObject, "inst", _private.getJMVCObjectDefinition({}));
			
			_private.defineProperty(iObject, "index", _public.clone(_properties["index"]));
			
			iObject.prototype = this;
			_private.defineProperty(iObject.prototype, "type", _private.getJMVCObjectDefinition(mType));
			
			_private.defineProperty(iObject, "stop", _private.getJMVCObjectDefinition(function(clean,dump){
				return _public.stopModel(iObject.prototype.type,clean,dump);
			}));
			
			var _objects = _public.clone(iModel.objects);
			_objects[mType] = iObject;
			_private.defineProperty(iModel, "objects", _private.getJMVCObjectDefinition(_objects, {
				configurable : true
			}));

			extensions.unshift(mType);
			_public.extendModel.apply(_self, extensions);

			return iObject;
		};

		_private.defineProperty(iModel, "objects", {
			configurable : true,
			enumerable : false,
			writable : false,
			value : {}
		});

		var _loadData = function(data) {
			var _data_prop = _public.clone(_properties["data"]);
			_data_prop.value = (arguments.length == 1 && (_public.type(data) == "array" || _public.type(data) == "object") ? data : [].slice.call(arguments)) || [];
			_private.defineProperty(this, "data", _data_prop);
			_private.defineProperty(this, "tempdata", _data_prop);
			return this;
		};

		var _filterData = function(criteria) {
			var _tempdata_prop = _public.clone(_properties["data"]), _data = _public.clone(this.data), _data_type = _public.type(_data), i = _data_type == "array" ? _data.length : undefined;
			;

			if (_data_type == "array") {
				while (i--)
				if (!criteria.call(_data[i], i))
					_data.splice(i, 1);
			} else if (_data_type == "object") {
				for (i in _data) {
					if (!criteria.call(_data[i], i))
						delete _data[i];
				}
			}
			_tempdata_prop.value = _data;
			_private.defineProperty(this, "tempdata", _tempdata_prop);
			return this.tempdata;
		};

		var _cleanData = function() {
			var _data_prop = _public.clone(_properties["data"]);
			_data_prop.value = [];
			_private.defineProperty(this, "data", _data_prop);
			_private.defineProperty(this, "tempdata", _data_prop);
			return this;
		};

		var _createChild = function(params) {
			var _child = _private.defineProperty((new (jmvc.getModel(this.type))(params)), "parent", _private.getJMVCObjectDefinition(this));
			return _child;
		};
		
		var _handleTempl = function(cont){
			var _templ = function(newVal){
				this.val = newVal || this.val;
				return this.val;
			};
			var _exec = function(newData){
				this.val = this.templ();
				return _public.type(this.val) == "string" ? _public.templ(this.templ(),newData||this.self.data) : this.val;
			};
			var _templ_prop = _public.clone(_properties["templ"]);
			_templ_prop.value = _templ.bind({val:cont});
			_templ_prop.value.exec = _exec.bind({templ:_templ_prop.value,self:this});
			_private.defineProperty(this, "templ", _templ_prop);
		};

		var _properties = {
			"index" : {
				configurable : true,
				enumerable : false,
				writable : false,
				value: 0
			},
			"type" : {
				configurable : false,
				enumerable : false,
				writable : false
			},
			"options" : {
				configurable : true,
				enumerable : true,
				writable : true
			},
			"data" : {
				configurable : true,
				enumerable : true,
				writable : false,
				value : []
			},
			"load" : {
				configurable : false,
				enumerable : true,
				writable : false,
				value : _private.wrapInstanceMethod(_loadData)
			},
			"filter" : {
				configurable : false,
				enumerable : true,
				writable : false,
				value : _private.wrapInstanceMethod(_filterData)
			},
			"clean" : {
				configurable : false,
				enumerable : true,
				writable : false,
				value : _private.wrapInstanceMethod(_cleanData)
			},
			"create" : {
				configurable : false,
				enumerable : true,
				writable : false,
				value : _private.wrapInstanceMethod(_createChild)
			},
			"templ" : {
				configurable : true,
				enumerable : true,
				writable : false,
				value : _private.wrapInstanceMethod(_handleTempl)
			},
			"dump" : {
				configurable : false,
				enumerable : true,
				writable : false,
				value : _private.wrapInstanceMethod(_private.dumpInstance(), "Object instance has been already dumped")
			}
		};

		for (prop in _properties) {
			_private.defineProperty(iModel.prototype, prop, _properties[prop]);
			_private.iModelPrototype.push(prop);
		}

		return iModel;
	})();

	//Switch codes below to manage public kb properties one at the time
	for (var key in _public)
	_private.defineProperty(_self, key, _private.getJMVCObjectDefinition(_public[key]));
	/*_private.defineProperties(_self,{
	 "clone": _private.getJMVCObjectDefinition(_public.clone)
	 , "extend": _private.getJMVCObjectDefinition(_public.extend)
	 , "stringify": _private.getJMVCObjectDefinition(_public.stringify)
	 , "type": _private.getJMVCObjectDefinition(_public.type)
	 , "setModel": _private.getJMVCObjectDefinition(_public.setModel)
	 , "getModel": _private.getJMVCObjectDefinition(_public.getModel)
	 , "stopModel": _private.getJMVCObjectDefinition(_public.dumpModel)
	 , "loadFile": _private.getJMVCObjectDefinition(_public.loadFile)
	 });*/
	window.jmvc = exports.jmvc = _self;
	return _self;
})(this);
