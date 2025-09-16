const axios = require('axios');
const oil = require('./oil');
const weather = require('./weather');
const gold = require('./gold');
const menu = require('./menu');

async function handleMessage(event, ACCESS_TOKEN) {
  const replyToken = event.replyToken;
  const userMessage = event.message.text.toLowerCase();
  let messages = [];

  if (userMessage.includes('ราคาน้ำมัน')) {
    const text = await oil.getOilPrices();
    messages.push({ type: 'text', text });
  } else if (userMessage.includes('อากาศ')) {
    const text = await weather.getWeather();
    messages.push({ type: 'text', text });
  } else if (userMessage.includes('ราคาทอง')) {
    const text = await gold.getGoldPrice();
    messages.push({ type: 'text', text });
  } else if (userMessage.includes('เมนู')) {
    messages.push(menu.getMenu());
  } else {
    messages.push({ type: 'text', text: `คุณพิมพ์ว่า: ${event.message.text}` });
  }

  await axios.post('https://api.line.me/v2/bot/message/reply', {
    replyToken,
    messages
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  });
}

module.exports = { handleMessage };
