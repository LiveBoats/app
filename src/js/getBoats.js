/**
 * Created by thomas on 19/11/16.
 */

function GetBoats() {
	this.interval = 0;

	this.boats = []
}

GetBoats.prototype = {
	downloadFile: function () {
		var that = this;
		$.get("http://10.16.1.15:8042/tracks.kml", function (responseData) {
			var myXmlDom = $.parseXML( responseData );
			var myBoats = $(myXmlDom).find("description").each(function() {
				//Get boat configuration
				var myId = $(this).text().replace(/.*mmsi=(\d+).*/, "$1");

				var myFind = false;
				for (var i = 0; i < that.boats.length; i++) {
					if( that.boats[i].id == myId) {
						myFind = true;
						break;
					}
				}

				if( ! myFind ) {
					that.boats.push( that.generateBoats(myId) );
				}

				//Get coordinates
				var myCoordinates = $(this).parent().find("coordinates").text().split(",");
				var mySpeed = parseFloat($(this).parent().find('[name="Speed"]').find('value').text());
				for (i = 0; i < that.boats.length; i++) {
					if( that.boats[i].id == myId) {
						that.boats[i].data.data.lat = myCoordinates[0];
						that.boats[i].data.data.lon = myCoordinates[1];
						that.boats[i].data.data.speed = mySpeed;
						break;
					}
				}
			});
		});
	},

	generateBoats: function (boatId) {

		var myData = new GetData(boatId);
		myData.getData();

		return {
			id : boatId,
			data: myData
		}
	},

	initInterval: function () {
		var that = this;
		this.interval = setInterval(function() {that.downloadFile()}, 30 * 1000);
	},

	init: function () {
		this.initInterval();
	}
};
