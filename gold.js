
const axios = require('axios');

exports.handler = async (event, context, callback) => {
  try {
    const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
    const data = response.data;

    const message = 
      `📅 วันที่: ${data.date} เวลา ${data.update_time}\n` +
      `🏅 ราคาทองคำวันนี้\n` +
      `ทองคำแท่ง 96.5%\n` +
      `• รับซื้อ: ${data.gold.buy} บาท\n` +
      `• ขายออก: ${data.gold.sell} บาท\n\n` +
      `ทองรูปพรรณ 96.5%\n` +
      `• รับซื้อ: ${data.gold_jewelry.buy.toFixed(2)} บาท\n` +
      `• ขายออก: ${data.gold_jewelry.sell} บาท`;

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        type: 'text',
        text: message
      })
    });
  } catch (error) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        type: 'text',
        text: '❌ ไม่สามารถดึงข้อมูลราคาทองคำได้ในขณะนี้'
      })
    });
  }
};
