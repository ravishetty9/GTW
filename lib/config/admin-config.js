AdminConfig = {
	adminEmails: Meteor.settings.public.defaultAdminEmail, 
	collections:
		{
			Teams: {
				tableColumns: [
				   { label: 'Name', name: 'name' },
				   { label: 'Country', name: 'country' },
				   { label: 'Logo', name: 'logo' }
				],
				color:'aqua'
			},

			Matches: {
				omitFields: ['createdAt', 'team1_name', 'team2_name','team1_logo', 'team2_logo','winning_team_name'],
				tableColumns: [
				   { label: 'Team 1', name: 'team1_name' },
				   { label: 'Team 2', name: 'team2_name' },
				   { label: 'Slider', name: 'slider' },
				   { label: 'Starts At', name: 'startDateTime' },
				   { label: 'Winning Team ID', name: 'winning_team_id' },
				   { label: 'Winning Team', name: 'winning_team_name' },
				   { label: 'Status', name: 'status' }
				],
				color:'green'
			},

			User_Selections:{
				omitFields: ['user_email','user_selected_team_name','points_earned','winning_team_name','match_desc'],
				tableColumns: [
				   { label: 'Match', name: 'match_desc' },
				   { label: 'User Email', name: 'user_email' },
				   { label: 'User Selected Team', name: 'user_selected_team_name' },
				   { label: 'Points', name: 'user_selected_points' },
				   { label: 'Winning Team', name: 'winning_team_name' },
				   { label: 'Points Earned', name: 'points_earned' },
				   { label: 'Status', name: 'status' }
				],
				color:'yellow',
				showEditColumn: true, // Set to false to hide the edit button. True by default.
  				showDelColumn: true
			}
	},

	// Disable editing of user fields:
	userSchema: null,

	// // Use a custom SimpleSchema:
	// userSchema: new SimpleSchema({
	// 	'profile.firstName': {
	//    		type: String
	//  	},
	//  	'username':{
	//  		type: String
	//  	},
	//  	'totalPoints' :{
	//  		type: Number,
	//  		defaultValue: 0
	//  	}
	// })

}
