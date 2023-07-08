const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connect = (url) => mongoose.connect(url);

module.exports = connect;
