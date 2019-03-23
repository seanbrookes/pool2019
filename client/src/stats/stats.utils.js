export const sortCombinedTotals = (hitters, pitchers) => {
  let fullCollection = [];
  let combinedCollection = hitters.concat(pitchers);

  combinedCollection = combinedCollection.filter((item) => {
    return (!!item.total);
  });

  let rankedCollection = combinedCollection.sort(compareTotals);

  rankedCollection.map((player) => {
    let uniqueTestFilter = fullCollection.filter((testPlayer) => (testPlayer.name === player.name));
    if (!uniqueTestFilter[0]) {
      fullCollection.push(player);
    }
  });

  return fullCollection;
};
const getSortMethod = (stat) => {
  switch(stat) {
    case 'runs':
      return compareRuns;

    case 'hits':
      return compareHits;

    case 'hr':
      return compareHR;

    case 'rbi':
      return compareRBI;

    case 'sb':
      return compareSteals;

    case 'saves':
      return compareSaves;

    default:

  }
};

export const sortHotStats = (collection) => {

  let hotStatData = {};

  const combinedCollection = collection.filter((item) => {
    return (!!item.total);
  });

  //const rankedCollection = combinedCollection.sort(getSortMethod(stat));

  masterHitterCollection.map(function(hitterCollection) {
    var runs = hitterCollection[hitterCollection.length - 1].r - hitterCollection[0].r;
    var hits = hitterCollection[hitterCollection.length - 1].h - hitterCollection[0].h;
    var hr = hitterCollection[hitterCollection.length - 1].hr - hitterCollection[0].hr;
    var rbi = hitterCollection[hitterCollection.length - 1].rbi - hitterCollection[0].rbi;
    var scoreStats = {
      hitter: hitterCollection[0],
      r: runs,
      h: hits,
      hr: hr,
      rbi: rbi
    };
    statsCollection.push(scoreStats);
  });



  // sort the stats collection into ranked list (r, h, hr, rbi)
  hotStatData.rankedRuns = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
    return b.r - a.r
  });
  hotStatData.rankedHits = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
    return b.h - a.h
  });
  hotStatData.rankedHomeRuns = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
    return b.hr - a.hr
  });
  hotStatData.rankedRBI = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
    return b.rbi - a.rbi
  });

  return hotStatData;

};
export const sortStat = (players, stat) => {
  let fullCollection = [];
  let combinedCollection = players;

  combinedCollection = combinedCollection.filter((item) => {
    return (!!item.total);
  });

  let rankedCollection = combinedCollection.sort(getSortMethod(stat));

  rankedCollection.map((player) => {
    let uniqueTestFilter = fullCollection.filter((testPlayer) => (testPlayer.name === player.name));
    if (!uniqueTestFilter[0]) {
      fullCollection.push(player);
    }
  });

  return fullCollection;
};

