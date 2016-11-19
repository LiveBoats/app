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
			var myBoats = myXmlDom.find("description").each(function() {
				//Get boat configuration
				var myId = $(this).text().replace(/.*mmsi=(\d+)&.*/, "$1");

				var myFind = false;
				for (var i = 0; i < that.boats.length; i++) {
					if( that.boats[i].id == myId) {
						myFind = true;
						break;
					}
				}

				if( ! myFind ) {
					that.boats.push( that.generateBoats(myId) )
				}

				//Get coordinates
				var myCoordinates = $(this).parent().find("coordinates").text().split(",");
				var mySpeed = parseFloat($(this).parent().find('[name="Speed"]').find('value').text())
				for (i = 0; i < that.boats.length; i++) {
					if( that.boats[i].id == myId) {
						that.boats[i].data.lat = myCoordinates[0];
						that.boats[i].data.lon = myCoordinates[1];
						that.boats[i].data.speed = mySpeed;
						break;
					}
				}
			});
		});
	},

	generateBoats: function (boatId) {
		return {
			id : boatId,
			data: new GetData(boatId).getData()
		}
	},

	initInterval: function () {
		var that = this;
		this.interval = setInterval(that.downloadFile, 30 * 1000);
	},

	init: function () {
		this.initInterval();
	}
};
