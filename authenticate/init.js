var twitterStrategy = require('passport-twitter').Strategy;
module.exports = function(app, passport, db){
	passport.use(new twitterStrategy({
		consumerKey: process.env.TWITTER_CONSUMER_KEY,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
		callbackURL: process.env.TWITTER_CALLBACK_URL
	}, function(token, tokenSecret, profile, done){
		var collection = db.collection('user');
		var user = {
			'twitterId': profile.id,
			'username': profile.username,
			'displayName': profile.displayName,
			'icon': profile.photos[0].value
		};
		collection.findOne({'twitterId' : user.twitterId}, function(err, data){
			if (err){
				return done(err);
			}
			if (!data){
				collection.insert(user, function(err, data){
					return done(err, user);
				});
			}
			if (data){
				return done(null, user);
			}
		});
	}));

	passport.serializeUser(function(user, done){
		done(null, user.twitterId);
	});
	passport.deserializeUser(function(id, done){
		var collection = db.collection('user');
		collection.findOne({twitterId: id}, function(err, user){
			return done(err, {
				'twitterId': user.twitterId,
				'username': user.username,
				'displayName': user.displayName,
				'icon': user.icon
			});
		});
	});

	app.get('/auth', passport.authenticate('twitter'));
	app.get('/auth/callback', passport.authenticate('twitter', {
		failureRedirect: '/'
	}), function(req, res){
		res.send('<script>if(window.opener){window.opener.location.reload();window.close();}else{window.location="/"}</script>');
	});

}
