const app = angular.module('bucket_list_app', ['ngRoute', 'ngSanitize', 'dndLists']);

app.controller('MainController', ['$http', '$scope', '$sce', function($http, $scope, $sce) {
  this.users = [];
  this.list_items = [];
  this.bucket_lists = [];
  this.formdata = {};
  this.user = {};
  this.goal = {};
  this.userPass = {};
  this.loggedIn = false;
  this.bucket_list = null;
  this.homeItemModal = false;
  this.profileItemModal = false;
  this.loginItemModal = false;
  this.signUpItemModal = false;


  //server location
  this.url = 'http://localhost:3000/';

  // log in function
  this.login = (userPass) => {
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
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      this.loggedIn = true;
      console.log('this.user:', this.user);
    });
  }

  //see the secret content
  // this.getUsers = () => {
  //   $http({
  //     url: this.url + '/users',
  //     method: 'GET',
  //     headers: {
  //       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
  //     }
  //   }).then(response => {
  //     console.log(response);
  //     if (response.data.status == 401) {
  //       this.error = "Unauthorized";
  //     } else {
  //       this.users = response.data;
  //     }
  //   });
  // }

  //logout
  this.logout = ()=> {
    localStorage.clear('token');
    location.reload();
    this.loggedIn = false;
    this.user = {};
    console.log('this.user:', this.user);
  }

  this.register = (regData) => {
     $http({
       method: 'POST',
       url: this.url + '/users',
       data: { user: { username: regData.username, password: regData.password,
       avatar: regData.avatar
       }}
     }).then(response => {
       this.user = response.data;
       this.logged = true;
       this.clickedLog = false;
       localStorage.setItem('token', JSON.stringify(response.data.token));
       console.log('this.user:', this.user);
     });
   }

  // dupe of getAllPosts?
  // $http({
  //   method: 'GET',
  //   url: this.url + "/list_items",
  // }).then(response => {
  //   this.list_items = response.data;
  //   this.post = this.list_items.id;
  // }).catch(reject => {
  //   console.log('reject: ', reject);
  // });

  // get list_items for home page
  this.getAllPosts = () => {
    $http({
      method: 'GET',
      url: this.url + '/list_items',
    }).then(response => {
      this.list_items = response.data;
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.getAllPosts();

  // get user info
  this.getUser = (id) => {
    $http({
      url: this.url + "/users/" + id + "/bucket_lists",
      method: "GET"
    }).then(response => {
      this.oneUser = response.data;
      this.oneUser_id = id;
      console.log('this.oneUser:', this.oneUser);
      this.dragDropLists(this.oneUser);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  // show one list_item
  this.getOne = (list_item_id, bucket_list_id) => {
    $http({
      url: this.url + "/list_items/" + list_item_id,
      method: "GET"
    }).then(response => {
      this.oneGoal = response.data;
      // this.bucket_list = bucket_list_id;
      console.log('this.oneGoal:', this.oneGoal);
      // console.log('this.bucket_list:', this.bucket_list);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  // delete one bucket_list
  this.deleteOne = (id) => {
    $http({
      url: this.url + "/bucket_lists/" + id,
      method: "DELETE"
    }).then(response => {
      this.bucket_lists.splice(response.data, 1);
      this.getUser(this.oneUser_id);
      this.getAllPosts();
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.editAvi = (id) => {
    $http({
      method: "PUT",
      url: "http://localhost:3000/users/" + id,
      data: this.formData,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(response => {
      this.oneUser[0].user.avatar = this.formData.avatar
      this.formData = {};
      console.log('this.oneUser[0].user.avatar:', this.oneUser[0].user.avatar);
    }, error => {
      console.error(error);
    }).catch(err => console.error("Catch: ", err));
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
      url: this.url + "/bucket_lists",
      data: this.newBucket
    }).then(response => {
      this.bucket_lists.push(response.data)
      this.getAllPosts();
    }).catch(error => {
      console.log('error:', error);
    });
  }

  // create new list_item
  this.processForm = () => {
    $http({
      method: 'POST',
      url: this.url + "/list_items",
      data: this.formdata
    }).then(response => {
      this.post = response.data;
      this.list_items.unshift(this.post);
      this.createPost(this.post.id, this.user.id)
      this.formdata = {}
      console.log('this.post:', this.post);
    }).catch(error => {
      console.log('error:', error);
    });
  }

  // Experimenting!!!
  this.dragDropLists = (user) => {
    $scope.models = {
        selected: null,
        lists: {"todo": [], "completed": []}
    };

    for (let i = 0; i < user.length; i++) {
      $scope.models.lists.todo.push({
        label: user[i].list_item.title,
        list_item_id: user[i].list_item.id,
        id: user[i].id
      })
    }

    $scope.$watch('models', function(model) {
      $scope.modelAsJson = angular.toJson(model, true);
    }, true);

  }


}]);


app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $routeProvider.when("/", {
    templateUrl: "../partials/home.html"
  })

  $routeProvider.when("/profile", {
    templateUrl: "../partials/profile.html"
  })

  $routeProvider.when("/user/:id", {
    templateUrl: "../partials/user.html"
  })
}]);
