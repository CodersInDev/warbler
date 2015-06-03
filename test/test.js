var assert = require('assert');
var Shot = require('shot');
var warblers = require('../warblers.js');
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

// var internals = {};
//
// internals.main = function () {
//
//     var dispatch = function (req, res) {
//
//         var reply = 'Hello World';
//         res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': reply.length });
//         res.end(reply);
//     };
//
//     var server = Http.createServer(dispatch);
//
//     Shot.inject(dispatch, { method: 'get', url: '/' }, function (res) {
//
//         console.log(res.payload);
//     });
// };
//
//
// internals.main();
