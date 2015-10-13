var DataPoint = function(name){
	this.name = name;
	this.extractionMethods = {};

	this.addExtractionMethod = function(methodPage, methodFunction){
		this.extractionMethods[methodPage] = methodFunction;
	}

	this.getExtractionMethod = function(methodPage){
		return (this.extractionMethods.hasOwnProperty(methodPage))? this.extractionMethods[methodPage] : false ;
	}

	return this;
}

module.exports = DataPoint;