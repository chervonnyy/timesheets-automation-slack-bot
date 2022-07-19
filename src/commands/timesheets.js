const axios = require('axios');
const formatMessage = require('../formatMessage/timesheets');

const timesheetsCommand = app => async ({ command, ack, respond, say }) => {
  await ack();

  const dates = command.text.trim().split('-');
  const username = command.user_name;

  if (!dates || dates.length !== 2) {
    return respond({
      response_type: 'ephemeral',
      text: `You have to specify dates. For example: /macys_timesheets 01/07/22-25/07/22`
    });
  }

  try {
    const { success, errorMsg, result } = await axios.post(process.env.ENDPOINT, {
      dateFrom: dates[0],
      dateTo: dates[1],
      username
    }, {
      cmd: 'whoNotSubmit'
    });

    if (!success) throw new Error(errorMsg || 'Unhandled error');

    const users = await Promise.all(result.map(async (rawUser) => {
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
