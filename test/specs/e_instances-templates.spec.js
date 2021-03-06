describe('JMVC - instances templates', function(){
	
	var model_name = "some model";
	var templ;
	var someModel;
	var someInstance;
	
  	before(function(){
		jmvc.reset();
	});
	
	describe('var someModel = jmvc.setModel("'+ model_name +'");', function(){
		before(function(){
  			someModel = jmvc.setModel(model_name);
  			someInstance = new someModel({"templ":"Hello World!"});
  		});
  		describe('var someInstance = new someModel({"templ":"Hello World!"});', function(){
	  		it('someInstance.templ() is equal to "Hello World!"',function(){
	  			someInstance.templ().should.equal("Hello World!");
	  		});
	  		it('someInstance.templ.exec() is alse equal to "Hello World!"',function(){
	  			someInstance.templ.exec().should.equal("Hello World!");
	  		});
  		});
  		describe('var templ = jmvc.templ("Hello World!");', function(){
	  		before(function(){
	  			templ = jmvc.templ("Hello World!");
	  		});
	  		it('templ() is equal to "Hello World!"',function(){
	  			templ().should.equal("Hello World!");
	  		});
  		});
  		describe('someInstance.templ("<span>My name is <%=me%></span>");', function(){
  			before(function(){
	  			someInstance.templ("<span>My name is <%=me%></span>");
	  		});
	  		it('someInstance.templ() is equal to "<span>My name is <%=me%></span>"',function(){
	  			someInstance.templ().should.equal("<span>My name is <%=me%></span>");
	  		});
	  		
	  		it('someInstance.templ.exec() throw an error because "me" is undefined',function(){
	  			expect(someInstance.templ.exec).to.throw(Error);
	  		});
	  		it('someInstance.load({"me":"Joe"}).templ.exec() uses someInstance.data as the template\'s data',function(){
	  			someInstance.load({"me":"Joe"}).templ.exec().should.equal("<span>My name is Joe</span>");
	  		});
	  		it('someInstance.templ.exec({"me":"Joe Blogg"}) uses exec argument as the template\'s data',function(){
	  			someInstance.templ.exec({"me":"Joe Blogg"}).should.equal("<span>My name is Joe Blogg</span>");
	  		});
  		});
  		describe('var templ = jmvc.templ("<span>My name is <%=me%></span>");', function(){
	  		before(function(){
	  			templ = jmvc.templ("<span>My name is <%=me%></span>");
	  		});
	  		it('templ({"me":"Joe Blogg"}) is equal to "<span>My name is Joe Blogg</span>"',function(){
	  			templ({"me":"Joe Blogg"}).should.equal("<span>My name is Joe Blogg</span>");
	  		});
  		});
  		describe('someInstance.templ(\'<%for (var i in data){%><%=(i+" = "+data[i])%>;<%}%>\');', function(){
  			before(function(){
	  			someInstance.templ('<%for (var i in data){%><%=(i+" = "+data[i])%>;<%}%>');
	  		});
	  		it('someInstance.templ.exec({data:{"name":"Joe", "surname":"Blogg"}}) is equal to "name = Joe;surname = Blogg;"',function(){
	  			someInstance.templ.exec({data:{"name":"Joe", "surname":"Blogg"}}).should.equal("name = Joe;surname = Blogg;");
	  		});
  		});
  		describe('var templ = jmvc.templ(\'<%for (var i in data){%><%=(i+" = "+data[i])%>;<%}%>\');', function(){
  			before(function(){
	  			templ = jmvc.templ('<%for (var i in data){%><%=(i+" = "+data[i])%>;<%}%>');
	  		});
	  		it('templ({data:{"name":"Joe", "surname":"Blogg"}}) is equal to "name = Joe;surname = Blogg;"',function(){
	  			templ({data:{"name":"Joe", "surname":"Blogg"}}).should.equal("name = Joe;surname = Blogg;");
	  		});
  		});
	});
});