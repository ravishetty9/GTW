// Validate username, sending a specific error message on failure.
Accounts.validateNewUser(function (user) {
	console.log("Validating user:" +  user);
	// console.log("Validating USer: "+ user.profile.name);
	// console.log("Validating USer: "+ user.profile.firstName);
	// console.log("Validating USer: "+ user.profile.lastName);
    if (user.profile.name)
    	return true;
  	throw new Meteor.Error(403, "User name is empty");
});

// Validate username, without a specific error message.
Accounts.validateNewUser(function (user) {
  return user.username !== "root";
});

Accounts.onCreateUser(function(options, user) {
    var OptionsEmailAddress=""
    options.profile = options.profile || {} ;
   	options.profile.joinDate = moment().toISOString();
   	options.emails=user.emails||[];

    if(user.services.facebook){
      OptionsEmailAddress= user.services.facebook.email;
      options.profile.firstName = user.services.facebook.first_name;
      options.profile.lastName = user.services.facebook.last_name;
      options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    }
    if(user.services.google){
      OptionsEmailAddress= user.services.google.email;
      options.profile.firstName = user.services.google.first_name;
      options.profile.lastName = user.services.google.last_name;
      options.profile.picture = user.services.google.picture;
    }
    if(!(options.profile.firstName || options.profile.lastName) && options.profile.name) {
      options.profile.firstName = options.profile.name.split(" ")[0];
      options.profile.lastName = _.rest(options.profile.name.split(" ")).join(" ");
    }

    if(!options.name) {
      options.profile.name = options.profile.firstName + " " + options.profile.lastName;
    }

    console.log(options.emails);
    //Emails are required for admin page. So we add this condition.
    if (_.isEmpty(options.emails)) {
    	options.emails.push({address:OptionsEmailAddress, verified: true}); //Automatically verify if its oauth
    }

    console.log(options.emails[0].address);
    user.profile = options.profile;
    user.emails= options.emails;

    // send the welcome email here....watch for bounces so we can ask the user
    // to correct their email

    return user;
});