export const positionSort = (roster) =>  {
  const cArray = [];
  const oneBArray = [];
  const twoBArray = [];
  const threeBArray = [];
  const ssArray = [];
  const lfArray = [];
  const cfArray = [];
  const rfArray = [];
  const dhArray = [];
  const spArray = [];
  const rpArray = [];
  roster.players.map(function(player) {

    switch(player.pos) {

      case 'C':
        if (cArray.length === 0){
          player.class = 'counting';
        }
        cArray.push(player);
        break;
      case '1B':
        if (oneBArray.length === 0){
          player.class = 'counting';
        }
        oneBArray.push(player);
        break;
      case '2B':
        if (twoBArray.length === 0){
          player.class = 'counting';
        }
        twoBArray.push(player);
        break;
      case '3B':
        if (threeBArray.length === 0){
          player.class = 'counting';
        }
        threeBArray.push(player);
        break;
      case 'SS':
        if (ssArray.length === 0){
          player.class = 'counting';
        }
        ssArray.push(player);
        break;
      case 'LF':
        if (lfArray.length === 0){
          player.class = 'counting';
        }
        lfArray.push(player);
        break;
      case 'CF':
        if (cfArray.length === 0){
          player.class = 'counting';
        }
        cfArray.push(player);
        break;
      case 'RF':
        if (rfArray.length === 0){
          player.class = 'counting';
        }
        rfArray.push(player);
        break;
      case 'DH':
        if (dhArray.length === 0){
          player.class = 'counting';
        }
        dhArray.push(player);
        break;
      case 'SP':
        spArray.push(player);
        break;
      case 'RP':
        rpArray.push(player);
        break;

      default:

    }



  });



  // merge the arrays
  const positionArray = cArray.concat(oneBArray)
    .concat(twoBArray)
    .concat(threeBArray)
    .concat(ssArray)
    .concat(lfArray)
    .concat(cfArray)
    .concat(rfArray)
    .concat(dhArray);

  return positionArray;

};
export const filterLatest = (rosterStats) => {
  const filteredOut = [];
  const uniqueMLBIDArray = [];
  if (rosterStats.length === 0) {
    return filteredOut;
  }

  const refMonth = new Date(rosterStats[0].date).getMonth();
  const refDay = new Date(rosterStats[0].date).getDate();

  rosterStats.map((tPlayer) => {
    const playerMonth = new Date(tPlayer.date).getMonth();
    // day of the month
    const playerDate = new Date(tPlayer.date).getDate();
    const currMonth = new Date().getMonth();
    // day of the month
    const currDate = new Date().getDate();

    if (playerMonth === refMonth && playerDate === refDay) {
      if (uniqueMLBIDArray.indexOf(tPlayer.mlbid) === -1){
        uniqueMLBIDArray.push(tPlayer.mlbid);
        filteredOut.push(tPlayer);
      }
    }
  });

  return filteredOut;
};
export const compareRuns = (a, b) => {
  return parseFloat(b.r) - parseFloat(a.r);
};
export const compareHits = (a, b) => {
  return parseFloat(b.h) - parseFloat(a.h);
};
export const compareHR = (a, b) => {
  return parseFloat(b.hr) - parseFloat(a.hr);
};
export const compareRBI = (a, b) => {
  return parseFloat(b.rbi) - parseFloat(a.rbi);
};
export const compareSteals = (a, b) => {
  return parseFloat(b.sb) - parseFloat(a.sb);
};
export const compareWins = (a, b) => {
  return parseFloat(b.w) - parseFloat(a.w);
};
export const compareLosses = (a, b) => {
  return parseFloat(b.l) - parseFloat(a.l);
};
export const compareInnings = (a, b) => {
  return parseFloat(b.ip) - parseFloat(a.ip);
};
export const compareKs = (a, b) => {
  return parseFloat(b.k) - parseFloat(a.k);
};
export const compareSaves = (a, b) => {
  return parseFloat(b.sv) - parseFloat(a.sv);
};
export const compareTotals = (a,b) => {

  if (parseFloat(a.total) > parseFloat(b.total)){
    return -1;
  }
  if (parseFloat(a.total) < parseFloat(b.total)){
    return 1;
  }
  return 0;
};
export const totalAndSortBatters = (rawBatters) => {
  let battersSubTotal = 0;
  const catchersArray = [];
  const firstBArray = [];
  const twoBArray = [];
  const threeBArray = [];
  const ssArray = [];
  const lfArray = [];
  const cfArray = [];
  const rfArray = [];
  const dhArray = [];

  const returnArray = [];
  console.log(rawBatters);

  rawBatters.map((player) => {
    if (!player.total) {
      player.total = 0;
    }
    switch(player.pos){

      case 'C':
        catchersArray.push(player);
        break;
      case '1B':
        firstBArray.push(player);

        break;

      case '2B':
        twoBArray.push(player);

        break;
      case '3B':
        threeBArray.push(player);

        break;
      case 'SS':
        ssArray.push(player);

        break;
      case 'LF':
        lfArray.push(player);

        break;
      case 'CF':
        cfArray.push(player);

        break;
      case 'RF':
        rfArray.push(player);

        break;

      case 'DH':
        dhArray.push(player);

        break;
      default:

    }
  });

  // for (var i = 0;i < rawBatters.length;i++){
  //   var player = rawBatters[i];
  //
  //   // add total property
  //   //player = totalBatterScore(player);
  //   switch(player.pos){
  //
  //     case 'C':
  //       catchersArray.push(player);
  //       break;
  //     case '1B':
  //       firstBArray.push(player);
  //
  //       break;
  //
  //     case '2B':
  //       twoBArray.push(player);
  //
  //       break;
  //     case '3B':
  //       threeBArray.push(player);
  //
  //       break;
  //     case 'SS':
  //       ssArray.push(player);
  //
  //       break;
  //     case 'LF':
  //       lfArray.push(player);
  //
  //       break;
  //     case 'CF':
  //       cfArray.push(player);
  //
  //       break;
  //     case 'RF':
  //       rfArray.push(player);
  //
  //       break;
  //
  //     case 'DH':
  //       dhArray.push(player);
  //
  //       break;
  //     default:
  //
  //   }
  //
  // }

  // set augmented properties
  // total
  // sort
  // establish counting property
  if (catchersArray.length > 0){
    catchersArray.sort(compareTotals);
    catchersArray[0].counting = true;
    battersSubTotal += parseFloat(catchersArray[0].total);
  }
  if (firstBArray.length > 0){
    firstBArray.sort(compareTotals);
    firstBArray[0].counting = true;
    battersSubTotal += parseFloat(firstBArray[0].total);
  }
  if (twoBArray.length > 0){
    twoBArray.sort(compareTotals);
    twoBArray[0].counting = true;
    battersSubTotal += parseFloat(twoBArray[0].total);
  }
  if (threeBArray.length > 0){
    threeBArray.sort(compareTotals);
    threeBArray[0].counting = true;
    battersSubTotal += parseFloat(threeBArray[0].total);
  }
  if (ssArray.length > 0){
    ssArray.sort(compareTotals);
    ssArray[0].counting = true;
    battersSubTotal += parseFloat(ssArray[0].total);
  }
  if (lfArray.length > 0){
    lfArray.sort(compareTotals);
    lfArray[0].counting = true;
    battersSubTotal += parseFloat(lfArray[0].total);
  }
  if (cfArray.length > 0){
    cfArray.sort(compareTotals);
    cfArray[0].counting = true;
    battersSubTotal += parseFloat(cfArray[0].total);
  }
  if (rfArray.length > 0){
    rfArray.sort(compareTotals);
    rfArray[0].counting = true;
    battersSubTotal += parseFloat(rfArray[0].total);
  }
  if (dhArray.length > 0){
    dhArray.sort(compareTotals);
    dhArray[0].counting = true;
    battersSubTotal += parseFloat(dhArray[0].total);
  }
  /*
   *
   * Merge all the arrays
   *
   * */
  //returnArray = $.merge(returnArray,catchersArray);
  //returnArray = $.merge(returnArray,firstBArray);
  //returnArray = $.merge(returnArray,twoBArray);
  //returnArray = $.merge(returnArray,threeBArray);
  //returnArray = $.merge(returnArray,ssArray);
  //returnArray = $.merge(returnArray,lfArray);
  //returnArray = $.merge(returnArray,cfArray);
  //returnArray = $.merge(returnArray,rfArray);
  //returnArray = $.merge(returnArray,dhArray);

  var positionArray = catchersArray
    .concat(firstBArray)
    .concat(twoBArray)
    .concat(threeBArray)
    .concat(ssArray)
    .concat(lfArray)
    .concat(cfArray)
    .concat(rfArray)
    .concat(dhArray);

  return ({batters:positionArray,subTotal:battersSubTotal});
  //return positionSort()
};
export const totalAndSortStarters = (originalArray) => {
  let startersSubTotal = 0;
//      for (var i = 0;i < originalArray.length;i++){
//        originalArray[i].total = ((originalArray[i].wins * 15) - (originalArray[i].losses * 4) + (originalArray[i].k / 2))
//      }
  originalArray.sort(compareTotals);
  if (originalArray[0]){
    originalArray[0].counting = true;
    startersSubTotal += parseFloat(originalArray[0].total);
  }
  if (originalArray[1]){
    originalArray[1].counting = true;
    startersSubTotal += parseFloat(originalArray[1].total);
  }
  if (originalArray[2]){
    originalArray[2].counting = true;
    startersSubTotal += parseFloat(originalArray[2].total);
  }
  if (originalArray[3]){
    originalArray[3].counting = true;
    startersSubTotal += parseFloat(originalArray[3].total);
  }

  return ({starters:originalArray,subTotal:startersSubTotal});
};
export const totalAndSortClosers = (originalArray) => {
  let closersSubTotal = 0;

  originalArray.sort(compareTotals);
  if (originalArray[0]){
    originalArray[0].counting = true;
    closersSubTotal += parseFloat(originalArray[0].total);
  }
  if (originalArray[1]){
    originalArray[1].counting = true;
    closersSubTotal += parseFloat(originalArray[1].total);
  }

  return ({closers:originalArray,subTotal:closersSubTotal});
};











