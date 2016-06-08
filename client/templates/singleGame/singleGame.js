Template.singleGame.helpers({
	gameStartCounter: function(){
		var current= Date.now();
		var counter= new Date(this.startDateTime) - current;
		// return "Game starts at " + new Date(this.startDateTime);
		return "Match starts in " + moment(this.startDateTime).fromNow();
	}
});

Template.singleGame.events({
	'click .team1': function(e){
		$(e.currentTarget).toggleClass('selected');
		$('.team2').removeClass('selected');
		if($('.team1').hasClass('selected')) {
			$('.singleGame-submit-button').prop('disabled', false);
		}
		else
		{
			$('.singleGame-submit-button').prop('disabled', true);	
		}
	},

	'click .team2': function(e){
		$(e.currentTarget).toggleClass('selected');
		$('.team1').removeClass('selected');
		if($('.team2').hasClass('selected')) {
			$('.singleGame-submit-button').prop('disabled', false);
		}
		else
		{
			$('.singleGame-submit-button').prop('disabled', true);	
		}
	},

	'click .singleGame-submit-button' : function(e){
		var teamSelectedName= $('.singleGame-team-logo.selected').attr('data-name');
		var teamSelectedID= $('.singleGame-team-logo.selected').attr('data-id');
		var pointsAllocated= $('#scoreRangeSlider').val();
		var self=this;

		swal({   
			title: "Are you sure?",   
			text: "If "+ teamSelectedName + " wins, you earn "+ pointsAllocated+ " points, else you will lose "+ pointsAllocated + " points!",   
			type: "info",   
			showCancelButton: true,     
			confirmButtonText: "Yes!",   
			closeOnConfirm: false 
		}, 
		function(){   
			var userSelectionObj={};
			userSelectionObj.match_id= self._id;
			userSelectionObj.user_selected_team_id= teamSelectedID;
			userSelectionObj.user_selected_points= parseInt(pointsAllocated);

			Meteor.call('submitUserSelection', userSelectionObj, function(error, result){
				if(error){
					swal("Error!", "Your submission was not successful."+ error.reason, "error"); 	
				}
				else
				{	
					swal({   
						title: "Are you sure?",   
						text:"Your submission was successful.",
						type: "success"
					}, 
					function(){   
						location=location;	
					});
					//swal("Submit!", "Your submission was successful.", "success");
					// Router.go('home');	
				}
			});
		});
	}
});

Template.singleGame.onRendered(function(){
	$('.singleGame-submit-button').prop('disabled', true);
	var maxSlider= this.data.slider;
	var midValue= parseInt(maxSlider/2);
	$("#scoreRangeSlider").ionRangeSlider({
   		min: 0,
    	max: maxSlider,
    	from: midValue,
    	step:50
	});
});