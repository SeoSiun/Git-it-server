import './gitCrawler.js';

var express = require('express');
var router = express.Router();

const User = require('../models/user.js');

// get all users
router.get('/', (req, res) => {
  const filter = {};
  User.find(filter, (err, userList) => {
    if(err) res.status(400).json({msg: `get all users error`});
    if(!userList) res.status(404).json({msg: `users not found`});
    else {
      console.log('find userList 성공');
      return res.status(200).json({userList});
    }
  })
})

// get a user by userName
router.get('/userName/:userName', (req, res) => {
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
router.get('/userName/:userName/friendsInfo', (req, res) => {
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
router.get('/userName/:userName/commit', (req, res) => {
  const result = getCommitByCrawling(req.params.userName);
  return res.status(200).json(result['crawledCommits']);
})

// get totalCommits by userName

router.get('/userName/:userName/stats', (req, res) => {
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

module.exports = router;