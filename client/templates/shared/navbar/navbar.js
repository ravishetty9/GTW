Template.navbar.helpers({
	// check if user is an admin
	loggedInUserName: function(){
		if(Meteor.user())
			return Meteor.user().name;
	},

	totalPoints: function(){
		if(Meteor.user())
			return Meteor.user(Meteor.userId()).totalPoints || 0;
	},

    isAdminUser: function() {
        return Roles.userIsInRole(Meteor.user(), 'admin', 'default-group');
    },
    
	onPage: function (pageName) {
		if(Router.current().route!== undefined){
			return Router.current().route.getName() === pageName;		
		}
	},

	currentProfilePicture: function(){
		return Meteor.user().profile.picture || _gtw_defaultProfileImage;	
	}
	
});

Template.navbar.events({
	"click .logout": function(e){
		e.preventDefault();
		AccountsTemplates.logout();
	},

	"click .navbar-brand": function(e){
		e.preventDefault();
		Router.go('home');
	},

	"click .navbar-menu-item": function(e){
		$('#gtw-navbar-main').collapse('hide');
	}
});

Template.navbar.onCreated(function(){
	this.subscribe('userData');
});