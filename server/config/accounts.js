// Set up login services
Meteor.startup(function() {
    // Add Facebook configuration entry
    ServiceConfiguration.configurations.update(
      { "service": "facebook" },
      {
        $set: {
          "appId": Meteor.settings.facebook.appId,
          "secret": Meteor.settings.facebook.secret
        }
      },
      { upsert: true }
    );

    // Add GitHub configuration entry
    ServiceConfiguration.configurations.update(
      { "service": "google" },
      {
        $set: {
          "clientId": Meteor.settings.google.clientId,
          "secret": Meteor.settings.google.secret
        }
      },
      { upsert: true }
    );
});