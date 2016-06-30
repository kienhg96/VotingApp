$(document).ready(function(){
	var divMakevote = $('#makevote');
	var btnSubmit = $('#submit');
	var txtTitle = $('#title');
	var txtSelection = $('#selection');
	$.get('/user', function(data){
		if (data){
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
					//	alert('OK');
					}
				});
			});
		}
		else {
			divMakevote.html('You must login to Make a vote <button id="login">Login now</button>');
			$('#login').on('click', function(){
				window.open("/auth", "", "width=600,height=400");
			});
		}
	});
});