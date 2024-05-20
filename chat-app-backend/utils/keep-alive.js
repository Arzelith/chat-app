const cron = require('cron');
const http = require('http');
const https = require('https');

const dotenv = require('dotenv');
dotenv.config();
const protocol = () => (process.env.NODE_ENV !== 'production' ? http : https);

const backendUrl = process.env.KEEP_ALIVE_URL;
const job = new cron.CronJob('*/14 * * * *', function () {
  try {
    console.log('reiniciando server');
    protocol().get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('servidor reiniciado');
      } else {
        console.error(`fallo en reinicio: código: ${res.statusCode}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  job,
};
