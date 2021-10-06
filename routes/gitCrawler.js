const cheerio = require('cheerio');
var request = require('request');
const User = require('../models/user.js');

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

// 잔디 커밋내역, 유저 이미지 url 크롤링
function getCommitByCrawling(userName, callback) {
  const homeUrl = 'https://github.com/'.concat(userName);
  request(homeUrl, function(err, _res, html) {
    if(err)
    {
        console.log("error");
    }
    else{
      const $ = cheerio.load(html);
      var crawledCommits = [];
      var data;
      var commit;
      var totalCommit = 0;
      var maxCommitStreak = 0;
      var imageUrl;

      $(".js-calendar-graph > svg > g > g > rect.ContributionCalendar-day").each(function(){
          data = $(this);
          
          commit = { 
            date: data['0']['attribs']['data-date'],
            count: Number(data['0']['attribs']['data-count']), 
            level: Number(data['0']['attribs']['data-level'])
          };

          crawledCommits.push(commit);

          // 전체 커밋 수 계산
          totalCommit += commit['count'];

          // 최대 연속 커밋일 수 계산
          if(commit['count'] <= 0) maxCommitStreak = 0;
          else maxCommitStreak += 1;
      });
      if(crawledCommits.length===0)
      {
        callback(null);
      }
      else 
      {
        $(".js-profile-editable-replace > div > div > a > img.avatar").each(function(){
          data = $(this);
  
          imageUrl = data['0']['attribs']['src'];
  
        });

        User.updateOne({ userName: userName }, { $set: { 
          tier: TIER.getTier(totalCommit),         // tier by number of commits
          totalCommits: totalCommit,  // commits for a year
          average: Math.round(totalCommit/365 * 10) / 10,   // totalCommits/365
          streak: maxCommitStreak,    // consecutive days
          imageUrl: imageUrl
         }}).exec();

        const result = {
          userName: userName,
          commitsRecord: crawledCommits,
          totalCommits: totalCommit
        }
        callback(result); 
      }
    } 
  })
};

function isUserInGithub(userName, callback){
  const homeUrl = 'https://github.com/'.concat(userName);
  request(homeUrl, function(err, _res, html) {
    var isExist = 0;
    if(err)
    {
        console.log("error");
    }
    else{
      const $ = cheerio.load(html);

      $(".js-profile-editable-replace > div > div > a > img.avatar").each(function(){
        isExist=1;
      });
    }
    callback(isExist);
  });
}


module.exports = {getCommitByCrawling, isUserInGithub};