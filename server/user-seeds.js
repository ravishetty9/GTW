Meteor.startup(function(){
	if(Meteor.users.find().count()===0){
		var users = [
		{name:"Tester User1",email:"tester1@example.com", username:'tester1', roles:[]},
		{name:"Ravish Shetty",email:"ravishetty9@gmail.com",username:'ravishetty9', roles:['admin']},
		{name:"Rakesh Shetty",email:"rakesh408059@gmail.com",username:'rakesh408059',roles:['admin']}
		];

		_.each(users, function (user) {
			var id;
			var password;
			if(user.roles[0]=='admin'){
				password="admin"
			}
			else{
				password="normal"
			}

			id = Accounts.createUser({
				email: user.email,
				password: password,
				username: user.username,
				profile: { name: user.name }
			});

			Meteor.users.update(id, {$set: {"emails.0.verified" :true}});

			if (user.roles.length > 0) {
				// Need _id of existing user record so this call must come
				// after `Accounts.createUser` or `Accounts.onCreate`
				Roles.addUsersToRoles(id, user.roles, 'default-group');
			}
		});
	}
	else{
		//console.log("Users already setup");
	}

	if(Teams.find().count()==0){
		var teams = [
		{name:"India", country:"IN", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1458180899/India_i26oe0.png'},
		{name:"Pakistan", country:"PAK", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1458181077/pak_wb9bxt.jpg'},
		{name:"Srilanka", country:"SL", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1457826975/SL_kl4mkx.jpg'},
		{name:"South Africa", country:"SA", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1457826975/SA_jgkx7f.png'},
		{name:"West Indies", country:"WI", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1457826975/WI_xpuhhn.jpg'},
		{name:"Australia", country:"AUS", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1457826975/AUS_czlnj1.jpg'},
		{name:"England", country:"ENG", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1457826975/ENG_dgx0gl.png'},
		{name:"New Zealand", country:"NZ", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1457826975/NZ_y2ysev.png'},
		{name:"Bangladesh", country:"BAN", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1457826975/BAN_fxbcnl.png'},
		{name:"Afghanistan", country:"AFG", logo:'http://res.cloudinary.com/dcshbkl7h/image/upload/v1458070316/AFG_bxtrf5.jpg'}
		];

		_.each(teams, function(team) {
			Teams.insert(team);
		});
	}

});
