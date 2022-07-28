const axios = require('axios');
const formatMessage = require('../formatMessage/timesheets');
const spliceChunks = require('../utils/spliceChunks');

const timesheetsCommand = app => async ({ command, ack, respond }) => {
  await ack();

  const dates = command.text.trim().split('-');
  const username = command.user_name;

  if (!dates || dates.length !== 2) {
    return respond({
      response_type: 'ephemeral',
      text: `You have to specify dates. For example: /macys_timesheets 01/07/2022-05/07/2022`
    });
  }

  respond({
    response_type: 'ephemeral',
    text: `Your request for timesheets is processing, please wait.`
  });
  console.log(`Timesheeets request for dates: ${dates}`);

  try {
    const { data } = await axios.post(process.env.ENDPOINT, {
      dateFrom: dates[0],
      dateTo: dates[1],
      username
    });

    const { success, errorMsg, result } = data;

    console.log(`Recieved response, is succesful: ${success}`);
    console.log(success ? `Users length: ${result?.length}` : `Error: ${errorMsg}`)

    if (!success) throw new Error(errorMsg || 'Unhandled error');

    const users = await Promise.all(result.map(async (rawUser) => {
      try {
        const { user } = await app.client.users.lookupByEmail({ email: rawUser.email });
        return { ...rawUser, slackUsername: user.name };
      } catch(error) {
        return rawUser;
      }
    }));

    spliceChunks(users).forEach((chunk, i) => {
      // header skips for all messages except the first one 
      const skipHeader = Boolean(i);
      respond({
        mrkdwn: true,
        blocks: formatMessage(chunk, skipHeader),
        text: 'Timesheets reminder',
        response_type: 'in_channel',
      }); 
    }); 

  } catch (error) {
    console.log(`Failed with error: ${error}`);
    respond({
      response_type: 'ephemeral',
      text: error.message
    });
  }
}

module.exports = timesheetsCommand;
