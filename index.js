const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const handler = require('./features/handler');

const app = express();
app.use(bodyParser.json());

//const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

//app.post('/webhook', async (req, res) => {
 // const events = req.body.events;
  //for (const event of events) {
  //  if (event.type === 'message' && event.message.type === 'text') {
  //    await handler.handleMessage(event, ACCESS_TOKEN);
  //  }
 // }
 // res.sendStatus(200);
//});

// เรียก handler โดยตรง
app.post('/webhook', handler);

app.get('/', (req, res) => {
  res.send('LINE Bot is running!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
