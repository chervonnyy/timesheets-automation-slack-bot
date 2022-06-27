const { App } = require('@slack/bolt');
const axios = require('axios');
const formatMessage = require('./formatMessage');

// needed to read tokents from .env file
require('dotenv').config();

const managers = ['U03HNULJ142', 'U03H5UPDPE0'];
const endpoint = 'https://6287-97-65-3-142.ngrok.io';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,  
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command('/macys_timesheets', async ({ command, ack, respond }) => {

  const userID = command.user_id;
  const period = command.text;
  const access = managers.includes(userID);

  console.log(`Command triggered by ${command.user_name}, access: ${access}`);

  if (!access) return;

  const { data } = await axios.get(`${endpoint}/timesheets`, { params: { period }});

  const users = await Promise.all(data.map(async (rawUser) => {
    const { user } = await app.client.users.lookupByEmail({ email: rawUser.email });
    return await { ...rawUser, slackUsername: user.name };
  }));

  await ack();

  await respond({
    mrkdwn: true,
    blocks: formatMessage(users),
    text: 'Timesheets reminder',
  })
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');

  const { members } = await app.client.users.list();
  console.log('Slack team is:')
  members.forEach(user => console.log(`${user.name}: ${user.id}`));
})();
