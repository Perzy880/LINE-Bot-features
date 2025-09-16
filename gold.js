const axios = require('axios');

async function getGoldPrice() {
  const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
  const gold = response.data.response.price.gold;
  return `ราคาทองคำวันนี้:\nทองแท่ง รับซื้อ: ${gold.buy} บาท\nทองแท่ง ขายออก: ${gold.sell} บาท`;
}

module.exports = { getGoldPrice };
