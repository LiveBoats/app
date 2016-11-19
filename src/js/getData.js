/**
 * Created by thomas on 19/11/16.
 */

var myAjaxPrefilter = false;

function GetData(boatId) {
	this.url = "http://www.marinetraffic.com/ais/details/ships/" + boatId;

	this.data = {
		img: "",
		title: "",
		type: "",
		country: "",
		lat: 0.0,
		lon: 0.0,
		speed: 0.0,
		deadWeight: 0.0,
		grossTonnage: 0.0,
		size: "",
		originalPort: "",
		speedRecordAverage: ""
	};

	return this;
}

GetData.prototype = {
	/**
	 * Extract data from web page
	 */
	getData: function() {
		var that = this;
		if( ! myAjaxPrefilter ) {
			myAjaxPrefilter = true;
			$.ajaxPrefilter( function (options) {
				if (options.crossDomain && jQuery.support.cors) {
					var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
					options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
					//options.url = "http://cors.corsproxy.io/url=" + options.url;
				}
			});
		}

		$.get(
			that.url,
			function (response) {
				that.extractData(response);
			});
	},

	extractData: function(htmlData) {
		var myDiv = $("<div></div>").html(htmlData);

		this.extractDataImg(myDiv);
		this.extractDataTitle(myDiv);
		this.extractDataType(myDiv);
		this.extractDataCountry(myDiv);
		this.extractDataGrossTonnage(myDiv);
		this.extractDataGrossDeadWeight(myDiv);
		this.extractDataSize(myDiv);
		this.extractDataOriginalPort(myDiv);
		this.extractDataSpeedRecordAverage(myDiv);
	},

	extractDataImg: function (jqueryNode) {
		this.data.img = jqueryNode.find(".center-block").attr("src");
	},

	extractDataTitle: function (jqueryNode) {
		this.data.title = jqueryNode.find("h1.font-200").text()
	},

	extractDataType: function (jqueryNode) {
		this.data.type = jqueryNode.find("a.font-120").text()
	},

	extractDataCountry: function (jqueryNode) {
		this.data.country = jqueryNode.find(".bg-info > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > b:nth-child(2)").text();
	},

	extractDataGrossTonnage: function (jqueryNode) {
		this.data.grossTonnage = parseFloat(jqueryNode.find(".bg-info > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > b:nth-child(2)").text());
	},

	extractDataGrossDeadWeight: function (jqueryNode) {
		this.data.deadWeight = parseFloat(jqueryNode.find(".bg-info > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > b:nth-child(2)").text());
	},

	extractDataSize: function (jqueryNode) {
		this.data.size = jqueryNode.find(".bg-info > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > b:nth-child(2)").text();
	},

	extractDataOriginalPort: function (jqueryNode) {
		this.data.originalPort = jqueryNode.find("li.group-ib:nth-child(9) > span:nth-child(2) > b:nth-child(1)").text();
	},

	extractDataSpeedRecordAverage: function (jqueryNode) {
		this.data.speedRecordAverage = jqueryNode.find("div.table-responsive:nth-child(6) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1)").text();
	}
};


