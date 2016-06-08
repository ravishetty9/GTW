Matches= new Meteor.Collection('matches');

Matchschema = new SimpleSchema({
  // Our schema rules will go here.
  "team1_id": {
    type: String,
    label: "Choose Team 1",
    regEx: SimpleSchema.RegEx.Id,
    autoform:{
    	options: function () {
	    	return Teams.find().map(function (team) {
	      		return {label: team.name, value: team._id};
	    	});
  		}
    }
  },

  "team1_name":{
  	type: 'String',
  	autoValue: function(){
		var teamID = this.field("team1_id");

		if (teamID.isSet) {
	    	return Teams.findOne(teamID.value).name
		} else {
	    	this.unset();
		}
  	}
  },

  "team1_logo":{
    type: 'String',
    autoValue: function(){
    var teamID = this.field("team1_id");
    if (teamID.isSet) {
        return Teams.findOne(teamID.value).logo
    } else {
        this.unset();
    }
    }
  },

  "team2_id": {
    type: String,
    label: "Choose Team 2",
    regEx: SimpleSchema.RegEx.Id,
    autoform:{
    	options: function () {
	    	return Teams.find().map(function (team) {
	      		return {label: team.name, value: team._id};
	    	});
  		}
    }
  },

  "team2_name":{
  	type: 'String',
  	autoValue: function(){
		var teamID = this.field("team2_id");
		if (teamID.isSet) {
	    	return Teams.findOne(teamID.value).name
		} else {
	    	this.unset();
		}
  	}
  },

  "team2_logo":{
    type: 'String',
    autoValue: function(){
    var teamID = this.field("team2_id");
    if (teamID.isSet) {
        return Teams.findOne(teamID.value).logo
    } else {
        this.unset();
    }
    }
  },

  "startDateTime":{
  	type: Date,
    label: "Start Date",
    autoform: {
      afFieldInput: {
        type: "datetime-local"
      }
    }
  },

  "slider":{
  	type: Number,
  	label: "Slider"
  },

  "winning_team_id": {
    type: String,
    label: "Choose winning team",
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
    autoform:{
    	options: function () {
        return Teams.find().map(function (team) {
            return {label: team.name, value: team._id};
        });
  		}
    }
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

  status:{
    type: Number,
    //Following are the status
    //0 - When admin creates a new match.
    //1- When the result(winning team) is updated.
    //2- When the scores are updated for this match.
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

Matches.attachSchema(Matchschema);

if (Meteor.isClient) {
   Meteor.subscribe("teams");
}

if(Meteor.isServer){
    Matches.allow({
        update: function () {
         // add custom authentication code here
        return true;
        },
        insert: function () {
         // add custom authentication code here
        return true;
        }
   });
}
