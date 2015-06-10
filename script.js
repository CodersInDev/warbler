var browserID = Math.random().toString();

if(localStorage.getItem("browserID") === undefined) {
	localStorage.setItem("browserID", browserID);
}

var warbleArray = [];

//on document load, GET all warbles from array

function Warble(content) {
	this.content = content;
	this.timestamp = new Date().getTime();
	this.user = localStorage.getItem("browserID");
	this.deleted = false;
	this.latitude = 51.5295407;
	this.longitude = -0.0422945;
}

function addWarble(data) {
	return "<li class='warble'>" + data.content + "<br/>" + "<span id='date'>" + "Warbled at " + new Date(data.timestamp).toString().slice(0, 24) + "</span>" + "</li>";
	//todo add delete button once its ready
}

function handlerGet () {
	$.get("/warbles", function handler(data){
		var warbles = JSON.parse(data);
		var newWarblesDOM = '';
		for (var i = 0; i < warbles.length; i++) {
			newWarblesDOM += addWarble(warbles[i]);
		}
		$("#publicStream").prepend(newWarblesDOM);
	});
}

window.onload = function(){
	handlerGet();
};

$("#warbleSubmit").click(function () {
	var warble = new Warble( $("#warbleBox").val());
	console.log(warble);
	var warbleMessage = {};
	// warbleMessage.content = warble;
	// warbleMessage.latitude = 51.5295407;
	// warbleMessage.longitude = -0.0422945;
	// console.log("new Warble: ", warbleMessage);
	if ($("#warbleBox").val().length !== 0 ){
		$.post("/create",JSON.stringify(warble));
		$("#warbleBox").val('');
	}
	
});


var warbleBox = document.getElementById('warbleBox');
var warbleSubmit = document.getElementById('warbleSubmit');
//if enter key is pressed, stop page refreshing and simulate button click
warbleBox.addEventListener("keypress", function(e) {
	e = e || window.event;
	if (e.keyCode === 13) {
		e.preventDefault();
		warbleSubmit.click();
	}
});

$("#userWarbles").click(function() {
    $("#userStream").toggle();
    if ($("#userWarbles").text() === "My Warbles") {
        $("#userWarbles").text("All");
        $("#publicStream").css("display","none");
    }
    else {
        $("#userWarbles").text("My Warbles");
        $("#publicStream").css("display","block");
    }
});


// addWarble({\"content\":\"hi\",\"timestamp\":1433935871999,\"user\":null,\"deleted\":false,\"latitude\":51.5295407,\"longitude\":-0.0422945});
