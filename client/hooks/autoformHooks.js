var hooksObject = {
  // Called when form does not have a `type` attribute
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    // You must call this.done()!
    //this.done(); // submitted successfully, call onSuccess
    //this.done(new Error('foo')); // failed to submit, call onError with the provided error
    //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
  },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    console.log(result);
    Meteor.call('notifyUsersNewMatch',result);
  },

  // Called when any submit operation fails
  onError: function(formType, error) {},

  // Called at the beginning and end of submission, respectively.
  // This is the place to disable/enable buttons or the form,
  // show/hide a "Please wait" message, etc. If these hooks are
  // not defined, then by default the submit button is disabled
  // during submission.
  beginSubmit: function() {
    console.log("Adding match.....");
  },
  endSubmit: function() {
    $('#addNewMatchModal').modal('hide');
    console.log("Match Added");
  }
};

// Pass `true` as optional third argument to replace all existing hooks of the same type
AutoForm.addHooks('insertMatchForm', hooksObject, true);
