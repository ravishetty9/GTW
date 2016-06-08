User_Selections= new Meteor.Collection('user_selections');

UserSelectionSchema = new SimpleSchema({
  "match_id":{
    type: String
  },

  "match_desc":{
    type: String,
    autoValue: function(){
      var matchID = this.field("match_id");
      if (matchID.isSet) {
        var team1=Matches.findOne(matchID.value).team1_name;
        var team2=Matches.findOne(matchID.value).team2_name;
            return team1 + " vs " + team2;
      } else {
        this.unset();
      }
    }
  },

  "user_id": {
      type: String,
      autoValue: function(){
        if (this.isInsert) {
          return this.userId
        }
      }
  },

  "user_email": {
      type: String,
      autoValue: function(){
        var userID = this.field("user_id");
        if (userID.isSet) {
          if(Meteor.users.findOne(userID.value).emails[0].address!== undefined){
            return Meteor.users.findOne(userID.value).emails[0].address  
          }
          else{
            return  "";
          }
        }
      }
  },

  "user_selected_team_id": {
    type: String
  },

  "user_selected_team_name": {
    type: String,
    autoValue: function(){
      var teamID = this.field("user_selected_team_id");
      if (teamID.isSet) {
          return Teams.findOne(teamID.value).name
      } else {
        this.unset();
      }
    }
  },

  "user_selected_points":{
  	type: Number,
  	label: "Slider"
  },

  "winning_team_id": {
    type: String,
    optional: true
  },

  "winning_team_name":{
  	type: 'String',
  	optional: true,
  	autoValue: function(){
  		var teamID = this.field("winning_team_id");
  		if (teamID.isSet) {
          if(teamID.value===""){
            console.log("empty");
            return "";
          }
  	    	return Teams.findOne(teamID.value).name
  		} else {
  	    	this.unset();
  		}
  	}
  },

  "points_earned":{
    type: Number,
    label: "Points",
    optional:true
    // autoValue: function(){
    //   var usersBet = this.field("user_selected_points");
    //   var userSelectedTeamID = this.field("user_selected_team_id");
    //   var winningTeamID = this.field("winning_team_id");

    //   if (winningTeamID.isSet) {
    //     if(userSelectedTeamID.value=== winningTeamID.value){
    //       return usersBet.value;
    //     }
    //     else
    //     {
    //       return (0-usersBet.value); 
    //     }
    //   } 
    //   else {
    //       this.unset();
    //   }
    // }
  },

  status:{
    type: Number,
    //Following are the status
    //0 - When user selects a winner or default when user makes a winner selection.
    //1- When the result(winning team) is updated.
    //2- When the scores are updated.
    allowedValues: [0, 1, 2],
    autoValue: function(){
      if(this.isInsert){
        return 0;  
      }
    }
  },

  "createdAt":{
  	type: Date,
    label: "Created At",
    autoValue: function(){
    	if(this.isInsert){
    		return new Date;	
    	}
    }
  }
});

User_Selections.attachSchema(UserSelectionSchema); 

// User_Selections.helpers({
//   match_title: function() {
//     return Matches.find(this.match_id).team1_name;
//   }
// });

if (Meteor.isClient) {
   Meteor.subscribe("teams");
   // Meteor.subscribe("matches");
}