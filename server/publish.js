"use strict";

Meteor.publish("teams", function () {
	var currentUserId= this.userId;
	if(currentUserId){
		if(Roles.userIsInRole(currentUserId,['admin'], 'default-group')){
			return Teams.find();
		}
		else{
    		Meteor.Error("UnAuthorized", "You need admin permission to access this data");
		}
	}
	else{
    	Meteor.Error("UnAuthorized", "You need permission to access this data");
    }
});


Meteor.publish("allMatches", function () {
	var currentUserId= this.userId;
	if(currentUserId){
		if(Roles.userIsInRole(currentUserId,['admin'], 'default-group')){
			return Matches.find();
		}
	}
	else{
    	Meteor.Error("UnAuthorized", "You need permission to access this data");
    }
});

Meteor.publish("currentAvailableMatch", function () {

	if(!this.userId){
		Meteor.Error("UnAuthorized", "You do not have permission to access this data");
	}

	var datePlus2= new Date();
	datePlus2.setDate(datePlus2.getDate() + 2);

	//Get all the matches that are ready to play
    var matchesAvailable=Matches.find({
    	startDateTime :{
    		$gt: new Date(),
    	    $lt: datePlus2
    	}
    });

    //Array of all the match IDs
    var matchIdsAvailableToPlay=matchesAvailable.map(function(match){
    	return match._id;
    });

    var userSelectedMatches= User_Selections.find({user_id: this.userId});
    var matchIdsThatUserHasAlreadyPlayed=userSelectedMatches.map(function(userSelection){
    	return userSelection.match_id;
    });

	var unplayedMatchIDs= matchIdsAvailableToPlay.map(function(matchID){
		if(!_.contains(matchIdsThatUserHasAlreadyPlayed, matchID)){
			return matchID;
		}
	});

	//filter the matches that have been already played by user
    //Check the userselection collection
	return Matches.find(
		{_id:{$in: unplayedMatchIDs}},
		{
			sort:{"startDateTime": 1}
		}
	);
});

//Get all the selection that a user made
Meteor.publish("stats", function(userId){
	var currentUserId= this.userId;
	//If we are requesting for a currently logged in user's stats, then we show all user selection stats. Including the ones with results yet to be announced.
	// else show only the user selection stats that have points already assigned.
	if(currentUserId){
		if(currentUserId== userId)
			return User_Selections.find({user_id: userId}); //Show all stats
		else
			return User_Selections.find({user_id: userId, points_earned: {$ne: undefined}}); //Show only selected stats
	}
	else{
    	Meteor.Error("Unauthorized", "You need permission to access this data");
    }
});

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'totalPoints': 1}});
});

Meteor.publish("top10Users", function () {
	var currentUserId= this.userId;
	if(currentUserId){
    	//return Meteor.users.find({}, {fields: {'profile': 0, 'roles': 0, 'services': 0,'emails':0}});
    	return Meteor.users.find({totalPoints:{$ne:undefined}}, {sort:{totalPoints:-1}, limit: 10 , fields: {'roles': 0, 'services': 0,'emails':0}});
    }
    else{
    	Meteor.Error("Unauthorized", "You need permission to access this data");
    }
});
