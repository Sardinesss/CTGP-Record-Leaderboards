const fs = require('fs');

// Maximum number of times to retry a failed fetch
const FETCH_RETRIES_MAX = 3;

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
  console.log(`Fetching ${leaderboard.name} leaderboard index...`);
  const response = await fetch(leaderboard.url);
  const data = await response.json();

  const urlList = data["leaderboards"].map((lb) => "https://tt.chadsoft.co.uk" + lb["_links"]["item"]["href"] + "?limit=1");
  const promises = urlList.map(url => fetch(url).then(res => res.json()).catch(err => {err.url = url; throw err;}));

  console.log(`Fetching ${promises.length} individual ${leaderboard.name} leaderboards...`);
  const results = await Promise.allSettled(promises);

  const rejectedResults = results.filter(result => result.status === "rejected");

  if (rejectedResults.length === 0) {
    console.log(`All ${leaderboard.name} leaderboards fetched successfully.`);
  } else {
    for (let i = 0; i < FETCH_RETRIES_MAX; i++) {
      console.log(`Some ${leaderboard.name} leaderboards failed to fetch. Retrying (${i+1}/${FETCH_RETRIES_MAX})...`);

      const retryPromises = rejectedResults.map(res => fetch(res.reason.url).then(res => res.json().catch(err => {err.url = url; throw err;})));
      console.log(`Refetching ${retryPromises.length} individual ${leaderboard.name} leaderboards`);
      const retryResults = await Promise.allSettled(retryPromises);

      retryResults.forEach((newResult) => {
        if (newResult.status === "fulfilled") {
          const url = "https://tt.chadsoft.co.uk" + newResult.value["_links"]["self"]["href"] + "?limit=1";

          const oldResultIndex = results.findIndex(result => result?.reason?.url === url);
          results[oldResultIndex] = newResult;

          const rejectedIndex = rejectedResults.findIndex(result => result.reason.url === url);
          rejectedResults.splice(rejectedIndex, 1);
        }
      });

      if (rejectedResults.length === 0) {
        break;
      }
    }

    if (rejectedResults.length === 0) {
    console.log(`All ${leaderboard.name} leaderboards fetched successfully.`);
    } else {
      console.log(`${rejectedResults.length} ${leaderboard.name} leaderboards failed to fetch after ${FETCH_RETRIES_MAX} attempts.`);
    }
  }
  

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