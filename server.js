const http = require('http');
const { WebClient } = require('@slack/web-api');
const formatMessage = require('./formatMessage');

require('dotenv').config();

const slackToken = process.env.SLACK_TOKEN;
const conversationId = 'C03K63Y1UH4';

const slackClient = new WebClient(slackToken);

const server = http.createServer(async (req, res) => {
  if (req.url === '/timesheets' && req.method == 'POST') {

    let data = null;

    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      data = JSON.parse(Buffer.concat(buffers).toString());
    } catch (error) {
      console.log('Error while processing data', error)
    }

    if (data) {
      const result = await slackClient.chat.postMessage({
        channel: conversationId,
        text: 'Timesheets reminder',
        blocks: formatMessage(data)
      });
    
      console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(data));
    res.end();
  }
});

server.listen(3000);
console.log('server started at port 3000');
