const axios = require('axios');
const formatMessage = require('../formatMessage/timesheets');

const timesheetsCommand = app => async ({ command, ack, respond, say }) => {
  await ack();

  const dates = command.text.trim();
  const username = command.user_name;

  if (!dates) {
    return respond({
      response_type: 'ephemeral',
      text: `You have to specify dates. For example: /macys_timesheets 01.07-25.07`
    });
  }

  try {
    const { data } = await axios.get(`${process.env.ENDPOINT}/timesheets`, { params: { dates, username }});

    const users = await Promise.all(data.map(async (rawUser) => {
      const { user } = await app.client.users.lookupByEmail({ email: rawUser.email });
      return await { ...rawUser, slackUsername: user.name };
    }));
  
    say({
      mrkdwn: true,
      blocks: formatMessage(users),
      text: 'Timesheets reminder',
    });

  } catch (error) {
    respond({
      response_type: 'ephemeral',
      text: error.message
    });
  }
}

module.exports = timesheetsCommand;
