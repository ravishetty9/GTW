Template.landingPage.helpers({
    alreadyLoggedIn: function() {
      if(Meteor.userId() === undefined){
        return false;
      }
      else{
        return true;
      }
    },
    userName: function() {
      if( Meteor.user() && Meteor.user().emails){        
        var email = Meteor.user().emails[0].address;       
        email = email.match(/(.*)@/)[1].slice(0,9); 
        if (email.length===9) 
          email = email.slice(0,8) + "\u2026";
        return email;
      }else{
       return "Not Present";
      }
    }  
});


// Template.landingPage.helpers(AccountsTemplates.atNavButtonHelpers);

// // Simply 'inherites' events from AccountsTemplates
// Template.landingPage.events(AccountsTemplates.atNavButtonEvents);
