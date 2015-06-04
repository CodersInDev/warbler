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

$("document").ready(function(){
	$.get("/warbles", function handler(data){
		JSON.parse(data).map(function(a) {
			warbleArray.push(a);
		});
		warbleArray.map(function(a){
			$("#listWarbles").append(formatWarble(a));
		});
	});
});

$("window").load(function(){
	window.setInterval(updatePublicStream, 1000);
});

// Take content and timestamp of warble and create html element
function formatWarble(warble) {
	return "<li>" + warble.content + "Warbled at " + warble.timestamp + "</li>";
}

// Update the public stream so latest warbles at the top. get must return only
// warbles after the timestamp
// $("#warbleUpdate").click(function() {
// 	var latestWarbleTime = warbleArray[warbleArray.length - 1].timestamp;
// 	$.post("/warbles", latestWarbleTime, function handler(data){
// 		if(data === []) {
// 			$("#toolTip").html("No new warbles to display").finish().fadeIn("fast").delay(1000).fadeOut("slow");
// 		} else {
// 			// TODO parse JSON object, format warbles, and update #publicStream
// 			$("#toolTip").html("Latest warbles added!").finish().fadeIn("fast").delay(1000).fadeOut("slow");
// 		}
// 	});
// });

// only get elements with higher timestamps, which would mean traversing the whole array??
// or are they already ordered??



function updatePublicStream() {
	var latestWarbleTime = warbleArray[warbleArray.length - 1].timestamp || 0;
	$.post("/warbles", latestWarbleTime, function handler(data){
		JSON.parse(data).map(function(a) {
			warbleArray.push(a);
		});
		warbleArray.map(function(a){
			$("#listWarbles").append(formatWarble(a));
		});
	});
}

//Send newly created warble to the server "create" endpoint
$("#warbleSubmit").click(function(){
	var warble = new Warble($("#warbleBox").val());
	$.post("/create", JSON.stringify(warble), function () {
		console.log("warble sent");
		// $("#userStream").append(formatWarble(warble));
		// updatePublicStream();
	});
});

// console.log('script loaded');
// var listWarbles = document.getElementById('listWarbles');
// //load list of warbles
// var request = new XMLHttpRequest();
// request.open('GET', '/warbles');
// request.send(null);
// request.onreadystatechange = function(){
//   if(request.readyState === 4 && request.status === 200){
//     var list = JSON.parse(request.responseText);
//     var htmlList = '';
//     list.forEach(function(element){
//       htmlList += "<li>" + element.content + "</li>";
//     });
//     listWarbles.innerHTML = htmlList;
//   }
// };
