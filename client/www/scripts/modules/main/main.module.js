var Main = angular.module('Main', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'angularSpinner',
  'ngCookies',
  'HelloWorld',
  'Common',
  'Admin',
  'Charts',
  'Roster',
  'Chat',
  'Draft',
  'MLB',
  'Auth',
  'Stats',
  'bbPoolApi',
  'ui.bootstrap',
  'ui.utils'
]);

Main.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './scripts/modules/main/templates/main.html',
        controller: 'MainController'
        //url:'/draft',
        //controller:'DraftMainController',
        //templateUrl:'./scripts/modules/draft/templates/draft.main.html'
      })
      .state('roster', {
        url:'/roster/:slug',
        controller:'RosterMainController',
        templateUrl:'./scripts/modules/roster/templates/roster.main.html'
      })
      .state('authuser', {
        url:'/authuser/:slug',
        controller:'AuthUserController',
        templateUrl:'./scripts/modules/auth/templates/auth.user.html'
      })
      .state('login', {
        url:'/login',
        controller:'AuthUserController',
        templateUrl:'./scripts/modules/auth/templates/auth.login.html'
      })
      .state('statsupdate', {
        url:'/statsupdate',
        controller: 'StatsUpdateFramesController',
        templateUrl:'./scripts/modules/stats/templates/stats.update.main.html'
      })
      .state('mlb', {
        url:'/mlb',
        controller:'MLBMainController',
        templateUrl:'./scripts/modules/mlb/templates/mlb.main.html'
      })
      .state('charts', {
        url:'/charts',
        controller:'ChartsMainController',
        templateUrl:'./scripts/modules/charts/templates/charts.main.html'
      })
      .state('diamond', {
        url:'/diamond',
        templateUrl:'./scripts/modules/roster/templates/roster.diamond.main.html'
      })
      .state('rosters', {
        url:'/rosters',
        templateUrl:'./scripts/modules/roster/templates/roster.main.list.view.html'
      })
      .state('draft', {
        url:'/draft',
        controller:'DraftMainController',
        templateUrl:'./scripts/modules/draft/templates/draft.main.html'
      })
      .state('adminroster', {
        url:'/adminroster',
        controller:'RosterAdminController',
        templateUrl:'./scripts/modules/admin/templates/admin.roster.html'
      })
      .state('adminstats', {
        url:'/adminstats',
        controller:'AdminStatsController',
        templateUrl:'./scripts/modules/admin/templates/admin.stats.html'
      })
      .state('protected', {
        url:'/protected/:slug',
        controller:'RosterProtectedController',
        templateUrl:'./scripts/modules/roster/templates/roster.protected.html'
      })
      .state('generate',{
        url:'/generate',
        controller:'GenListController',
        templateUrl:'./scripts/modules/draft/templates/draft.main.html'
      })
      .state('rank', {
        url:'/rank/:pos',
        controller:'RankPosController',
        templateUrl:'./scripts/modules/stats/templates/rank.pos.html'
      })

      .state('chat', {
        url:'/chat',
        controller:'ChatMainController',
        templateUrl:'./scripts/modules/chat/templates/chat.main.html'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: './scripts/modules/admin/templates/admin.main.html',
        controller: 'AdminMainController'
      });

  }
]);
