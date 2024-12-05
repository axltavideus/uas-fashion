app.controller("ReviewController", function ($scope, $http) {
    $scope.reviews = [];
    $scope.newReview = {};

    $http.get("/api/reviews").then((response) => {
        $scope.reviews = response.data;
    });

    $scope.submitReview = function () {
        $http.post("/api/reviews", $scope.newReview).then((response) => {
            $scope.reviews.push(response.data);
            $scope.newReview = {};
        });
    };
});

app.controller("ShopController", function ($scope, $http, Upload) {
    $scope.shops = [];
    $scope.newShop = {};
    $scope.selectedShop = {}; // For the edit modal
    var role = sessionStorage.getItem("role");
    $scope.role = role;

    // Fetch shops
    $http.get("/api/shops").then((response) => {
        $scope.shops = response.data;
    });

    // Add a new shop
    $scope.addShop = function () {
        const formData = {
            name: $scope.newShop.name,
            description: $scope.newShop.description,
            location: $scope.newShop.location,
            image: $scope.newShop.image,
            link: $scope.newShop.link
        };

        Upload.upload({
            url: "/api/shops",
            data: formData
        })
            .then((response) => {
                $scope.shops.push(response.data);
                $scope.newShop = {};
            })
            .catch((error) => {
                console.error("Error uploading shop:", error);
            });
    };

    // Open edit shop modal
    $scope.openEditShopModal = function (shop) {
        $scope.selectedShop = angular.copy(shop); // Copy the shop data to the selectedShop
        $("#editShopModal").modal("show"); // Show the modal
    };

    // Save changes to the shop
    $scope.saveShopChanges = function () {
        const formData = {
            name: $scope.selectedShop.name,
            description: $scope.selectedShop.description,
            location: $scope.selectedShop.location,
            image: $scope.selectedShop.image,
            link: $scope.selectedShop.link
        };

        Upload.upload({
            url: `/api/shops/${$scope.selectedShop._id}`, // Correct endpoint
            method: "PUT", // Specify PUT method
            data: formData
        })
            .then((response) => {
                const index = $scope.shops.findIndex((shop) => shop._id === response.data._id);
                if (index !== -1) {
                    $scope.shops[index] = response.data; // Update the shop in the list
                }
                $("#editShopModal").modal("hide"); // Hide the modal after saving changes
            })
            .catch((error) => {
                console.error("Error updating shop:", error);
            });
    };

    // Delete a shop
    $scope.deleteShop = function (shopId) {
        if (confirm("Are you sure you want to delete this shop?")) {
            $http
                .delete(`/api/shops/${shopId}`)
                .then(() => {
                    $scope.shops = $scope.shops.filter((shop) => shop._id !== shopId); // Remove the shop from the list
                })
                .catch((error) => {
                    console.error("Error deleting shop:", error);
                });
        }
    };
});

app.controller("AuthController", function ($scope, $http) {
    $scope.credentials = {};
    $scope.user = {};

    $scope.login = function () {
        $http.post("/api/auth/login", $scope.credentials).then(
            (response) => {
                alert("Logged in successfully!");
            },
            (err) => {
                alert("Invalid credentials");
            }
        );
    };

    $scope.signup = function () {
        $http.post("/api/auth/signup", $scope.user).then((response) => {
            alert("Signup successful!");
        });
    };
});

