Meteor.publish('activities.all', function() {
    return Activities.find({},{sortBy:{start_date:1}, limit:10});
});
