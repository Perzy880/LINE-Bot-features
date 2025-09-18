const axios = require('axios');
const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

module.exports = async function (req, res) {
  const events = req.body.events;
  for (const event of events) {
    const replyToken = event.replyToken;
    let messages = [];

    if (event.type === 'message') {
      const msg = event.message;

      if (msg.type === 'text') {
        const userMessage = msg.text.toLowerCase();
        let replyText = '';

        if (userMessage.includes('เมนูวันนี้')) {
          messages.push({
            type: 'flex',
            altText: 'ข้อมูลวันนี้: ราคาทองคำ ราคาน้ำมัน และพยากรณ์อากาศ',
contents: {"type": "carousel", "contents": [{"type": "bubble", "header": {"type": "box", "layout": "vertical", "contents": [{"type": "text", "text": "📊 ราคาทองคำ", "weight": "bold", "size": "lg", "color": "#bfa14c"}]}, "body": {"type": "box", "layout": "vertical", "spacing": "sm", "contents": [{"type": "text", "text": "📅 วันที่: 16 กันยายน 2568", "size": "sm"}, {"type": "text", "text": "🕒 เวลาอัปเดต: เวลา 14:39 น.", "size": "sm"}, {"type": "separator"}, {"type": "text", "text": "🔹 ทองแท่ง", "weight": "bold"}, {"type": "text", "text": "• ขายออก: 55,250.00 บาท"}, {"type": "text", "text": "• รับซื้อ: 55,350.00 บาท"}, {"type": "text", "text": "🔸 ทองรูปพรรณ", "weight": "bold", "margin": "md"}, {"type": "text", "text": "• ขายออก: 54,151.52 บาท"}, {"type": "text", "text": "• รับซื้อ: 56,150.00 บาท"}]}}, {"type": "bubble", "header": {"type": "box", "layout": "vertical", "contents": [{"type": "text", "text": "⛽ ราคาน้ำมัน", "weight": "bold", "size": "lg", "color": "#00bfa5"}]}, "body": {"type": "box", "layout": "vertical", "spacing": "sm", "contents": [{"type": "text", "text": "เบนซิน: 41.24 บาท/ลิตร"}, {"type": "text", "text": "แก๊สโซฮอล์ 95: 32.95 บาท/ลิตร"}, {"type": "text", "text": "E20: 30.74 บาท/ลิตร"}, {"type": "text", "text": "E85: 28.69 บาท/ลิตร"}, {"type": "text", "text": "แก๊สโซฮอล์ 91: 32.58 บาท/ลิตร"}, {"type": "text", "text": "ดีเซล B7: 31.94 บาท/ลิตร"}, {"type": "text", "text": "ดีเซลพรีเมียม: 43.94 บาท/ลิตร"}, {"type": "text", "text": "NGV: 17.08 บาท/กิโลกรัม"}]}}, {"type": "bubble", "header": {"type": "box", "layout": "vertical", "contents": [{"type": "text", "text": "🌤 พยากรณ์อากาศ", "weight": "bold", "size": "lg", "color": "#2196f3"}]}, "body": {"type": "box", "layout": "vertical", "spacing": "sm", "contents": [{"type": "text", "text": "📍 กรุงเทพฯ"}, {"type": "text", "text": "🌡 อุณหภูมิ: 32°C"}, {"type": "text", "text": "💧 ความชื้น: 70%"}, {"type": "text", "text": "🌥 สภาพอากาศ: เมฆบางส่วน"}]}}]}
          });
        } else {
          replyText = `คุณพิมพ์ว่า: ${msg.text}`;
          messages.push({ type: 'text', text: replyText });
        }
      }
    }

    if (messages.length > 0) {
      await axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: messages
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      });
    }
  }

  res.sendStatus(200);
};
