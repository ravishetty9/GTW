Teams= new Meteor.Collection('teams');

TeamSchema = new SimpleSchema({
  // Our schema rules will go here.
  "name": {
    type: String,
    label: "Team Name"
  },

  "country": {
    type: String,
    label: "Country"
  },

  "logo":{
  	type: String,
  	label: "Team Logo"
  }
});

Teams.attachSchema(TeamSchema); 