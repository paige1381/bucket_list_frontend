console.log('oh hayyy');

const app = angular.module('bucket_list_app', []);

app.controller('mainController', ['$http', function($http) {
  this.listItems = []

  $http({
    method: 'GET',
    url: 'http://localhost:3000/',
  }).then(response => {
    console.log('response: ', response);
    this.listItems = response.data
  }).catch(reject => {
    console.log('reject: ', reject);
  });

}])
