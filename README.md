# CTGP Time Trial Record Leaderboard

The goal of this project was to automate a lot of work which was previously done manually. The problem with the CTGP website is that all tracks are seperated and there are no stats whatsoever. Many people including myself like looking at all tracks records in one location. There used to be a spreadsheet which was updated regularly to show records and some stats in one location, but interest in updating the spreadsheet became very low. Thats why I created the website to automatically display up-to-date time trial records. Another problem with the CTGP website is that there is no player names associated with time-trials, instead there is only a playerID. Players may have more than 1 playerID for a variety of reasons, so to give credit to the record holders, a database of playerIDs, player names, and their countries was created.

Previous iterations of this project fetched all data when the site was loaded however we have transitioned to a database housed on github that is updated twice daily through github actions. Huge shout out to Ice for doing the proof of concept and main implemention of this improvement.

# Features

Now there are leaderboards for all the custom tracks(150cc and 200cc) and 200cc Nintendo track records. Some stats that are calculated are Top 10 longest standing records, Pie charts which have all the used characters and vehicles, as well as bar charts showing how many records each person has at a given time or how many records a nation has. All graphs are rendered through ApexCharts. There is also a search functionality which hides table rows based on matching values within the row. Exclusive Search will only match when the inputted search paramater matches the beginning of the table value.

Another feature is the player lookup which searches through the player data and returns their playerID and a link to their chadsoft players page. If a player is linked with multiple playerIDs, it will return all.

# CTGP API Documentation

The CTGP API which is used throughout the website has no official documentation so I decided to share what I've learned over time while creating this project. The API is hosted at https://tt.chadsoft.co.uk. The main endpoint is located at [index.json](https://tt.chadsoft.co.uk/index.json). 

<img src="website/images/indexCTGP.png" height=600>

There is not much here except there are links to the main leaderboards we want. The main custom track leaderboard is [ctgp-leaderboards.json](https://tt.chadsoft.co.uk/ctgp-leaderboards.json)

<img src="website/images/leaderboardCTGP.png" height=600>

This contains a link to itself as well as an array called leaderboards. This array is sorted alphabetically by track name and contains some basic information about the tracks like the record time and record UTC time stamp but is missing important details about records themselves. The information is within the leaderboards."track number you want"._links.item.href location. The time trial ghosts can only be found there.

Below is a sample of a ghost reference. This is contained in a json file which can be navigated to from the previous json. Ex. https://tt.chadsoft.co.uk/leaderboard/19/8C4EEED505F0862CBB490A0AC0BD334515895710/00.json

Here there is an array called ghosts which has every time trial ever finished on the track. It is sorted by fastest times first so the first entry will always be the track record.

<img src="website/images/ghostCTGP.png" height=600>

Here the important information like characterId, vehicleId, playerId, etc. can be found. PlayerId is used to match a real person to this record. The other Ids are only numbers and need to be converted to what they represent. In the code a switch case statement is used but I have also created a google doc [here](https://docs.google.com/spreadsheets/d/18iAJnUXEt7IZqJNB9cQhVR9s2IrUHRG7TXeKhDH7qM0/edit?usp=sharing).