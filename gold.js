
const axios = require('axios');

/**
 * Function to fetch gold prices and return a formatted message
 * @returns {Promise<string>} - Formatted gold price message
 */
async function getGoldPriceMessage() {
  try {
    const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
    const data = response.data;

    const message = `📈 ราคาทองคำวันนี้ (${data.date} ${data.update_time})\n` +
                    `\n🟡 ทองคำแท่ง 96.5%\n` +
                    `ซื้อเข้า: ${data.gold.buy.toLocaleString()} บาท\n` +
                    `ขายออก: ${data.gold.sell.toLocaleString()} บาท\n` +
                    `\n💍 ทองรูปพรรณ 96.5%\n` +
                    `ซื้อเข้า: ${data.gold_jewelry.buy.toLocaleString()} บาท\n` +
                    `ขายออก: ${data.gold_jewelry.sell.toLocaleString()} บาท`;

    return message;
  } catch (error) {
    console.error('Error fetching gold price:', error.message);
    return '❌ ไม่สามารถดึงข้อมูลราคาทองคำได้ในขณะนี้';
  }
}

module.exports = { getGoldPriceMessage };
