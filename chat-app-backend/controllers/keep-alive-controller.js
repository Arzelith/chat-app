const { asyncHandler } = require('../utils/async-handler');

const keepAlive = asyncHandler(async (req, res) => {
  return res.sendStatus(200);
});

module.exports = {
  keepAlive,
};
