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
	return "<li class='warble'>" + data.content + "Warbled at " + data.timestamp + "</li>";
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
	if ($("#warbleBox").val().length !== 0 ){
		$.post("/create",JSON.stringify(warble), function () {
			$("#publicStream").prepend(addWarble(warble));
		});
		$("#warbleBox").val('');
	}
});


$("#userWarbles").click(function() {
    $("#userStream").toggle();
    if ($("#userWarbles").text() == "My Warbles") {
        $("#userWarbles").text("All");
        $("#publicStream").css("display","none");
    }
    else {
        $("#userWarbles").text("My Warbles");
        $("#publicStream").css("display","block");
    }
});
