const puppeteer = require('puppeteer');
const fs = require('fs/promises');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

(async () => {
  const postBoxes = JSON.parse(await fs.readFile('post-boxes-data-cleaned.json'));
  const errorAddress = [];
  const browser = await puppeteer.launch();
  const webPage = await browser.newPage();

  for (const postBox of postBoxes) {
    const { city, district, address } = postBox;
    const fullAddress = `${city}${district}${address}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=AIzaSyCNP4jQWUEkD-YM19j20D5fkM2XY0TLksc`;

    try {
      await webPage.goto(encodeURI(url));
      const data = JSON.parse(await webPage.$eval('body', el => el.innerText));
      postBox.fullAddress = fullAddress;
      postBox.lat = data.results[0].geometry.location.lat;
      postBox.lng = data.results[0].geometry.location.lng;
    } catch (err) {
      postBox.fullAddress = fullAddress;
      errorAddress.push(fullAddress);
    }
    console.log(fullAddress)
  }

  await browser.close();
  await fs.writeFile('post-boxes-data-with-lat-lng.json', JSON.stringify(postBoxes));
  await fs.writeFile('error.json', JSON.stringify(errorAddress));
})();
