var app = angular.module('mvcApp', ['ngRoute', 'ngFileUpload']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .when('/shop', {
            templateUrl: 'shop.html',
            controller: 'ShopController'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'SignupController'
        })
        .when('/fashion', {
            templateUrl: 'fashion.html',
            controller: 'FashionController'
        })
        .when('/sustainable', {
            templateUrl: 'sustainable.html',
            controller: 'SustainableController'
        })
        .when('/admin', {
            templateUrl: 'admin.html',
            controller: 'AdminController',
        })
        .when('/events', {
            templateUrl: 'events.html',
            controller: 'EventsController',
        })
        .otherwise({
            redirectTo: '/home' // Redirect to the home page by default
        });
}]);

