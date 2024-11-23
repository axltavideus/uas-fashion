app.controller('ReviewController', function ($scope, $http) {
    $scope.reviews = [];
    $scope.newReview = {};

    $http.get('/api/reviews').then(response => {
        $scope.reviews = response.data;
    });

    $scope.submitReview = function () {
        $http.post('/api/reviews', $scope.newReview).then(response => {
            $scope.reviews.push(response.data);
            $scope.newReview = {};
        });
    };
});

app.controller('ShopController', function ($scope, $http) {
    $scope.shops = [];
    $scope.newShop = {};

    $http.get('/api/shops').then(response => {
        $scope.shops = response.data;
    });

    $scope.addShop = function () {
        $http.post('/api/shops', $scope.newShop).then(response => {
            $scope.shops.push(response.data);
            $scope.newShop = {};
        });
    };
});

app.controller('AuthController', function ($scope, $http) {
    $scope.credentials = {};
    $scope.user = {};

    $scope.login = function () {
        $http.post('/api/auth/login', $scope.credentials).then(response => {
            alert('Logged in successfully!');
        }, err => {
            alert('Invalid credentials');
        });
    };

    $scope.signup = function () {
        $http.post('/api/auth/signup', $scope.user).then(response => {
            alert('Signup successful!');
        });
    };
});

app.controller("HomeController", ["$scope","$http", function ($scope, $http) {
    $scope.review = {}; // Initialize the review object
    $scope.alertMessage = ""; // Variable to store alert messages
    $scope.alertType = ""; // Variable to define alert type (success or error)
    $scope.reviews = []; // Initialize the reviews array
    $scope.currentPage = 1; // Initialize the current page
    $scope.pageSize = 5; 

    $scope.submitReview = function () {
      if ($scope.review.name && $scope.review.text) {
        $http
          .post("/api/reviews", $scope.review)
          .then(function (response) {
            // Success callback
            $scope.alertMessage = "Review submitted successfully!";
            $scope.alertType = "success"; // Bootstrap success alert
            $scope.review = {}; // Reset the form
          })
          .catch(function (error) {
            // Error callback
            $scope.alertMessage = "Failed to submit review. Please try again.";
            $scope.alertType = "danger"; // Bootstrap danger alert
          });
      } else {
        $scope.alertMessage = "Please fill out all fields before submitting.";
        $scope.alertType = "warning"; // Bootstrap warning alert
      }
    };

    // Fetch reviews from the API
    $http.get('/api/reviews').then(function(response) {
        $scope.reviews = response.data.sort(function(a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    });

    // Function to set the current page
    $scope.setCurrentPage = function(page) {
        if (page < 1 || page > $scope.pageCount) return;
        $scope.currentPage = page;
    };

    // Function to calculate the number of pages
    $scope.pageCount = function() {
        return Math.ceil($scope.reviews.length / $scope.pageSize);
    };

    // Function to get the reviews for the current page
    $scope.getPageReviews = function() {
        var start = ($scope.currentPage - 1) * $scope.pageSize;
        var end = start + $scope.pageSize;
        return $scope.reviews.slice(start, end);
    };

    $scope.deleteReview = function(review) {
        $http.delete('/api/reviews/' + review._id)
          .then(function(response) {
            // Remove the review from the scope
            var index = $scope.reviews.indexOf(review);
            $scope.reviews.splice(index, 1);
            $scope.alertMessage = "Review deleted successfully!";
            $scope.alertType = "success";
          })
          .catch(function(error) {
            $scope.alertMessage = "Failed to delete review. Please try again.";
            $scope.alertType = "danger";
          });
    };
  },
]);

app.controller('SustainableController', ['$scope', function($scope) {
    $scope.message = 'Welcome to the Sustainable Fashion page!';
}]);

app.controller('FashionController', ['$scope', function($scope) {
    $scope.message = 'Welcome to the Current Fashion Trends page!';
}]);

app.controller('LoginController', function($scope, $http, $location) {
    $scope.credentials = {
        email: '',
        password: ''
    };

    $scope.login = function() {
        $http.post('/api/auth/login', $scope.credentials)
            .then(function(response) {
                if (response.data.redirect) {
                    $location.path(response.data.redirect);
                }
            })
            .catch(function(error) {
                console.error(error);
            });
    };
});

app.controller('SignupController', function($scope, $http) {
    $scope.credentials = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    };

    $scope.signup = function() {
        // Check if passwords match
        if ($scope.credentials.password !== $scope.credentials.confirmPassword) {
            document.getElementById('error-message').innerHTML =
                `<div class="alert alert-danger">Passwords do not match.</div>`;
            return; // Stop further execution if passwords don't match
        }

        // Proceed to send signup data to the backend
        $http.post('/api/auth/signup', $scope.credentials)
            .then(function(response) {
                alert('Signup successful! You can now log in.');
                window.location.href = '#!/login'; // Redirect to login page
            })
            .catch(function(error) {
                document.getElementById('error-message').innerHTML =
                    `<div class="alert alert-danger">${error.data.message}</div>`;
            });
    };
});

app.controller("IndexController", ["$scope","$location",function ($scope, $location) {
    $scope.hideNavbarAndFooter = false;

    $scope.$on("$routeChangeSuccess", function () {
      if ($location.path() === "/login" || $location.path() === "/signup") {
        $scope.hideNavbarAndFooter = true;
      } else {
        $scope.hideNavbarAndFooter = false;
      }
    });
  },
]);
