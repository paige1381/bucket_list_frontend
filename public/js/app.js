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
  this.createPostModal = false;
  this.editAvatarModal = false;
  this.openTheNav = false;

  //server location
  this.url = 'http://localhost:3000';

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
      this.getTodoList(this.oneUser_id);
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
      this.bucket_list = bucket_list_id;
      console.log('this.oneGoal:', this.oneGoal);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  // delete one bucket_list
  this.deleteOne = (id) => {
    console.log(id);
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
      url: this.url + "/users/" + id,
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

  this.getTodoList = (id) => {
    $http({
      url: this.url + "/users/" + id + "/bucket_lists/todo",
      method: "GET"
    }).then(response => {
      this.todoList = response.data;
      this.getCompletedList(id, this.todoList)
    }).catch(error => {
      console.log('error:', error);
    });
  }

  this.getCompletedList = (id, todoList) => {
    $http({
      url: this.url + "/users/" + id + "/bucket_lists/completed",
      method: "GET"
    }).then(response => {
      this.completedList = response.data;
      this.dragDropLists(todoList, this.completedList)
    }).catch(error => {
      console.log('error:', error);
    });
  }


  this.dragDropLists = (todoList, completedList) => {
    $scope.models = {
        selected: null,
        lists: {"todo": [], "completed": []}
    };

    for (let i = 0; i < todoList.length; i++) {
      $scope.models.lists.todo.push({
        label: todoList[i].list_item.title,
        list_item_id: todoList[i].list_item.id,
        id: todoList[i].id
      })
    }

    for (let i = 0; i < completedList.length; i++) {
      $scope.models.lists.completed.push({
        label: completedList[i].list_item.title,
        list_item_id: completedList[i].list_item.id,
        id: completedList[i].id
      })
    }

  }

  this.getOneBucketList = (id, completed) => {
    $http({
      url: this.url + "bucket_lists/" + id,
      method: "GET"
    }).then(response => {
      this.bucket_list = response.data;
      console.log(this.bucket_list);
      this.updateOneBucketList(this.bucket_list, completed)
    }).catch(error => {
      console.log('error:', error);
    });
  }

  this.updateOneBucketList = (bucketList, completed) => {
    console.log(bucketList);
    console.log(bucketList.id + ' completed?', completed);
    $http({
      method: "PUT",
      url: this.url + "bucket_lists/" + bucketList.id,
      data: {
        bucket_list: {
          user_id: bucketList.user_id,
          list_item_id: bucketList.list_item_id,
          completed: completed
        }
      }
    }).then(response => {
      bucketList.completed = completed;
      console.log(response.data);
      console.log(bucketList);
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
    templateUrl: "../partials/home.html"
  })

  $routeProvider.when("/profile", {
    templateUrl: "../partials/profile.html"
  })

  $routeProvider.when("/user/:id", {
    templateUrl: "../partials/user.html"
  })
}]);
