Template.loading.rendered = function () {
  // if (!Session.get('loadingSplash') ) {
    this.loading = window.pleaseWait({
      logo: '/images/logo.png',
      backgroundColor: '#ffffff',
      loadingHtml: message + spinner
    });
  //   Session.set('loadingSplash', true); // just show loading splash once
  // }
};

Template.loading.destroyed = function () {
  if (this.loading) {
    this.loading.finish();
  }
};

var message = '<p class="loading-message"><b>Guess The Winner</b></p>';
var spinner = '<i class="fa fa-spinner fa-spin fa-4x"></i>';

// var message = '<p class="loading-message">Just a sec...</p>';
// var spinner = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';