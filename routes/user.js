var {getCommitByCrawling, getImageUrlByCrawling} = require('./gitCrawler.js');

var express = require('express');
var router = express.Router();
var app = express();

const User = require('../models/user.js');

// get all users
// router.get('/', (req, res) => {
//   const filter = {};
//   User.find(filter, (err, userList) => {
//     if(err) res.status(400).json({msg: `get all users error`});
//     if(!userList) res.status(404).json({msg: `users not found`});
//     else {
//       console.log('find userList 성공');
//       return res.status(200).json({userList});
//     }
//   })
// })

// get a user by userName
router.get('/:userName', (req, res) => {
  const filter = {userName: req.params.userName};
  User.findOne(filter, (err, user) => {
    if(err) res.status(500).json({error: `db failure`});
    if(!user) res.status(404).json({msg: `user not found`});
    else {
      console.log('findOne by userName 성공');
      return res.status(200).json(user);
    }
  })
})

// get friends by userName
router.get('/:userName/friendsInfo/', (req, res) => {
  // const id = req.params.userName.$oid;
  const filter = {userName: req.params.userName};
  User.find(filter).select('friends').exec((err, friendList) => {
    if(err) res.status(400).json({msg: `get friends error`});
    if(!friendList) res.status(404).json({msg: `freind not found`});
    else {
      console.log('getFreinds by userName 성공');
      return res.status(200).json({friendList});
    }
  })
})

// get a user commit by userName
// friend + totalCommit 추가하기
// 크롤링한걸 디비에 저장하면 안됨.
router.get('/:userName/friend', (req, res) => {
  getCommitByCrawling(req.params.userName, function(result){
    return res.status(200).json(result['crawledCommits']);
  });
})

// get a user imageUrl by userName
router.get('/:userName/imageUrl', (req, res) => {
  getImageUrlByCrawling(req.params.userName, function(result){
    return res.status(200).json(result);
  });
})

// get totalCommits by userName
router.get('/:userName/stats', (req, res) => {
  const filter = {userName: req.params.userName};
  User.findOne(filter).select('tier totalCommits average streak tier rank').exec((err, stats) => {
    if(err) res.status(500).json({error: `db failure`});
    if(!stats) res.status(404).json({msg: `stats not found`});
    else {
      console.log('get stats by user name 성공');
      return res.status(200).json(stats);
    }
  })
})

/* -------------------- Update Api -------------------- */

// update friends by userName
router.put('/friend/add', (req, res) => {
  const name = req.body.userName;            // body로 받은 userName을 저장
  const fName = req.body.friendName;    // body로 받은 friendName을 저장
  User.updateOne(
    {userName: name},                         // 이름이 name인 사람을 찾아서햐
    {$push: {friends: fName}},          // friendName을 friends 배열에 추가해라
    function (error, success) {
      if(error) {
        console.log(error);
        return res.status(400).json("0");
      } else {
        console.log(success);
        return res.status(200).json("1");
      }
    }).exec()
})

module.exports = router;