Router.configure({
    layoutTemplate: "ApplicationLayout",
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFoundTemplate' 
    //notFoundTemplate doesnot hit the router hooks. Its just view rendering. So we explicitly call the landing Page
    //from 'notFoundTemplate' template onRendered method.
});

Router.map(function() {
    this.route('landingPage', {
        path: '/',
        template:'landingPage'
    });
    
    // Account
    this.route('login', {
        path: '/login',
        template:'login'
    });

    this.route('register', {
        path: '/register',
        template:'register'
    });

    //Home
    this.route('home', {
        path: '/home',
        template: 'home'
    });   

    this.route('leaderboard', {
        path: '/leaderboard',
        template: 'leaderboard'
    });   

    this.route('stats', {
        path: '/stats',
        template: 'stats',
        data: function () {
            Session.set("currentStatsUserID", Meteor.userId());

            //When the user clicks on stats navbar link, we do not show the BACK button. 
            //So we use this session variable to check this condition.
            Session.set("navigateFromLeaderBoard", false);
        }
    });  

    this.route('/statsWithID',{
        path: '/stats/:_id',
        template: 'stats',
        data: function () {
          Session.set("currentStatsUserID", this.params._id);

          //When the user clicks on user name in leaderboard page, we navigate to stats page
          //but, we do not show the BACK button. So we use this session variable to check this condition.
          Session.set("navigateFromLeaderBoard", true);
        }
    }); 

    this.route('matches', {
        path: '/matches',
        template: 'matches'
    });   
});

