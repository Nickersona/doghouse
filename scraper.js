var fs = require('fs'),
	request = require('request'),
	cheerio = require('cheerio');


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

var PageScraper = function(url, callback){
	this.baseUrl = url;
	
	this.callback = callback;
	this.stats = {
		searchUrl: url,
		count: 0,
		pages: 0

	}
	this.data = {};
	this.allFinished = false;
	this.dataPoints = [];

	//Describe the data points to extract and how to extract them from the listing domNode
	var priceDataPoint = new DataPoint('price');
	priceDataPoint.addExtractionMethod('overview', function($domNode){
		return parseInt($domNode.find('span.price').text().substr(1));
	});

	var listingName = new DataPoint('ListingName');
	listingName.addExtractionMethod('overview', function($domNode){
		return $domNode.find('a.hdrlnk').text();	
	});

	var location = new DataPoint('location');
	location.addExtractionMethod('overview', function($domNode){
		return $domNode.find('a.hdrlnk').text();
	});

	var listingHref = new DataPoint('href');
	listingHref.addExtractionMethod('overview', function($domNode){
		return 'http://vancouver.craigslist.ca' + $domNode.find('a.hdrlnk').attr('href');	
	});

	var listingDate = new DataPoint('date');
	listingDate.addExtractionMethod('overview', function($domNode){
		return Date.parse($domNode.find('time').attr('datetime'));
	});

	var sqft = new DataPoint('sqft');
	sqft.addExtractionMethod('overview', function($domNode){
		var string = $domNode.find('span.housing').text();
		match = string.match(/([0-9]+)ft2/);
		return (match)? parseInt(match[1]) : "";
	});

	this.dataPoints.push(sqft);
	this.dataPoints.push(listingDate);
	this.dataPoints.push(priceDataPoint);
	this.dataPoints.push(listingName);
	this.dataPoints.push(listingHref);

	
	this.crawlPage(this.baseUrl, this.dataPoints);
	
}

PageScraper.prototype.tryCallback = function(){
	if(this.allFinished){
		this.callback(this.stats, this.data);
	}
}

PageScraper.prototype.crawlPage = function(url, dataPoints){
	var self = this;
	request(url, function(error, response, html){
		if (!error && response.statusCode == 200){
			self.stats.pages++;
			var $ = cheerio.load(html);

			//Iterate through all the listings, and run every dataPoint overview extraction method agains the listing element
			$('.content > p.row').each(function(i, listingEl){
				var listingData = {};
				self.stats.count++;

				var id = parseInt($(listingEl).data('pid'));

				//runs all the dataPoint extraction methods against the listing Node
				for (var i = dataPoints.length - 1; i >= 0; i--) {
					listingData[dataPoints[i].name] = dataPoints[i].getExtractionMethod('overview')($(listingEl));
				};

				self.data[id] = listingData;
			});

			self.stats.listedTotal = $('.totallink').text();

			//If it's the last page run the callback otherwise generate the next pages url and crawl it
			if(!$('.paginator.buttongroup').hasClass('lastpage')) {
				url = advancePageUrl(url);
				self.crawlPage(url, dataPoints);
				
				console.log('Next Page >>');
			}else{
				self.allFinished = true;
				self.tryCallback();
			}
		}
	});
}

function advancePageUrl(url){
	var hasPageParam = (url.search(/s\=[0-9]+/) === -1);
	if (hasPageParam){
		url += "&s=100";	
	} else{
		url = url.replace(/s\=([0-9]+)/, function(match, p1){
			var  newCount = parseInt(p1) + 100
			return 's=' + newCount
		});
	}
	return url;
}


var url = "http://vancouver.craigslist.ca/search/apa?pets_dog=0&amp;query=vancouver%20apartment&amp;sort=rel"



var scraper = new PageScraper(url, function(stats, data){
	console.log(stats);

	var avgPrice = calculateAverage(data);

	var DataSet = {"stats" : stats, "data": data}




	fs.writeFile('dataSet.json', JSON.stringify(DataSet, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    }
	}); 
});



function calculateAverage(dataSet){
	var total = 0;
	var dataKeys = Object.keys(dataSet);
	var actualDataCount = dataKeys.length;
	for (var i = dataKeys.length - 1; i >= 0; i--) {
		if( isValidData(dataSet[dataKeys[i]].price) ){
			total += dataSet[dataKeys[i]].price;
		}else{
			actualDataCount--;
		}
	};
	console.log(actualDataCount);
	console.log(total/actualDataCount);
};

function isValidData (datum){
	return typeof datum === 'number' 
	&& !isNaN(datum)
	&& datum < 10000
	&& datum > 100

}


