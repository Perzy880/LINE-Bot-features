const line = require('@line/bot-sdk');
const axios = require('axios');

// LINE Bot configuration
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

// Main handler function
exports.handler = async (event) => {
  const message = event.events[0].message.text;

  if (message === 'เมนู') {
    return client.replyMessage(event.events[0].replyToken, {
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
  }

  if (message === 'ราคาทอง') {
    try {
      const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
      const goldData = response.data.response.price;

      return client.replyMessage(event.events[0].replyToken, {
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
                text: `ทองรูปพรรณ ขายออก: ${goldData.gold.sell} บาท`,
            margin: 'sm'
          },
          {
            type: 'text',
            text: `ทองรูปพรรณ รับซื้อ: ${goldData.gold.buy} บาท`
          },
          {
            type: 'text',
            text: `ทองคำแท่ง ขายออก: ${goldData.gold_bar.sell} บาท`,
            margin: 'sm'
          },
          {
            type: 'text',
            text: `ทองคำแท่ง รับซื้อ: ${goldData.gold_bar.buy} บาท`,
                margin: 'sm'
              },
              {
                type: 'text',
                text: `ปรับล่าสุด: ${goldData.update}`,
                margin: 'sm',
                size: 'xs',
                color: '#888888'
              }
            ]
          }
        }
      });
    } catch (error) {
      return client.replyMessage(event.events[0].replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถดึงข้อมูลราคาทองได้ในขณะนี้'
      });
    }
  }

  return client.replyMessage(event.events[0].replyToken, {
    type: 'text',
    text: 'กรุณาพิมพ์ "เมนู" เพื่อเริ่มต้น'
  });
};
