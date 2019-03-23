Chat.directive('bbpChatMain', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/chat/templates/chat.main.html'
    }
  }
]);
Chat.directive('bbpChatWindow', [
  'socket',
  function(socket) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/chat/templates/chat.window.html',
      controller:'ChatMainController'
    }
  }
]);
