const axios = require('axios');
const cheerio = require('cheerio');
var request = require('request');
var express = require('express');
var router = express.Router();

// 잔디에서 데이터 크롤링
var userName = 'gyuree-kim';
const homeUrl = 'https://github.com/'.concat(userName);
router.get('/', function(req, res) {
    request(homeUrl, function(err, res, html) {
        if(err)
        {
            console.log("error");
            res.status = 400;
        }
        else{
          const $ = cheerio.load(html);
          var crawledCommits = [];
          var data;
          var commit;
          var imageUrl;

          // 잔디에서 커밋내역 가져오기.
          $(".js-calendar-graph > svg > g > g > rect.ContributionCalendar-day").each(function(){
              commit = { 'date': '', 'count': 0, 'color': 0 };
              data = $(this);

              commit['date'] = data['0']['attribs']['data-date'];
              commit['count'] = data['0']['attribs']['data-count'];
              commit['color'] = data['0']['attribs']['data-level'];

              crawledCommits.push(commit);
          });
          if(!crawledCommits)
          {
              res.status(404).json("not found");
          }
          else 
          {
              console.log(crawledCommits);
              // res.status(200).json("crawled!");
              // res.send(crawledCommits);
          }

          // 유저 이미지 가져오기
          $(".js-profile-editable-replace > div > div > a > img.avatar").each(function(){
            data = $(this);

            imageUrl = data['0']['attribs']['src'];

            console.log(imageUrl);
          });
        } 
    })
});

module.exports = router;