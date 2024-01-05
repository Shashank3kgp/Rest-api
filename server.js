const http = require('http');  // http package for creating http server
const app = require('./app'); // importing the app file

const port = process.env.PORT || 3000;  // creating the port

const server = http.createServer(app);  // it creates the http server by using createserver taking app as an argument 

server.listen(port);  // this one starts the server and makes it listen for incoming http requests coming from this port 

// for handling all the http requests that we encounter we use this one to work on all of them 