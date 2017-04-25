# devlog
A Sailsjs webapp that tails (watches) files for changes.
Especially useful for viewing log files during development.

* Set up watchers and profiles to tail one or more files
* Interactive file browser to search files on your local machine or a server that you have access to.

## Installation
Ensure that you have [SailsJS](http://sailsjs.com/)
Run `npm install` followed by `bower install`
If behind a corporate firewall, ensure that your root .bowerrc or .npmrc is configured correctly.

## Running the server
For live reload of server changes, install `npm install -g nodemon` then run `nodemon app` when starting the server
To start the app *without* live reload, run good ol' `sails lift`

## SCSS
This project is configured to use `node-sass`. Ensure the module is installed globally by running `npm install -g node-sass`. 

## Database
Devlog uses MongoDB for data storage. Download & install [MongoDB CE](https://www.mongodb.com/download-center#community) on your system.
Then run `mongod` to start your MongoDB instance. 