var Tools = {

	calculateAverage : function(dataSet){
		var total = 0;
		var dataKeys = Object.keys(dataSet);
		var actualDataCount = dataKeys.length;
		for (var i = dataKeys.length - 1; i >= 0; i--) {
			if( this.isValidData(dataSet[dataKeys[i]].price) ){
				total += dataSet[dataKeys[i]].price;
			}else{
				actualDataCount--;
			}
		};
		console.log(actualDataCount);
		console.log(total/actualDataCount);
	},
	isValidData: function (datum){
		return typeof datum === 'number' 
		&& !isNaN(datum)
		&& datum < 10000
		&& datum > 100

	}
}

module.exports = Tools;