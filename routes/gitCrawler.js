const axios = require('axios');
const cheerio = require('cheerio');
var request = require('request');
var express = require('express');
var router = express.Router();

// 아이언, 브론즈, 실버, 골드, 다이아, 마스터, 챌린저
const TIER = {
  count: {
    challenger: 3000,
    master: 1500,
    diamond: 800,
    gold: 365,
    silver: 150,
    bronze: 60,
    iron: 0
  },
  getTier: function(totalCommit) {
    if(totalCommit >= this.count.challenger) return "챌린저";
    else if(totalCommit >= this.count.master) return "마스터";
    else if(totalCommit >= this.count.diamond) return "다이아";
    else if(totalCommit >= this.count.gold) return "골드";
    else if(totalCommit >= this.count.silver) return "실버";
    else if(totalCommit >= this.count.bronze) return "브론즈";
    else return "아이언";
  }
}

// 잔디에서 커밋내역 크롤링
router.get('/userName/:userName/commit', function(req, res) {
  const homeUrl = 'https://github.com/'.concat(req.params.userName);
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
      var totalCommit = 0;
      var maxCommitStreak = 0;

      $(".js-calendar-graph > svg > g > g > rect.ContributionCalendar-day").each(function(){
          commit = { 'date': '', 'count': 0, 'color': 0 };
          data = $(this);

          commit['date'] = data['0']['attribs']['data-date'];
          commit['count'] = data['0']['attribs']['data-count'];
          commit['color'] = data['0']['attribs']['data-level'];

          crawledCommits.push(commit);

          // 전체 커밋 수 계산
          totalCommit += commit['count'];

          // 최대 연속 커밋일 수 계산
          if(commit['count'] <= 0) maxCommitStreak = 0;
          else maxCommitStreak += 1;
      });
      if(!crawledCommits)
      {
          res.status(404).json("not found");
      }
      else 
      {
        console.log(crawledCommits);
        // res.status(200).json("crawled!");
        
        /* TODO */
        // 데이터베이스에 stats 저장하기
        const stats = {
          tier: TIER.getTier(totalCommit),         // tier by number of commits
          totalCommits: totalCommit,  // commits for a year
          average: totalCommit/365,   // totalCommits/365
          streak: maxCommitStreak,    // consecutive days

          /* TODO */
          // 이걸 여기서 어떻게 알아내지?
          // rank: "",                 // rank of shcool 
        }

        console.log(stats);

        return;
      }
      res.send.json(crawledCommits);
    }  
  })
});


// 깃허브에서 유저 이미지 url 크롤링
router.get('/userName/:userName/imageUrl', function(req, res) {
  const homeUrl = 'https://github.com/'.concat(req.params.userName);
  request(homeUrl, function(err, res, html) {
    if(err)
    {
        console.log("error");
        res.status = 400;
    }
    else{
      const $ = cheerio.load(html);

      $(".js-profile-editable-replace > div > div > a > img.avatar").each(function(){
        data = $(this);

        imageUrl = data['0']['attribs']['src'];

        console.log(imageUrl);
        return;
      });
    }  
  });
  res.send.json(imageUrl);
});

module.exports = router;