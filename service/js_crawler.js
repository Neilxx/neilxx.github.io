const puppeteer = require('puppeteer');
const fs = require('fs/promises');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

(async () => {
  const CITIES = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '臺東縣', '花蓮縣', '宜蘭縣', '澎湖縣', '金門縣', '連江縣']
  const browser = await puppeteer.launch();
  const webPage = await browser.newPage();
  const postBoxes = {};

  for (const city of CITIES) {
    let page = 1;
    while (page < 1000) {
      const url = `https://www.post.gov.tw/post/internet/I_location/index.jsp?topage=${page}&PreRowDatas=10&city=${city}&city_area=&ID=190106&village=&addr=`
      await webPage.goto(encodeURI(url));
      const rows = await webPage.$$('table > tbody > tr');
      if (rows.length === 0) break;

      rows.shift();   // 第一行是 header
      for (const row of rows) {
        const texts = await row.$$eval('td', (nodes) => nodes.map((n) => n.innerText));
        const [_icon, district, address, _map, postBoxType, department, phone, note] = texts.map(text => text.trim());
        const fullAddress = `${city}${district}${address}`;
        //TODO: should considering same address with different post box type
        postBoxes.push({ city, district, address, postBoxType, department, phone, note, fullAddress });
        console.log(city, district, address);
      }

      await delay(1000);
    }
  }

  await browser.close();
  await fs.writeFile('post-boxes-data.json', JSON.stringify(postBoxes));
})();
