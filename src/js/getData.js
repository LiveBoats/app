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
		speed: 0.0
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
	}
};
