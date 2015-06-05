var assert = require('assert');
var Shot = require('shot');
var warblers = require('../warblers.js');
var Http = require('http');
var server = require('../handler.js');
//var testindex = 1;  see: https://testanything.org/tap-version-13-specification.html
console.log("Check type of warbles");
assert.equal(typeof warblers, 'object');
assert.equal(typeof warblers.generic, 'function');

console.log('warbles must have a property GET /');
assert.equal(warblers.hasOwnProperty('GET /'), true);

console.log('warbles must have a property GET /warbles');
assert.equal(warblers.hasOwnProperty('GET /warbles'), true);

console.log('warbles must have a property POST /create');
assert.equal(warblers.hasOwnProperty('POST /create'), true);

console.log('warbles must have a property generic');
assert.equal(warblers.hasOwnProperty('generic'), true);

//don't pass yet
// console.log('warbles must have a property POST /warble');
// assert.equal(warblers.hasOwnProperty('POST /warble'), true);
//Let's have some shots
// var server = Http.createServer(warblers["GET /test"]);
console.log('call server for whole list of warbles returns string of warble array');
Shot.inject(server, { method: 'GET', url: '/warbles'}, function (res){
    assert.equal(typeof res.payload, "string");
});
// console.log('end of test');

console.log('Test POST /warbles - gets the newest warbles and returns them in an array');
Shot.inject(server, {method: "POST", url: "/warbles"}, function (res) {
	assert.equal(Object.prototype.toString.call(res.payload), "[object Array]");
});

// console.log('Test POST /create - storing a new warble and stores it in a file');
// Shot.inject(server, {method: "POST", url: "/create", payload: {content: "TEST TEST TEST"}}, function (res) {
// 	// // assert.equal(JSON.parge(res.payload).content, "");
// 	console.log(res.payload);
// 	// // console.log("testWarble is ", testWarble);
// 	// assert.equal(testWarble, "TESTMESSAGE");
// 	// console.log("Test message successfully submitted to server");
// 	// var warbleData = require('../data.json');
// 	// assert.equal(warbleData[warbleData.length - 1].content, "TESTMESSAGE");
// 	// console.log("Test message successfully stored in data.json");
// });

// console.log("checking if warbles.generic sends the right file according to the request.url");
// Shot.inject(server, {method: "generic", url: "../css/mobile-first.css"}, function (res) {
// 	console.log(res.payload);
// });


