const express = require('express');
const db_connection = require('./db_connection');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
//app.use(bodyParser);
const port = 3000;

// Connection testing
app.get('/user/', (req, res) => {
  //var result = db_connection.getAllUsers();
  db_connection.getAllUsers().then( (result) => res.json(result));
  //res.json(result);
});

// Get user info
app.get('/user/:id', (req, res) => {
    db_connection.getUserInfo(req.params.id).then( (result) => res.json(result));
});

// Get user tasks of the day
app.get('/user/:id/:date', (req, res) => {
  db_connection.getUserTasksOfDate(req.params.id, req.params.date).then( (result) => res.json(result));
});

// Post user sign-up data and check
app.post('/user/sign-up/', (req, res) => {
  db_connection.registerUser(req.body.email, req.body.pw, req.body.name).then( (result) => res.send(result));
});

app.listen(port, () => {
  console.log(`Tagged server app listening at http://localhost:${port}`)
})