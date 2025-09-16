const axios = require('axios');

async function getOilPrices() {
  const response = await axios.get('https://api.chnwt.dev/thai-oil-api/latest');
  const prices = response.data.stations.ptt;
  return `ราคาน้ำมันวันนี้:\nเบนซิน: ${prices.benzine} บาท\nแก๊สโซฮอล์ 95: ${prices.gasohol95} บาท\nE20: ${prices.e20} บาท\nE85: ${prices.e85} บาท\nดีเซล: ${prices.diesel} บาท`;
}

module.exports = { getOilPrices };
