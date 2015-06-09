
var socket = io();

$('#warbleSubmit').click(function(){
	socket.emit('warble', $('#warbleBox').val());
	return false;
});

socket.on('warble', function(msg){
	$("#publicStream").prepend("<li class='warble'>" + msg + "<br/>" + "<span id='date'>" + "Warbled at " + new Date().toString().slice(0, 24) + "</span>" + "</li>");
	$("#userStream").prepend("<li class='warble'>" + msg + "<br/>" + "<span id='date'>" + "Warbled at " + new Date().toString().slice(0, 24) + "</span>" + "</li>");
});


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
}

function addWarble(data) {
	return "<li class='warble'>" + data.content + "<br/>" + "<span id='date'>" + "Warbled at " + new Date(data.timestamp).toString().slice(0, 24) + "</span>" + "</li>";
	//todo add delete button once its ready
}

function handlerGet () {
	$.get("/warbles", function handler(data){
		var warbles = JSON.parse(data);
		var newWarblesDOM = '';
		var user;
		var userList;
		for (var i = 0; i < warbles.length; i++) {
			newWarblesDOM += addWarble(warbles[i]);
		} 
		user = warbles.filter(function(a){
			return a.user === localStorage.getItem("browserID");
		});
		userList = user.map(addWarble);
		$("#publicStream").prepend(newWarblesDOM);
		$("#userStream").prepend(userList);
	});
}

window.onload = function(){
	handlerGet();
};

$("#warbleSubmit").click(function () {
	var warble = new Warble( $("#warbleBox").val());
	console.log(warble);
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

