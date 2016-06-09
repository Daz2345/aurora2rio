
Template.newsfeed.onCreated(function() {
    this.autorun(() => {
        this.subscribe('activities.all');
  });
})

Template.newsfeed.helpers({
    activities: function() {
        return Activities.find();
    },
    username: function(activity) {
        stravaId = activity.athlete.id;
        user = Users.findOne({id: stravaId})
        return user.profile.fullName;
    }
})