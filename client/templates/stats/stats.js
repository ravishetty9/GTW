Template.stats.helpers({
	'myStats': function(){
		var currentUser= Meteor.user();
		console.log(Session.get("currentStatsUserID"));
		var userID= Session.get("currentStatsUserID");

		if(currentUser){
			return User_Selections.find({user_id: userID});	
		}
	},

	statsAvailable: function(){
		var userID= Session.get("currentStatsUserID");
		console.log(userID);
		if(User_Selections.find({user_id: userID}).count()>0)
			return true;
		else
			return false;
	},

	totalPoints: function(){
		var currentUser= Meteor.user();
		var userID= Session.get("currentStatsUserID");
		var total=0;
		if(currentUser){
			var userSelectionsArray= User_Selections.find({user_id: userID}).fetch();
			_.each(userSelectionsArray,function(userSelection){
				if(userSelection.points_earned)
					total+= userSelection.points_earned;
			});
		}
		return total;
	},

	userFullName: function(){
		var userID= Session.get("currentStatsUserID");
		var currentUser= Meteor.user();
		
		if(currentUser){
			return Meteor.users.findOne(userID).profile.name;
		}
	},

	navigateFromLeaderBoard: function(){
		return Session.get("navigateFromLeaderBoard");
	}
});

Template.stats.onCreated(function(){
	Meteor.subscribe('stats', Session.get("currentStatsUserID"));
	Meteor.subscribe('top10Users');
});

//Template statsRow

Template.statsRow.helpers({
	'isRowGood': function(){
		if(!this.winning_team_id)
			return null;
		else if(this.user_selected_team_id===this.winning_team_id)
			return "table-row-good";
		else
			return "table-row-bad";
	}
});