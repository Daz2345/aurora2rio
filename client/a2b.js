Template.activityFeed.onCreated(function() {
    this.autorun(() => {
        this.subscribe('activities.all');
  });
});

Template.activityFeed.helpers({
    activities: function() {
        return Activities.find({}).fetch();
    },
    username: function(activity) {
        var stravaId = activity.athlete.id;
        var user = Meteor.users.findOne({id: stravaId});
        if (!!user) {
            return user.profile.fullName;
        }
        return "unknown";
    }
})