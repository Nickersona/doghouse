var fs = require('fs'),
	request = require('request'),
	cheerio = require('cheerio');


var DataPoint = function(name){
	this.name = "";
	var extractionMethods = {};

	this.addExtractionMethod = function(methodPage, methodFunction){
		console.log(methodFunction);
		this.extractionMethods[methodPage] = methodFunction;
	}

	this.getExtractionMethod = function(methodPage){
		return (this.extractionMethods.hasOwnProperty(methodPage))? this.extractionMethods[methodPage] : false ;
	}

	return this;
}

var PageScraper = function(url, callback){
	this.baseUrl = url;
	

	this.stats = {
		count: 0,
		pages: 0
	}
	this.data = [];
	this.allFinished = false;
	this.dataPoints = [];

	var priceDataPoint = new DataPoint('price');
	priceDataPoint.addExtractionMethod('overview', function(domNode){
		return $(domNode).find('span.price').text();	
	});

	this.dataPoints.push(priceDataPoint);

	var tryCallback = function(){
		if(this.allFinished){
			callback(this.stats, this.data);
		}
	}
	
	this.crawlPage(this.baseUrl, dataPoints);
	
}

PageScraper.prototype.crawlPage = function(url, dataPoints){
	var self = this;
	request(url, function(error, response, html){
		if (!error && response.statusCode == 200){
			self.stats.pages++;
			var $ = cheerio.load(html);
			$('span.price').each(function(i, element){
				self.stats.count++;
				console.log($(element).text());
			});


			if(!$('.paginator.buttongroup').hasClass('lastpage')) {
				url = advancePageUrl(url);
				self.crawlPage(url);
				
				console.log('Next Page >>');
			}else{
				this.allFinished = true;
				tryCallback();
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


var url = "http://vancouver.craigslist.ca/search/hhh?sort=rel&pets_dog=1&query=vancouver+apartment"
url = advancePageUrl(url)
url = advancePageUrl(url)
url = advancePageUrl(url)

var scraper = new PageScraper(url, function(stats){
	console.log(stats);
});






