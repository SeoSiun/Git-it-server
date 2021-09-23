var {getCommitByCrawling, getImageUrlByCrawling} = require('./gitCrawler.js');

var express = require('express');
var router = express.Router();

const User = require('../models/user.js');

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

// get a friendsInfo by friendName
router.get('/:friendName/friend', (req, res) => {
  getCommitByCrawling(req.params.friendName, function(result){
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

module.exports = router;