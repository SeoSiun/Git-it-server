const express = require('express');
const router = express.Router();
const User = require('./user');
const {getCommitByCrawling} = require('./gitCrawler.js');


router.use('/user', User);

// get a commitInfo by name
router.get('/commit/:userName', (req, res) => {
  getCommitByCrawling(req.params.userName, function(result){
    return res.status(200).json(result);
  });
})

router.get('/', function(req, res, next) {
    res.send('hello world!')
});

module.exports = router;