// services.js
app.factory('AuthService', function() {
    const AuthService = {};

    // Set the currently logged-in user
    AuthService.login = function(username) {
        sessionStorage.setItem('loggedInUser', username);
    };

    // Get the currently logged-in user
    AuthService.getUser = function() {
        return sessionStorage.getItem('loggedInUser');
    };

    // Check if the user is an admin
    AuthService.isAdmin = function() {
        return AuthService.getUser() === 'admin';
    };

    // Logout the user
    AuthService.logout = function() {
        sessionStorage.removeItem('loggedInUser');
    };

    return AuthService;
});
