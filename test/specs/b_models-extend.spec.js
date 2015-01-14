describe('JMVC - extend models', function(){
	
	var model_name = "some model";
	var other_model_name = "some other model";
	var firstExtension = {"val1": true, "val2": "any"};
	var firstExtensionKeys = Object.getOwnPropertyNames(firstExtension);
	var secondExtension = {"val3": {}, "val4":[]};
	var secondExtensionKeys = Object.getOwnPropertyNames(secondExtension);
	var thirdExtension = {"val5": function(val){console.log(val);},"val6": null};
	var thirdExtensionKeys = Object.getOwnPropertyNames(thirdExtension);
	var fourthExtension = {"val7": 0,"val8": 1};
	var fourthExtensionKeys = Object.getOwnPropertyNames(fourthExtension);
	var fifthExtension = (function(ext){
		ext = jmvc.clone(ext);
		for (var p in ext){
			ext[p]++;
		}
		return ext;
	})(fourthExtension);
	var fifthExtensionKeys = Object.getOwnPropertyNames(fifthExtension);
	
	var someModel;
	var someOtherModel;
	
	var someInstance;
	
	before(function(){
		jmvc.reset();	
	});
	
	describe('var someModel = jmvc.setModel("'+ model_name +'",'+ jmvc.stringify(firstExtension) +')', function(){
		before(function(){
			someModel = jmvc.setModel(model_name,firstExtension);
			someInstance = new someModel();	
		});
		
		it('someModel.prototype should have equal properties '+ firstExtensionKeys.join(", "), function(){
			for (var p in firstExtension) someModel.prototype.should.have.property(p).and.equal(firstExtension[p]);
  		});
  		it('instances of someModel should have equal properties '+ firstExtensionKeys.join(", "), function(){
			for (var p in firstExtension) someInstance.should.have.property(p).and.equal(firstExtension[p]);
  		});
	});
	
	describe('jmvc.extendModel("'+ model_name +'",'+ jmvc.stringify(secondExtension) +');', function(){
		before(function(){
			jmvc.extendModel(model_name,secondExtension);
		});
		it('someModel.prototype should have equal properties '+ secondExtensionKeys.join(", "), function(){
			for (var p in secondExtension) someModel.prototype.should.have.property(p).and.equal(secondExtension[p]);
		});
		it('instances of someModel should have equal properties '+ secondExtensionKeys.join(", "), function(){
			for (var p in secondExtension) someInstance.should.have.property(p).and.equal(secondExtension[p]);
  		});
	});
	
	describe('var somesomeOtherModelModel = jmvc.setModel("'+ model_name +'",'+ jmvc.stringify(fourthExtension) +')', function(){
		before(function(){
			someOtherModel = jmvc.setModel(other_model_name,fourthExtension);
		});
		describe('jmvc.extendModel("'+ model_name +'",'+ jmvc.stringify(thirdExtension) +',someOtherModel)', function(){
			before(function(){
				jmvc.extendModel(model_name,thirdExtension,someOtherModel);
			});
			it('someModel.prototype should have equal properties '+ thirdExtensionKeys.join(", "), function(){
				for (var p in thirdExtension) someModel.prototype.should.have.property(p).and.equal(thirdExtension[p]);
			});
			it('instances of someModel should have equal properties '+ thirdExtensionKeys.join(", "), function(){
				for (var p in thirdExtension) someInstance.should.have.property(p).and.equal(thirdExtension[p]);
	  		});
	  		it('someModel.prototype should have equal properties to someOtherModel extension', function(){
				for (var p in fourthExtension) someModel.prototype.should.have.property(p).and.equal(fourthExtension[p]).and.equal(someOtherModel.prototype[p]);
			});
			it('instances of someModel should have equal properties to someOtherModel extension', function(){
				for (var p in fourthExtension) someInstance.should.have.property(p).and.equal(fourthExtension[p]).and.equal(someOtherModel.prototype[p]);
	  		});
	 	});
	});
});