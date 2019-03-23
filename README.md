# Pool 2019

Time for baseball!!

migration from 2018 notes  

overall should be pretty straight:
- set up pool2019 in heroku
- added db
- forked project and renamed as 2019
- add db config
- confirm everything runs
- update call to mlb for current year

- grab relevant data from db
- so far it seems roster is the only key data set
- mongo docs from 2018:
| collection | total records | notes |
| ---------- | ------------- | ----- |
| roster     |  4            | this is the key data set as it has current roster info |
| dailybatterstat | 14,390 | updated daily with latest stats |
| dailypitcherstats | 8000 | updated daily with latest stats |
| draftpick | 80 | stores record of draft - probably not needed to seed new season |
| rankSnapshot | 552 | calculated during season to give highlight tables |
| statupdate | 183 | record of when stat updates happen |
| totals | 583 | record of latest calculated totals |


