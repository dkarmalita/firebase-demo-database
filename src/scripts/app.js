// 
// Firebase API
// 
var todoApp = angular.module('TodoApp', []);


todoApp.controller('TodoCtrl', ['$scope',
    function($scope) {

        $scope.headline = 'ToDo list using AngularJS and pure Firebase API';
        
        // CONFIGURE FIREBASE ACCESS
        // 
        // 1. Create your free Firebase project at http://console.firebase.google.com
        // 2. Replace the object bellow with the one obteined from access snippet of your project
        // 3. Add the following rule in 'Database -> RULES' section to allow
        // unauthenticated users to access the teat application's data
        /* 
           "demo-Firebase": {
                ".read": true,
                ".write": true
            }
        */      
 
        var config = {
          apiKey: "apiKey",
          authDomain: "projectId.firebaseapp.com",
          databaseURL: "https://databaseName.firebaseio.com",
          storageBucket: "bucket.appspot.com",
        };
        try{
            firebase.initializeApp(config);
        }catch(error) {
            console.error('firebase.initializeApp (',error.code,"): ",error.message);
        };
        
        // CREATE A FIREBASE REFERENCE
        var todosRef = firebase.database().ref("demo-Firebase");

        // GET TODOS AS AN ARRAY
        todosRef.on('value', function(snapshot) {
            var todoList = snapshot.val();
            $scope.todos = [];
            for(var propertyName in todoList) {
                var el = todoList[propertyName];
                el.$id = propertyName;
                $scope.todos.push(el);
            }
            $scope.$apply();
        });

        // ADD TODO ITEM METHOD
        $scope.addTodo = function () {

            // CREATE A UNIQUE ID
            var timestamp = new Date().valueOf();

            var newTodo = {
                id: timestamp,
                name: $scope.todoName,
                status: 'pending'
            };

            todosRef.push(newTodo);

            $scope.todoName = "";

        };

        // REMOVE TODO ITEM METHOD
        $scope.removeTodo = function (index, todo) {

            // CHECK THAT ITEM IS VALID
            if (todo.id === undefined)return;

            //console.log('Remove request',todo,index)

            // FIREBASE: REMOVE ITEM FROM LIST
            todosRef.child(todo.$id).remove();
            //$scope.todoset.$remove(todo);

        };

        // MARK TODO AS IN PROGRESS METHOD
        $scope.startTodo = function (index, todo) {

            // CHECK THAT ITEM IS VALID
            if (todo.id === undefined)return;

            // UPDATE STATUS TO IN PROGRESS AND SAVE
            todo.status = 'in progress';
            var tmp = Object.assign({}, todo);
            delete tmp["$id"];
            delete tmp["$$hashKey"];
            todosRef.child(todo.$id).update(tmp);

        };

        // MARK TODO AS COMPLETE METHOD
        $scope.completeTodo = function (index, todo) {

            // CHECK THAT ITEM IS VALID
            if (todo.id === undefined)return;

            // UPDATE STATUS TO COMPLETE AND SAVE
            todo.status = 'complete';
            var tmp = Object.assign({}, todo);
            delete tmp["$id"];
            delete tmp["$$hashKey"];
            todosRef.child(todo.$id).update(tmp);
        };

    }]);


