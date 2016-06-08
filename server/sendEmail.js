/*jshint node:true */
"use strict";

var server_addr = Meteor.settings.email_server.address;
var disableSendMail= true; //For now, I am disabling sending email. Set it to FALSE later.

Meteor.methods({
    sendEmail: function(mailFields) {
        console.log("about to send email from " + mailFields.from);
        console.log(mailFields);
        if (!mailFields.from) mailFields.from = server_addr;

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();
        try {
            if(!disableSendMail){
                Email.send({
                    to: mailFields.to,
                    from: mailFields.from,
                    subject: mailFields.subject,
                    html: mailFields.text
                });    
            }
            
        } catch(e) {
            console.log("Error trying to send an email notification: "+e);
        }
    },

    //This uses a template
    sendEmailWithTemplate: function(mailFields) {
        if (!mailFields.from) mailFields.from = server_addr;

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();
        try {
            if(!disableSendMail){
                Email.send({
                    to: mailFields.to,
                    from: mailFields.from,
                    subject: mailFields.subject,
                    html: SSR.render(mailFields.emailTemplate, mailFields.emailData )
                });
            }
        } catch(e) {
            console.log("Error trying to send an email notification: "+e);
        }
    },

});
