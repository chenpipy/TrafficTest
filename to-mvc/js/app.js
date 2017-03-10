(function (angular) {
	'use strict'
	var myApp = angular.module('MyTodoMVC', []);
	//注册一个主要的控制器
	myApp.controller('MainController', ['$scope', function ($scope) {
		$scope.text = '';
		$scope.todos = [{
			id: 0.11,
			text: "吃饭",
			completed: false,
		}, {
			id: 0.12,
			text: '睡觉',
			completed: false,
		}, {
			id: 0.32,
			text: '打豆豆',
			completed: true,
		}
		];

		//添加todo事件
		$scope.add = function () {
			if ($scope.text) {
				$scope.todos.push({
					id: Math.random(),
					text: $scope.text,
					completed: false,
				})
			}
			;
			//添加完成之后要清空文本框的内容
			$scope.text = '';
		};
		//处理删除
		$scope.remove = function (id) {
			for (var i = 0; i < $scope.todos.length; i++) {
				if (id === $scope.todos[i].id) {
					$scope.todos.splice(i, 1);
					break;
				}
			}
		};
		//清理已完成的项

		$scope.clear = function () {

		};

		$scope.currentEditingID = -1;
		//双击开始编辑
		$scope.editing = function (id) {
			$scope.currentEditingID = id;
		}
		$scope.save = function () {
			$scope.currentEditingID = -1;
		}
		//判断是否有已经完成的，如果有的话，就显示清楚按钮，如果没用的话，就隐藏
		$scope.existCompleted = function () {

		};

		var now = true;
		$scope.toggleAll = function () {
			for (var i = 0; i < $scope.todos.length; i++) {
				$scope.todos[i].completed=now;
			}
			now = !now;
		}
	}
	]);
})(angular)
