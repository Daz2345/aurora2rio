Template.activityFeed.onCreated(function() {
    this.autorun(() => {
        this.subscribe('activities.all');
  });
});

Template.activityFeed.helpers({
    activities: function() {
        return Activities.find({}).fetch();
    }
})