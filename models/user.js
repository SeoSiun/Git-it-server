
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  userName: {type: String, unique: true, required: true}, // user name
  school: String, // school
  friends: [{type: String, ref: this}],
  // statsId: {type: Schema.Types.ObjectId, ref: 'Stats'},
  image: { data: Buffer, contentType: String}, // profile image
  tier: String, // tier by number of commits
  totalCommits: Number, // commits for a year
  average: Number,  // totalCommits/365
  streak: Number, // consecutive days
  rank: Number, // rank of shcool
});

module.exports = mongoose.model('User', user);

/* 고민들 */
// 1. friends를 이름만 저장할까?
// 그럼 그냥 이름 불러와서 그거로 찾아와서 정보 전달하면 됨
// 저장할 때도 이름만
// 문제는 저장할 때 존재하는 유저인지 확인 -> 다 돌려서 확인해야될 듯 -> 오래걸릴까?

// 2. reference 유지하면
// 한번에 정보까지 불러올 수 있음
// 얘는 없는 id면 안된다고 해버리면 된다.

// 당장 할 수 있는건 1번
// 2번을 더 찾아보고 안되면 1번으로 하는게 좋을 것 같은데
// 나중에 바꾸는게 좋을까?