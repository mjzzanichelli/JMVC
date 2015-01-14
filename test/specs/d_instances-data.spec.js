describe('JMVC - instances data', function(){
	
	var model_name = "some model";
	var firstData = [0,1,2];
	var secondData = {"val1":true,"val2":false};
	var dataBeforeFilter;
	var filterResult;
	var someModel;
	var someInstance;
	
  	before(function(){
		jmvc.reset();
	});
	
	describe('var someModel = jmvc.setModel("'+ model_name +'");', function(){
		before(function(){
  			someModel = jmvc.setModel(model_name);
  			
  		});
  		describe('var someInstance = new someModel();', function(){
  			before(function(){
	  			someInstance = new someModel();
	  		});
	  		it('someInstance.data is equal to be []',function(){
	  			someInstance.data.should.deep.equal([]);
	  		});
	  		it('someInstance.tempdata is equal to undefined',function(){
	  			expect(someInstance.tempdata).to.deep.equal(undefined);
	  		});
  		});
  		describe('var someInstance = new someModel({"data":'+ jmvc.stringify(firstData) +'});', function(){
  			before(function(){
	  			someInstance = new someModel({"data":firstData});
	  		});
	  		it('someInstance.data is equal to '+ jmvc.stringify(firstData),function(){
	  			someInstance.data.should.equal(firstData);
	  		});
	  		it('someInstance.tempdata is equal to '+ jmvc.stringify(firstData),function(){
	  			someInstance.tempdata.should.equal(firstData);
	  		});
  		});
  		describe('someInstance.load('+ jmvc.stringify(secondData) +')', function(){
  			before(function(){
	  			someInstance.load(secondData);
	  		});
	  		it('someInstance.data is equal to '+ jmvc.stringify(secondData),function(){
	  			someInstance.data.should.equal(secondData);
	  		});
	  		it('someInstance.tempdata is equal to '+ jmvc.stringify(secondData),function(){
	  			someInstance.tempdata.should.equal(secondData);
	  		});
  		});
  		
  		describe('someInstance.load('+ jmvc.stringify(firstData) +','+ jmvc.stringify(secondData) +')', function(){
  			before(function(){
	  			someInstance.load(firstData,secondData);
	  		});
	  		it('someInstance.data is equal to ['+ jmvc.stringify(firstData) +','+ jmvc.stringify(secondData) +']',function(){
	  			someInstance.data.should.deep.equal([firstData,secondData]);
	  		});
	  		it('someInstance.tempdata is equal to ['+ jmvc.stringify(firstData) +','+ jmvc.stringify(secondData) +']',function(){
	  			someInstance.tempdata.should.deep.equal([firstData,secondData]);
	  		});
  		});
  		describe('filterResult = someInstance.filter(function(index){return index===0;})', function(){
  			before(function(){
  				dataBeforeFilter = jmvc.clone(someInstance.data);
	  			filterResult = someInstance.filter(function(index){return index===0;});
	  		});
	  		it('filterResult is equal to [someInstance.data[0]]',function(){
	  			filterResult.should.deep.equal([someInstance.data[0]]);
	  		});
	  		it('someInstance.data stays the same',function(){
	  			someInstance.data.should.deep.equal(dataBeforeFilter);
	  		});
	  		it('someInstance.tempdata is equal to filterResult',function(){
	  			someInstance.tempdata.should.equal(filterResult);
	  		});
  		});
  		describe('filterResult = someInstance.filter(function(){return jmvc.type(this)==="object";})', function(){
  			before(function(){
  				dataBeforeFilter = jmvc.clone(someInstance.data);
	  			filterResult = someInstance.filter(function(){return jmvc.type(this)==="object";});
	  		});
	  		it('filterResult is equal to [someInstance.data[1]]',function(){
	  			filterResult.should.deep.equal([someInstance.data[1]]);
	  		});
	  		it('someInstance.data stays the same',function(){
	  			someInstance.data.should.deep.equal(dataBeforeFilter);
	  		});
	  		it('someInstance.tempdata is equal to filterResult',function(){
	  			someInstance.tempdata.should.equal(filterResult);
	  		});
  		});
  		describe('someInstance.clean()', function(){
  			before(function(){
  				someInstance.clean();
	  		});
	  		it('someInstance.data is equal to be []',function(){
	  			someInstance.data.should.deep.equal([]);
	  		});
	  		it('someInstance.tempdata is equal to []',function(){
	  			someInstance.tempdata.should.deep.equal([]);
	  		});
  		});
	});
});