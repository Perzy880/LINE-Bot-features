const line = require('@line/bot-sdk');
const axios = require('axios');

// LINE Bot configuration
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

// Express-compatible handler function
exports.handler = async (req, res) => {
  const event = req.body.events[0];
  const message = event.message.text;

  if (message === 'เมนู') {
    await client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: 'เมนูหลัก',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'กรุณาเลือกเมนู',
              weight: 'bold',
              size: 'md',
              margin: 'md'
            },
            {
              type: 'button',
              action: {
                type: 'message',
                label: 'ราคาทอง',
                text: 'ราคาทอง'
              },
              style: 'primary',
              margin: 'md'
            }
          ]
        }
      }
    });
    return res.status(200).end();
  }

  if (message === 'ราคาทอง') {
    try {
      const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
      const data = response.data.response;
      const gold = data.price.gold;
      const goldBar = data.price.gold_bar;
      const date = data.date;
      const time = data.update_time;

      await client.replyMessage(event.replyToken, {
        type: 'flex',
        altText: 'ราคาทองวันนี้',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'ราคาทองวันนี้',
                weight: 'bold',
                size: 'md',
                margin: 'md'
              },
              {
                type: 'text',
                text: `ทองรูปพรรณ ขายออก: ${gold.sell} บาท`,
                margin: 'sm'
              },
              {
                type: 'text',
                text: `ทองรูปพรรณ รับซื้อ: ${gold.buy} บาท`,
                margin: 'sm'
              },
              {
                type: 'text',
                text: `ทองคำแท่ง ขายออก: ${goldBar.sell} บาท`,
                margin: 'sm'
              },
              {
                type: 'text',
                text: `ทองคำแท่ง รับซื้อ: ${goldBar.buy} บาท`,
                margin: 'sm'
              },
              {
                type: 'text',
                text: `ปรับล่าสุด: ${date} ${time}`,
                margin: 'sm',
                size: 'xs',
                color: '#888888'
              }
            ]
          }
        }
      });
      return res.status(200).end();
    } catch (error) {
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดึงข้อมูลราคาทองได้ในขณะนี้'
      });
      return res.status(200).end();
    }
  }

  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'กรุณาพิมพ์ "เมนู" เพื่อเริ่มต้น'
  });
  return res.status(200).end();
};
