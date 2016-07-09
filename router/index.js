var makevote = require('../app/makevote');
var path = require('path');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(app, db){
	var collection = db.collection('vote');
	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname, '../view/index.html'));
	});
	app.get('/makevote', function(req, res){
		res.sendFile(path.join(__dirname, '../view/makevote.html'));
	});
	app.post('/post', function(req, res){
		var msg = req.body.msg;
		if (msg === 'logout'){
			if (req.isAuthenticated()){
				req.logout();
			}
			res.send({msg: 'OK'});
		}
		if (msg === 'makevote'){
			if (req.isAuthenticated()){
				var vote = makevote(req.body, req.user.twitterId);
				collection.insert(vote, function(err, data){
					if (err) throw err;
					res.send({msg: 'OK', id: data.insertedIds[0]});
				});
			}
			else {
				res.send({msg: "Failed"});
			}
		}
		if (msg === 'getTitle'){
			collection.find().toArray(function(err, data){
				if (err) throw err;
				var arr = data.map(function(obj){
					return {
						id: obj._id.toString(),
						title: obj.title
					}
				});
				res.json(arr);
			});
		}
		if (msg === 'vote') {
			console.log(req.body);
			var id = req.body.id;
			var index = parseInt(req.body.index);
			collection.findOne({_id: ObjectId(id)}, function(err, doc){
				var userList = doc.userList;
				var voteList = doc.voteList;
				if (req.isAuthenticated()){
					var userId = req.user.twitterId;
					if (userList.indexOf(userId) === -1){
						userList.push(userId);
						voteList[index].count++;
						collection.update({_id: ObjectId(id)}, {
							$set: {
								userList: userList,
								voteList: voteList
							}
						}, function(err){
							if (err) throw err;
						});
						res.json({msg: 'OK'});
					}
					else {
						res.json({
							msg: 'ERROR, USER VOTED'
						});
					}
				}
				else {
					var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
					if (userList.indexOf(ip) === -1){
						userList.push(ip);
						voteList[index].count++;
						collection.update({_id: ObjectId(id)}, {
							$set: {
								userList: userList,
								voteList: voteList
							}
						}, function(err){
							if (err) throw err;
						});
						res.json({msg: 'OK'});
					}
					else {
						res.json({msg: 'ERROR, IP VOTED'});
					}
				}
			});
		}
		if (msg === 'mypoll') {
			if (req.isAuthenticated()){
				collection.find({authorId: req.user.twitterId}).toArray(function(err, data){
					if (err) throw err;
					var arr = data.map(function(obj){
						return {
							id: obj._id.toString(),
							title: obj.title
						}
					});
					res.json(arr);
				});
			}
			else {
				res.json(null);
			}
		}
		if (msg === 'hello'){
			res.json({msg: 'hi'});
		}
	});
	app.get('/user', function(req, res){
		if (req.isAuthenticated()){
			res.json(req.user);
		}
		else {
			res.json(null);
		}
	});
	app.get('/vote/:id', function(req, res){
		res.sendFile(path.join(__dirname, '../view/vote.html'));
	});
	app.get('/votejson/:id', function(req, res){
		collection.findOne({_id: ObjectId(req.params.id)}, function(err, doc){
			if (err) throw err;
			if (doc){
				var isVoted = true;
				var userList = doc.userList;
				if (req.isAuthenticated()){
					var userId = req.user.twitterId;
					isVoted = (userList.indexOf(userId) !== -1);
				}
				else {
					var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
					isVoted = (userList.indexOf(ip) !== -1);
				}
				var data = {
					title: doc.title,
					voteList: doc.voteList,
					voted: isVoted
				};
				res.json(data);
			}
			else {
				res.json(null);
			}
		});
	});
	app.get('/mypoll', function(req, res){
		res.sendFile(path.join(__dirname, '../view/mypoll.html'));
	});
}