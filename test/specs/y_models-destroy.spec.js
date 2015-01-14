
describe('JMVC - destroy models', function(){
	
	var model_name = "some model";
	var someModel;
	var someInstance;
	var someOtherInstance;
	var stopValue;
	
  	before(function(){
		jmvc.reset();	
	});
	
		
	describe('var someModel = jmvc.setModel("'+ model_name +'");\n\r\tjmvc.stopModel("'+ model_name +'")', function(){
  		before(function(){
  			someModel = jmvc.setModel(model_name);
  			stopValue = jmvc.stopModel(model_name);
  		});
  		it('stopping model "'+ model_name +'" the first time returns true', function(){
			stopValue.should.equal(true);
  		});
  		it('stopping model "'+ model_name +'" a second time returns false', function(){
			jmvc.stopModel(model_name).should.equal(false);
  		});
  		it('model "'+ model_name +'" reference to jmvc is lost', function(){
			jmvc.getModel().should.not.have.property(model_name);
  		});
  		it('someModel can still work as a constructor', function(){
			someInstance = new someModel();
			someInstance.should.equal(someModel["inst"][someInstance["index"]]);
  		});
  		it('someModel new instances cannot be dumped', function(){
			expect(someInstance.dump).to.throw(Error).and.to.not.have.property("dumped");
  		});
  	});
  	
  	describe('var someModel = jmvc.setModel("'+ model_name +'");\n\r\tsomeModel.stop()', function(){
  		before(function(){
  			someModel = jmvc.setModel(model_name);
  			stopValue = someModel.stop();
  		});
  		it('stopping model "'+ model_name +'" the first time returns true', function(){
			stopValue.should.equal(true);
  		});
  		it('stopping model "'+ model_name +'" a second time returns false', function(){
			someModel.stop().should.equal(false);
  		});
  		it('model "'+ model_name +'" reference to jmvc is lost', function(){
			jmvc.getModel().should.not.have.property(model_name);
  		});
  		it('someModel can still work as a constructor', function(){
			someInstance = new someModel();
			someInstance.should.equal(someModel["inst"][someInstance["index"]]);
  		});
  		it('someModel new instances cannot be dumped', function(){
			expect(someInstance.dump).to.throw(Error).and.to.not.have.property("dumped");
  		});
  	});
  	
  	describe('var someModel = jmvc.setModel("'+ model_name +'");\n\r\tsomeInstance = new someModel();\n\r\tjmvc.stopModel("'+ model_name +'",true);', function(){
  		before(function(){
  			someModel = jmvc.setModel(model_name);
  			someInstance = new someModel();
  			stopValue = jmvc.stopModel(model_name,true);
  		});
  		it('model "'+ model_name +'" reference to jmvc is lost', function(){
			jmvc.getModel().should.not.have.property(model_name);
  		});
  		it('someInstance is dumped', function(){
			someInstance.should.have.property("dumped").and.equal(true);
  		});
  		it('someModel can still work as a constructor', function(){
			someOtherInstance = new someModel();
			someOtherInstance.should.equal(someModel["inst"][someOtherInstance["index"]]);
  		});
  		it('someModel new instances cannot be dumped', function(){
			expect(someOtherInstance.dump).to.throw(Error).and.to.not.have.property("dumped");
  		});
  	});
  	
  	describe('var someModel = jmvc.setModel("'+ model_name +'");\n\r\tsomeInstance = new someModel();\n\r\tsomeModel.stop(true);', function(){
  		before(function(){
  			someModel = jmvc.setModel(model_name);
  			someInstance = new someModel();
  			stopValue = someModel.stop(true);
  		});
  		it('model "'+ model_name +'" reference to jmvc is lost', function(){
			jmvc.getModel().should.not.have.property(model_name);
  		});
  		it('someInstance is dumped', function(){
			someInstance.should.have.property("dumped").and.equal(true);
  		});
  		it('someModel can still work as a constructor', function(){
			someOtherInstance = new someModel();
			someOtherInstance.should.equal(someModel["inst"][someOtherInstance["index"]]);
  		});
  		it('someModel new instances cannot be dumped', function(){
			expect(someOtherInstance.dump).to.throw(Error).and.to.not.have.property("dumped");
  		});
  	});
});