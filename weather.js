const axios = require('axios');

async function getWeather() {
  const response = await axios.get('https://apis.thaiskyward.com/v1/weather/13.7563,100.5018/?api_key=YOUR_API_KEY');
  const weather = response.data.nowcasting;
  return `พยากรณ์อากาศวันนี้:\nอุณหภูมิ: ${weather.temperature}°C\nความชื้น: ${weather.humidity}%\nสภาพอากาศ: ${weather.description}`;
}

module.exports = { getWeather };
