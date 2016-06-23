FlowRouter.route('/', {
  name: 'home',
  subscriptions: function(params, queryParams) {
    this.register('Distance', Meteor.subscribe('distance.all'));
  },
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
  subscriptions: function(params, queryParams) {
    this.register('Feed', Meteor.subscribe('activities.feed'));
  },
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
      content: "",
      footer: "footer"
    });
  }
});

FlowRouter.route('/map', {
  name: 'map',
  subscriptions: function(params, queryParams) {
    this.register('Distance', Meteor.subscribe('distance.all'));
  },  
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
      content: "",
      footer: "footer"
    });
  }
});