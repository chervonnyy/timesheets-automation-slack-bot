const { App, ExpressReceiver } = require('@slack/bolt');
const timesheetsCommand = require('./commands/timesheets');

// needed to read tokents from .env file
require('dotenv').config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// health check 
receiver.app.get('/', (_, res) => {
  // respond 200 OK to the default health check method
  res.status(200).send();
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,  
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const run = async (port) => {
  await app.start(process.env.PORT || port);
  await receiver.start(process.env.HELTHCHECK_PORT);
}

app.command('/macys_timesheets', timesheetsCommand(app));

run(3000);
