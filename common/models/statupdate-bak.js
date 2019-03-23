// var loopback = require('loopback');
var moment = require('moment');
var request = require('request');
// var app = module.exports = loopback();

//var battersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2014&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=1&recPP=900";
//var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2014&sort_order='asc'&sort_column='era'&stat_type=pitching&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&position='1'&recSP=1&recPP=900";

module.exports = function(Statupdate) {

  //var Roster = app.models.roster;
  //var DailyBatterStat = app.models.dailybatterstat;
  //var DailyPitcherStat = app.models.dailypitcherstat;
  //var StatUpdate = app.models.statupdate;

  //var battersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2015&sort_order=%27desc%27&sort_column=%27avg%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999"; 
  var battersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2015&sort_order=%27desc%27&sort_column=%27g%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999"; 
  var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2015&sort_order=%27asc%27&sort_column=%27era%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999"; 


  Statupdate.updateStats = function(cb) {
    var latestPitchingStats = [];
    var latestHittingStats = [];
    var pitchingStatCount = 0;
    var hittingStatCount = 0;
    var statsDate = Date.now();
    var rostersArray = [];
    var rosterNameArray = ['bashers', 'mashers', 'stallions', 'rallycaps'];


    Roster.find({}, function(err, dox) {
      if (err) {
        console.log('error finding rosters: ' + JSON.stringify(err));
      }
      rostersArray = dox;
      /*
       *
       *
       * PITCHER STATS
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
        statsDate =  moment(pitcherStatObj.stats_sortable_player.queryResults.created).format('YYYY MM DD');
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
         * */
        // batters
        request({uri: battersUrl}, function(err, response, body){

          if(err){
            console.log('batter Request error: ' + err);
            //return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
          }


          var hitterPayload = {};
          hitterPayload.data = body;
          hitterPayload.metadata = {};

          var batterStatObj = JSON.parse(hitterPayload.data);

          latestHittingStats = batterStatObj.stats_sortable_player.queryResults.row;
          hittingStatCount = latestHittingStats.length;


          /*
           *
           * we have all the stats and rosters now we sholld be able to loop over them
           *
           *
           * */


          for (var i = 0;i < rostersArray.length;i++){
            var targetRoster = rostersArray[i];
//          console.log('|------------------------------------');
//          console.log('|');
//          console.log('|');
//          console.log('| start ROSTER [' + targetRoster.slug + '|');
//          console.log('|');
//          console.log('|');
//          console.log('|------------------------------------');
//          console.log('|');

            var rosterPlayers = targetRoster.players;

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
                      console.log('[' + currentPlayer.name + ']');

                      var hitterStatPackageObj = {
                        date: statsDate,
                        lastUpdate: Date.now(),
                        mlbid: currentPlayer.mlbid,
                        name: currentPlayer.name,
                        roster: targetRoster.slug,
                        rosterStatus: currentPlayer.status,
                        team: currRawHitter.team,
                        pos: currentPlayer.pos,
                        r: currRawHitter.r,
                        h: currRawHitter.h,
                        rbi: currRawHitter.rbi,
                        hr: currRawHitter.hr,
                        sb: currRawHitter.sb
                      };


                      hitterStatPackageObj.total = getHitterTotal(hitterStatPackageObj);



                      console.log('| create stat entry: ' + JSON.stringify(LpitcherStatPackageObj));
                      //DailyBatterStat.create(hitterStatPackageObj,
                      //  function(response){
                      //    console.log('yay added stat');
                      //  },
                      //  function(response){
                      //    console.log('sad no stat: ' + JSON.stringify(response));
                      //  }
                      //);



                      break;
                    }

                  }
                }
                else {
                  var LhitterStatPackageObj = {
                    date: statsDate,
                    lastUpdate: Date.now(),
                    mlbid: currentPlayer.mlbid,
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



                  console.log('| create stat entry: ' + JSON.stringify(LhitterStatPackageObj));
                  //DailyBatterStat.create(LhitterStatPackageObj,
                  //  function(response){
                  //    console.log('yay added stat');
                  //  },
                  //  function(response){
                  //    console.log('sad no stat: ' + JSON.stringify(response));
                  //  }
                  //);
                }



              }
              /*
               *
               * PITCHERS
               *
               * */
              else {

                if (currentPlayer.mlbid){
                  for (pI = 0;pI < pitchingStatCount;pI++){
                    var currRawPitcher = latestPitchingStats[pI];
                    // console.log('currRawPitcher: ' + JSON.stringify(currRawPitcher));

                    /*
                     *
                     * MATCHING ROSTER PITCHER
                     *
                     * */
                    if (currRawPitcher.player_id === currentPlayer.mlbid){
                      console.log('[' + currentPlayer.name + ']');


                      var pitcherStatPackageObj = {
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

                      var pitcherTotal = 0;
                      // figure out if closer or starter
                      if (currentPlayer.pos.toLowerCase() == 'sp'){
                        pitcherStatPackageObj.total = getStarterTotal(pitcherStatPackageObj);
                      }
                      else if (currentPlayer.pos.toLowerCase() === 'rp'){
                        pitcherStatPackageObj.total = getCloserTotal(pitcherStatPackageObj);
                      }
                      else {
                        console.log('cannot determine pitcher type:' + JSON.stringify(currentPlayer) );
                      }


                      console.log('| create stat entry: ' + JSON.stringify(pitcherStatPackageObj));
                      //DailyPitcherStat.create(pitcherStatPackageObj,
                      //  function(response){
                      //    console.log('yay added pitcher');
                      //  },
                      //  function(response){
                      //    console.log('sad no stat: ' + JSON.stringify(response));
                      //  }
                      //);
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

                  console.log('| create stat entry: ' + JSON.stringify(LpitcherStatPackageObj));
                  //DailyPitcherStat.create(LpitcherStatPackageObj,
                  //  function(response){
                  //    console.log('yay added pitcher');
                  //  },
                  //  function(response){
                  //    console.log('sad no stat: ' + JSON.stringify(response));
                  //  }
                  //);


                }



              }



              // iterate over pitching stats

            }

            console.log('|');
            console.log('| end save this roster [' + targetRoster.slug + ']');
            console.log('|');



          }

          var statUpdateObj = {
            date:Date.now(),
            status:'good',
            type:'stats'
          };
          StatUpdate.create(statUpdateObj,
            function(response){
              console.log('yay added stat update');
              return cb(null, JSON.stringify(statUpdateObj));
            },
            function(response){
              console.log('sad no stat update: ' + JSON.stringify(response));
            }
          );













        }); // end batter stats

      });  // end pitching stats

    });  // end roster iteration

    function isInt(n) {
      return n % 1 === 0;
    }

    /*
     *
     *
     * Hitter total
     *
     *
     * */
    var getHitterTotal = function(hitter){
      var totalVal = 0;
      var baseValObj = {
        r:0,
        h:0,
        hr:0,
        sb:0,
        rbi:0
      };

      if (hitter.r) {
        baseValObj.r = parseInt(hitter.r);
      }
      if (hitter.h) {
        baseValObj.h = parseInt(hitter.h);
      }
      if (hitter.rbi) {
        baseValObj.rbi = parseInt(hitter.rbi);
      }
      if (hitter.hr) {
        baseValObj.hr = parseInt(hitter.hr);
      }
      if (hitter.sb) {
        baseValObj.sb = parseInt(hitter.sb);
      }

      try {
        totalVal = (baseValObj.r) + (baseValObj.h / 2) + (baseValObj.rbi) + (baseValObj.hr * 2) + (baseValObj.sb / 2);

      }
      catch(e){
        console.log('error calculating hitter total:  ' + e.message)
      }

      if (!isInt(totalVal)){
        totalVal = parseFloat(totalVal).toFixed(2);
      }



      return totalVal
    };

    /*
     *
     * starter total
     *
     *
     * */
    var getStarterTotal = function(pitcher){
      var totalVal = 0;

      var baseValObj = {
        l:0,
        w:0,
        k:0
      };


      if (pitcher.l) {
        baseValObj.l = parseInt(pitcher.l);
      }
      if (pitcher.w) {
        baseValObj.w = parseInt(pitcher.w);
      }
      if (pitcher.k) {
        baseValObj.k = parseInt(pitcher.k);
      }

      try{
        totalVal = ((baseValObj.w * 15) - (baseValObj.l * 4) + (baseValObj.k / 2));

      }
      catch(err){
        console.log('error calculating starter total: ' + err.message);
      }
      if (!isInt(totalVal)){
        totalVal = parseFloat(totalVal).toFixed(2);
      }



      return totalVal;
    };
    var getCloserTotal = function(pitcher){
      var totalVal = 0;
      var baseValObj = {
        sv:0,
        l:0,
        w:0,
        k:0,
        ip:0
      };
//    console.log('total this pitcher:  ==============================');
//    console.log(JSON.stringify(pitcher));

      if (pitcher.sv){
        baseValObj.sv = parseInt(pitcher.sv);
      }
      if (pitcher.l) {
        baseValObj.l = parseInt(pitcher.l);
      }
      if (pitcher.w) {
        baseValObj.w = parseInt(pitcher.w);
      }
      if (pitcher.k) {
        baseValObj.k = parseInt(pitcher.k);
      }
      if (pitcher.ip) {
        baseValObj.l = parseInt(pitcher.ip);
      }
      totalVal = (baseValObj.sv * 7)  + (baseValObj.w * 6) + (baseValObj.k / 2) + (baseValObj.ip / 2);

      if (!isInt(totalVal)){
        totalVal = parseFloat(totalVal).toFixed(2);
      }

//
//    console.log('|');
//    console.log('|');
//    console.log('|');
//    console.log('|');
//    console.log('|  Starter: ' + pitcher.name);
//    console.log('|');
//    console.log('|  w[' + baseValObj.w + ']  l[' + baseValObj.l + ']   k[' + baseValObj.k + ']   ip[' + baseValObj.ip + ']   sv[' + baseValObj.sv + ']');
//    console.log('|');
//    console.log('| total[' + totalVal + ']');
//    console.log('|');
//    console.log('|');
//    console.log('|');
//    console.log('|');

      return totalVal;


    };

  };
  Statupdate.remoteMethod(
    'updatestats',
    {
      http: {path: '/updatestats', verb: 'get'},
      returns: {arg: 'data', type: 'string'}
    }
  );
};
