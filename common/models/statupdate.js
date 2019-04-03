/**
 *
 *
 * TRADE Aug 31 2018

 *
 */


const loopback = require('loopback');
const moment = require('moment');

const fs = require('fs');
const path = require('path');

const utils = require('../stat.utils');

const app = module.exports = loopback();

module.exports = function(Statupdate) {

  Statupdate.updatestats = function(cb) {
    const Roster = loopback.getModel('roster');
    const DailyBatterStat = loopback.getModel('dailybatterstat');
    const DailyPitcherStat = loopback.getModel('dailypitcherstat');
    const StatUpdate = loopback.getModel('statupdate');
    const HotHitter = loopback.getModel('hotHitter');

    let statsDate = new Date().getTime();
    let rostersArray = [];


    /**
     *
     *  GET ROSTERS
     *
     *
     * */
    Roster.find({}, function(err, dox) {
      if (err) {
        console.log('error finding rosters: ' + JSON.stringify(err));
      }
      rostersArray = dox;

      async function runTheStats() {
        // get the stats
        const ALPitchers = await utils.fetchALPitchers();
        const ALHitters = await utils.fetchALHitters();
        const NLHitters = await utils.fetchNLHitters();
        const NLPitchers = await utils.fetchNLPitchers();

        // parse the response into json
        const ALPitcherObj = JSON.parse(ALPitchers);
        const ALHitterObj = JSON.parse(ALHitters);
        const NLHitterObj = JSON.parse(NLHitters);
        const NLPitcherObj = JSON.parse(NLPitchers);

        // extract the relevant data
        const latestALPitchingStats = ALPitcherObj.stats_sortable_player.queryResults.row;
        const latestALHittingStats = ALHitterObj.stats_sortable_player.queryResults.row;
        const latestNLPitchingStats = NLPitcherObj.stats_sortable_player.queryResults.row;
        const latestNLHittingStats = NLHitterObj.stats_sortable_player.queryResults.row;

        // isolate NL players if necessary

        const NLHittersCollection = [];
        const NLPithersCollection = [];

        // get machado nl stats
        // const machadoNLStatsCollection = latestNLHittingStats.filter((player) => {
        //   return player.player_id === '592518';
        // });


        let NLHitterStatsCollection = [];
        let NLPitcherStatsCollection = [];

        latestNLHittingStats.map((player) => {
          NLHittersCollection.map((poolplayer_id) => {
            if (player.player_id === poolplayer_id) {
              NLHitterStatsCollection[player.player_id] = player;
            }
          })
        });
        latestNLPitchingStats.map((player) => {
          NLPithersCollection.map((poolplayer_id) => {
            if (player.player_id === poolplayer_id) {
              NLPitcherStatsCollection[player.player_id] = player;
            }
          })
        });


        // let machadoStats = null;
        // if (machadoNLStatsCollection[0]) {
        //   machadoStats = machadoNLStatsCollection[0];
        // }

        /*
         *
         *   Iterate over rosters / players
         *
         * */
        rostersArray.map((roster) => {
          // match the player bsaed on mlbid
          // build stat object
          // generate point totals
          // create record
          // lather, wash, rinse, repeat
          /*
          *
          * FILTER HITTERS AND PITCHER COLLECTIONS
          *
          * */
          const pitchers = roster.players.filter((player) => {
            return (player.posType === 'pitcher');
          });
          const hitters = roster.players.filter((player) => {
            return (player.posType === 'hitter');
          });


          /*
           *
           * HITTERS
           *
           * */
          hitters.map((hitter, index) => {
            let hitterStatPackageObj = {
              date: statsDate,
              lastUpdateTs: new Date().getTime(),
              lastUpdate: Date.now(),
              mlbid: hitter.mlbid,
              name: hitter.name,
              roster: roster.slug,
              status: hitter.status,
              draftStatus: hitter.draftStatus,
              team: hitter.team,
              pos: hitter.pos,

            };
            // set zeros
            if (!hitter.mlbid) {
              hitterStatPackageObj.r = 0;
              hitterStatPackageObj.h = 0;
              hitterStatPackageObj.rbi = 0;
              hitterStatPackageObj.hr = 0;
              hitterStatPackageObj.sb = 0;
            }
            else {

              // legit player
              const rawPlayerCollection = latestALHittingStats.filter((stat) => {
                if (stat.player_id === hitter.mlbid) {
                  // console.log('|');
                  // console.log('|');
                  // console.log('| match hitter', stat.name_display_first_last);
                  // console.log('|');
                  // console.log('|');
                  return stat.player_id;
                }

              });
              const rawPlayer = rawPlayerCollection[0];
              if (rawPlayer) {
                if (NLHitterStatsCollection[rawPlayer.player_id]) {
                  // console.log('|');
                  // console.log('|');
                  // console.log('| Add hitter', rawPlayer.name_display_first_last);
                  // console.log('|');
                  // console.log('|');
                  const nlHitter = NLHitterStatsCollection[rawPlayer.player_id];
                  hitterStatPackageObj.r = parseInt(rawPlayer.r) + parseInt(nlHitter.r);
                  hitterStatPackageObj.h = parseInt(rawPlayer.h) + parseInt(nlHitter.h);
                  hitterStatPackageObj.rbi = parseInt(rawPlayer.rbi) + parseInt(nlHitter.rbi);
                  hitterStatPackageObj.hr = parseInt(rawPlayer.hr) + parseInt(nlHitter.hr);
                  hitterStatPackageObj.sb = parseInt(rawPlayer.sb) + parseInt(nlHitter.sb);
                }
                else{
                  hitterStatPackageObj.r = parseInt(rawPlayer.r);
                  hitterStatPackageObj.h = parseInt(rawPlayer.h);
                  hitterStatPackageObj.rbi = parseInt(rawPlayer.rbi);
                  hitterStatPackageObj.hr = parseInt(rawPlayer.hr);
                  hitterStatPackageObj.sb = parseInt(rawPlayer.sb);
                }
                hitterStatPackageObj.total = utils.getHitterTotal(hitterStatPackageObj);
              }
              else {
                // player not in stats yet
                hitterStatPackageObj.r = 0;
                hitterStatPackageObj.h = 0;
                hitterStatPackageObj.rbi = 0;
                hitterStatPackageObj.hr = 0;
                hitterStatPackageObj.sb = 0;
              }

            }
            return DailyBatterStat.create(hitterStatPackageObj, function(err,response){
              if (err) {
                console.log('sad no stat: ' + JSON.stringify(response));
              }
              return response;
            });
          });

          /*
           *
           * PITCHERS
           *
           * */

          pitchers.map((pitcher, index) => {
            let pitcherStatPackageObj = {
              date: statsDate,
              lastUpdateTs: new Date().getTime(),
              lastUpdate: Date.now(),
              mlbid: pitcher.mlbid,
              name: pitcher.name,
              roster: roster.slug,
              status: pitcher.status,
              draftStatus: pitcher.draftStatus,
              team: pitcher.team,
              pos: pitcher.pos,

            };

            // set zeros
            if (!pitcher.mlbid) {
              pitcherStatPackageObj.w = 0;
              pitcherStatPackageObj.l = 0;
              pitcherStatPackageObj.k = 0;
              pitcherStatPackageObj.sv = 0;
              pitcherStatPackageObj.ip = 0;
              pitcherStatPackageObj.total = 0;

            }
            else {
              // legit player
              const rawPlayerCollection = latestALPitchingStats.filter((stat) => {
                return (stat.player_id === pitcher.mlbid);
              });
              const rawPlayer = rawPlayerCollection[0];

              if (rawPlayer) {

                if (NLPitcherStatsCollection[rawPlayer.player_id]) {
                  // console.log('|');
                  // console.log('|');
                  // console.log('| Add pitcher', rawPlayer.name_display_first_last);
                  // console.log('|');
                  // console.log('|');
                  const nlPitcher = NLPitcherStatsCollection[rawPlayer.player_id];
                  pitcherStatPackageObj.w = parseInt(rawPlayer.w) + parseInt(nlPitcher.w);
                  pitcherStatPackageObj.l = parseInt(rawPlayer.l) + parseInt(nlPitcher.l);
                  pitcherStatPackageObj.k = parseInt(rawPlayer.so) + parseInt(nlPitcher.so);
                  pitcherStatPackageObj.sv = parseInt(rawPlayer.sv) + parseInt(nlPitcher.sv);
                  pitcherStatPackageObj.ip = parseInt(rawPlayer.ip) + parseInt(nlPitcher.ip);
                }
                else{
                  pitcherStatPackageObj.w = parseInt(rawPlayer.w);
                  pitcherStatPackageObj.l = parseInt(rawPlayer.l);
                  pitcherStatPackageObj.k = parseInt(rawPlayer.so);
                  pitcherStatPackageObj.sv = parseInt(rawPlayer.sv);
                  pitcherStatPackageObj.ip = parseInt(rawPlayer.ip);



                }
                if (pitcher.pos.toLowerCase() == 'sp') {
                  pitcherStatPackageObj.total = utils.getStarterTotal(pitcherStatPackageObj);
                }
                else if (pitcher.pos.toLowerCase() === 'rp') {
                  pitcherStatPackageObj.total = utils.getCloserTotal(pitcherStatPackageObj);
                }

              }
              else {
                // players has id but not in stats
                pitcherStatPackageObj.w = 0;
                pitcherStatPackageObj.l = 0;
                pitcherStatPackageObj.k = 0;
                pitcherStatPackageObj.sv = 0;
                pitcherStatPackageObj.ip = 0;
                pitcherStatPackageObj.total = 0;
              }


            }
            return DailyPitcherStat.create(pitcherStatPackageObj, function(err,response){
              if (err) {
                console.log('sad no stat: ' + JSON.stringify(response));
              }
              return response;
            });

          });
        });

        /*
        *
        * STATS UPDATE METADATA
        *
        * */
        const statUpdateObj = {
          date:Date.now(),
          timestamp: new Date().getTime(),
          type:'stats-update'
        };

        /*
         *
         * MAKE NOTE OF STATS UPDATE METADATA
         *
         * */
        StatUpdate.create(statUpdateObj, function(err, response){
          if (err) {
            console.log('sad no stat update: ' + JSON.stringify(response));
          }
          cb(null, statUpdateObj);
        });
      }

      runTheStats();
    });



  };
  Statupdate.writedailystats = function(cb) {

    // find all dailybatterstat
    var DailyBatterStats = loopback.getModel('dailybatterstat');
    DailyBatterStats.find({}, function(err, response) {
      if (err) {
        return cb(err);
      }
      var data = JSON.toString(response);
      // heroku won't persist a written file
      //fs.writeFile('/client/www/dailybatterstats.json', data, function(err, data){
      //  if (err) {
      //    return cb(err);
      //  }
      //  return cb(null, 'Successfully Written to File.');
      //});
      return cb(null, 'ok');
    });

  };

  Statupdate.remoteMethod(
    'updatestats',
    {
      http: {path: '/updatestats', verb: 'get'},
      returns: {arg: 'data', type: 'string'}
    }
  );
  Statupdate.remoteMethod(
    'writedailystats',
    {
      http: {path: '/writedailystats', verb: 'get'},
      returns: {arg: 'data', type: 'string'}
    }
  );

};
