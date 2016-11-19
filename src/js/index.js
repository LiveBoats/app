/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
window.location.protocol = 'http:';
var area = new Area();

var app = {

	// Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        this.initializeCamera();
    },

	initializeCamera: function () {
		CameraPreview.startCamera(
			{
				camera: "rear",
				tapPhoto: false,
				toBack: true
			}
		);

		this.initializeBoatData()
	},

	initializeBoatData: function() {
    	this.getBoats();
	},

	getBoats: function () {
		new GetBoats().init();

		this.retrieveSensorData();
	},

	retrieveSensorData: function () {

    	function onCompassSuccess(heading) {
			area.setUserPosition(area.position.user.lat, area.position.user.lat, heading.magneticHeading)
		}

		function onCompassError(compassError) {
			alert('Compass error: ' + compassError.code);
		}

		var compassOptions = {
			frequency: 1000
		};

		navigator.compass.watchHeading(onCompassSuccess, onCompassError, compassOptions);

		//////////////
		// GPS
		/////////////

		function onGPSSuccess(position) {
			area.setUserPosition(position.coords.latitude, position.coords.longitude, area.angle);
		}

		// onError Callback receives a PositionError object
		function onGPSError(error) {
			console.log('code: '    + error.code    + '\n' +
				'message: ' + error.message + '\n');
		}

		navigator.geolocation.watchPosition(onGPSSuccess, onGPSError, { timeout: 2000 });
	}
};

app.initialize();
