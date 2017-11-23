var app = angular.module('app', ['ui.router']);

// Declare view
function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/user-list");

    $stateProvider
        .state('user-list', {
            url: '/user-list',
            templateUrl: 'views/user-list.html',
            controller: 'UserListController',
            data: { pageTitle: 'User list' }
        })
        .state('add-user', {
            url: '/add-user',
            templateUrl: 'views/add-user.html',
            controller: 'AddUserController',
            data: { pageTitle: 'Add new user' }
        })
        .state('edit-user', {
            url: '/edit-user/{email}',
            templateUrl: 'views/edit-user.html',
            data: { pageTitle: 'Edit user' },
            controller: function ($scope, $stateParams, $state) {
                // Find the user
                let user = $scope.users.find(user => user['email'] === $stateParams.email);

                // Bind value to modal
                $scope.name = user.name;
                $scope.email = user.email;
                $scope.quote = user.quote;

                // Edit user function
                $scope.editUser = function () {
                    // Check name is empty or null
                    if (!$scope.name) {
                        // Error message
                        $scope.color = "text-danger";
                        $scope.message = "Name can not be empty.";
                    }

                    // Success message
                    $scope.color = "text-success";
                    $scope.message = "Edit user sucessfully.";

                    // Bind new value
                    user.name = $scope.name;
                    user.quote = $scope.quote;

                    // Redirect to user-list
                    $state.go('user-list');
                }
            }
        });
}

app.config(config);

app.controller("MainController", function ($scope) {
    // Load user list
    $scope.users = userList;
});

app.controller("UserListController", function ($scope) {
    // Confirm remove user function
    $scope.confirmDelete = function (email) {
        // Dismiss modal
        $('#deleteModal').modal('toggle');
        // Setting selected user
        $scope.selected = email;
    }

    // Remove user function
    $scope.removeUser = function () {
        // Find the user
        let user = $scope.users.find(user => user['email'] === $scope.selected);

        // Remove if user exists
        if (user) {
            $scope.users.splice($scope.users.indexOf(user), 1);
        }

        // Dismiss modal
        $('#deleteModal').modal('toggle');
    }
});

app.controller("AddUserController", function ($scope) {
    // Add user function
    $scope.addUser = function () {
        $scope.message = ""; // Clear error message

        let hasEmail = $scope.users.some(users => users['email'] === $scope.user.email);

        // Check email exists
        if (hasEmail) {
            // Error message
            $scope.color = "text-danger";
            $scope.message = "The email is already exists.";
        } else {
            // Add new user
            $scope.users.push({ name: $scope.user.name, email: $scope.user.email, quote: $scope.user.quote });

            // Success message
            $scope.color = "text-success";
            $scope.message = "Added new user sucessfully.";

            // Clear form after insert
            $scope.user = {};
            $scope.userForm.$setPristine();
            $scope.userForm.$setUntouched();
        }
    }
});