const axios = require('axios');

async function getWeather(lat = 13.7563, lon = 100.5018) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: 'd3c39e210bf80691ddc15c9f4c12d36c',
        units: 'metric',
        lang: 'th'
      }
    });

    const data = response.data;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const location = data.name;

    return `พยากรณ์อากาศที่ ${location}:
อุณหภูมิ: ${temp}°C
ความชื้น: ${humidity}%
สภาพอากาศ: ${description}`;
  } catch (error) {
    return 'ไม่สามารถดึงข้อมูลพยากรณ์อากาศได้ในขณะนี้';
  }
}

module.exports = { getWeather };
