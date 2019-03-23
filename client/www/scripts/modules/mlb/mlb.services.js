MLB.service('MLBServices', [
  '$log',
  'Mlbbatters',
  'Mlbpitchers',
  function($log, Mlbbatters, Mlbpitchers) {
    var svc = this;

    svc.getMlbHitters = function() {

      return Mlbbatters.fetchBatters()
        .$promise
        .then(function(response) {
        //  $log.debug('yes: ' + response);
          if (response.data) {
            return response.data;

          }
          return [];
        })
        .catch(function(error) {
          $log.warn('no: ' + error.message);
        });
    };
    svc.getMlbPitchers = function() {

      return Mlbpitchers.fetchPitchers()
        .$promise
        .then(function(response) {
        //  $log.debug('yes: ' + response);
          if (response.data) {
            return response.data;

          }
          return [];
        })
        .catch(function(error) {
          $log.warn('no: ' + error.message);
        });
    };

    return  svc;
  }

]);
