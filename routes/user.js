var {getCommitByCrawling, getImageUrlByCrawling} = require('./gitCrawler.js');

var express = require('express');
var router = express.Router();

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
router.put('api/user/:userName/addFriend/:friendName', (req, res) => {
  const filter = {userName: req.params.userName};
  const friend = {name: req.params.friendName}
  User.findOneAndUpdate(
    {userName: req.params.userName}, 
    {$push: {friends : friend}},
    function (error, success) {
      if(error) {
        console.log(error);
      } else {
        console.log(success);
      }
    }).exec()
})

module.exports = router;