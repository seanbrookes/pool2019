var loopback = require('loopback');
var moment = require('moment');
var request = require('request');
var fs = require('fs');
var path = require('path');

var utils = require('../stat.utils');
const {
  getHitterTotal,
  getStarterTotal,
  getCloserTotal,
} = require('../stat.utils');

var app = module.exports = loopback();

//var battersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2014&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=1&recPP=900";
//var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2014&sort_order='asc'&sort_column='era'&stat_type=pitching&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&position='1'&recSP=1&recPP=900";

module.exports = function(Statupdate) {


  //var battersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2015&sort_order=%27desc%27&sort_column=%27avg%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999"; 
  // var battersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27g%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999";
  // var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999";
  // var nlPitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27NL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999";
  // var nlBattersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27g%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27NL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999";
  var battersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2019&sort_order=%27desc%27&sort_column=%27g%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999";
  var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2019&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999";
  var nlPitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2019&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27NL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999";
  var nlBattersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2019&sort_order=%27desc%27&sort_column=%27g%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27NL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999";



  Statupdate.updatestats = function(cb) {
    var Roster = loopback.getModel('roster');
    var DailyBatterStat = loopback.getModel('dailybatterstat');
    var DailyPitcherStat = loopback.getModel('dailypitcherstat');
    var StatUpdate = loopback.getModel('statupdate');
    var HotHitter = loopback.getModel('hotHitter');


    var latestPitchingStats = [];
    var hotHitters = [];
    var latestHittingStats = [];
    var NLlatestHittingStats = [];
    var pitchingStatCount = 0;
    var NLhittingStatCount = 0;
    var hittingStatCount = 0;
    var statsDate = Date.now();
    var rostersArray = [];
    var rosterNameArray = ['bashers', 'mashers', 'stallions', 'rallycaps'];


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




      /*
      *
      * Yu Darvish NL loop
      *
      * When players are traded to the NL fortunately their total season stats go with them
      * also their mlb id stays the same
      * i.e. the AL stats are maintained with them so we still get aggregate totals
      * in order to handle traded players the application needs to grab all the NL players
      * then iterate to find relevant NL players, build an object with mlb player id and then
      * reference that object during processing and replace if match found during regular
      * iteration
      *
      * request({uri: nlPitchersUrl}, function(err, response, body) {
      *
      * */
      /**
       *
       *  NL HITTERS
       *
       *
       * */
      request({uri: nlBattersUrl}, function(err, response, body) {
        if(err){
          console.log('NL batter Request error: ' + err);
          //return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
        }

        var JDId = '502110';
        var jdPlayer = {};

        var nlBatterUpdateObj = {};

        var nlBatterPayload = {};
        nlBatterPayload.data = body;
        nlBatterPayload.metadata = {};

        var nlBatterStatObj = JSON.parse(nlBatterPayload.data);
        statsDate =  moment(nlBatterStatObj.stats_sortable_player.queryResults.created).format('YYYY MM DD');

        nlLatestBattingStats = nlBatterStatObj.stats_sortable_player.queryResults.row;
        nlBattingStatCount = nlLatestBattingStats.length;

        for (var j = 0;j < nlBattingStatCount;j++){

          var nlBatter = nlLatestBattingStats[j];
          if (nlBatter.player_id === '502110') {
            nlBatterUpdateObj['502110'] = nlBatter;
            jdPlayer = nlBatter;
            console.log('First Assign', nlBatterUpdateObj['502110']);
            break;
          }
        }


        /**
         *
         *  NL PITCHERS
         *
         *
         * */
      request({uri: nlPitchersUrl}, function(err, response, body) {
        if(err){
          console.log('NL pitcher Request error: ' + err);
          //return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
        }

        var yuDId = '506433';

        var nlUpdateObj = {};

        var nlPitchPayload = {};
        nlPitchPayload.data = body;
        nlPitchPayload.metadata = {};

        var nlPitcherStatObj = JSON.parse(nlPitchPayload.data);
       // statsDate =  moment(nlPitcherStatObj.stats_sortable_player.queryResults.created).format('YYYY MM DD');
        /*
         *
         * MLB STATS DATA  NL
         *
         * */
        nlLatestPitchingStats = nlPitcherStatObj.stats_sortable_player.queryResults.row;
        nlPitchingStatCount = nlLatestPitchingStats.length;

        for (var z = 0;z < nlPitchingStatCount;z++){

          var nlPlayer = nlLatestPitchingStats[z];
          if (nlPlayer.player_id === '506433') {
            nlUpdateObj['506433'] = nlPlayer;
            console.log('First Assign', nlUpdateObj['506433']);
            break;
          }

        }



        /*
         *
         *
         * AL PITCHER STATS
         *
         *
         * */
        request({uri: pitchersUrl}, function(err, response, body){

          if(err){
            console.log('pitcher Request error: ' + err);
            //return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
          }

          var pitchPayload = {};
          pitchPayload.data = body;
          pitchPayload.metadata = {};





          var pitcherStatObj = JSON.parse(pitchPayload.data);

          /*
           *
           *
           * STATS TIME STAMP
           *
           *
           * */
          //statsDate =  moment(pitcherStatObj.stats_sortable_player.queryResults.created).format('YYYY MM DD');
  //      statsDate =  '2014 04 06';


          /*
           *
           * ASSIGN PITCHING STATS VARIABLE
           *
           * */
          latestPitchingStats = pitcherStatObj.stats_sortable_player.queryResults.row;
          pitchingStatCount = latestPitchingStats.length;


          /*
           *
           * BATTING STATS
           *
           *
           * process the nl batters first
           *
           * */
          request({uri: battersUrl}, function(err, response, body){

            if(err){
              console.log('batter Request error: ' + err);
              //return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
            }


            var hitterPayload = {};
            hitterPayload.data = body;
            hitterPayload.metadata = {};

            var batterStatObj = JSON.parse(hitterPayload.data);

            /*
            *
            * MLB STATS DATA
            *
            * */
            latestHittingStats = batterStatObj.stats_sortable_player.queryResults.row;
            hittingStatCount = latestHittingStats.length;


            /*
             *
             *
             *  START THE ITERATIONS
             *
             *
             *
             * ROSTERS
             *
             *
             * we have all the stats and rosters now we should be able to loop over them
             *
             *
             * */
            for (var i = 0;i < rostersArray.length;i++){
              var targetRoster = rostersArray[i];
              console.log('|------------------------------------');
              console.log('|');
              console.log('|');
              console.log('| start ROSTER [' + targetRoster.slug + '|');
              console.log('|');
              console.log('|');
              console.log('|------------------------------------');
              console.log('|');

              var rosterPlayers = targetRoster.players;
              if (rosterPlayers && rosterPlayers.length) {


                /*
                *
                *   ROSTER PLAYERS LOOP
                *
                * */
                for (var k = 0;k < rosterPlayers.length;k++){

                  var currentPlayer = targetRoster.players[k];
                  //console.log('DO STATS FOR THIS PLAYER [' + currentPlayer.posType + ']');

                  var pI = 0; // pitcher iterator
                  var hI = 0; // hitter iterator
                  /*
                   *
                   *
                   * HITTERS
                   *
                   * */
                  // iterate over batting stats
                  if (currentPlayer.posType === 'hitter'){




                    if (currentPlayer.mlbid){
                      for (hI = 0;hI < hittingStatCount;hI++){
                        //console.log('THIS PLAYER IS A HITTER ' + latestHittingStats[hI].player_id );

                        var currRawHitter = latestHittingStats[hI];

                        /*
                         *
                         * MATCHING ROSTER HITTER
                         *
                         * */
                        if (currRawHitter.player_id === currentPlayer.mlbid){
                          // console.log('[' + currentPlayer.name + ']');

                          var hitterStatPackageObj = {};



                          /*
                          *
                          * CUSTOM PLAYER
                          *
                          * */
                          if (currRawHitter.player_id === '502110') {
                            hitterStatPackageObj = {
                              date: statsDate,
                              lastUpdate: Date.now(),
                              mlbid: currentPlayer.mlbid,
                              name: currentPlayer.name,
                              roster: targetRoster.slug,
                              status: currentPlayer.status,
                              draftStatus: currentPlayer.draftStatus,
                              team: jdPlayer.team,
                              pos: currentPlayer.pos,
                              r: (parseInt(currRawHitter.r) + parseInt(jdPlayer.r)),
                              h: (parseInt(currRawHitter.h) + parseInt(jdPlayer.h)),
                              rbi: (parseInt(currRawHitter.rbi) + parseInt(jdPlayer.rbi)),
                              hr: (parseInt(currRawHitter.hr) + parseInt(jdPlayer.hr)),
                              sb: (parseInt(currRawHitter.sb) + parseInt(jdPlayer.sb))
                            };

                            console.log('JD: ', hitterStatPackageObj);
                          }
                          else {



                            /*
                            *
                            * REGULAR PLAYER STATS COUNT
                            *
                            * */
                            hitterStatPackageObj = {
                              date: statsDate,
                              lastUpdate: Date.now(),
                              mlbid: currentPlayer.mlbid,
                              name: currentPlayer.name,
                              roster: targetRoster.slug,
                              status: currentPlayer.status,
                              draftStatus: currentPlayer.draftStatus,
                              team: currRawHitter.team,
                              pos: currentPlayer.pos,
                              r: currRawHitter.r,
                              h: currRawHitter.h,
                              rbi: currRawHitter.rbi,
                              hr: currRawHitter.hr,
                              sb: currRawHitter.sb
                            };





                          }
                          /*
                          *
                          * TOTAL HITTERS VALUE
                          * */
                          hitterStatPackageObj.total = utils.getHitterTotal(hitterStatPackageObj);








                          /*
                          *
                          *
                          * DB RECORD CREATE  HITTER
                          *
                          *
                          * */
                          // DailyBatterStat.create(hitterStatPackageObj, function(err,response){
                          //   if (err) {
                          //     console.log('sad no stat: ' + JSON.stringify(response));
                          //   }
                          // });












                          break;
                        }

                      }
                    }
                    /*
                    *
                    * PLAYERS WITH NO MLBID
                    *
                    * they get 0 totals
                    *
                    * */
                    else {
                      var LhitterStatPackageObj = {
                        date: statsDate,
                        lastUpdate: Date.now(),
                        name: currentPlayer.name,
                        roster: targetRoster.slug,
                        rosterStatus: currentPlayer.status,
                        team: currentPlayer.team,
                        pos: currentPlayer.pos,
                        r: 0,
                        h: 0,
                        rbi: 0,
                        hr: 0,
                        sb: 0
                      };


                      LhitterStatPackageObj.total = 0;

                      //console.log('| create L stat entry: ', LhitterStatPackageObj);






                      // DailyBatterStat.create(LhitterStatPackageObj, function(err, response){
                      //   if (err) {
                      //     console.log('sad no stat: ' + JSON.stringify(response));
                      //   }
                      // });








                    }



                  }
                  /*
                   *
                   * PITCHERS
                   *
                   * */
                  else {

                    if (currentPlayer.mlbid){
                      if (currentPlayer.mlbid === '506433') {
                        var freshObj = {};
                        var yuDId = '506433';

                        var yu = nlUpdateObj['506433'];



                        //console.log('PLAYER PLAYER wins', yuStatPackageObj.w);
                      }
                      for (pI = 0;pI < pitchingStatCount;pI++){

                        var currRawPitcher = latestPitchingStats[pI];


                        /*
                         *
                         * MATCHING ROSTER PITCHER
                         *
                         * */
                        if (currRawPitcher.player_id === currentPlayer.mlbid){
                          var pitcherStatPackageObj = {};
                          /*
                          *
                          * CUSTOM PLAYER
                          *
                          * */
                          if (currRawPitcher.player_id === '506433') {
                            console.log('------------------------[' + currentPlayer.name + ']-------------');

                            pitcherStatPackageObj = {
                              date: statsDate,
                              lastUpdate: Date.now(),
                              mlbid: currentPlayer.mlbid,
                              name: currentPlayer.name,
                              roster: targetRoster.slug,
                              rosterStatus: currentPlayer.status,
                              team: yu.team,
                              pos: currentPlayer.pos,
                              w: (parseInt(currRawPitcher.w) + parseInt(yu.w)),
                              l: (parseInt(currRawPitcher.l) + parseInt(yu.l)),
                              k: (parseInt(currRawPitcher.so) + parseInt(yu.so)),
                              sv: (parseInt(currRawPitcher.sv) + parseInt(yu.sv)),
                              ip: (parseInt(currRawPitcher.ip) + parseInt(yu.ip))
                            };

                            console.log('------------------------[' + pitcherStatPackageObj.name + ']-------------');
                            console.log('----------wins--------------[' + pitcherStatPackageObj.w + ']-------------');


                          }
                          /*
                          *
                          *   REGULAR PITCHER
                          *
                          * */
                          else {
                            pitcherStatPackageObj = {
                              date: statsDate,
                              lastUpdate: Date.now(),
                              mlbid: currentPlayer.mlbid,
                              name: currentPlayer.name,
                              roster: targetRoster.slug,
                              rosterStatus: currentPlayer.status,
                              team: currRawPitcher.team,
                              pos: currentPlayer.pos,
                              w: currRawPitcher.w,
                              l: currRawPitcher.l,
                              k: currRawPitcher.so,
                              sv: currRawPitcher.sv,
                              ip: currRawPitcher.ip
                            };
                          }




                          var pitcherTotal = 0;
                          // figure out if closer or starter
                          if (currentPlayer.pos.toLowerCase() == 'sp'){
                            pitcherStatPackageObj.total = utils.getStarterTotal(pitcherStatPackageObj);
                          }
                          else if (currentPlayer.pos.toLowerCase() === 'rp'){
                            pitcherStatPackageObj.total = utils.getCloserTotal(pitcherStatPackageObj);
                          }
                          else {
                            console.log('cannot determine pitcher type:' + JSON.stringify(currentPlayer) );
                          }


                          //console.log('| create stat entry: ' + JSON.stringify(pitcherStatPackageObj));






                          /*
                          *
                          * DB CREATE PITCHER STAT RECORD
                          *
                          * */
                          // DailyPitcherStat.create(pitcherStatPackageObj, function(err, response){
                          //   if (err) {
                          //     console.log('sad no stat: ' + JSON.stringify(response));
                          //   }
                          // });








                          break;
                        }
                      }
                    }
                    else {

                      // non mlbid player

                      var LpitcherStatPackageObj = {
                        date: statsDate,
                        lastUpdate: Date.now(),
                        name: currentPlayer.name,
                        roster: targetRoster.slug,
                        rosterStatus: currentPlayer.status,
                        team: currentPlayer.team,
                        pos: currentPlayer.pos,
                        w: 0,
                        l: 0,
                        k: 0,
                        sv: 0,
                        ip: 0,
                        total: 0
                      };

                      //console.log('| create stat entry: ' + JSON.stringify(LpitcherStatPackageObj));




                      // DailyPitcherStat.create(LpitcherStatPackageObj, function(err, response){
                      //   if (err) {
                      //     console.log('sad no stat: ' + JSON.stringify(response));
                      //   }
                      // });








                    }



                  }



                  // iterate over pitching stats

                }

                // console.log('|');
                // console.log('| end save this roster [' + targetRoster.slug + ']');
                // console.log('|');

              }

            }

            var statUpdateObj = {
              date:Date.now(),
              timestamp: new Date().getTime(),
              status:'good',
              type:'stats'
            };

            /*
            *
            * MAKE NOTE OF STATS UPDATE METADATA
            *
            * */
            // StatUpdate.create(statUpdateObj, function(err, response){
            //   if (err) {
            //     console.log('sad no stat update: ' + JSON.stringify(response));
            //   }
            //   console.log('yay added stat update');
            //   cb(null, statUpdateObj);
            // });

          }); // end batter stats


        });  // end pitching stats
      });

      /*
      * });
      * end NL Yu Darvish loop
      *
      * */


      });

      /*
      *
      * end JD Martinez loop
      *
      * */



    });  // end roster iteration

    // function isInt(n) {
    //   return n % 1 === 0;
    // }

    /*
     *
     *
     * Hitter total
     *
     *
     * */
    // var getHitterTotal = function(hitter){
    //   var totalVal = 0;
    //   var baseValObj = {
    //     r:0,
    //     h:0,
    //     hr:0,
    //     sb:0,
    //     rbi:0
    //   };
    //
    //   if (hitter.r) {
    //     baseValObj.r = parseInt(hitter.r);
    //   }
    //   if (hitter.h) {
    //     baseValObj.h = parseInt(hitter.h);
    //   }
    //   if (hitter.rbi) {
    //     baseValObj.rbi = parseInt(hitter.rbi);
    //   }
    //   if (hitter.hr) {
    //     baseValObj.hr = parseInt(hitter.hr);
    //   }
    //   if (hitter.sb) {
    //     baseValObj.sb = parseInt(hitter.sb);
    //   }
    //
    //   try {
    //     totalVal = (baseValObj.r) + (baseValObj.h / 2) + (baseValObj.rbi) + (baseValObj.hr * 2) + (baseValObj.sb / 2);
    //
    //   }
    //   catch(e){
    //     console.log('error calculating hitter total:  ' + e.message)
    //   }
    //
    //   if (!isInt(totalVal)){
    //     totalVal = parseFloat(totalVal).toFixed(2);
    //   }
    //
    //
    //
    //   return totalVal
    // };

    /*
     *
     * starter total
     *
     *
     * */
    // var getStarterTotal = function(pitcher){
    //   var totalVal = 0;
    //
    //   var baseValObj = {
    //     l:0,
    //     w:0,
    //     k:0
    //   };
    //
    //
    //   if (pitcher.l) {
    //     baseValObj.l = parseInt(pitcher.l);
    //   }
    //   if (pitcher.w) {
    //     baseValObj.w = parseInt(pitcher.w);
    //   }
    //   if (pitcher.k) {
    //     baseValObj.k = parseInt(pitcher.k);
    //   }
    //
    //   try{
    //     totalVal = ((baseValObj.w * 15) - (baseValObj.l * 4) + (baseValObj.k / 2));
    //
    //   }
    //   catch(err){
    //     console.log('error calculating starter total: ' + err.message);
    //   }
    //   if (!isInt(totalVal)){
    //     totalVal = parseFloat(totalVal).toFixed(2);
    //   }
    //
    //
    //
    //   return totalVal;
    // };
