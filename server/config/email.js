/*jshint node:true */
"use strict";
/* global parseEmailForUsername */
Accounts.emailTemplates.siteName = "GuessTheWinner";

Accounts.emailTemplates.from = "GuessTheWinner <support@guessthewinner.in>";

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Message for " + user.profile.name;
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
    var signature = "Guessthewinner";

    return "Dear " + user.profile.name + ",\n\n" +
        "Click the following link to set your new password:\n" +
        url + "\n\n" +
        "Cheers,\n\n" +
        signature;
};


// A Function that takes a user object and returns a String for the subject line of the email.
Accounts.emailTemplates.verifyEmail.subject = function() {
    return 'Confirm Your Email Address';
};

// A Function that takes a user object and a url, and returns the body text for the email.
// Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    var signature = "GuessTheWinner";
     return "Dear " + user.profile.name + ",\n\n" +
        "Thank you for creating an account at GuessTheWinner. \n" +
        "Please click on the following link to verify your email address: \n\n" + url+
        "\n\n"+
        "Cheers,\n\n" +
        signature;
};
