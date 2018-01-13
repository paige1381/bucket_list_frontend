const app = angular.module('bucket_list_app', ['ngRoute', 'ngSanitize']);

app.controller('MainController', ['$http', '$scope', '$sce', function($http, $scope, $sce) {
  this.users = []
  this.list_items = []
  this.bucket_lists = []
  this.formdata = {}

  this.getOne = () => {
    $http({
    url: "http://localhost:3000/list_items/",
    method: "GET"
    }).then(response => {
      this.list_items[0] = response.data
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  $http({
    method: 'GET',
    url: 'http://localhost:3000/users',
  }).then(response => {
    this.users = response.data
  }).catch(reject => {
    console.log('reject: ', reject);
  });

  $http({
    method: 'GET',
    url: 'http://localhost:3000/list_items',
  }).then(response => {
    this.list_items = response.data;
    this.post = this.list_items.id;
    console.log(this.list_items[0].id);
  }).catch(reject => {
    console.log('reject: ', reject);
  });

  this.getAllPosts = () => {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/bucket_lists',
    }).then(response => {
      this.bucket_lists = response.data
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.getAllPosts();



  this.processForm = () => {
      $http({
        method: 'POST',
        url: 'http://localhost:3000/list_items',
        data: this.formdata
      }).then(response => {
        console.log('response:', response.data);
        this.formdata = {};
        this.bucket_lists.push(this.formdata);
        console.log('new bucket:' + this.bucket_lists[0].list_item.title);
        this.getAllPosts();
      }).catch(error => {
        console.log('error:', error);
    });
  }

}]);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode({ enabled: true, requireBase: false });

  $routeProvider.when("/", {
    templateUrl: "../partials/home.html"
  })

  $routeProvider.when("/profile", {
    templateUrl: "../partials/profile.html"
  })

  $routeProvider.when("/goal/", {
    templateUrl: "../partials/one_goal.html"
  })

  $routeProvider.when("/user", {
    templateUrl: "../partials/one_user.html"
  })

}]);
