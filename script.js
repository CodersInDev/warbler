window.onload = function(){
	handlerGet();
	if(typeof localStorage.getItem("warblerBrowserID") !== "string") {
		localStorage.setItem("warblerBrowserID", Math.random().toString());
	}
	leaflet.showMap();
};

var socket = io();

$('#warbleForm').submit(function(e){
	e.preventDefault();	
	if ($("#warbleBox").val().length){
			var warble = new Warble($("#warbleBox").val());
			// navigator.geolocation.getCurrentPosition(function(position){
			// 	warble.latitude = position.coords.latitude;
			// 	warble.longitude = position.coords.longitude;
			// });
			var warbleString = JSON.stringify(warble).replace(/</g, "&lt").replace(/>/g, "&gt");

			socket.emit('warble', warbleString);

			leaflet.createMarker(warble);
			
			$.post("/warble", warbleString);
			$("#warbleBox").val('');
	}
	return false;
});

socket.on('warbleFromServer', function(data){
	var warble = JSON.parse(data);
	$("#publicStream").prepend(addWarble(warble));
	if (warble.user === localStorage.getItem("warblerBrowserID")) {
		$("#userStream").prepend(addWarble(warble));
	}
});

socket.on("deleteFromServer", function(stamp) {
	$(stamp).remove();
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
	return "<li class='warble' id='" + data.timestamp + "'>" + data.content +
	"<br/><span class='date'>Warbled at " +
	new Date(data.timestamp).toString().slice(0, 24) + 
	" Located at: " + data.latitude + ", " + data.longitude +
	"</span>" + unWarble + "</li>";
}

function handlerGet () {
	$.get("/warbles", function handler(data){
		var warbles = JSON.parse(data);
		var worldWarblesDOM = "";
		var userWarblesDOM = "";
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
