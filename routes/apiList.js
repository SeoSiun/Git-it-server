const express = require('express');
const router = express.Router();

// api list
router.get("/", function (req, res, next) {
  res.render("list", {
    title: "api list",
    apilist: [
      // user
      {
        name: `${req.headers.host}/api/user/create`,
        description: "create a new user",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/:username`,
        description: "get a user info by username",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/:friendName/friend`,
        description: "get friend info by friendname",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/:username/stats`,
        description: "get commit info by username",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/:username/addFriend/:friendName`,
        description: "add friend to user",
        method: "put",
      },{
        name: `${req.headers.host}/api/user/:username/deleteFriend/:friendName`,
        description: "delete friend to user",
        method: "put",
      },
      {
        name: `${req.headers.host}/api/user/:username/delete`,
        description: "delete a user by username",
        method: "delete",
      },
    ],
  });
});

module.exports = router;