const _ = require('lodash');
const fs = require('fs/promises');

(async () => {
  const postBoxes = JSON.parse(await fs.readFile('post-boxes-data.json'));
  const newPostBoxes = [];
  const groupedPostBox = _.groupBy(postBoxes, box => `${box.city}${box.district}${box.address}`);
  Object.values(groupedPostBox).forEach(postBoxes => {
    if (postBoxes.length === 1) {
      const postBox = postBoxes[0];
      postBox.postBoxType = postBox.postBoxType.split(',');
      newPostBoxes.push(postBox)
    } else {
      const postBox = postBoxes[0];
      postBox.postBoxType = _.uniq(postBoxes.map(postBox => postBox.postBoxType.split(',')).flat());
      newPostBoxes.push(postBox)
    }
  })
  console.log(newPostBoxes.length)
  await fs.writeFile('post-boxes-data-cleaned.json', JSON.stringify(newPostBoxes));
})()
