FlowRouter.route('/', {
  name: 'home',
  action: function() {
    BlazeLayout.render("mainLayout", {
      topSection: "top",
      content: "homeContent",
      footer: "footer"
    });
  }
});

FlowRouter.route('/feed', {
  name: 'feed',
  action: function() {
    BlazeLayout.render("mainLayout", {
      topSection: "top",
      content: "activityFeed",
      footer: "footer"
    });
  }
});

FlowRouter.route('/user', {
  name: 'profile',
  action: function() {
    BlazeLayout.render("mainLayout", {
      topSection: "top",
      content: "profile",
      footer: "footer"
    });
  }
});

FlowRouter.route('/teams', {
  name: 'teams',
  action: function() {
    BlazeLayout.render("mainLayout", {
      topSection: "top",
      content: "teams",
      footer: "footer"
    });
  }
});

FlowRouter.route('/journey', {
  name: 'journey',
  action: function() {
    BlazeLayout.render("mainLayout", {
      topSection: "top",
      content: "map",
      footer: "footer"
    });
  }
});

FlowRouter.route('/leaderboard', {
  name: 'leaderboard',
  action: function() {
    BlazeLayout.render("mainLayout", {
      topSection: "top",
      content: "leaderboard",
      footer: "footer"
    });
  }
});