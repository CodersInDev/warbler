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
	// navigator.geolocation.getCurrentPosition(function(position){
	// 	warble.latitude = position.coords.latitude;
	// 	warble.longitude = position.coords.longitude;
	// });
	var warbleString = JSON.stringify(warble);
	socket.emit('warble', warbleString);
	leaflet.createMarker(warble);
	if ($("#warbleBox").val().length){
		$.post("/warble", warbleString);
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
