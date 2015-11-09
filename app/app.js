var fs = require('fs'),
	path = require('path'),
	PageScraper = require('./PageScraper.js'),
	dataTools = require('./dataTools/datatools.js')

var db = require('./dbConn.js');
var listings = db.get('listings');


var url = "http://vancouver.craigslist.ca/search/apa?pets_dog=1&amp;query=vancouver%20apartment&amp;sort=rel"

var scraper = new PageScraper(url, function(stats, data){
	var avgPrice = dataTools.calculateAverage(data);
	var dest = path.resolve( __dirname + '/data/dataSet.json');
	var DataSet = {"stats" : stats, "data": data}

	for (var i = data.length - 1; i >= 0; i--) {
		listings.insert(data[i]);
	};

	fs.writeFile(dest, JSON.stringify(DataSet, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    }
	}); 
});