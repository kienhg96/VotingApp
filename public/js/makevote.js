$(document).ready(function(){
	var divMakevote = $('#makevote');
	var btnSubmit = $('#submit');
	var txtTitle = $('#title');
	var txtSelection = $('#selection');
	var userDiv = $('#user');
	var loginout = $('#loginout');
	$.get('/user', function(data){
		if (data){
			userDiv.html('Hello, ' + data.displayName);
			loginout.html('Logout');
			loginout.on('click', function(){
				$.post('/post', {msg:'logout'}, function(data){
					if (data.msg === 'OK'){
						window.location = '/';
					}
				});
			});
			btnSubmit.on('click', function(){
				var title = txtTitle.val();
				var selection = txtSelection.val().split('\n');
				for (var  i = 0; i < selection.length; i++){
					if (selection[i] === ''){
						selection.splice(i, 1);
					}
				}
				console.log(selection);
				var vote = {
					msg: 'makevote',
					title: title,
					selection: selection
				};
				$.post('/post', vote, function(data){
					if (data.msg === 'OK'){
						window.location = '/vote/' + data.id;
					}
				});
			});
		}
		else {
			window.location = '/';
		}
	});
});