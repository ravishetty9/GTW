Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var isFormValid=$('.login-form').valid();

        if(isFormValid){
            var emailVar = event.target.loginEmail.value;
            var passwordVar = event.target.loginPassword.value;

            Meteor.loginWithPassword(emailVar, passwordVar, function(error, result){
                if(error){
                    swal(error.reason); 
                }
                else{
                    Router.go('home');
                }
            });
        }
    },

    'click #forgot-pwd-submit-btn' : function(e){
        e.preventDefault();
        var emailVar= $('#forgotPasswordEmail').val();
        var options={email: emailVar};
        Accounts.forgotPassword(options, function(error, result){
            if(error)
                swal(error.reason);
            else
                swal({
                    title: "Password reset",
                    text: "Email sent. Please check your inbox.",
                });
        });
    }
});

Template.login.onRendered(function(){
    $('.login-form').validate();
})