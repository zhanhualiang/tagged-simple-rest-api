const express = require('express');
const db_connection = require('./db_connection');
var cors = require('cors');
const auth = require('./authentication');
const app = express();
app.use(express.json());
app.use(cors());
//app.use(bodyParser);
const port = 3000;

// Connection testing
app.get('/user/', (req, res) => {
  //var result = db_connection.getAllUsers();
  db_connection.getAllUsers()
  .then( (result) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
  //res.json(result);
});

// Get user info
app.get('/user/:id', (req, res) => {
    db_connection.getUserInfo(req.params.id)
    .then( (result) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.json(result);}
      );
});

// Get user tasks of the day
app.get('/user/:id/:date', (req, res) => {
  db_connection.getUserTasksOfDate(req.params.id, req.params.date)
  .then( (result) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
});

// Post user sign-up data and check
app.post('/user/sign-up/', (req, res) => {
  db_connection.registerUser(req.body.email, req.body.pw, req.body.name)
  .then( (result) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(result);
  });
});

// Add task
app.post('/task/add/', (req, res) => {
  db_connection.addTask(req.body.uid, req.body.title, req.body.desc, req.body.taskOrder, req.body.share, req.body.date)
  .then( (result) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(result);
  });
});


//Update task info with Patch.
app.patch('/task/update/:taskId/', (req, res) => {
  db_connection.updateTask(req.params.taskId, req.body.title, req.body.desc, req.body.taskOrder, req.body.share, req.body.finish).then(
    (result) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(result);
    });
});

//Update task order with Patch.
app.patch('/task/update/order/:taskId/', (req, res) => {
  db_connection.updateTaskOrder(req.params.taskId, req.body.taskOrder).then(
    (result) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(result);
    });
});

//Update task order in batch
app.patch('/task/order/update/', (req, res) => {
  db_connection.updateTaskOrderInList(req.body.taskOrderList).then(
    (result) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(result);
    });
});

//Delete task with task id.
app.delete('/task/delete/', (req, res) => {
  db_connection.deleteTask(req.body.taskId).then(
    (result) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(result);
    });
})

//Log in.
app.post('/user/sign-in/', (req, res) => {
  db_connection.signIn(req.body.email, req.body.password).then(
    (result) => {
      if(result.hasOwnProperty('id')){
        const payload = {
          email: result.email,
          id: result.id,
          name: result.name
        }
        const token = auth.signToken(payload);
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({
          status: "success",
          jwtToken: token,
          expiresIn: "300"
        });
      } else {
        res.json({
          status: "failed",
          message: "Login failed."
        });
      }

    });
})

app.listen(port,'0.0.0.0', () => {
  console.log(`Tagged server app listening at http://localhost:${port}`)
})