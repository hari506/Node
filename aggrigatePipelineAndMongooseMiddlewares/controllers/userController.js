const fs = require('fs');

let users = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/userData.json`, 'utf-8')
);

exports.getUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      ...users,
    },
  });
};

exports.getUserById = (req, res) => {
  let id = req.params.id * 1;
  let user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({
      status: 'failed',
      message: 'User not Found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      ...user,
    },
  });
};