const bigData = () => {
  let masterHitterCollection = [];
  let statsCollection = [];
  let scoreStats = {
    hitter: {},
    r: [],
    h: [],
    hr: [],
    rbi: []
  };


  const ONE_WEEK = 4 * 24 * 60 * 60 * 1000;  // Month in milliseconds
  const filter = {
    where: {
      lastUpdate: {gt: Date.now() - ONE_WEEK}
    }
  };
  let batterBlob = {};
  let hotStatData = {};

  function addHitterToHisCollection(hitter) {
    var isUnique = true;
    masterHitterCollection.map(function(hitterCollection) {
      if (hitter.mlbid === hitterCollection[0].mlbid) {
        hitterCollection.push(hitter);
        isUnique = false;
      }
    });
    if (isUnique) {
      var newArray = [hitter];
      masterHitterCollection.push(newArray);
    }
  }

  Dailybatterstat.find({filter: filter})
    .$promise
    .then(function(response) {
      var weeklyBatterStats = response;

      weeklyBatterStats.map(function(hitter) {
        if (!batterBlob[hitter.mlbid]) {
          batterBlob[hitter.mlbid] = [];
        }
        batterBlob[hitter.mlbid].push(hitter);
        addHitterToHisCollection(hitter);
      });

      masterHitterCollection.map(function(hitterCollection) {
        var runs = hitterCollection[hitterCollection.length - 1].r - hitterCollection[0].r;
        var hits = hitterCollection[hitterCollection.length - 1].h - hitterCollection[0].h;
        var hr = hitterCollection[hitterCollection.length - 1].hr - hitterCollection[0].hr;
        var rbi = hitterCollection[hitterCollection.length - 1].rbi - hitterCollection[0].rbi;
        var scoreStats = {
          hitter: hitterCollection[0],
          r: runs,
          h: hits,
          hr: hr,
          rbi: rbi
        };
        statsCollection.push(scoreStats);
      });



      // sort the stats collection into ranked list (r, h, hr, rbi)
      hotStatData.rankedRuns = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
        return b.r - a.r
      });
      hotStatData.rankedHits = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
        return b.h - a.h
      });
      hotStatData.rankedHomeRuns = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
        return b.hr - a.hr
      });
      hotStatData.rankedRBI = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
        return b.rbi - a.rbi
      });

      $scope.batterData = hotStatData;

    })
    .catch(function(error) {
      console.log('get daily batter stats error: ', error);
    });
};


