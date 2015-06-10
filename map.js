// *********** MAP ********** //
// var latitude = 51.5295407;
// var longitude = -0.0422945;


navigator.geolocation.getCurrentPosition(function(response){
	latitude = response.coords.latitude;
	longitude = response.coords.longitude;
	// location.latitude = response.coords.latitude;
	// location.longitude = response.coords.longitude;
	// document.getElementById("lat").innerHTML += lat;
	// document.getElementById("lon").innerHTML += lon;
	// console.log(location);


	var map = L.map('map').setView([latitude, longitude], 15);
	// var marker = L.marker([latitude, longitude]).addTo(map);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		id: 'nofootnotes.af3a6d72',
		accessToken: 'pk.eyJ1Ijoibm9mb290bm90ZXMiLCJhIjoiODg2Mzg4MTZjZjQxMDUyNDA3NWRmOTFmNTAzNjg5OWMifQ.yMaarDENqB-qe1srLI3u9g'
	}).addTo(map);

	// marker.bindPopup("<b>You are here</b>").openPopup();

});