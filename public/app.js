const app = angular.module('FlightApp', ['ngCookies']);


app.controller('MainController', ['$cookies', '$scope', '$http', function($cookies, $scope, $http){

  //Global Variables
  this.loading = null;
  this.loginError = null;
  this.userSuccefullyCreated = null;

  //Form data
  this.formdata = {};
  this.logindata = {}
  this.signupdata = {};

  //Navigaction
  this.includePath = 'partials/home.html';
  this.changeInclude = (path) => {
    this.includePath = 'partials/' + path + '.html';
  }
  this.goToHome = () => {
    this.changeInclude('home');
  }
  this.goToProfile = () => {
    this.changeInclude('profile');
    this.getFlights()
  }
  this.goTologin = () => {
    this.changeInclude('login');
  }
  this.goToSignUp = () => {
    this.changeInclude('signup');
  }

  //Sign Up
  this.signup = () => {
    $http({
      method:'POST',
      url: '/signup',
      data: {
        firstname: this.signupdata.firstname,
        lastname: this.signupdata.lastname,
        email: this.signupdata.email,
        password: this.signupdata.password,
      }
    }).then(response => {
      if(response.data.message === "user created"){
        this.signupdata = {};
        this.loginError = null;
        this.userSuccefullyCreated = true;
        this.changeInclude('login');
      }
    });
  }

  //Login
  this.login = () => {
    this.userSuccefullyCreated = null;
    this.loginError = null;
    $http({
      method:'POST',
      url: '/login',
      data: {
        email: this.logindata.email,
        password: this.logindata.password
      }
    }).then(response => {
      this.currentUser = response.data.message.firstname + ' ' + response.data.message.lastname;
      this.currentUserId = response.data.message._id;
      $cookies.put('user_id', this.currentUserId);
      $cookies.put('username', this.currentUser);
      this.checkLoginSession()
      this.logindata = {};
      this.changeInclude('home');
    }, err => {
      if(err.data.status === 401){
        this.loginError = true
      }
    });
  }

  // log out function
this.logout = () => {
  // NOTE: remove log on project complete
  console.log('logging out');
  this.loggedIn = false;
  // removes browser cookies, logged in username and user_id
  $cookies.remove('username', this.currentUser);
  $cookies.remove('user_id', this.currentUserId);
    this.changeInclude('home');
};

  //Search for flights
  this.findFlight = function(){
    this.changeInclude('search');
    this.loading = true;
    $http({
      method: 'POST',
      url: '/data',
      data: {
        origin: this.formdata.origin,
        destination: this.formdata.destination,
        departure_date: this.formdata.departure_date.toISOString().split('T')[0],
        adults: this.formdata.adults,
        childern: this.formdata.childern
      }
    }).then(response => {
      this.loading = false;
      this.flightdata = response.data.results;
      console.log(this.flightdata);
    });
  }

  //autocomplete origin search
  this.autoOrigin = function(){
    $http({
      method: 'POST',
      url: '/autocomplete',
      data: {
        term: this.formdata.origin
      }
    }).then(response => {
      this.originData = response.data
    });
  }

  //auto complete destination search
  this.autoDestination = function(){
    $http({
      method: 'POST',
      url: '/autocomplete',
      data: {
        term: this.formdata.destination
      }
    }).then(response => {
      this.destinationData = response.data
    });
  }

  //set origin based on autocomplete
  this.setOrigin = function(data){
    this.formdata.origin = data.value;
    this.originData = null;
  }

  //set destination based on autocomplete
  this.setDestination = function(data){
    this.formdata.destination = data.value;
    this.destinationData = null;
  }

  // check browser for previous logged in user cookies function
  this.checkLoginSession = () => {
    $scope.loggedInSessionCookie = $cookies.get('username');
    $scope.loggedInSessionIdCookie = $cookies.get('user_id');
    this.currentUser = $scope.loggedInSessionCookie;
    this.currentUserId = $scope.loggedInSessionIdCookie;
    // if found cookies toggle(hide/show) items on navbar
    if (this.currentUserId = $scope.loggedInSessionIdCookie) {
      this.loggedIn = true;
    } else {
      this.logout()
    };
  };

  this.addFlight = (flight) => {
    if($cookies.get('user_id')){
      $http({
        method: 'POST',
        url: '/booking',
        data: {
          user_id: $cookies.get('user_id'),
          flight: flight
        }
      }).then(response => {
        console.log(response);
        this.changeInclude('profile');
        this.getFlights()
      });
    }else{
      this.changeInclude('login')
    }
  }

  this.getFlights = () => {
    if($cookies.get('user_id')){
      console.log($cookies.get('user_id'));
      $http({
        method: 'GET',
        url: '/booking',
        params: {
          user_id: $cookies.get('user_id')
        }
      }).then(response => {
        this.flights = response.data;
        console.log(response);
      });
    }
  }

  this.checkLoginSession()
  this.getFlights()

}]);
