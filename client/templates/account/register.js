Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        
        var isFormValid=$('.register-form').valid();

        console.log(isFormValid);

        if(isFormValid){
            var firstNameVar = event.target.registerFirstName.value;
            var lastNameVar = event.target.registerLastName.value;
            var usernameVar = event.target.registerUserName.value;
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value;

            var profileObj={
                firstName: firstNameVar,
                lastName: lastNameVar,
            };

            var userObj={
                email: emailVar,
                password: passwordVar,
                username: usernameVar,
                profile: profileObj
            };

            console.log(userObj.password);

            Accounts.createUser(userObj, function(error, result){
                if(error){
                    swal({
                        title: "Sign up failed",
                        type: "error",
                        text: error.reason
                    }); 
                }
                else
                {
                    Router.go('home')
                }   
            });
        } 
    }
});

Template.register.onRendered(function(){
    $('.register-form').validate();
});