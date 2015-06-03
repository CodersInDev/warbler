var warbleArray = [];

function Warble(content) {
	this.wId = ""; // length of master array + 1?????
	this.content = content;
	this.timeStamp = new Date().getTime();
	this.user = ""; // cookie ID????
	this.deleted = false;
}

// Take content and timestamp of warble and create html element
function formatWarble(warble) {

}

// Update the public stream so latest warbles at the top. get must return only
// warbles after the timestamp
$("#warbleUpdate").click(function() {
	var latestWarbleTime = warbleArray[warbleArray.length - 1].timestamp;
	$.post("/warbles", latestWarbleTime, function handler(data){
		if(data === []) {
			$("#toolTip").html("No new warbles to display").finish().fadeIn("fast").delay(1000).fadeOut("slow");
		} else {
			// TODO parse JSON object, format warbles, and update #publicStream
			$("#toolTip").html("Latest warbles added!").finish().fadeIn("fast").delay(1000).fadeOut("slow");
		}
	});
});

// only get elements with higher timestamps, which would mean traversing the whole array??
// or are they already ordered??
function updatePublicStream() {
	var latestWarbleTime = warbleArray[warbleArray.length - 1].timestamp || 0;
	$.post("/warbles", latestWarbleTime, function handler(data){
		JSON.parse(data).map(function(a) {
			warbleArray.push(a);
		});
		// $("#publicStream").append(formatWarble())
	});
}

//Send newly created warble to the server "create" endpoint
$("#warbleSubmit").click(function(){
	var warble = new Warble($("#warbleBox").val());
	$.post("/create", JSON.stringify(warble), function () {
		$("#userStream").append(formatWarble(warble));
		updatePublicStream();
	});
});

console.log('script loaded');
var listWarbles = document.getElementById('listWarbles');
//load list of warbles
var request = new XMLHttpRequest();
request.open('GET', '/warbles');
request.send(null);
request.onreadystatechange = function(){
  if(request.readyState === 4 && request.status === 200){
    var list = JSON.parse(request.responseText);
    var htmlList = '';
    list.forEach(function(element){
      htmlList += "<li>" + element.content + "</li>";
    });
    listWarbles.innerHTML = htmlList;
  }
};
