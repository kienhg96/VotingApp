$(document).ready(function(){
	var userDiv = $('#user');
	var loginout = $('#loginout');
	var votingDiv = $('#voting');
	$.get('/user', function(data){
		if (data){
			//console.log(data);
			$('#mypoll').show();
			$('makevote').show();
			userDiv.html('Hello, ' + data.displayName);
			loginout.html('Logout');
			loginout.on('click', function(){
				$.post('/post', {msg:'logout'}, function(data){
					if (data.msg === 'OK'){
						window.location.reload();
					}
				});
			});
		}
		else {
			userDiv.html('');
			loginout.html('Login');
			loginout.on('click', function(){
				window.open("/auth", "", "width=600,height=400");
			});
		}
	});
	$.post('/post', {msg: 'mypoll'}, function(data){
		for (var i = 0; i < data.length; i++){
			//votingDiv.append('<a href="/vote/'+data[i].id+'">'+data[i].title+'</a><br>');
			votingDiv.append('<a href="/vote/'+data[i].id+'"><div class="anchor-vote">'+data[i].title+'</div></a>');
		}
	});
});