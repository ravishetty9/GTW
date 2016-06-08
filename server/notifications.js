Meteor.methods({
	sendPushNotifications: function(pushNotificationObj){
		Push.debug = true;

		Push.send({
		 	from: 'GuessTheWinner',
	       	title: pushNotificationObj.title,
	       	text: pushNotificationObj.text,
			badge: 1,
		  	query: pushNotificationObj.query
		});
	}
});