
describe('JMVC - overwrite model extension', function(){
	
	var model_name = "some model";
	var other_model_name = "some other model";
	var firstExtension = {"val1": true, "val2": "any"};
	var firstExtensionKeys = Object.getOwnPropertyNames(firstExtension);
	var secondExtension = {"val1": false, "templ":null};
	var secondExtensionKeys = Object.getOwnPropertyNames(secondExtension);
	var thirdExtension = {"val2": "some"};
	var thirdExtensionKeys = Object.getOwnPropertyNames(thirdExtension);
	
	var someModel;
	var someOtherModel;
	
	before(function(){
		jmvc.reset();	
	});
	
	describe('var someModel = jmvc.setModel("'+ model_name +'",'+ jmvc.stringify(firstExtension) +')', function(){
		before(function(){
			someModel = jmvc.setModel(model_name,firstExtension);
		});
		it('someModel.prototype should have equal properties '+ firstExtensionKeys.join(", "), function(){
			for (var p in firstExtension) someModel.prototype.should.have.property(p).and.equal(firstExtension[p]);
  		});
	});
	
	describe('jmvc.extendModel("'+ model_name +'",'+ jmvc.stringify(secondExtension) +');', function(){
		before(function(){
			jmvc.extendModel(model_name,secondExtension);
		});
		for (var p in secondExtension) {
			if(jmvc.getProto().some(function(item){return item === p;})){
				it('someModel.prototype should NOT have native property '+ p +' equal to '+ secondExtension[p], function(){
					someModel.prototype
						.should.have.property(p)
						.and.not.equal(secondExtension[p]);
		  		});
			} else {
				firstExtensionKeys.filter(function(item){return item === p;}).map(function(item){
					it('someModel.prototype should have property '+ item +' equal to '+ secondExtension[item], function(){
						someModel.prototype
							.should.have.property(item)
							.and.equal(secondExtension[item]);
			  		});
				});
			}
		}
	});
	
	describe('var someOtherModel = jmvc.setModel("'+ model_name +'",'+ jmvc.stringify(firstExtension) +',someModel,'+ jmvc.stringify(thirdExtension) +')', function(){
		before(function(){
			someOtherModel = jmvc.setModel(other_model_name,firstExtension,someModel,thirdExtension);
		});
		it('someOtherModel.prototype should have property val1 equal to someModel.prototype.val1 = '+ secondExtension["val1"] +' and not '+ firstExtension["val1"], function(){
			someOtherModel.prototype
				.should.have.property("val1")
				.and.equal(someModel.prototype["val1"])
				.and.not.equal(firstExtension["val1"]);
		});
		it('someOtherModel.prototype should have property val2 equal to '+ thirdExtension["val2"] +' and not someModel.prototype.val2 = '+ firstExtension["val2"], function(){
			someOtherModel.prototype
				.should.have.property("val2")
				.and.equal(thirdExtension["val2"])
				.and.not.equal(someModel.prototype["val2"]);
		});
	});
	  	
});