app.controller("HomeController", [
    "$scope",
    "$http",
    "$location",
    function ($scope, $http, $location) {
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

        // Initialize search and sort variables
        $scope.searchText = "";
        $scope.sortBy = "createdAt"; // Default sort by date
        $scope.reverse = true; // Default to descending order

        // Fetch reviews from the API
        $http.get("/api/reviews")
        .then(function (response) {
            $scope.reviews = response.data.sort(function (a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            // Initialize user data on load
            $scope.init();
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
            // Filter reviews based on search input
            const filteredReviews = $scope.reviews.filter(review => 
                review.text.toLowerCase().includes($scope.searchText.toLowerCase()) ||
                review.name.toLowerCase().includes($scope.searchText.toLowerCase()) // Include name in search
            );
        
            // Sort filtered reviews based on selected criteria and direction
            const sortedReviews = filteredReviews.sort((a, b) => {
                if ($scope.sortBy === 'name') {
                    // Sort by name
                    return $scope.reverse 
                        ? b.name.localeCompare(a.name) // Descending order
                        : a.name.localeCompare(b.name); // Ascending order
                } else {
                    // Sort by createdAt (date)
                    return $scope.reverse 
                        ? new Date(b[$scope.sortBy]) - new Date(a[$scope.sortBy]) // Descending order
                        : new Date(a[$scope.sortBy]) - new Date(b[$scope.sortBy]); // Ascending order
                }
            });
        
            var start = ($scope.currentPage - 1) * $scope.pageSize;
            var end = start + $scope.pageSize;
            return sortedReviews.slice(start, end);
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


app.controller('SustainableController', ['$scope', '$timeout', function($scope, $timeout) {
    // Initialize the carousel once the DOM is fully loaded
    $timeout(function() {
        var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExample'), {
            interval: 2000,
            wrap: true
        });
    }, 0);
    $scope.quotes = []; // Initialize quotes array
    $scope.newQuote = { name: "", text: "" }; // Object to store input values

    // Fetch existing quotes from the database
    $http.get('/api/quotes').then(function (response) {
        $scope.quotes = response.data; // Update the quotes array with fetched data
    });

    // Add a new quote
    $scope.addQuote = function () {
        $http.post('/api/quotes', $scope.newQuote).then(function (response) {
            $scope.quotes.push(response.data); // Add the new quote to the array
            $scope.newQuote = { name: "", text: "" }; // Clear input fields
        });
    };
 }]);
         // Initialize sorting variables
        $scope.sortBy = "createdAt"; // Default sort by date
        $scope.reverse = true; // Default to descending order
        // Initialize user data on load
        $scope.init();
    }
]);

app.controller("SustainableController", [
    "$scope",
    "$timeout",
    function ($scope, $timeout) {
        // Initialize the carousel once the DOM is fully loaded
        $timeout(function () {
            var myCarousel = new bootstrap.Carousel(document.getElementById("carouselExample"), {
                interval: 2000,
                wrap: true
            });
        }, 0);
    }
]);

app.controller("FashionController", [
    "$scope",
    function ($scope) {
        $scope.message = "Welcome to the Current Fashion Trends page!";
    }
]);

app.controller("EventsController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    document.addEventListener("DOMContentLoaded", () => {
        const elements = document.querySelectorAll(".fade-in, .slide-up, .slide-right, .slide-left");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                    observer.unobserve(entry.target); // Stop observing once animation is triggered
                }
            });
        });

        elements.forEach((el) => observer.observe(el));
    });

    $scope.events = [];
    $scope.userEmail = ""; // Initialize userEmail
    $scope.searchQuery = ""; // Initialize search query
    $scope.sortBy = "name"; // Default sort option

    // Fetch user email from sessionStorage
    const userData = sessionStorage.getItem("user"); // Assuming user data is stored here
    if (userData) {
        try {
            const user = JSON.parse(userData);
            $scope.userEmail = user.email; // Get the email from user data
        } catch (error) {
            console.error("Error parsing user data:", error);
            $scope.userEmail = ""; // Reset if there's an error
        }
    } else {
        console.warn("User data not found in session storage.");
        $scope.userEmail = ""; // Reset if user data is not found
    }

    // Fetch events
    $http
        .get("/api/tickets")
        .then((response) => {
            console.log("Fetched events:", response.data); // Log data to inspect the time format
            $scope.events = response.data;
        })
        .catch((err) => {
            console.error("Failed to fetch events:", err);
            alert("Failed to fetch events.");
        });

    // Function to parse the event time string
    function parseEventTime(timeString) {
        // Use a regex to extract the time (HH:mm:ss)
        const match = timeString.match(/(\d{2}:\d{2}:\d{2})/);
        if (match && match[1]) {
            return `1970-01-01T${match[1]}Z`; // Use UTC as the fallback
        }
        console.error("Invalid time format:", timeString);
        return null; // Return null for invalid formats
    }

    // Format event time to HH:mm AM/PM format
    $scope.formatEventTime = function (time) {
        const parsedTime = parseEventTime(time);
        if (!parsedTime) return "Invalid Time";

        const date = new Date(parsedTime);
        if (isNaN(date.getTime())) return "Invalid Time";

        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12;

        return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    // Sign up for an event
    $scope.signUp = function (id) {
        if (!$scope.userEmail) {
            alert("You need to be logged in to sign up for an event.");
            return;
        }

        $http
            .post(`/api/tickets/${id}/signup`, { email: $scope.userEmail })
            .then(() => {
                alert("You successfully signed up for the event!");
            })
            .catch((err) => {
                console.error("Error during signup:", err); // Log the error for debugging
                alert(err.data.error || "Failed to sign up. Try again later.");
            });
    };
}]);


