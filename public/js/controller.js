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

app.controller('HomeController', ['$scope', '$http', function($scope, $http) {
    $scope.review = {}; // Initialize the review object
    $scope.alertMessage = ''; // Variable to store alert messages
    $scope.alertType = ''; // Variable to define alert type (success or error)

    $scope.submitReview = function() {
        if ($scope.review.name && $scope.review.text) {
            $http.post('/api/reviews', $scope.review)
                .then(function(response) {
                    // Success callback
                    $scope.alertMessage = 'Review submitted successfully!';
                    $scope.alertType = 'success'; // Bootstrap success alert
                    $scope.review = {}; // Reset the form
                })
                .catch(function(error) {
                    // Error callback
                    $scope.alertMessage = 'Failed to submit review. Please try again.';
                    $scope.alertType = 'danger'; // Bootstrap danger alert
                });
        } else {
            $scope.alertMessage = 'Please fill out all fields before submitting.';
            $scope.alertType = 'warning'; // Bootstrap warning alert
        }
    };
}]);

app.controller('SustainableController', ['$scope', function($scope) {
    $scope.message = 'Welcome to the Sustainable Fashion page!';
}]);

app.controller('FashionController', ['$scope', function($scope) {
    $scope.message = 'Welcome to the Current Fashion Trends page!';
}]);
