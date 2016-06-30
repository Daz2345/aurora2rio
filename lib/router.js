FlowRouter.route('/', {
  name: 'home',
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "homeContent",
      footer: "footer"
    });
  }
});

FlowRouter.route('/feed', {
  name: 'feed',
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "activityFeed",
      footer: "footer"
    });
  }
});

FlowRouter.route('/user', {
  name: 'profile',
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "profile",
      footer: "footer"
    });
  }
});

FlowRouter.route('/teams', {
  name: 'teams',
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "teams",
      footer: "footer"
    });
  }
});

FlowRouter.route('/journey', {
  name: 'journey',
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "map",
      footer: "footer"
    });
  }
});

FlowRouter.route('/leaderboard', {
  name: 'leaderboard',
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "leaderboard",
      footer: "footer"
    });
  }
});