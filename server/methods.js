Meteor.methods({
	'submitUserSelection': function(obj){
		var currentUserId= this.userId;

		if(currentUserId){
			var match_id= obj.match_id;
			var match= Matches.findOne(match_id);
			if(!match){
				throw new Meteor.Error("Invalid Match ID", "The match ID you provided is invalid");
			}

			var user_selected_team_id= obj.user_selected_team_id;
			var user_selected_points= obj.user_selected_points;

			if(user_selected_points > parseInt(match.slider)){
				throw new Meteor.Error("Points Exceed", "The points selected is more than allowed maximum");
			}

			var userSelectedMatch=User_Selections.findOne(
				{match_id: match_id , userId: currentUserId}
			);

			if(userSelectedMatch!== undefined){
				throw new Meteor.Error("DB Exception", "You have already played this game");
			}
			else{
				User_Selections.insert(obj, function(error, id){
					if(error){
						throw new Meteor.Error("DB Exception", "There was problem inserting into user selection db");
					}
				});
			}	
		}
		else{
			Meteor.Error("Unauthorized", "You need admin permission to access this data");
		}
	},

	'updateMatchWinner': function(obj){
		var currentUserId= this.userId;

		if(currentUserId){
			if(Roles.userIsInRole(currentUserId,['admin'], 'default-group'))
			{
				var match_id= obj.match_id;
				var winningTeamID= obj.winning_team_id;

				//If a match ends with no result, we reset the winning team ID column.
				if(winningTeamID=== -1){
					winningTeamID="";
				}

				Matches.update(match_id, {
					$set: {winning_team_id: winningTeamID, status: 1}
				});
			}
			else{
				Meteor.Error("Unauthorized", "You need admin permission to access this data");
			}
		}
		else{
			Meteor.Error("Unauthorized", "You need to be logged in to access this data");
		}
	},

	"updateUserSelectionWinningTeam": function(obj){
		var currentUserId= this.userId;

		if(currentUserId){
			if(Roles.userIsInRole(currentUserId,['admin'], 'default-group'))
			{
				var match_id= obj.match_id;
				var winningTeamID= obj.winning_team_id;

				//If a match ends with no result, we reset the winning team ID column.
				if(winningTeamID=== -1){
					winningTeamID= "";
				}

				User_Selections.update(
					{ match_id: match_id },
					{
						$set: {winning_team_id: winningTeamID, status: 1} //Status 1 when winning team is updated.
					},
					{ multi: true }
				);
			}
			else{
				Meteor.Error("Unauthorized", "You need admin permission to access this data");
			}
		}
		else{
			Meteor.Error("Unauthorized", "You need to be logged in to access this data");
		}
	},

	"updateAllUsersScores": function(){
		var currentUserId= this.userId;

		if(currentUserId){
			if(Roles.userIsInRole(currentUserId,['admin'], 'default-group'))
			{
				//Find all users whose scores have not been updated
				//i.e status 1
				var matchesMap= {};
				var userSelections= User_Selections.find({status:1}).fetch();

				_.each(userSelections, function(userSelection){
					var matchID= userSelection.match_id;
					var userID= userSelection.user_id;

					var matchObj= null;

					//Check if the match object is in the dictionary else add it.
					if(matchesMap[matchID]){
						console.log("getting from dict");
						matchObj= matchesMap[matchID];
					}
					else{
						console.log("outside from dict");
						matchObj= Matches.findOne(matchID);
						console.log(matchObj._id);
						if(matchObj)
						matchesMap[matchID]=matchObj;
						else
						Meteor.Error("Invalid Argument","Match ID entered is invalid");

						//Set the status of match to 2
						Matches.update(matchID,
							{
								$set: {status:2}
							});
						}

						var winnerTeamID= matchObj.winning_team_id;
						var pointsEarned=0;
						if(!matchObj.winning_team_id){
							//No result. (Tie or match abadoned)
							console.log("Match is tie");
							//DO NOTHING
						}
						else if(userSelection.user_selected_team_id===matchObj.winning_team_id){
							pointsEarned= userSelection.user_selected_points;
							console.log(pointsEarned);
						}
						else{
							pointsEarned=-userSelection.user_selected_points;
							console.log(pointsEarned);
						}

						//Update the userSelection with the earned points
						var userCollectionDoc= User_Selections.findOne({
							$and:[
								{match_id: matchID},
								{user_id: userID}
							]
						}
					);

					if(userCollectionDoc){

						User_Selections.update(userCollectionDoc._id,
							{
								$set:{points_earned: pointsEarned, status: 2}
							}
						);
					}
				});


				//Update the total score of users
				Meteor.call('calculateAndUpdateTotalPoints', function(error){
					if(error){
						Meteor.Error("Error", "Error updating user's total points");
					}
				});

			}
			else{
				Meteor.Error("Unauthorized", "You need admin permission to access this data");
			}
		}
		else{
			Meteor.Error("Unauthorized", "You need to be logged in to access this data");
		}
	},

	calculateAndUpdateTotalPoints: function(){
		var currentUserId= this.userId;

		if(currentUserId){
			if(Roles.userIsInRole(currentUserId,['admin'], 'default-group'))
			{
				//Find all the user selection documents whose scores have been updated.
				var userSelections= User_Selections.find({status:2}).fetch();
				var totalPointsUserMap={};
				_.each(userSelections, function(userSelection){
					var pointsEarned=userSelection.points_earned;
					console.log("Points earned:"+ pointsEarned);
					if(pointsEarned){
						var userID= userSelection.user_id;
						console.log(totalPointsUserMap[userID]);
						if(totalPointsUserMap[userID])
						totalPointsUserMap[userID]+= pointsEarned;
						else
						totalPointsUserMap[userID]= pointsEarned;
					}
					else
					{
						console.log("This should not occur. Status 2 should have points in it");
						Meteor.Error("Unknown","Scores have not been updated");
					}
				});

				//Now we have an array of objects with userID and scores
				var totalPointsUserIDs= Object.keys(totalPointsUserMap);

				_.each(totalPointsUserIDs, function(totalPointUserID){
					var userID= totalPointUserID;
					var totalPoints= totalPointsUserMap[totalPointUserID];
					
					var userPoints= Meteor.users.findOne(userID).totalPoints;
					console.log("Points in db: "+ userPoints);

					Meteor.users.update(userID,
						{$set:
							{totalPoints: totalPoints}
						}
					);

					//Send push notfications to users
					var pushObj={
						title: 'Scores updated!',
				       	text: "We have updated the match winners. Please check your latest score.",
					  	query: {
					  		//userId: userID
					  	}
					}

					Meteor.call('sendPushNotifications', pushObj);
				});
			}
			else{
				Meteor.Error("Unauthorized", "You need admin permission to access this data");
			}
		}
		else{
			Meteor.Error("Unauthorized", "You need to be logged in to access this data");
		}
	},

	notifyUsersNewMatch: function(matchID) {
		// Important server-side check for security and data integrity
		check(matchID, String);
		console.log("Notifying all users about the match....");
		
		var newMatchSubject= "Guess the next match winner!"
		var currentUserId= this.userId;

		if(currentUserId){
			if(Roles.userIsInRole(currentUserId,['admin'], 'default-group'))
			{
				var matchDetails= Matches.findOne(matchID);
				if(!matchDetails){
					Meteor.Error("Invalid ID", "Match ID entered was invalid");
				}

				SSR.compileTemplate('htmlEmail', Assets.getText('newMatchEmail.html'));

				var emailData = {
					team1_name: matchDetails.team1_name,
					team1_logo: matchDetails.team1_logo,
					team2_name: matchDetails.team2_name,
					team2_logo: matchDetails.team2_logo,
					match_points: matchDetails.slider,
					appURL: process.env.ROOT_URL
				};

				var allUsers= Meteor.users.find({}).fetch();

				_.each(allUsers, function(user){
					//Send each verified users an email
					if(user.emails[0].verified){
						emailData.user_firstname= user.profile.firstName;

						console.log("Sending email to "+ user.profile.firstName);

						var mailFields={
							to: user.emails[0].address,
							subject: newMatchSubject,
							emailTemplate: 'htmlEmail',
							emailData: emailData
						};

						Meteor.call('sendEmailWithTemplate', mailFields);
					}

					

				 // 	var pushObj={
					// 	title: 'A new match has been added.',
				 //       	text: "Please guess the winner of "+ emailData.team1_name + " vs " + emailData.team2_name + ".",
					//   	query: {
					//   		userId: user._id
					//   	}
					// }

					// Meteor.call('sendPushNotifications', pushObj);

					// Push.send({
					//  	from: 'GuessTheWinner',
				 //       	title: 'A new match has been added.',
				 //       	text: "Please guess the winner of "+ emailData.team1_name + " vs " + emailData.team2_name + ".",
					// 	badge: 1,
					//   	query: {
					//   		userId: user._id
					//   	}
					// });

				});

				//Add one notification.
				//Push Notifcations should be sent when adding match
				console.log("Pushing notifications to users Points ).");
				
				var pushObj={
					title: 'Guess The Winner - New Match.',
			       	text:  emailData.team1_name + " Vs " + emailData.team2_name + " ("+ emailData.match_points+" Points).",
				  	query: {}
				}

				Meteor.call('sendPushNotifications', pushObj);

			}
			else
			{
				Meteor.Error("Unauthorized", "You need admin permission to access this data");
			}
		}
		else{
			Meteor.Error("Unauthorized", "You need to be logged in to access this data");
		}
	},

	getCurrentUsersRank: function(){
		var currentUserId= this.userId;

		if(currentUserId){
			var points=Meteor.users.findOne(currentUserId).totalPoints;

			//console.log("My Points: "+ points);

			//if undefined, then return the last rank
			if(points=== undefined){
				return Meteor.users.find({}).count();
			}
			else
			{
				return Meteor.users.find({totalPoints:{$gt:points}}).count()+1;
			}
		}
		else{
			Meteor.Error("Unauthorized", "You need to be logged in to access this data");
		}
	}

});
