var app = angular.module("clioBucketsApp", []);

// Setup an interceptor that detects unauthorized and sends them to the login page
app.service("loggedOutInterceptor", function($q){
  return {
    responseError: function(response){
      if(response.status == 401){
        window.location = "/unauthed.html"
      }        
      return $q.reject(response)
    }
  }
});

app.config(function($httpProvider){
  $httpProvider.interceptors.push('loggedOutInterceptor');
});

app.controller("LogoutDirective", function($http){
  var ctrl = this;
  ctrl.logout = function(){
    $http.delete("logout.json").then(function(){
      window.location = "/unauthed.html"    
    });
  }
})


app.controller("StupidController", function($http){
  var ctrl = this
  $http.get("/departments.json").then(function(response){    
    ctrl.departments = response.data
  });

  ctrl.selectDepartment = function(id){    
    ctrl.departmentId = id
  }

  ctrl.findUsers = function(){
    ctrl.competencies = null;
    $http.get("/departments/"+ctrl.departmentId+"/users.json").then(function(response){
      ctrl.employees = response.data
    });
  }

  ctrl.findCompetencies = function(){
    ctrl.employees = null;
    ctrl.userCompetencies = null;
    $http.get("/departments/"+ctrl.departmentId+"/competencies.json").then(function(response){
      ctrl.competencies = response.data
    });
  }

  ctrl.selectEmployee = function(id){    
    $http.get("/users/"+id+"/competencies").then(function(response){
      ctrl.userCompetencies = response.data
    });
    $http.get("/users/"+id+"/grants").then(function(response){
      ctrl.competenciesGranted = {}
      for(i=0; i < response.data.length; i++){
        ctrl.competenciesGranted[response.data[i].competency_id] = true
      }
    });
  }

  return
});
