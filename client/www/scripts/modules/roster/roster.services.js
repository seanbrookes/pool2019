/**
 * Created by seanbrookes on 2014-03-27.
 */
Roster.service('RosterService',[
  'Roster',
  '$q',
  '$log',
  function(Roster,$q, $log){

    var svc = this;

    svc.getAllRosters = function() {
      //Roster.find({}, function(err, respon))
      return Roster.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all rosters: ' + JSON.stringify(error));
        });
    };
    svc.addRoster = function(roster) {
      if (roster.slug) {
        return Roster.create(roster)
          .$promise
          .then(function(response) {
            $log.debug('Roster Added: ', response);
            return response;
          })
          .catch(function(error) {
            $log.warn('bad add roster', error);
          });

      }
    };
    svc.getRoster = function(slug) {
      var filter = {
        'filter[where][slug]':slug
      };
      return Roster.query(filter)
        .$promise
        .then(function(response) {
          return response[0];
        })
        .catch(function(error) {
          $log.warn('bad get roster: ' + error.message);
        });

      //var filter = {
      //  'filter[where][roster]':slug
      //};
      //return Roster.find(filter)
      //  .$promise
      //  .then(function(response) {
      //    return response;
      //  })
      //  .catch(function(error) {
      //    $log.warn('bad get roster: ' + JSON.stringify(error));
      //  })
    };
    svc.updateRoster = function(roster) {
      delete roster._id;
      return Roster.upsert(roster,
        function(response) {
          return response;
        },
        function(error) {
          $log.warn('bad update roster: ' + error.message);
          return;
        });
    };
    svc.saveRosterPlayer = function(player) {

      return svc.getRoster(player.slug)
        .then(function(roster) {
          var isUnique = true;
          roster.players.map(function(rPlayer) {
            if (rPlayer.name === player.name) {
              rPlayer = player;
              isUnique = false;
            }
          });
          if (isUnique) {
            roster.players.push(player);
          }
          svc.updateRoster(roster);
          return player;
        });
      // get the roster based on the slug
      // check to see if player exists
      // if so then assign this object to player
      // if not add player to players collection
      // save roster
    };
    svc.deleteRosterPlayer = function(roster, player) {
      roster.players.map(function(p, i) {
        if (p.name === player.name) {
          $log.debug('delete player at index: ' + i);
          roster.players.splice(i, 1);
        }
      });
      return svc.updateRoster(roster);
    };

    var deferred = $q.defer();
    var slug = 'bashers';
    var filter = {
      'filter[where][slug]':slug
    };
//    Roster.find(filter).
//      then(function(response){
//        deferred.resolve(data);
//      }
//    );

    svc.getRosterBySlug = function(slug){
      console.log('strangely in the function  getRosterBySlug');
      return deferred.promise;
    };

    return svc;

  }
]);
