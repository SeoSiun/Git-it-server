var {getCommitByCrawling, isUserInGithub} = require('./gitCrawler.js');

var express = require('express');
var router = express.Router();
var app = express();

const User = require('../models/user.js');

// get all users
function getAllUsers() {
  User.find({},(err, users) =>{
    if(err) return null;
    else return users;
  })
}

// get a user by userName
router.get('/:userName', (req, res) => {
  const filter = {userName: req.params.userName};
  getCommitByCrawling(req.params.userName, function(result){
    if(result===null) res.status(200).json({validation: 3});
    else{
      User.findOne(filter, (err, user) => {
        if(err) res.status(200).json({validation: 0});
        else if(!user) res.status(200).json({validation: 2});
        else {
          console.log("get User by userName 성공");

          return res.status(200).json({
            validation: 1,
            userName: req.params.userName,
            commitsRecord: result["commitsRecord"],
            profileImageUrl: user["imageUrl"],
            streak: user["streak"],
            friendList: user["friends"]
          });
        }
      });
    }
  })
})

router.get('/github/:userName', (req, res) => {
  isUserInGithub(req.params.userName, function(result){
    return res.status(200).json({result: result});
  })
})

// get stats by userName
router.get('/stats/:userName', (req, res) => {
  const filter = {userName: req.params.userName};
  User.findOne(filter).exec((err, stats) => {
    if(err) res.status(500).json({"validation": 0});      // db failed -> db가 아예 터지거나 쿼리가 잘못되었을 때
    if(!stats) res.status(404).json({"validation": 2});   // no user  -> db에 저장된 유저정보가 없는 이름일 때
    else {
      console.log('get stats by user name 성공');
      return res.status(200).json({
        validation: 1,
        average: stats["average"],
        streak: stats["streak"],
        tier: stats["tier"],
        totalCommits: stats["totalCommits"]
        // rank: stats["rank"]          학교 랭크인데 api list에 없음 한다는겨 만다는겨
      });
    }
  })
})

router.post('/', (req, res) => {
  User.insertMany({userName: req.body.userName}, (err, user) => {
    if(err) res.status(200).json({result: 0});
    else {
      console.log('add user 성공');

      getCommitByCrawling(req.body.userName, function(result){});

      return res.status(200).json({result: 1});
    }
  });
})

router.delete('/:userName', (req, res) => {
  User.deleteOne({userName: req.params.userName}, (err, d) => {
    if(err) res.status(200).json({result: 0});
    else {
      if(d.deletedCount === 1) return res.status(200).json({result: 1});
      else return res.status(200).json({result: 0});
    }
  })
})

/* -------------------- Update Api -------------------- */

// update friend with json
router.put('/friend/add', (req, res) => {
  const name = req.body.userName;            // body로 받은 userName을 저장
  const fName = req.body.friendName;    // body로 받은 friendName을 저장
  User.updateOne(
    {userName: name},                         // 이름이 name인 사람을 찾아서햐
    {$push: {friends: fName}},          // friendName을 friends 배열에 추가해라
    function (error, success) {
      if(error) {
        console.log(error);
        return res.status(400).json({"result": 0});
      } else {
        console.log(success);
        return res.status(200).json({"result": 1});
      }
    })
})

// delete friend with json
router.put('/friend/delete', (req, res) => {
  const name = req.body.userName;            // body로 받은 userName을 저장
  const fName = req.body.friendName;    // body로 받은 friendName을 저장
  User.updateOne(
    {userName: name},                         // 이름이 name인 사람을 찾아서햐
    {$pull: {friends: fName}},          // friendName을 friends 배열에서 삭제하라
    function (error, success) {
      if(error) {
        console.log(error);
        return res.status(400).json({"result": 0});
      } else {
        console.log(success);
        return res.status(200).json({"result": 1});
      }
    })
})

module.exports = router;