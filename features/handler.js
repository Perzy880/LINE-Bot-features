
const axios = require('axios');

const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const WEATHER_API_KEY = process.env.API_KEY;

async function getOilPrices() {
  try {
    const response = await axios.get('https://api.chnwt.dev/thai-oil-api/latest');
    const prices = response.data.stations.ptt;
    return `ราคาน้ำมันวันนี้:\nเบนซิน: ${prices.benzine} บาท\nแก๊สโซฮอล์ 95: ${prices.gasohol95} บาท\nE20: ${prices.e20} บาท\nE85: ${prices.e85} บาท\nดีเซล: ${prices.diesel} บาท`;
  } catch (error) {
    return 'ไม่สามารถดึงข้อมูลราคาน้ำมันได้ในขณะนี้';
  }
}

async function getWeather(lat = 13.7563, lon = 100.5018) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric',
        lang: 'th'
      }
    });
    const data = response.data;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const location = data.name;
    return `พยากรณ์อากาศที่ ${location}:\nอุณหภูมิ: ${temp}°C\nความชื้น: ${humidity}%\nสภาพอากาศ: ${description}`;
  } catch (error) {
    return 'ไม่สามารถดึงข้อมูลพยากรณ์อากาศได้ในขณะนี้';
  }
}

//async function getGoldPrices() {
//  try {
//    const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
//    const goldBar = response.data.response.price.gold_bar;
//    const goldJewelry = response.data.response.price.gold;
//    return `ราคาทองคำวันนี้:\nทองแท่ง รับซื้อ: ${goldBar.sell} บาท / ขายออก: ${goldBar.buy} บาท\nทองรูปพรรณ รับซื้อ: ${goldJewelry.sell} บาท / ขายออก: ${goldJewelry.buy} บาท`;
//  } catch (error) {
//    return 'ไม่สามารถดึงข้อมูลราคาทองคำได้ในขณะนี้';
//  }
//}

async function getGoldPrices() {
  try {
    const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
    const data = response.data.response;
    const goldBar = data.price.gold_bar;
    const goldJewelry = data.price.gold;
    const date = data.date;
    const time = data.update_time;

    return `📅 วันที่: ${date}
🕒 เวลาอัปเดต: ${time}

🏅 ราคาทองคำวันนี้
🔹 ทองแท่ง
   • รับซื้อ: ${goldBar.sell} บาท
   • ขายออก: ${goldBar.buy} บาท

🔸 ทองรูปพรรณ
   • รับซื้อ: ${goldJewelry.sell} บาท
   • ขายออก: ${goldJewelry.buy} บาท`;
  } catch (error) {
    return 'ไม่สามารถดึงข้อมูลราคาทองคำได้ในขณะนี้';
  }
}


function getMenuFlex() {
  return {
    type: 'flex',
    altText: 'เมนูข้อมูลวันนี้',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'คุณต้องการดูข้อมูลอะไร?',
            weight: 'bold',
            size: 'lg',
            margin: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'ราคาน้ำมัน',
              text: 'ราคาน้ำมัน'
            },
            style: 'primary',
            margin: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'พยากรณ์อากาศ',
              text: 'อากาศวันนี้'
            },
            style: 'primary',
            margin: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'ราคาทองคำ',
              text: 'ราคาทอง'
            },
            style: 'primary',
            margin: 'md'
          }
        ]
      }
    }
  };
}

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

        if (userMessage.includes('เมนู')) {
          messages.push(getMenuFlex());
        } else if (userMessage.includes('ราคาน้ำมัน')) {
          replyText = await getOilPrices();
          messages.push({ type: 'text', text: replyText });
        } else if (userMessage.includes('อากาศ')) {
          replyText = await getWeather();
          messages.push({ type: 'text', text: replyText });
        } else if (userMessage.includes('ราคาทอง')) {
          replyText = await getGoldPrices();
          messages.push({ type: 'text', text: replyText });
        } else {
          replyText = `คุณพิมพ์ว่า: ${msg.text}`;
          messages.push({ type: 'text', text: replyText });
        }
      } else if (msg.type === 'location') {
        const lat = msg.latitude;
        const lon = msg.longitude;
        const text = await getWeather(lat, lon);
        messages.push({ type: 'text', text });
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
