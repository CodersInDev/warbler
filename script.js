window.onload = function(){
	handlerGet();
	if(localStorage.getItem("warblerBrowserID") === undefined) {
		localStorage.setItem("warblerBrowserID", Math.random().toString());
	}
};

var socket = io();

$('#warbleForm').submit(function(e){
	e.preventDefault();
	var warble = new Warble($("#warbleBox").val());
	var warbleString = JSON.stringify(warble);
	socket.emit('warble', warbleString);
	
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


function Warble(content) {
	this.content = content;
	this.timestamp = Date.now();
	this.user = localStorage.getItem("warblerBrowserID");
	this.deleted = false;
}

function addWarble(data) {
	var unWarble = data.user === localStorage.getItem("warblerBrowserID") ? "<input type='button' class='unwarble' value='UnWarble'>" : "";
	return "<li class='warble'>" + 
	data.content + 
	"<br/><span class='date' id='" + data.timestamp + "'>Warbled at " + 
	new Date(data.timestamp).toString().slice(0, 24) + 
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

