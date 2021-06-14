const _ = require('lodash');
const fs = require('fs/promises');

// 相同地址可能會有多個郵箱 with 不同類別
// (async () => {
//   const postBoxes = JSON.parse(await fs.readFile('post-boxes-data.json'));
//   const newPostBoxes = [];
//   const groupedPostBox = _.groupBy(postBoxes, box => `${box.city}${box.district}${box.address}`);
//   Object.values(groupedPostBox).forEach(postBoxes => {
//     if (postBoxes.length === 1) {
//       const postBox = postBoxes[0];
//       postBox.postBoxType = postBox.postBoxType.split(',');
//       newPostBoxes.push(postBox)
//     } else {
//       const postBox = postBoxes[0];
//       postBox.postBoxType = _.uniq(postBoxes.map(postBox => postBox.postBoxType.split(',')).flat());
//       newPostBoxes.push(postBox)
//     }
//   })
//   console.log(newPostBoxes.length)
//   await fs.writeFile('post-boxes-data-cleaned.json', JSON.stringify(newPostBoxes));
// })()

// 相同地址可能會有多個郵箱 with 不同全名，要用 lat & lng 去對
// ex. 仁愛路四段505號 vs. 仁愛路4段505號
// ex. 屏東縣山腳里恆西路1巷32號(恆春郵局)
(async () => {
    const postBoxes = JSON.parse(await fs.readFile('post_boxes_with_latlng.json'));
    const newPostBoxes = [];
    const groupedPostBox = _.groupBy(postBoxes, box => `${box.lat}_${box.lng}`);
    Object.values(groupedPostBox).forEach(postBoxes => {
      if (postBoxes.length === 1) {
        const postBox = postBoxes[0];
        newPostBoxes.push(postBox)
      } else {
        const postBox = postBoxes[0];
        postBox.postBoxType = _.uniq(postBoxes.map(postBox => postBox.postBoxType).flat());
        newPostBoxes.push(postBox)
      }
    })
    console.log(newPostBoxes.length)
    await fs.writeFile('post-boxes-data-cleaned.json', JSON.stringify(newPostBoxes));
  })()