//     var getCloserTotal = function(pitcher){
//       var totalVal = 0;
//       var baseValObj = {
//         sv:0,
//         l:0,
//         w:0,
//         k:0,
//         ip:0
//       };
// //    console.log('total this pitcher:  ==============================');
// //    console.log(JSON.stringify(pitcher));
//
//       if (pitcher.sv){
//         baseValObj.sv = parseInt(pitcher.sv);
//       }
//       if (pitcher.l) {
//         baseValObj.l = parseInt(pitcher.l);
//       }
//       if (pitcher.w) {
//         baseValObj.w = parseInt(pitcher.w);
//       }
//       if (pitcher.k) {
//         baseValObj.k = parseInt(pitcher.k);
//       }
//       if (pitcher.ip) {
//         baseValObj.l = parseInt(pitcher.ip);
//       }
//       totalVal = (baseValObj.sv * 7)  + (baseValObj.w * 6) + (baseValObj.k / 2) + (baseValObj.ip / 2);
//
//       if (!isInt(totalVal)){
//         totalVal = parseFloat(totalVal).toFixed(2);
//       }
//
// //
// //    console.log('|');
// //    console.log('|');
// //    console.log('|');
// //    console.log('|');
// //    console.log('|  Starter: ' + pitcher.name);
// //    console.log('|');
// //    console.log('|  w[' + baseValObj.w + ']  l[' + baseValObj.l + ']   k[' + baseValObj.k + ']   ip[' + baseValObj.ip + ']   sv[' + baseValObj.sv + ']');
// //    console.log('|');
// //    console.log('| total[' + totalVal + ']');
// //    console.log('|');
// //    console.log('|');
// //    console.log('|');
// //    console.log('|');
//
//       return totalVal;
//
//
//     };



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