const topTen = () => {
  $scope.topTenList = [];

  var masterHitterCollection = [];
  var masterPitcherCollection = [];
  var statsCollection = [];

  var uniqueObj = {};

  var rankedTotals = function(collection, stat) {
    return collection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
      return b[stat] - a[stat]
    });
  };


  var ONE_WEEK = 4 * 24 * 60 * 60 * 1000;  // Month in milliseconds
  var filter = {
    where: {
      lastUpdate: {gt: Date.now() - ONE_WEEK}
    }
  };


  var batterBlob = {};
  var hotStatData = {};

  function addHitterToHisCollection(hitter) {
    var isUnique = true;
    masterHitterCollection.map(function(hitterCollection) {
      if (hitter.mlbid === hitterCollection[0].mlbid) {
        hitterCollection.push(hitter);
        isUnique = false;
      }
    });
    if (isUnique) {
      var newArray = [hitter];
      masterHitterCollection.push(newArray);
    }
  }

  var weeklyBatterStats = [];
  var weeklyPitcherStats = [];
  var masterStatList = [];

  function rankTheTopTen() {
    console.log('Rank Them');
    weeklyBatterStats.forEach(function(player) {
      masterStatList.push({
        mlbid: player.mlbid,
        name: player.name,
        team: player.team,
        pos: player.pos,
        roster: player.roster,
        total: player.total
      })
    });
    weeklyPitcherStats.forEach(function(player) {
      masterStatList.push({
        mlbid: player.mlbid,
        name: player.name,
        team: player.team,
        pos: player.pos,
        roster: player.roster,
        total: player.total
      })
    });


    // rank by total

    var x = rankedTotals(masterStatList, 'total');
    var totalList = [];

    x.forEach(function(player) {
      if (!uniqueObj[player.mlbid]) {
        uniqueObj[player.mlbid] = player;
        totalList.push(player);

      }
    });




    $scope.topTenList = totalList;



  }

  Dailybatterstat.find({filter: filter})
    .$promise
    .then(function(response) {
      weeklyBatterStats = response;
      Dailypitcherstat.find({filter: filter})
        .$promise
        .then(function(response) {
          weeklyPitcherStats = response;


          rankTheTopTen();

        })
        .catch(function(error) {
          console.log('get pitcher batter stats error: ', error);
        });


    })
    .catch(function(error) {
      console.log('get daily batter stats error: ', error);
    });
}
