describe('JMVC - dump model instances', function(){
	
	var model_name = "some model";
	var firstExtension = {"val1": true, "val2": "any"};
	var data = [0,1,2];
	var someModel;
	var someInstance;
	var ownProperties;
	var ownPropertiesBeforeDump;
	var inheritMethods;
	minOwnProperties = ["dumped"];
	undefinedOwnProperties = ["dumped","index","parent","tempdata"];
	
  	before(function(){
		jmvc.reset();
	});
	
	describe('var someModel = jmvc.setModel("'+ model_name +'",'+ jmvc.stringify(firstExtension) +');', function(){
		before(function(){
  			someModel = jmvc.setModel(model_name,firstExtension);
  			
  		});
  		describe('var someInstance = new someModel({"data":'+ jmvc.stringify(data) +'});', function(){
  			beforeEach(function(){
	  			someInstance = new someModel({"data":data});
	  		});
  			describe('someInstance.dump("max")', function(){
  				beforeEach(function(){
  					someInstance.dump("max");
  				});
  				it('someInstance.dumped is true, all inherited properties are turned owned, all properties are set to null',function(){
  					someInstance.dumped.should.equal(true);
  					for (var p in someModel.prototype) someInstance.hasOwnProperty(p).should.equal(true);
  					for (var p in someInstance) if (p!=="dumped") expect(someInstance[p]).to.be.equal(null);
  				});
  			});
  			describe('someInstance.dump("min")', function(){
  				beforeEach(function(){
  					ownPropertiesBeforeDump = Object.getOwnPropertyNames(someInstance);
  					someInstance.dump("min");
  				});
  				it('someInstance.dumped is true, inherited properties and extensions are still accessible, inherit methods return error, own properties/methods are null',function(){
  					ownProperties = Object.getOwnPropertyNames(someInstance).filter(function(o){return !minOwnProperties.some(function(p){return p===o;});});
  					inheritMethods = jmvc.getProto().filter(function(p){return !ownProperties.concat(minOwnProperties).some(function(o){return o===p;});});
  					
  					someInstance.dumped.should.equal(true);
  					ownPropertiesBeforeDump.should.be.deep.equal(ownProperties);
  					for (var p in firstExtension) someInstance[p].should.equal(firstExtension[p]);
  					for (var p in ownProperties) expect(someInstance[ownProperties[p]]).to.be.equal(null);
  					for (var p in inheritMethods) {
  						if (jmvc.type(someInstance[inheritMethods[p]])==="function") expect(function(){someInstance[inheritMethods[p]]();}).to.throw(Error);
  						else expect(someInstance[inheritMethods[p]]).to.be.equal(someModel.prototype[inheritMethods[p]]);
  					}
  				});
  			});
  			describe('someInstance.dump()', function(){
  				beforeEach(function(){
  					ownPropertiesBeforeDump = (function(inst){
  						_own = {"dumped":true};
  						_prop = Object.getOwnPropertyNames(inst);
  						for (var p in _prop)_own[_prop[p]] = inst[_prop[p]]; 
  						return _own;
  					})(someInstance);
  					someInstance.dump();
  				});

  				it('someInstance.dumped is true, '+ undefinedOwnProperties.join(", ") +' are accessible, all inherited properties and extensions are turned owned and set to null',function(){
  					ownProperties = Object.getOwnPropertyNames(someInstance).filter(function(o){return !undefinedOwnProperties.some(function(p){return p===o;});});
  					
  					someInstance.dumped.should.equal(true);
  					for (var p in ownProperties) expect(someInstance[ownProperties[p]]).to.be.equal(null);
  					for (var p in someModel.prototype) someInstance.hasOwnProperty(p).should.equal(true);
  					for (var p in firstExtension) expect(someInstance[p]).to.be.equal(null);
  					for (var p in undefinedOwnProperties)expect(someInstance[undefinedOwnProperties[p]]).to.be.deep.equal(ownPropertiesBeforeDump[undefinedOwnProperties[p]]);
  					
  				});
  			});
  		});
  		
	});
});