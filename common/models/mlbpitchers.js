module.exports = function(Mlbpitchers) {
  var request = require('request');
  var http = require("http");
//  var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2014&sort_order='desc'&sort_column='avg'&stat_type=pitching&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=1&recPP=900"; 
  //var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2014&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=1&recPP=900"; 
 // var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2015&sort_order=%27asc%27&sort_column=%27era%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999"; 
  var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=ALL&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999";
//  var pitchersUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=ALL&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999";


  Mlbpitchers.fetchPitchers = function(cb) {
    var responseBody = '';

    return request(
      {uri: pitchersUrl},
      function(err, response, body){

        //console.log('|');
        //console.log('|');
        //console.log('|        wtf');
        //console.log('|');
        //console.log('|');
        //console.log('|');

        if(err){
          console.log('Request error: ' + err);
          //return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
        }


        var self = this;
        // var innerIndex2 = innerIndex;
        self.items = new Array();//I feel like I want to save my results in an array
        //Just a basic error check

        var payload = {};
        payload.data = body;
        payload.metadata = {};

        var statObj = JSON.parse(payload.data);

        var statsResult = statObj.stats_sortable_player.queryResults.row;

        var returnArray = [];

        //return data = statsResult;
        for (var i = 0;i < statsResult.length;i++){
          var newRecord = {};
          var tPlayer = statsResult[i];

          tPlayer.mlbid = tPlayer.player_id;
          tPlayer.name = tPlayer.name_display_first_last;
          tPlayer.team = tPlayer.team_abbrev;


          returnArray.push(tPlayer);
          //RawPitchers.create(newRecord, function(err,doc){
          //  console.log('created pitcher record');
          //})
        }

        cb(null, returnArray);
      });
    //console.log(cb);

  };
  Mlbpitchers.remoteMethod(
    'fetchPitchers',
    {
      http: {path: '/fetchPitchers', verb: 'get'},
      returns: {arg: 'data', type: 'string'}
    }
  );
};
