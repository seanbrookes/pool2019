const request = require('request');
const isInt = (n) => {
  return n % 1 === 0;
};
const CONST = {
    NL_HITTER_STAT_URL: 'http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27g%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27NL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999',
    NL_PITCHER_STAT_URL: 'http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27NL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999',
    AL_PITCHER_STAT_URL: 'http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27sv%27&stat_type=pitching&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&position=%271%27&recSP=1&recPP=999',
    AL_HITTER_STAT_URL: 'http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2018&sort_order=%27desc%27&sort_column=%27g%27&stat_type=hitting&page_type=SortablePlayer&game_type=%27R%27&player_pool=QUALIFIER&season_type=ANY&league_code=%27AL%27&sport_code=%27mlb%27&results=1000&recSP=1&recPP=999',
  };
module.exports = {
  fetchALHitters: () => {
    return new Promise(function(resolve, reject) {
      request(CONST.AL_HITTER_STAT_URL, function(error, response, body) {
        if (error) return reject(error);
        resolve(body);
      });
    });
  },
  fetchALPitchers: async () => {
    return new Promise(function(resolve, reject) {
      request(CONST.AL_PITCHER_STAT_URL, function(error, response, body) {
        if (error) return reject(error);
        resolve(body);
      });
    });
  },
  fetchNLHitters: async () => {
    return new Promise(function(resolve, reject) {
      request(CONST.NL_HITTER_STAT_URL, function(error, response, body) {
        if (error) return reject(error);
        resolve(body);
      });
    });
  },
  fetchNLPitchers: async () => {
    return new Promise(function(resolve, reject) {
      request(CONST.NL_PITCHER_STAT_URL, function(error, response, body) {
        if (error) return reject(error);
        resolve(body);
      });
    });
  },

  /*
   *
   *
   * Hitter total
   *
   *
   * */
  getHitterTotal: (hitter) => {
    var totalVal = 0;
    var baseValObj = {
      r: 0,
      h: 0,
      hr: 0,
      sb: 0,
      rbi: 0
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
    catch (e) {
      console.log('error calculating hitter total:  ' + e.message)
    }

    if (!isInt (totalVal)) {
      totalVal = parseFloat(totalVal).toFixed(2);
    }


    return totalVal
  },
  /*
   *
   * starter total
   *
   *
   * */
  getStarterTotal: (pitcher) => {
    var totalVal = 0;

    var baseValObj = {
      l: 0,
      w: 0,
      k: 0
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

    try {
      totalVal = ((baseValObj.w * 15) - (baseValObj.l * 4) + (baseValObj.k / 2));

    }
    catch (err) {
      console.log('error calculating starter total: ' + err.message);
    }
    if (!isInt (totalVal)) {
      totalVal = parseFloat(totalVal).toFixed(2);
    }


    return totalVal;
  },
  getCloserTotal: (pitcher) => {
    var totalVal = 0;
    var baseValObj = {
      sv: 0,
      l: 0,
      w: 0,
      k: 0,
      ip: 0
    };

    if (pitcher.sv) {
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
    totalVal = (baseValObj.sv * 7) + (baseValObj.w * 6) + (baseValObj.k / 2) + (baseValObj.ip / 2);

    if (!isInt (totalVal)) {
      totalVal = parseFloat(totalVal).toFixed(2);
    }

    return totalVal;
  }
};
