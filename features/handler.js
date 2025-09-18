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

  if (message === 'ราคาทอง') {
    try {
      const response = await axios.get('https://api.chnwt.dev/thai-gold-api/latest');
      const data = response.data.response;
      const date = data.date;
      const time = data.update_time;
      const goldBar = data.price.gold_bar;
      const goldJewelry = data.price.gold;

      await client.replyMessage(event.replyToken, {
        type: 'flex',
        altText: 'ราคาทองคำ',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              {
                type: 'text',
                text: 'ราคาทองคำ',
                weight: 'bold',
                size: 'xl',
                align: 'center'
              },
              {
                type: 'text',
                text: `วันที่: ${date}`,
                size: 'sm',
                color: '#888888',
                align: 'center'
              },
              {
                type: 'text',
                text: `เวลาอัปเดต: ${time}`,
                size: 'sm',
                color: '#888888',
                align: 'center'
              },
              {
                type: 'separator',
                margin: 'md'
              },
              {
                type: 'text',
                text: 'ทองแท่ง',
                weight: 'bold',
                size: 'md',
                margin: 'md'
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: `ขายออก: ${goldBar.sell} บาท`,
                    size: 'sm',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: `รับซื้อ: ${goldBar.buy} บาท`,
                    size: 'sm',
                    flex: 1,
                    align: 'end'
                  }
                ]
              },
              {
                type: 'text',
                text: 'ทองรูปพรรณ',
                weight: 'bold',
                size: 'md',
                margin: 'md'
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: `ขายออก: ${goldJewelry.sell} บาท`,
                    size: 'sm',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: `รับซื้อ: ${goldJewelry.buy} บาท`,
                    size: 'sm',
                    flex: 1,
                    align: 'end'
                  }
                ]
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

  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'กรุณาพิมพ์ "เมนู" เพื่อเริ่มต้น'
  });
  return res.status(200).end();
};
