Chat.controller('ChatMainController', [
  '$scope',
  '$log',
  'socket',
  function($scope, $log, socket) {


    $scope.currentUser = window.localStorage.getItem('homeRoster');
    if (!$scope.currentUser) {
     // alert('you need to auth as a user');
    }

    $scope.isChatDisabled = function() {
      if (window.localStorage.getItem('homeRoster')) {
        return false;
      }
      return true;
    };
    $scope.chatMessages = [];
    socket.on('chat message', function(msg){
      $scope.chatMessages.push(msg);
    });
    $scope.postChatMessage = function() {
      if ($scope.currentChatMessage) {
        socket.emit('chatMessage', {user:$scope.currentUser, message: $scope.currentChatMessage});
        $scope.currentChatMessage = '';
      }
    }



  }
]);
