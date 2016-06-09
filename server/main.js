var publicActivityFields = {
    id:1,
    athlete:1,
    name:1,
    distance:1,
    location_city:1,
    location_country:1,
    type:1
};

Meteor.publish('activities.all', function() {
    return Activities.find({},{sortBy:{start_date:1}, limit:10, fields: publicActivityFields });
});

