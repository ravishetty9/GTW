Template.home.helpers({
	'availableMatch': function(){
		return Matches.findOne();
	}
});

Template.home.onRendered(function(){
	this.subscribe('currentAvailableMatch');
});