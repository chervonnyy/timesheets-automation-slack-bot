const blocks = require('./blocks.json');
const groupDates = require('../utils/groupDates');

const formatTimesheetsMessage = (data) => {
  const messageSections = [
    {
      ...blocks.header,
      text: {
        ...blocks.header.text,
        text: "Dear colleagues, please submit the missing timesheets in EBS and OA",
      }
    }, blocks.divider
  ];

  try {
    data.forEach(({ name, slackUsername, dates }) => {
      const getDates = (platform) => {
        return dates[platform] && dates[platform].length 
          ? `${platform.toUpperCase()}: ${groupDates(dates[platform])}.` : '';
      }
    
      const userName = slackUsername ? `${name} <@${slackUsername}>` : name;
      
      messageSections.push({ 
        ...blocks.plaintTextSection,
        "text": {
          ...blocks.plaintTextSection.text, 
          "text": `${userName} ${getDates('oa')} ${getDates('ebs')}`,
        },
      });
    });
  } catch (error) {
    console.log('Error while formatting data', error)
  }

  return messageSections;
}

module.exports = formatTimesheetsMessage;
