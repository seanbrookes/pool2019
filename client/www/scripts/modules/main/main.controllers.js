Main.controller('MainController', [
  '$scope',
  '$log',
  '$location',
  function($scope, $log, $location){
    $log.debug('Main Controller');
    $scope.currentRoster = {};
    $scope.currentFilter = '';
    $scope.bbpCtx = {};
    $scope.currentRosterSlug = 'mashers';

    function init() {

        $scope.bbpCtx = {
          homeRoster: '',
          currentRoster: '',
          currentPosFilter: '',
          amIActive: function(key) {
            // get the current URL
            var currPath = $location.path();
            if (currPath.indexOf(key) > -1) {
              return 'active-nav';
            }
            return '';
            // check if it matches the key
          }
        };
    }

    $scope.isDog = function(){
      if(localStorage.getItem('homeRoster')){
        if (localStorage.getItem('homeRoster') === 'dog'){
          return true;
        }
        return false;
      }
      return false;
    };

    if (window.localStorage && window.localStorage.getItem('homeRoster')) {
      $scope.bbpCtx.homeRoster = window.localStorage.getItem('homeRoster');
    }
    init();
}]);
