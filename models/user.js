
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  userName: {type: String, unique: true, required: true}, // user name
  school: String, // school
  friends: [{type: String, ref: this}],
  // statsId: {type: Schema.Types.ObjectId, ref: 'Stats'},
  imageUrl: String, // profile image
  tier: String, // tier by number of commits
  totalCommits: Number, // commits for a year
  average: Number,  // totalCommits/365
  streak: Number, // consecutive days
  rank: Number, // rank of shcool
});

module.exports = mongoose.model('User', user);