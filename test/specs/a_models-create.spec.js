
describe('JMVC - create models', function(){
	
	var model_name = "some model";
	var someModel;
	var someInstance;
	
  	before(function(){
		jmvc.reset();	
	});
	
		
	describe('var someModel = jmvc.setModel("'+ model_name +'")', function(){
  		before(function(){
  			someModel = jmvc.setModel(model_name);	
  		});  		
  		it('someModel should be type "'+ model_name +'"', function(){
			someModel.prototype.type.should.equal(model_name);
			//({"a":"b"}).should.eql({"a":"b"});
  		});
  		it('someModel should be equal to jmvc.getModel("'+ model_name +'")', function(){
			someModel.should.equal(jmvc.getModel(model_name));
  		});
  	});
  	
  	describe('var someInstance = someModel()', function(){
  		before(function(){
  			someInstance = new someModel();	
  		});
  		
  		it('someInstance should be type "'+ model_name +'"', function(){
			someInstance.type.should.equal(model_name);
  		});
  		it('someInstance should be equal to someModel.inst[someInstance.index]', function(){
			someInstance.should.equal(someModel.inst[someInstance.index]);
  		});
  	});
});