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
	socket.emit('warble', warbleString);
	leaflet.createMarker(warble);
	var locationFormat = fetchJSONFile('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + leaflet.latitude + '&lon=' + leaflet.longitude + '&zoom=18&addressdetails=1', returnData);
	console.log(locationFormat);
	if ($("#warbleBox").val().length){
		$.post("/create", warbleString);
		$("#warbleBox").val('');
	}
	return false;
});

socket.on('warble', function(data){
	var warble = JSON.parse(data);
	$("#publicStream").prepend(addWarble(warble));
	if (warble.user === localStorage.getItem("warblerBrowserID")) {
		$("#userStream").prepend(addWarble(warble));
	}
});

function fetchJSONFile(url, returnData) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				var data = JSON.parse(request.responseText);
				if (typeof returnData === "function") {
					returnData(data);
				}
			}
		}
	};
	request.open("GET", url, true);
	request.send();
}

function returnData(jsonData) {
	var suburb = jsonData.address.suburb;
	var city = jsonData.address.city;
	console.log(suburb);
}

function Warble(content) {
	this.content = content;
	this.timestamp = Date.now();
	this.user = localStorage.getItem("warblerBrowserID");
	this.deleted = false;
	this.latitude = leaflet.latitude;
	this.longitude = leaflet.longitude;
}

function addWarble(data) {
	var unWarble = data.user === localStorage.getItem("warblerBrowserID") ? "<input type='button' class='unwarble' value='UnWarble'>" : "";
	return "<li class='warble'>" + data.content + 
	"<br/><span class='date' id='" + data.timestamp + "'>Warbled at " + 
	new Date(data.timestamp).toString().slice(0, 24) + " Located at: " + data.latitude + ", " + data.longitude +
	"</span>" + unWarble + "</li>";
}

function handlerGet () {
	$.get("/warbles", function handler(data){
		var warbles = JSON.parse(data);
		var worldWarblesDOM = "";
		var userWarblesDOM = "";
		
		for (var i = 0; i < warbles.length; i++) {
			worldWarblesDOM += addWarble(warbles[i]);
			if (warbles[i].user === localStorage.getItem("warblerBrowserID")) {
				userWarblesDOM += addWarble(warbles[i]);
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


// addWarble({\"content\":\"hi\",\"timestamp\":1433935871999,\"user\":null,\"deleted\":false,\"latitude\":51.5295407,\"longitude\":-0.0422945});
