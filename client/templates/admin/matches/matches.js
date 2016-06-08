Template.matches.helpers({
	allMatches: function(){
		return Matches.find();
	},

	matchesAvailable: function(){
		if(Matches.find().fetch().length>0){
			return true
		}
		return false;
	}
});

Template.matches.events({
	'click .edit-match': function(e){
		e.preventDefault();
		var matchDesc= this.team1_name + " vs " + this.team2_name;

		$('#update-winner-matchID-hidden').val(this._id);
		$('#update-winner-matchDesc').val(matchDesc);
		$('#update-winner-startTime').val(this.startDateTime);

		$('#update-winner-optionsRadios1').val(this.team1_id);
		$('#update-winner-optionsRadios2').val(this.team2_id);

		$('label[for=update-winner-optionsRadios1]').html(this.team1_name);
		$('label[for=update-winner-optionsRadios2]').html(this.team2_name);

		$('#updateMatchWinnerModal').modal('show');
	},

	//Click on add new match button
	'click #match-add-match-button': function(e){
		$('#addNewMatchModal').modal('show');
	},

	'submit .update-winner-match-form': function(e){
		e.preventDefault();
		var match_ID= $('.update-winner-match-form #update-winner-matchID-hidden').val();

		var winningTeamID= $('input[name=winnerOptions]:checked', '.update-winner-match-form').val();

		if(winningTeamID==='option3'){
			winningTeamID=-1 // We use -1 for no result;
		}

		var resultObj={
			match_id: match_ID,
			winning_team_id: winningTeamID
		};

		//Update the match winner
		Meteor.call("updateMatchWinner", resultObj, function(error){
			if(error){
				swal("error updating the match");
			}
			else
			{
				//Update the user selection scores and match winners
				Meteor.call('updateUserSelectionWinningTeam', resultObj);
			}
		});

		$('#updateMatchWinnerModal').modal('hide');
	},

	'click #match-update-scores-button': function(e){
		swal({
			title: "Are you sure?",
			text: "This will update all user's points.",
			type: "info",
			showCancelButton: true,
			confirmButtonText: "Yes!",
			closeOnConfirm: false
		},
		function(){
			Meteor.call('updateAllUsersScores', function(error){
				if(error){
					swal("Error!", "Your submission was not successful."+ error.reason, "error");
				}
				else{
					swal({
						title: "Are you sure?",
						text:"All scores have been updated.",
						type: "success"
					});
				}
			});
		});
	}
});

Template.matches.onCreated(function(){
	this.subscribe('allMatches');
});
