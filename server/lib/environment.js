"use strict";

var smtp = {
    username: Meteor.settings.smtp.username,
    password: Meteor.settings.smtp.password,
    server:   Meteor.settings.smtp.server,
    port: Meteor.settings.smtp.port,
};

// process.env.REPLY_TO = "do_not_reply@guessthewinner.in";
process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' +
                                   encodeURIComponent(smtp.password) + '@' +
                                   encodeURIComponent(smtp.server) + ':' + smtp.port;