app.controller("AdminController", ["$scope", "$http", "$location", "Upload", function ($scope, $http, $location, Upload) {
    var role = sessionStorage.getItem("role");
    $scope.role = role;

    if (role !== "admin") {
        $location.path("/login");
    }

    // Accounts and events data
    $scope.accounts = [];
    $scope.events = [];
    $scope.newEvent = {};
    $scope.selectedEvent = {}; // For the event modal
    $scope.selectedAccount = {}; // For the account modal
    $scope.searchQuery = ""; // Initialize search query
    $scope.sortBy = "latestUpdated"; // Default sort option
    $scope.sortOptions = ["name", "latestUpdated"]; // Define sort options

    // Fetch accounts
    $http
        .get("/api/accounts")
        .then((response) => {
            console.log(response.data); // Log the response data
            $scope.accounts = response.data;
        })
        .catch((err) => {
            console.error("Failed to fetch accounts:", err);
            alert("Failed to fetch accounts.");
        });

    $scope.openEditAccountModal = function (account) {
        $scope.selectedAccount = angular.copy(account);
        $("#editAccountModal").modal("show");
    };

    $scope.saveAccountChanges = function () {
        $http
            .put(`/api/accounts/${$scope.selectedAccount._id}`, $scope.selectedAccount)
            .then((response) => {
                const index = $scope.accounts.findIndex((account) => account._id === response.data._id);
                if (index !== -1) {
                    $scope.accounts[index] = response.data; // Update the account in the list
                }
                $scope.selectedAccount = {}; // Reset the selected account
                $("#editAccountModal").modal("hide"); // Hide the modal after saving changes
            })
            .catch((err) => {
                alert(err.data.error || "Failed to update account");
            });
    };

    // Fetch events
    $http
        .get("/api/tickets")
        .then((response) => {
            $scope.events = response.data;
            $scope.sortEvents(); // Sort events after fetching
        })
        .catch((err) => {
            console.error("Failed to fetch events:", err);
            alert("Failed to fetch events.");
        });

    // Function to sort events based on the selected criteria
    $scope.sortEvents = function () {
        if ($scope.sortBy === "latestUpdated") {
            $scope.events.sort((a, b) => {
                // Assuming 'updatedAt' is the field that holds the last updated timestamp
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
        } else if ($scope.sortBy === "name") {
            $scope.events.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
    };

    // Show users signed up for an event
    $scope.showEventUsers = function (event) {
        $scope.selectedEvent = event; // Store the selected event
        $("#eventUsersModal").modal("show"); // Show the modal
    };

    // Watch for changes in sortBy and re-sort events
    $scope.$watch('sortBy', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.sortEvents();
        }
    });

    // Add event
    $scope.addEvent = function () {
        // Use the local time (HH:mm) as it is without converting to UTC
        const eventTime = `1970-01-01T${$scope.newEvent.time}:00`; // Local time, no 'Z' for UTC
    
        Upload.upload({
            url: "/api/tickets",
            data: {
                name: $scope.newEvent.name,
                location: $scope.newEvent.location,
                time: eventTime, // Use the local time as-is
                description: $scope.newEvent.description,
                image: $scope.newEvent.image // This will hold the image file
            }
        })
        .then((response) => {
            $scope.events.push(response.data);
            $scope.sortEvents(); // Re-sort after adding a new event
            $scope.newEvent = {}; // Reset the form
        })
        .catch((err) => {
            alert(err.data.error || "Failed to add event");
        });
    };    

    // Open edit event modal
    $scope.openEditEventModal = function (event) {
        $scope.selectedEvent = angular.copy(event); // Copy the event data to the selectedEvent for editing
        $("#editEventModal").modal("show"); // Show the modal
    };

    $scope.saveEventChanges = function () {
        $scope.updateEvent(); // Call the update function
        $("#editEventModal").modal("hide"); // Hide the modal after saving changes
    };

    // Update event (no UTC conversion)
    $scope.updateEvent = function () {
        // Use the local time as-is without converting to UTC
        const eventTime = `1970-01-01T${$scope.selectedEvent.time}:00`; // Local time, no 'Z' for UTC
        
        Upload.upload({
            url: `/api/tickets/${$scope.selectedEvent._id}`, // Correct endpoint
            method: "PUT", // Change from POST to PUT
            data: {
                name: $scope.selectedEvent.name,
                location: $scope.selectedEvent.location,
                time: eventTime, // Use the local time as-is
                description: $scope.selectedEvent.description,
                image: $scope.selectedEvent.image // Include the image file if uploaded
            }
        })
        .then((response) => {
            const index = $scope.events.findIndex((event) => event._id === response.data._id);
            if (index !== -1) {
                $scope.events[index] = response.data; // Update the event in the list
            }
            $scope.sortEvents(); // Re-sort after updating an event
            $scope.selectedEvent = {}; // Reset the selected event
            $("#editEventModal").modal("hide"); // Hide the modal after saving changes
        })
        .catch((err) => {
            alert(err.data.error || "Failed to update event");
        });
    };

    // Delete event
    $scope.deleteEvent = function (eventId) {
        if (confirm("Are you sure you want to delete this event?")) {
            $http
                .delete(`/api/tickets/${eventId}`)
                .then(() => {
                    $scope.events = $scope.events.filter((event) => event._id !== eventId); // Remove the event from the list
                })
                .catch((err) => {
                    alert("Failed to delete event");
                });
        }
    };

    // Delete account
    $scope.deleteAccount = function (accountId) {
        if (confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
            $http
                .delete(`/api/accounts/${accountId}`)
                .then(() => {
                    $scope.accounts = $scope.accounts.filter((account) => account._id !== accountId); // Remove the account from the list
                    alert("Account deleted successfully!");
                })
                .catch((err) => {
                    alert("Failed to delete account");
                });
        }
    };

    $scope.formatEventTime = function(time) {
        // Extract the time part (e.g., "21:21:00")
        var timeMatch = time.match(/(\d{2}:\d{2}:\d{2})/);
        
        if (timeMatch) {
            var timeString = timeMatch[0]; // This will be the time (e.g., "21:21:00")
            // Convert the time string to a Date object
            var date = new Date('1970-01-01T' + timeString + 'Z'); // Adding a 'Z' to indicate UTC
            if (isNaN(date)) {
                console.error('Invalid Date:', timeString);
                return 'Invalid Time';
            }
            
            // Format the time as HH:mm
            var hours = date.getUTCHours().toString().padStart(2, '0');
            var minutes = date.getUTCMinutes().toString().padStart(2, '0');
            return hours + ':' + minutes;
        } else {
            console.error('Time format is invalid:', time);
            return 'Invalid Time';
        }
    };    
}]);

app.controller("LoginController", ["$scope","$http","$location","$window",function ($scope, $http, $location, $window) {
        $scope.credentials = {
            email: "",
            password: ""
        };

        $scope.login = function () {
            $http
                .post("/api/auth/login", $scope.credentials)
                .then(function (response) {
                    console.log(response.data);
                    if (response.data && response.data.role) {
                        // Save role in sessionStorage
                        sessionStorage.setItem("role", response.data.role);

                        // Save minimal user data (e.g., email and role) if needed
                        sessionStorage.setItem(
                            "user",
                            JSON.stringify({
                                email: $scope.credentials.email,
                                username: response.data.username,
                                role: response.data.role
                            })
                        );

                        if (response.data.role === "admin") {
                            $location.path("/admin");
                        } else {
                            $location.path("/home");
                        }
                    } else {
                        alert("Login failed");
                    }
                })
                .catch(function (error) {
                    console.error("Login error:", error);
                    alert("Login failed: " + (error.data && error.data.message ? error.data.message : "Server error."));
                });
        };
    }
]);

app.controller("SignupController", function ($scope, $http) {
    $scope.credentials = {
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signup = function () {
        // Check if passwords match
        if ($scope.credentials.password !== $scope.credentials.confirmPassword) {
            document.getElementById("error-message").innerHTML = `<div class="alert alert-danger">Passwords do not match.</div>`;
            return; // Stop further execution if passwords don't match
        }

        // Proceed to send signup data to the backend
        $http
            .post("/api/auth/signup", $scope.credentials)
            .then(function (response) {
                alert("Signup successful! You can now log in.");
                window.location.href = "#!/login"; // Redirect to login page
            })
            .catch(function (error) {
                document.getElementById("error-message").innerHTML = `<div class="alert alert-danger">${error.data.message}</div>`;
            });
    };
});

app.controller("IndexController", ["$scope","$http","$location","$window",function ($scope, $http, $location, $window) {
        $scope.hideNavbarAndFooter = false;

        $scope.$on("$routeChangeSuccess", function () {
            if ($location.path() === "/login" || $location.path() === "/signup") {
                $scope.hideNavbarAndFooter = true;
            } else {
                $scope.hideNavbarAndFooter = false;
            }
        });

        $scope.logout = function () {
            // Clear local storage or session
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            $http.post("/api/auth/logout").then(
                function (response) {
                    // Redirect to login page
                    $location.path("/login");
                },
                function (error) {
                    // Logout failed, handle error
                }
            );
        };
    }
]);
