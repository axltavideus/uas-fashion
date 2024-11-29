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

app.controller('ShopController', function ($scope, $http, Upload) {
    $scope.shops = [];
    $scope.newShop = {};
    var role = sessionStorage.getItem('role');
    $scope.role = role;

    $http.get('/api/shops').then(response => {
        $scope.shops = response.data;
    });

    $scope.addShop = function () {
        const formData = {
            name: $scope.newShop.name,
            description: $scope.newShop.description,
            location: $scope.newShop.location,
            image: $scope.newShop.image,
            link: $scope.newShop.link,  
        };

        Upload.upload({
            url: '/api/shops',
            data: formData
        }).then(response => {
            $scope.shops.push(response.data);
            $scope.newShop = {};
        }).catch(error => {
            console.error('Error uploading shop:', error);
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

app.controller("HomeController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    // Check role and redirect if not logged in
    var role = sessionStorage.getItem("role");
    $scope.role = role;

    if (!role) {
        $location.path("/login");
    }

    // Initialize user data
    $scope.init = function () {
        const userData = sessionStorage.getItem("user"); // Use sessionStorage consistently
        if (userData) {
            try {
                $scope.user = JSON.parse(userData);
                console.log("Parsed user data:", $scope.user);
            } catch (error) {
                console.error("Error parsing user data:", error);
                $scope.user = {};
            }
        } else {
            console.warn("User data not found in session storage.");
            $scope.user = {};
        }
    };

    // Initialize review and alert variables
    $scope.review = {};
    $scope.alertMessage = "";
    $scope.alertType = "";
    $scope.reviews = [];
    $scope.currentPage = 1;
    $scope.pageSize = 5;

    // Submit a review
    $scope.submitReview = function () {
        if ($scope.user && $scope.user.email) {
            $scope.review.email = $scope.user.email; // Add user email to the review
        }

        $http
            .post("/api/reviews", $scope.review)
            .then(function (response) {
                $scope.alertMessage = "Review submitted successfully!";
                $scope.alertType = "success";
                $scope.review = {}; // Reset the form
                $scope.reviews.unshift(response.data); // Add the new review to the list
            })
            .catch(function (error) {
                $scope.alertMessage = "Failed to submit review. Please try again.";
                $scope.alertType = "danger";
            });
    };

    // Fetch reviews from the API
    $http
        .get("/api/reviews")
        .then(function (response) {
            $scope.reviews = response.data.sort(function (a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        })
        .catch(function (error) {
            console.error("Failed to fetch reviews:", error);
        });

    // Pagination functions
    $scope.setCurrentPage = function (page) {
        if (page < 1 || page > $scope.pageCount()) return;
        $scope.currentPage = page;
    };

    $scope.pageCount = function () {
        return Math.ceil($scope.reviews.length / $scope.pageSize);
    };

    $scope.getPageReviews = function () {
        var start = ($scope.currentPage - 1) * $scope.pageSize;
        var end = start + $scope.pageSize;
        return $scope.reviews.slice(start, end);
    };

    // Function to start editing a review
    $scope.editReview = function (review) {
        review.editing = true; // Set editing flag
    };

    // Function to save the edited review
    $scope.saveReview = function (review) {
        $http
            .put("/api/reviews/" + review._id, {text: review.text})
            .then(function (response) {
                var index = $scope.reviews.indexOf(review);
                $scope.reviews[index] = response.data; // Update the review in the list
                review.editing = false; // Reset editing flag
                $scope.alertMessage = "Review updated successfully!";
                $scope.alertType = "success";
            })
            .catch(function (error) {
                $scope.alertMessage = "Failed to update review. Please try again.";
                $scope.alertType = "danger";
            });
    };

    // Function to cancel editing
    $scope.cancelEdit = function (review) {
        review.editing = false; // Reset editing flag
    };

    // Delete a review
    $scope.deleteReview = function (review) {
        $http
            .delete("/api/reviews/" + review._id)
            .then(function (response) {
                var index = $scope.reviews.indexOf(review);
                $scope.reviews.splice(index, 1);
                $scope.alertMessage = "Review deleted successfully!";
                $scope.alertType = "success";
            })
            .catch(function (error) {
                $scope.alertMessage = "Failed to delete review. Please try again.";
                $scope.alertType = "danger";
            });
    };

    // Initialize sorting variables
    $scope.sortBy = "createdAt"; // Default sort by date
    $scope.reverse = true; // Default to descending order

    // Initialize user data on load
    $scope.init();
}]);


app.controller('SustainableController', ['$scope', function($scope) {
    $scope.message = 'Welcome to the Sustainable Fashion page!';
}]);

app.controller('FashionController', ['$scope', function($scope) {
    $scope.message = 'Welcome to the Current Fashion Trends page!';
}]);

app.controller('AdminController', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.message = 'Welcome to the Current Fashion Trends page!';
    var role = sessionStorage.getItem('role');
    $scope.role = role;

    if (role === 'user') {
        $location.path('/login');
    }

    $http.get('/api/accounts')
    .then(function(response) {
        $scope.accounts = response.data;
    }, function(error) {
        console.error(error);
    });
}]);

app.controller('LoginController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
    $scope.credentials = {
        email: '',
        password: ''
    };

    $scope.login = function () {
        $http.post('/api/auth/login', $scope.credentials)
            .then(function (response) {
                console.log(response.data);
                if (response.data && response.data.role) {
                    // Save role in sessionStorage
                    sessionStorage.setItem('role', response.data.role);
    
                    // Save minimal user data (e.g., email and role) if needed
                    sessionStorage.setItem('user', JSON.stringify({
                        email: $scope.credentials.email,
                        username: response.data.username,
                        role: response.data.role
                    }));

                    if (response.data.role === 'admin') {
                        $location.path('/admin');
                      } else {
                        $location.path('/home');
                      }
                } else {
                    alert('Login failed');
                }
            })
            .catch(function (error) {
                console.error('Login error:', error);
                alert('Login failed: ' + (error.data && error.data.message ? error.data.message : 'Server error.'));
            });
    };
}]);


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

app.controller('IndexController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
    $scope.hideNavbarAndFooter = false;

    $scope.$on("$routeChangeSuccess", function () {
      if ($location.path() === "/login" || $location.path() === "/signup") {
        $scope.hideNavbarAndFooter = true;
      } else {
        $scope.hideNavbarAndFooter = false;
      }
    });
  
    $scope.logout = function() {
        // Clear local storage or session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        $http.post('/api/auth/logout')
          .then(function(response) {
            // Redirect to login page
            $location.path('/login');
          }, function(error) {
            // Logout failed, handle error
          });
    };
}]);
