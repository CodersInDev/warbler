// *********** MAP ********** //

var leaflet = {
	latitude: '',
	longitude: '',


	showMap: function() {
		navigator.geolocation.getCurrentPosition(function(response){
			leaflet.latitude = response.coords.latitude;
			leaflet.longitude = response.coords.longitude;


			var map = L.map('map').setView([leaflet.latitude, leaflet.longitude], 15);
			var marker = L.marker([leaflet.latitude, leaflet.longitude]).addTo(map);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18,
				id: 'nofootnotes.af3a6d72',
				accessToken: 'pk.eyJ1Ijoibm9mb290bm90ZXMiLCJhIjoiODg2Mzg4MTZjZjQxMDUyNDA3NWRmOTFmNTAzNjg5OWMifQ.yMaarDENqB-qe1srLI3u9g'
			}).addTo(map);

		marker.bindPopup("<b>You are here</b>").openPopup();

		});
	}
};