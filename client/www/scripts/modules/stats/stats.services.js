Stats.service('StatsServices', [
  '$log',
  'Totals',
  'Dailybatterstat',
  'Dailypitcherstat',
  function($log, Totals, Dailybatterstat, Dailypitcherstat) {
    var svc = this;

    var currentHistoryCollection = [];

    function assignUniqueDeltaTotal(playerName, delta, collection) {
      collection.map(function(player) {
        if (player.name === playerName) {
          player.deltaTotal = delta;
        }
      });
      return collection;
    }


    svc.calculateDeltaPoints = function(historyCollection) {

      var whosHot = [];
      var uniquePlayerCollection = svc.getUniquePlayers(historyCollection);
      uniquePlayerCollection.map(function(player) {
        var playerDelta = svc.getPlayerDelta(player.name, historyCollection);
        $log.debug('PLAYER DELTA: ' +  playerDelta + ' ' + player.name);
        player.deltaTotal = playerDelta;

       // historyCollection = assignDeltaTotal(playerName, playerDelta, historyCollection);
      });

      return uniquePlayerCollection;

    };
    svc.getPlayerHistory = function(player) {
      if (currentHistoryCollection) {
        return svc.getPlayerCollection(player.name, currentHistoryCollection);

      }
      return [];
    };
    svc.getPlayerCollection = function(playerName, historyCollection) {
      var retVar = [];
      historyCollection.map(function(player) {
        if (player.name === playerName) {
          retVar.push(player);
        }
      });

      return retVar;



    };
    svc.getPlayerDelta = function(playerName, historyCollection) {
      var playerCollection = svc.getPlayerCollection(playerName, historyCollection);
      var playerLowTotal = svc.getPLayerLowTotal(playerCollection);
      var playerHighTotal = svc.getPLayerHighTotal(playerCollection);
      var playerDelta = (playerHighTotal - playerLowTotal);
      return playerDelta;

    };

    function isUnique(name, collection) {
      var isUnique = true;
      collection.map(function(item) {
        if (item.name === name) {
          isUnique = false;
        }
      });
      return isUnique;
    }
    svc.getUniquePlayers = function(historyCollection) {
      var retVar = [];
      historyCollection.map(function(update) {
        var isUniquePlayer = isUnique(update.name, retVar);
        if (isUniquePlayer) {
          retVar.push(update);
        }
      });

      return retVar;
    };
    svc.getPLayerLowTotal = function(playerCollection) {
      var lowTotal = playerCollection[0].total;
      playerCollection.map(function(item) {
        if (item.total < lowTotal) {
          lowTotal = item.total;
        }
      });
      return lowTotal
    };
    svc.getPLayerHighTotal = function(playerCollection) {
      var highTotal = playerCollection[0].total;
      playerCollection.map(function(item) {
        if (item.total > highTotal) {
          highTotal = item.total;
        }
      });
      return highTotal;
    };

    svc.getBatterHistory = function(filter) {
      if (!filter) {
        filter = {};
      }
      return Dailybatterstat.find(filter)
      .$promise
      .then(function(response) {
        currentHistoryCollection = response;
        return response;
      })
      .catch(function(error) {
        $log.debug('bad get Batter History', error);
      });
    };
    svc.getPitcherHistory = function(mlbid) {
      var filter = {};
      if (mlbid) {
        filter = {
          'filter[where][mlbid]':mlbid
        };
      }
      return Dailypitcherstat.find(filter)
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.debug('bad get Batter History', error);
        });
    };


    svc.processRosterTotals = function(latestTotals) {
      var rosterSlug = latestTotals.roster;
      var filter = {
        'filter[where][roster]':rosterSlug,
        'filter[order]':'grandTotal DESC'
      };
      Totals.find(filter)
        .$promise
        .then(function (results) {
          // process the totals against the new ones
          // get the latest totals
          $log.debug('totals: ' + results);
          // if there are no totals then create them
          var bInsert = true;
          //if (results.length === 0) {
          //  Totals.create(latestTotals);
          //}
          if (results.length > 0) {
            // get the current highest grandTotal
            if (results[0].roster) {
              if (latestTotals.grandTotal > results[0].grandTotal) {
                $log.debug('creating new total record');
                var insertObj = latestTotals;

                Totals.create(latestTotals);
              }
            }
          }
          else {
            // first update of the year
            Totals.create(latestTotals);
          }

            // there is at least one result

          // iterate to get the last update timestamp
          // get the timestamp for now
          // compare for each
          // if there is a delta then create the record

        })
        .catch(function(error) {
          $log.warn('StatsServices - processRosterTotals: ' + error.message);
        });
    };


    return svc;

  }
]);
