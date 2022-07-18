const { App } = require('@slack/bolt');
const timesheetsCommand = require('./commands/timesheets');

// needed to read tokents from .env file
require('dotenv').config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,  
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const run = async (port) => {
  await app.start(process.env.PORT || port);
  console.log('⚡️ Bolt app is running!');
}

app.command('/macys_timesheets', timesheetsCommand(app));

run(3000);
