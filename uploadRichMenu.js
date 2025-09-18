// uploadRichMenu.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function createRichMenu() {
  const richMenuData = {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "Main Menu",
    chatBarText: "เมนูหลัก",
    areas: [
      { bounds: { x: 0, y: 0, width: 833, height: 843 }, action: { type: "message", text: "PSHEA" } },
      { bounds: { x: 833, y: 0, width: 833, height: 843 }, action: { type: "message", text: "PDPA" } },
      { bounds: { x: 1666, y: 0, width: 834, height: 843 }, action: { type: "message", text: "เว็บไซต์" } },
      { bounds: { x: 0, y: 843, width: 833, height: 843 }, action: { type: "message", text: "ราคาทองคำ" } },
      { bounds: { x: 833, y: 843, width: 833, height: 843 }, action: { type: "message", text: "พยากรณ์อากาศ" } }
    ]
  };

  const response = await axios.post('https://api.line.me/v2/bot/richmenu', richMenuData, {
    headers: {
      'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.richMenuId;
}

async function uploadImage(richMenuId) {
  const imagePath = path.join(__dirname, 'rich_menu_6_buttons_2rows.png');
  const imageData = fs.readFileSync(imagePath);

  await axios.post(`https://api.line.me/v2/bot/richmenu/${richMenuId}/content`, imageData, {
    headers: {
      'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'image/png'
    }
  });
}

async function linkToAllUsers(richMenuId) {
  await axios.post(`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`, null, {
    headers: {
      'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
    }
  });
}

(async () => {
  try {
    const richMenuId = await createRichMenu();
    await uploadImage(richMenuId);
    await linkToAllUsers(richMenuId);
    console.log('Rich Menu uploaded and linked successfully!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
})();
