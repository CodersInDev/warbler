var socket = io();

window.onload = function(){
	getWarbles();
	if(typeof localStorage.getItem("warblerBrowserID") !== "string") {
		localStorage.setItem("warblerBrowserID", Math.random().toString());
	}
	leaflet.showMap();
};

function getWarbles () {
	$.get("/warbles", function(data){
		var warbles = JSON.parse(data).warbles;
		var worldWarblesDOM = "";
		var userWarblesDOM = "";
    warbles.forEach(function(warble){
			worldWarblesDOM += addWarble(warble);
			if (warble.user === localStorage.getItem("warblerBrowserID")) {
				userWarblesDOM += addWarble(warble);
			}
		});

		$("#publicStream").prepend(worldWarblesDOM);
		$("#userStream").prepend(userWarblesDOM);
	});
}


$('#warbleForm').submit(function(e){
	e.preventDefault();
	if ($("#warbleBox").val().length){
			var message = {};
			navigator.geolocation.getCurrentPosition(function(position){
				message.location = {latitude: position.coords.latitude, longitude: position.coords.longitude};
				message.content = $("#warbleBox").val();
				// 1.replace(/</g, "&lt").replace(/>/g, "&gt");
				message.user = localStorage.getItem("warblerBrowserID");
				socket.emit('warble', message);
				leaflet.createMarker(message);
				$("#warbleBox").val('');
			});
	}
	return false;
});

function fetchJSONFile(path, callback) {
	$.get(path, function(data){
			callback(data);
	});
}

socket.on('warbleFromServer', function(data){
	console.log(data);
	$("#publicStream").prepend(addWarble(data));
		if (data.user === localStorage.getItem("warblerBrowserID")) {
			$("#userStream").prepend(addWarble(data));
		}
		$.post("/warble", JSON.stringify(data));

	// var warble = JSON.parse(data);
	// fetchJSONFile('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + warble.latitude +'&lon=' + warble.longitude + '&zoom=18&addressdetails=1', function(data) {
	// 	if (data.address) {
	// 		var suburb = data.address.suburb;
	// 		var city = data.address.city;
	// 		warble.locationFormatSuburb = suburb;
	// 		warble.locationFormatCity = city;
	// 	}
	// 	$("#publicStream").prepend(addWarble(warble));
	// 	if (warble.user === localStorage.getItem("warblerBrowserID")) {
	// 		$("#userStream").prepend(addWarble(warble));
	// 	}
	// });
	leaflet.createMarker(data);
});

socket.on("deleteFromServer", function(stamp) {
	$(stamp).remove();
});

function addWarble(data) {
	var unWarble = data.user === localStorage.getItem("warblerBrowserID") ? "<input type='button' class='unwarble' value='UnWarble'>" : "";

	return "<li class='warble' id='" + data.timestamp + "'>" + data.content +
	"<br/><span class='date'>Warbled at " + data.timestamp +
	" Located at: " + data.location.suburb + ", " + data.location.city +
	"</span>" + unWarble + "</li>";
}

//delete function for clicking on unwarble button
$("body").on("click", "li input", function(){
	var jId = "#" + $(this).parent().attr('id');
	$(jId).remove();
	socket.emit("delete", jId);
	$.post("/delete", jId.substr(1));
});


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
