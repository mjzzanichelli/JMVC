var jmvc = (
	function(){
		
		if (jmvc) return jmvc;
		
		var _self = {};
		
		
		var _private = {
					
			
			getJMVCObjectDefinition: function(value,extension){
				var _props = {
					configurable: false
					, enumerable: true
					, writable: false
					, value: value
				};
				_props = _public.extend(_props,extension);
				return _props;
			}
			
			
			, iModelPrototype: []
			
			
			, iPanelPrototype: []
			
			
			, dumpInstance: function(){
				var _dumper = function(type){
					var _obj = this.constructor.objects[this.type]
						, _inst = _obj.inst;
					;

					delete _obj.inst[this.index];
					if (this.models) for (name in this.models) this.models[name].dump(type);

					if (type==undefined || type=="max"){
						for (i in _obj.prototype) Object.defineProperty(this,i,{configurable:false,enumerable:false,writable:false,value: null});
						for (i in this.constructor.prototype) Object.defineProperty(this,i,{configurable:false,enumerable:false,writable:false,value: null});
					}
					if (type=="min" || type=="max"){
						var _props = Object.getOwnPropertyNames(this);
						i =  _props.length;
						//while(i--) delete this[_props[i]];
						while(i--) {
							//console.log(_props[i],Object.getOwnPropertyDescriptor(this,_props[i]))
							Object.defineProperty(this,_props[i],_public.extend(Object.getOwnPropertyDescriptor(this,_props[i]),{configurable:false,enumerable:false,writable:false,value: null},true));
						}
					}
					
					Object.defineProperty(this,"dumped",{
						configurable: false
						, enumerable: true
						, writable: false
						, value: true
					});
					
					return undefined;
				};
				return _dumper;
			}
			
			
			, wrapInstanceMethod: function(method,message){
				message = message || "Object instance has been dumped";
				var _wrapper = function(){
					if (!this.dumped) return method.apply(this,arguments);
					else throw new Error(message);
				};
				return _wrapper;
			}
		};
		
		
		var _public = {
			clone: function(obj){
			    if(obj == null || typeof(obj) != 'object') return obj;
			    var temp = obj.constructor(); // changed
			    for(var key in obj) temp[key] = _public.clone(obj[key]);
			    return temp;
			}
			, extend: function(base,add,overwrite){
				overwrite = overwrite || false;
	            var _extend = {},key;
	            for (key in base) _extend[key] = base[key];
	            for (key in add) if (overwrite || !base[key])_extend[key] = add[key];
	            return _extend;
	        }
	        , stringify: function(obj){
	            var t = typeof (obj);
	            if (t != "object" || obj === null) {
	                // simple data type
	                if (t == "string") obj = '"'+obj+'"';
	                return String(obj);
	            }
	            else {
	                // recurse array or object
	                var n, v, json = [], arr = (obj && obj.constructor == Array);
	                for (n in obj) {
	                    v = obj[n]; t = typeof(v);
	                    //if (t == "string") v = '"'+v.replace(/\"/gi,'%22')+'"';
	                    if (t == "string") v = '"'+v+'"';
	                    else if (t == "object" && v !== null) v = this.stringify(v);
	                    json.push((arr ? "" : '"' + n + '":') + String(v));
	                }
	                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	            }
	        }
	        , type : function(object){
	            var _stringConstructor = "".constructor
	            , _arrayConstructor = [].constructor
	            , _objectConstructor = {}.constructor
	            , _functionConstructor = function(){}.constructor
	            , _type = "";
	
	            if (object === null) {
	                _type = "null";
	            }
	            else if (object === undefined) {
	                _type = "undefined";
	            }
	            else if (object.constructor === _stringConstructor) {
	                _type = "string";
	            }
	            else if (object.constructor === _arrayConstructor) {
	                _type = "array";
	            }
	            else if (object.constructor === _objectConstructor) {
	                _type = "object";
	            }
	            else if (object.constructor === _functionConstructor) {
	                _type = "function";
	            }
	            else if (object.nodeType !== undefined) {
	                _type = "html";
	            }
	            _stringConstructor = _arrayConstructor =  _objectConstructor = null;
	            return _type;
	        }
	        , setModel: function(mType,extension){
				if (_public.type(mType) != "string" && _public.getModel(mType)!== undefined) return undefined;
				var _OM = new iModel(mType,extension);
				return _OM;
			}
			, getModel: function(name){
				return name ? iModel.objects[name] : iModel.objects;
			}
			, extendModel: function(name,extension){
				if (_public.type(name) != "string" || iModel.objects[name]===undefined || _public.type(extension) != "object") return false;
				var _model_proto = [""].concat(_private.iModelPrototype).concat([""]).join();
				for (prop in extension) if (_model_proto.indexOf(","+prop+",")<0) Object.defineProperty(iModel.objects[name].prototype,prop,_private.getJMVCObjectDefinition(extension[prop],{configurable:true}));
				return iModel.objects[name];
			}
			, unextendModel: function(name,extension){
				if (_public.type(name) != "string" || iModel.objects[name]===undefined || _public.type(extension) != "string" || [""].concat(_private.iModelPrototype).concat([""]).join().indexOf(","+extension+",") >= 0) return false;
				delete iModel.objects[name].prototype[extension];
				return iModel.objects[name];
			}
			, stopModel: function(name,clean,dump){
				if (_public.type(name) != "string" || iModel.objects[name]===undefined) return false;
				if (clean) for (var i in iModel.objects[name].inst) iModel.objects[name].inst[i].dump(dump);
				var _objects = _public.clone(iModel.objects);
				delete _objects[name];
				Object.defineProperty(iModel,"objects",_private.getJMVCObjectDefinition(_objects,{configurable:true}));
				return true;
			}
			, setPanel: function(pType,models,extension){
				if (_public.type(pType) != "string" && _public.getPanel(pType)!== undefined ) return undefined;
				var _OP = new iPanel(pType,models,extension);
				return _OP;
			}
			, getPanel: function(name){
				return name ? iPanel.objects[name] : iPanel.objects;
			}
			, extendPanel: function(name,extension){
				if (_public.type(name) != "string" || iPanel.objects[name]===undefined || _public.type(extension) != "object") return false;
				var _panel_proto = [""].concat(_private.iPanelPrototype).concat([""]).join();
				for (prop in extension) {
					if (_panel_proto.indexOf(","+prop+",")<0) {
						Object.defineProperty(iPanel.objects[name].prototype,prop,_private.getJMVCObjectDefinition(extension[prop],{configurable:true}));
					}
				}
				return iPanel.objects[name],"test";
			}
			, unextendPanel: function(name,extension){
				if (_public.type(name) != "string" || iPanel.objects[name]===undefined || _public.type(extension) != "string" || [""].concat(_private.iPanelPrototype).concat([""]).join().indexOf(","+extension+",") >= 0) return false;
				delete iPanel.objects[name].prototype[extension];
				return iPanel.objects[name];
			}
			, stopPanel: function(name,clean,dump){
				if (_public.type(name) !="string" || iPanel.objects[name]===undefined) return false;
				if (clean) for (var i in iPanel.objects[name].inst) iPanel.objects[name].inst[i].dump(dump);
				var _objects = _public.clone(iPanel.objects);
				delete _objects[name];
				Object.defineProperty(iPanel,"objects",_private.getJMVCObjectDefinition(_objects,{configurable:true}));
				return true;
			}
			/**@ignore*/
			, loadFile: function(params) {
				params = _public.extend({
					"method" : "GET"
					, "dataType": "application/x-www-form-urlencoded"
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
						if (params["method"].toUpperCase()=="POST" && params["data"]){
							xmlhttp.setRequestHeader("Content-type",params["dataType"]);
							//console.log(_public.stringify(params["data"]))
							xmlhttp.send(_public.stringify(params["data"]));
						} else xmlhttp.send();
					} catch(e) {
						if (params["error"])
							params["error"](e);
					}
				}
			}
		};
		
		var iModel = (function(){
			var iModel = function(mType,extension) {
				var _obj = function(params){
					Object.defineProperties(this,{
						"index" :{
							configurable: true
							, enumerable: true
							, writable: false
							, value: _obj.index
						}, "list": {
							configurable: true
							, enumerable: true
							, writable: false
							, value: []
						}
					});
					if (params && params.list) this.load(params.list);
					_obj.inst[_obj.index] = this;
					_obj.index++;
					return this;
				};
				_obj.inst = {};
				_obj.index = 0;
				
				_obj.prototype = this;
				Object.defineProperties(_obj.prototype,{
					"type": {
						configurable: false
						, enumerable: true
						, writable: false
						, value: mType
					}
				});
				
				var _objects = _public.clone(iModel.objects);
				_objects[mType] = _obj;
				Object.defineProperty(iModel,"objects",_private.getJMVCObjectDefinition(_objects,{configurable:true}));
				
				_public.extendModel(mType,extension);
				
				return _obj;
			};
			
			Object.defineProperty(iModel,"objects",{
				configurable: true
				, enumerable: true
				, writable: false
				, value: {}
			});
			
			var _loadList = function(list){
				var _list_prop = _public.clone(_properties["list"]);
				_list_prop.value=(arguments.length==1 && (_public.type(list)=="array"||_public.type(list)=="object")?list:[].slice.call(arguments))||[];
				Object.defineProperty(this,"list",_list_prop);
				Object.defineProperty(this,"templist",_list_prop);
				return this;
			};
			
			var _filterList = function(criteria){
				var _templist_prop = _public.clone(_properties["list"])
					, _list = _public.clone(this.list)
					, _list_type = _public.type(_list) 
					, i = _list_type=="array"?_list.length:undefined; 
				;
				
				if (_list_type=="array") {
					while(i--) if (!criteria.call(_list,i)) _list.splice(i,1);
				} else if (_list_type=="object") {
					for (i in _list) {
						if (!criteria.call(_list,i)) delete _list[i];
					}
				}
				_templist_prop.value=_list;
				Object.defineProperty(this,"templist",_templist_prop);
				return this.templist;
			};
			
			var _cleanList = function(){
				var _list_prop = _public.clone(_properties["list"]);
				_list_prop.value=[];
				Object.defineProperty(this,"list",_list_prop);
				Object.defineProperty(this,"templist",_list_prop);
				return this;
			};
			
			var _properties = {
				"options": {
					configurable: true
					, enumerable: true
					, writable: true
				}
				, "list": {
					configurable: true
					, enumerable: true
					, writable: false
					, value: []
				}
				, "load": {
					configurable: false
					, enumerable: true
					, writable: false
					, value: _private.wrapInstanceMethod(_loadList)
				}
				, "filter": {
					configurable: false
					, enumerable: true
					, writable: false
					, value: _private.wrapInstanceMethod(_filterList)
				}
				, "clean": {
					configurable: false
					, enumerable: true
					, writable: false
					, value: _private.wrapInstanceMethod(_cleanList)
				}
				, "dump": {
					configurable: false
					, enumerable: true
					, writable: false
					, value: _private.wrapInstanceMethod(_private.dumpInstance(),"Object instance has been already dumped")
				}
			};
			
			for (prop in _properties) {
				Object.defineProperty(iModel.prototype,prop,_properties[prop]);
				_private.iModelPrototype.push(prop);
			}
			
			return iModel;
		})();
		
		var iPanel = (function() {
			var iPanel = function(pType,models,extension) {
				var _obj = function(params){
					var _models = _obj.prototype.models || []
						, i = _models.length
						, _props = {
								"index" :{
									configurable: true
									, enumerable: true
									, writable: false
									, value: _obj.index
								}
								, "models": {
									configurable: true
									, enumerable: true
									, writable: false
									, value: {}
								}
							}
					;
					while(i--) _props.models.value[_models[i]] = new iModel.objects[_models[i]];
					Object.defineProperties(this,_props);
					
					_obj.inst[_obj.index] = this;
					_obj.index++;
					return this;
				};
				_obj.inst = {};
				_obj.index = 0;
				
				_obj.prototype = this;
				Object.defineProperties(_obj.prototype,{
					"type": {
						configurable: false
						, enumerable: true
						, writable: false
						, value: pType
					}
					, "models": {
						configurable: false
						, enumerable: true
						, writable: false
						, value: models
					}
				});
				
				var _objects = _public.clone(iPanel.objects);
				_objects[pType] = _obj;
				Object.defineProperty(iPanel,"objects",_private.getJMVCObjectDefinition(_objects,{configurable:true}));
				
				_public.extendPanel(pType,extension);
				
				return _obj;
			};
			
			Object.defineProperty(iPanel,"objects",{
				configurable: true
				, enumerable: true
				, writable: false
				, value: {}
			});
			
			var _properties = {
				"options": {
					configurable: true
					, enumerable: true
					, writable: true
				}
				, "models": {
					configurable: true
					, enumerable: true
					, writable: false
					, value: []
				}
				, "dump": {
					configurable: false
					, enumerable: true
					, writable: false
					, value: _private.wrapInstanceMethod(_private.dumpInstance(),"Object instance has been already dumped")
				}
			};
			
			for (prop in _properties) {
				Object.defineProperty(iPanel.prototype,prop,_properties[prop]);
				_private.iPanelPrototype.push(prop);
			}
			
			return iPanel;
		})();
		
		//Switch codes below to manage public kb properties one at the time
		for (var key in _public) Object.defineProperty(_self,key,_private.getJMVCObjectDefinition(_public[key]));
		/*Object.defineProperties(_self,{
			"clone": _private.getJMVCObjectDefinition(_public.clone)
			, "extend": _private.getJMVCObjectDefinition(_public.extend)
			, "stringify": _private.getJMVCObjectDefinition(_public.stringify)
			, "type": _private.getJMVCObjectDefinition(_public.type)
			, "setModel": _private.getJMVCObjectDefinition(_public.setModel)
			, "getModel": _private.getJMVCObjectDefinition(_public.getModel)
			, "stopModel": _private.getJMVCObjectDefinition(_public.dumpModel)
			, "setPanel": _private.getJMVCObjectDefinition(_public.setPanel)
			, "getPanel": _private.getJMVCObjectDefinition(_public.getPanel)
			, "stopPanel": _private.getJMVCObjectDefinition(_public.dumpPanel)
			, "loadFile": _private.getJMVCObjectDefinition(_public.loadFile)
		});*/
		
		return _self;
	}
)();