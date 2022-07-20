const axios = require('axios');
const formatMessage = require('../formatMessage/timesheets');

const timesheetsCommand = app => async ({ command, ack, respond }) => {
  await ack();

  const dates = command.text.trim().split('-');
  const username = command.user_name;

  if (!dates || dates.length !== 2) {
    return respond({
      response_type: 'ephemeral',
      text: `You have to specify dates. For example: /macys_timesheets 01/03/2022-25/03/2022`
    });
  }

  try {
    const { data } = await axios.post(process.env.ENDPOINT, {
      dateFrom: dates[0],
      dateTo: dates[1],
      username
    });

    const { success, errorMsg, result } = data;

    if (!success) throw new Error(errorMsg || 'Unhandled error');

    const users = await Promise.all(result.map(async (rawUser) => {
      let slackUsername;
      try {
        const { user } = await app.client.users.lookupByEmail({ email: rawUser.email });
        slackUsername = user.name;
      } catch(error) {
        slackUsername = rawUser.email.split('@')[0];
      }
      return await { ...rawUser, slackUsername };
    }));
  
    respond({
      mrkdwn: true,
      blocks: formatMessage(users),
      text: 'Timesheets reminder',
      response_type: 'in_channel',
    });

  } catch (error) {
    respond({
      response_type: 'ephemeral',
      text: error.message
    });
  }
}

module.exports = timesheetsCommand;
