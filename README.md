# warbler
The next Twitter

[![Code Climate](https://codeclimate.com/github/CodersInDev/warbler/badges/gpa.svg)](https://codeclimate.com/github/CodersInDev/warbler)
[![Test Coverage](https://codeclimate.com/github/CodersInDev/warbler/badges/coverage.svg)](https://codeclimate.com/github/CodersInDev/warbler/coverage)
[![Build Status](https://travis-ci.org/CodersInDev/warbler.svg?branch=master)](https://travis-ci.org/CodersInDev/warbler)
![Dependencies](https://david-dm.org/CodersInDev/warbler.svg)
[![devDependency Status](https://david-dm.org/dwyl/esta/dev-status.svg)](https://david-dm.org/dwyl/esta#info=devDependencies)


## Why?
We want to learn how to handle endpoints, with an aim to make a version of Twitter.

## What?
We will have the ability to create Warbles, see existing Warbles, and delete something you have previously warbled.

## How?
- [x] Make Create, Read, and Delete endpoints
- [x] Store Warbles as JSON in memory
- [x] Store Warbles in the file system
- [x] Use Cookies (or preferably localStorage) to restrict Warble deletion to the browser from which the Warble was originally created.
- [ ] Move Warbles to Redis
- [ ] Deploy to Heroku
- [ ] Add real-time updates of Warbles

### To run, first clone the repository  

### Then go to the repository directory and install the dependencies:  
``` npm install ```  
This will install the correct version of the relevant dependencies so you can run the app.  

### Now load the page  
```npm run nodemon```  
 
http://localhost:8000

### The app has the following functions:  

* [x] Create a new warble by typing in the box and hitting the button  
 * [x] This will send your warble to the server, 
 * [ ] update your personal warble stream with your new warble, and 
 * [ ] update the public warble stream with warbles from other warblers on the worldwide web by refreshing the page 
* [ ] Update the public warble stream every 30 seconds
* [ ] Allow the original warbler (and only the original warbler) to delete her warbles
