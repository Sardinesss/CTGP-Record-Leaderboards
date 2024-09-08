const fs = require('fs');

let leaderboards = [
  {
    name: "150CTGP",
    url: "https://tt.chadsoft.co.uk/ctgp-leaderboards.json"
  },
  {
    name: "200CTGP",
    url: "https://tt.chadsoft.co.uk/ctgp-leaderboards-200cc.json"
  },
  {
    name: "200NIN",
    url: "https://tt.chadsoft.co.uk/original-track-leaderboards-200cc.json"
  },
];

leaderboards.forEach(async (leaderboard) => {
  const response = await fetch(leaderboard.url);
  const data = await response.json();

  const urlList = data["leaderboards"].map((lb) => "https://tt.chadsoft.co.uk" + lb["_links"]["item"]["href"] +'?limit=1');

  const promises = urlList.map(url => fetch(url).then(res => res.json()));
  const results = await Promise.allSettled(promises);

  const backupJson = {
    leaderboards: data["leaderboards"],
    lastUpdated: new Date()
  };

  const backupFilename = `Backup_${leaderboard.name}.json`;
  fs.writeFile(backupFilename, JSON.stringify(backupJson), (err) => {
    if (err) {
      console.error(`Failed to create ${backupFilename}:`, err);
    } else {
      console.log(`${backupFilename} created successfully.`);
    }
  });

  const recordsFilename = `Records_${leaderboard.name}.json`;
  fs.writeFile(recordsFilename, JSON.stringify(results), (err) => {
    if (err) {
      console.error(`Failed to create ${recordsFilename}:`, err);
    } else {
      console.log(`${recordsFilename} created successfully.`);
    }
  });
});