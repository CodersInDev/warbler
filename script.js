window.onload = function(){
	handlerGet();
	if(localStorage.getItem("warblerBrowserID") === undefined) {
		localStorage.setItem("warblerBrowserID", Math.random().toString());
	}
	leaflet.showMap();
};

var socket = io();

$('#warbleForm').submit(function(e){
	e.preventDefault();
	var warble = new Warble($("#warbleBox").val());
	var warbleString = JSON.stringify(warble);
	//check for js injection
	if(warbleString.indexOf("<") > -1) {
		warbleString = warbleString.replace("<", "&lt");
	}
	if(warbleString.indexOf(">") > -1) {
		warbleString = warbleString.replace(">", "&gt");
	}
	socket.emit('warble', warbleString);
	leaflet.createMarker(warble);
	if ($("#warbleBox").val().length){
		$.post("/warble", warbleString);
		$("#warbleBox").val('');
	}
	return false;
});

function fetchJSONFile(path, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					var data = JSON.parse(httpRequest.responseText);
					if (callback) {callback(data);}
				}
			}
		};

		httpRequest.open('GET', path);
		httpRequest.send();
}

socket.on('warbleFromServer', function(data){

	var warble = JSON.parse(data);
	// fetchJSONFile('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + warble.latitude +'&lon=' + warble.longitude + '&zoom=18&addressdetails=1', function(data) {
	// 	if (data.address) {
	// 		var suburb = data.address.suburb;
	// 		var city = data.address.city;
	// 		warble.locationFormatSuburb = suburb;
	// 		warble.locationFormatCity = city;
	// 	}
		$("#publicStream").prepend(addWarble(warble));
		if (warble.user === localStorage.getItem("warblerBrowserID")) {
			$("#userStream").prepend(addWarble(warble));
		}
	// });
	leaflet.createMarker(warble);
});

function Warble(content) {
// IF geoloc is on
//get geoloc from navigator
//then get parsed location from nominatim
	if(navigator.geolocation){
		// this.latitude = navigator.geolocation.getCurrentPosition().coords.latitude;
		// this.longitude = navigator.geolocation.getCurrentPosition().coords.longitude;
		this.latitude = leaflet.latitude;
		this.longitude = leaflet.longitude;
		
		fetchJSONFile('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + this.latitude +'&lon=' + this.longitude + '&zoom=18&addressdetails=1', function(response) {
			var suburb = response.address.suburb;
			var city = response.address.city;
			this.locationFormatSuburb = suburb;
			this.locationFormatCity = city;
			console.log(this.locationFormatSuburb);
		});
		// console.log(this.locationFormatSuburb);
	} 
	else {
		// this.latitude = leaflet.latitude;
		// this.longitude = leaflet.longitude;
		this.locationFormatSuburb = "";
		this.locationFormatCity = "";
	}


	this.content = content;
	this.timestamp = Date.now();
	this.user = localStorage.getItem("warblerBrowserID");
	this.deleted = false;

}

function addWarble(data) {
	var locString = data.longitude ? " Located at: " + data.locationFormatSuburb + ", " + data.longitude : "";
	var unWarble = data.user === localStorage.getItem("warblerBrowserID") ? "<input type='button' class='unwarble' value='UnWarble'>" : "";
	return "<li class='warble' id='" + data.timestamp + "'>" + data.content + 
	"<br/><span class='date'>Warbled at " + new Date(data.timestamp).toString().slice(0, 24) + 
	locString + "</span>" + unWarble + "</li>";
}

// function addWarble(data) {
// 	var unWarble = data.user === localStorage.getItem("warblerBrowserID") ? "<input type='button' class='unwarble' value='UnWarble'>" : "";
// 	return "<li class='warble'>" + data.content + 
// 	"<br/><span class='date' id='" + data.timestamp + "'>Warbled at " + 
// 	new Date(data.timestamp).toString().slice(0, 24) + " Located at: " + data.locationFormatSuburb + ", " + data.locationFormatCity + 
// 	"</span>" + unWarble + "</li>";
// }

function handlerGet () {
	$.get("/warbles", function handler(data){
		var warbles = JSON.parse(data);
		var worldWarblesDOM = "";
		var userWarblesDOM = "";

	console.log(warbles.warbles.length);
		for (var i = 0; i < warbles.warbles.length; i++) {
			worldWarblesDOM += addWarble(warbles.warbles[i]);
			if (warbles.warbles[i].user === localStorage.getItem("warblerBrowserID")) {
				userWarblesDOM += addWarble(warbles.warbles[i]);
			}
		}

		$("#publicStream").prepend(worldWarblesDOM);
		$("#userStream").prepend(userWarblesDOM);
	});
}


$("#userWarbles").click(function() {
	$("#userStream").toggle();
	if ($("#userWarbles").text() === "Your Warbles") {
		$("#userWarbles").text("Worldwide Warbles");
		$("#publicStream").css("display","block");
		$("#userStream").css("display","none");
	}
	else {
		$("#userWarbles").text("Your Warbles");
		$("#publicStream").css("display","none");
		$("#userStream").css("display","block");
	}
});
