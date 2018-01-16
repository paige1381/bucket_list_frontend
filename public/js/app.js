const app = angular.module('bucket_list_app', ['ngRoute', 'ngSanitize']);

app.controller('MainController', ['$http', '$scope', '$sce', function($http, $scope, $sce) {
  this.users = [];
  this.list_items = [];
  this.bucket_lists = [];
  this.formdata = {};
  this.user = {};
  this.goal = {};
  this.userPass = {};
  this.loggedIn = false;

  //server location
  this.url = 'http://localhost:3000';

  // log in function
  this.login = (userPass) => {
    console.log(userPass);
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: {
        user: {
          username: userPass.username,
          password: userPass.password,
          user_id: userPass.id
        }
      },
    }).then(response => {
      console.log(response);
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      this.loggedIn = true;
      console.log('logged in?:', this.loggedIn);
    });
}
    //see the secret content
    this.getUsers = () => {
      $http({
        url: this.url + '/users',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(response => {
        console.log(response);
        if (response.data.status == 401) {
          this.error = "Unauthorized";
        } else {
          this.users = response.data;
        }
      });
    }

    //logout
    this.logout = ()=> {
      localStorage.clear('token');
      location.reload();
      this.loggedIn = false;
      console.log('logged in?:', this.loggedIn);
      this.user = {};
      console.log(this.user);

    }


//GOT FROM JOSEFINA
    this.register = (regData) => {
       console.log(regData);

       $http({
         method: 'POST',
         url: this.url + '/users/create',
         data: { user: { username: regData.username, password: regData.password }}
       }).then(response => {
         console.log(response);
         this.user = response.data.user;
         console.log('USER DATA:', this.user);
         this.logged = true;
         this.clickedLog = false;
         localStorage.setItem('token', JSON.stringify(response.data.token));
       });
     }
/////////////////HER FAULT IF IT BREAKS//////////////////

  // dupe of getAllPosts?
  $http({
    method: 'GET',
    url: 'http://localhost:3000/list_items',
  }).then(response => {
    this.list_items = response.data;
    this.post = this.list_items.id;
    console.log('logged in?:', this.loggedIn);
  }).catch(reject => {
    console.log('reject: ', reject);
  });

  // get all bucket_lists
  $http({
    method: 'GET',
    url: 'http://localhost:3000/bucket_lists',
  }).then(response => {
    this.bucket_lists = response.data;
    console.log('logged in?:', this.loggedIn);
  }).catch(reject => {
    console.log('reject: ', reject);
  });

  // get list_items for home page
  this.getAllPosts = () => {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/list_items',
    }).then(response => {
      this.list_items = response.data;
      // this.user = this.bucket_lists.users
      console.log('logged in?:', this.loggedIn);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.getAllPosts();

  // get user info
  this.getUser = (id) => {
    console.log(this.user);
    $http({
      url: "http://localhost:3000/users/" + id,
      method: "GET"
    }).then(response => {
      this.oneUser = response.data;
      console.log(this.oneUser);
      console.log('logged in?:', this.loggedIn);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  // show one list_item
  this.getOne = (id) => {
    $http({
      url: "http://localhost:3000/list_items/" + id,
      method: "GET"
    }).then(response => {
      this.oneGoal = response.data;
      console.log(this.oneGoal);
      console.log('logged in?:', this.loggedIn);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  // delete one list_item
  this.deleteOne = (id) => {
    $http({
      url: "http://localhost:3000/bucket_lists/" + id,
      method: "DELETE"
    }).then(response => {
      console.log('post deleted');
      this.bucket_lists.splice(response.data, 1);
      console.log('logged in?:', this.loggedIn);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  // create new bucket_list
  this.createPost = (post_id, user_id) => {
    console.log("post id: " + post_id + " user id: " + user_id);
    this.newBucket = {
      user_id: user_id,
      list_item_id: post_id
    };
    $http({
      method: 'POST',
      url: "http://localhost:3000/bucket_lists",
      data: this.newBucket
    }).then(response => {
      this.bucket_lists.push(response.data)
      console.log(this.bucket_lists);
      console.log(this.user);
      this.getAllPosts();
    }).catch(error => {
      console.log('error:', error);
    });
  }

  // create new list_item
  this.processForm = () => {
    $http({
      method: 'POST',
      url: "http://localhost:3000/list_items",
      data: this.formdata
    }).then(response => {
      this.post = response.data;
      this.list_items.unshift(this.post);
      this.createPost(this.post.id, this.user.id)
      console.log(this.user);
      this.formdata = {}
    }).catch(error => {
      console.log('error:', error);
    });
  }

}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $routeProvider.when("/", {
    templateUrl: "../partials/home.html",
    controller: 'MainController as ctrl',
    controllerAs: 'ctrl'
  })

  $routeProvider.when("/profile", {
    templateUrl: "../partials/profile.html",
    controller: 'MainController as ctrl',
    controllerAs: 'ctrl'
  })

  $routeProvider.when("/goal/:id", {
    templateUrl: "../partials/one_goal.html",
    controller: 'MainController as ctrl',
    controllerAs: 'ctrl'
  })

  $routeProvider.when("/user/:id", {
    templateUrl: "../partials/user.html",
    controller: 'MainController as ctrl',
    controllerAs: 'ctrl'
  })

}]);
