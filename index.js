const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const UPLOAD_SECRET = process.env.UPLOAD_SECRET || 'mysecurekey123';

// ตรวจสอบว่า Rich Menu มีอยู่แล้วหรือไม่
async function checkExistingRichMenus() {
  try {
    const response = await axios.get('https://api.line.me/v2/bot/richmenu/list', {
      headers: {
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
      }
    });
    return response.data.richmenus || [];
  } catch (error) {
    console.error('Error checking existing Rich Menus:', error.response?.data || error.message);
    return [];
  }
}

// สร้าง Rich Menu ใหม่
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

// อัปโหลดภาพ Rich Menu
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

// เชื่อม Rich Menu กับผู้ใช้ทั้งหมด
async function linkToAllUsers(richMenuId) {
  await axios.post(`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`, null, {
    headers: {
      'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
    }
  });
}

// Endpoint ปลอดภัยสำหรับอัปโหลด Rich Menu
app.get('/upload-richmenu', async (req, res) => {
  if (req.query.secret !== UPLOAD_SECRET) {
    return res.status(403).send('Forbidden: Invalid secret key');
  }

  try {
    const existingMenus = await checkExistingRichMenus();
    const alreadyExists = existingMenus.some(menu => menu.name === 'Main Menu');

    if (alreadyExists) {
	  const existingMenu = existingMenus.find(menu => menu.name === 'Main Menu');
	  await linkToAllUsers(existingMenu.richMenuId);
	  return res.send(`Rich Menu "Main Menu" already exists and has been linked to all users.`);
	}


    const richMenuId = await createRichMenu();
    await uploadImage(richMenuId);
    await linkToAllUsers(richMenuId);

    res.send(`Rich Menu created and linked: ${richMenuId}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).send('Error uploading Rich Menu');
  }
});

app.get('/', (req, res) => {
  res.send('LINE Bot is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
