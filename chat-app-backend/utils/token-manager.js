const jwt = require('jsonwebtoken');

const generateAccessToken = async (user) => {
  try {
    const accessToken = jwt.sign(
      { user: { displayName: user.displayName, _id: user._id } },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXP,
      }
    );
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

const generateRefreshToken = async (user, res) => {
  try {
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_EXP,
    });
    const rt = jwt.decode(refreshToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + (rt.exp - rt.iat) * 1000),
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    return refreshToken;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateAccessToken, generateRefreshToken };
