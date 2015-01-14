module.exports = function() {
	args = {
		get: function(val,argv){
			argv = argv || process.argv;
			arg = argv.filter(function(item){
				var _itemArr = item.split("=");
				return _itemArr[0] === "--"+ val && _itemArr.length==2;
			});
			return arg.length>0 ? arg[0].split("=")[1] : undefined;
		}
	};
	return args;
};