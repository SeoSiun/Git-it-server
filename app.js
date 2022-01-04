const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors'); 
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./routes');

var {getCommitByCrawling} = require('./routes/gitCrawler.js')
const User = require('./models/user.js');

// update all users
function updateUsers(){
  console.log("call updateUsers()");
  User.find({},(err, users) =>{
    if(err){
      console.log("err")
    }
    else{
      console.log("user 목록 가져오기 성공!")
      users.forEach(function(user, index, _users){
        getCommitByCrawling(user["userName"],function(result){
          // user["school"]에 따라 해당하는 school에 result["totalommit"]을 더해주기.
        })
      });
    }
  })
}

// Express 프레임워크를 시작하는 부분
const app = express();

// 보안+요청Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// 포트 설정하는 부분
const port = process.env.PORT || 8000;

// API를 route하는 부분
app.use('/api', router);

// DB를 연결하는 부분
const url = "mongodb://localhost:27017/GIT-IT"
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
// 실제로 연결되는 곳.
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function(err){
    if(err) {
      console.log('Unable to connect to the mongoDB server.error', err);
    }
    else {
      // 서버를 시작하는 부분
      app.listen(port, ()=>{
        console.log(`Listening on port ${port}`)

        // 1시간! (1000 * 60 * 60)
        var interval = 1000 * 60 * 60;
        setInterval(updateUsers,interval);
      })
    }
});