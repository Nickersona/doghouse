var fs = require('fs'),
	path = require('path'),
	PageScraper = require('./PageScraper.js'),
	dataTools = require('./dataTools/datatools.js')

var url = "http://vancouver.craigslist.ca/search/apa?pets_dog=1&amp;query=vancouver%20apartment&amp;sort=rel"



var scraper = new PageScraper(url, function(stats, data){
	console.log(stats);
	var avgPrice = dataTools.calculateAverage(data);
	var dest = path.resolve( __dirname + '/data/dataSet.json');
	var DataSet = {"stats" : stats, "data": data}

	fs.writeFile(dest, JSON.stringify(DataSet, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    }
	}); 
});