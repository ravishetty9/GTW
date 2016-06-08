Template.leaderboard.helpers({
	"top10Users": function(){
		return Meteor.users.find({},{sort:{totalPoints:-1}});
	},

	myRank: function(){
		return Session.get('myRank');
	}
});

Template.leaderboard.onCreated(function(){
	this.subscribe('top10Users');

	Meteor.call('getCurrentUsersRank', function(error, result){
		if(!error)
		  Session.set('myRank', result);
	});
});