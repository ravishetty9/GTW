////////////////
// BeforeHooks
////////////////
// I use an object that contains all before hooks
var IR_BeforeHooks = {
    isLoggedIn: function() {
        if (!(Meteor.loggingIn() || Meteor.user())) {
            console.log("User not logged in");
            Router.go('landingPage');
        }
        else
        {
          this.next();
        }
    },

    isAdmin: function(){
        if (!(Meteor.loggingIn() || Meteor.user())) {
            console.log("User not logged in");
            Router.go('landingPage');
        }
        else
        {
            var loggedInUser = Meteor.user();
            if(Roles.userIsInRole(loggedInUser,['admin'], 'default-group'))
            {
                this.next();
            } 
            else
            {
                Router.go('home');
            }
        }
    },

    redirectToHomeIfLoggedIn: function() { 
        if (!(Meteor.loggingIn() || Meteor.user())) {
            console.log("Hitting Landing Page with user not logged in");
            this.next();
        }
        else
        {
            console.log("Hitting Landing Page with user logged in");
            Router.go('home');
        }
    }
    // add more before hooks here
}

// (Global) Before hooks for any route
//Router.onBeforeAction(IR_BeforeHooks.somethingForAnyRoute);

// Before hooks for specific routes
// Must be equal to the route names of the Iron Router route map
Router.onBeforeAction(IR_BeforeHooks.isLoggedIn, {only: ['home','leaderboard','stats']});
Router.onBeforeAction(IR_BeforeHooks.isAdmin, {only: ['matches']});
Router.onBeforeAction(IR_BeforeHooks.redirectToHomeIfLoggedIn, {only: ['landingPage']});
