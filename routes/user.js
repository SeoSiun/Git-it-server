var {getCommitByCrawling, isUserInGithub} = require('./gitCrawler.js');

var express = require('express');
var router = express.Router();

const User = require('../models/user.js');

// // get a friendsInfo by friendName
// router.get('/:friendName/friend', (req, res) => {
//   getCommitByCrawling(req.params.friendName, function(result){
//     return res.status(200).json(result);
//   });
// })

router.get('github/:userName', (req, res) => {
  isUserInGithub(req.params.userName, function(result){
    return res.status(200).json({result: result});
  })
})

// get totalCommits by userName
router.get('stats/:userName', (req, res) => {
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

router.post('/', (req, res) => {
  User.insertMany({userName: req.body.userName}, (err, user) => {
    if(err) res.status(200).json({result: 0});
    else {
      console.log('add user 성공');

      res.status(200).json({result: 1});
      getCommitByCrawling(req.body.userName, function(result){});
    }
  });
})

/* -------------------- Update Api -------------------- */

// update friends by userName
router.get('/userName/:userName/friends', (req, res) => {
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
            commitsRecord: result["crawledCommits"],
            profileImageUrl: user["imageUrl"],
            streak: user["streak"],
            friendList: user["friends"]
          });
        }
      });
    }
  })
})

module.exports = router;