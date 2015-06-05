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

// console.log('submit ')
