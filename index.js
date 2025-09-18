
const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./features/handler');

const app = express();

app.use(bodyParser.json());

app.post('/webhook', handler.handler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
