var publicActivityFields = {
    id:1,
    name:1,
    distance:1,
    location_city:1,
    location_country:1,
    type:1,
    username:1,
    start_date:1,
    team: 1
};

Meteor.publish('leaderboard.individuals', function () {
  ReactiveAggregate(this, Activities, [{
    $group: {
        '_id': "$username",
        'activities': {
        // In this case, we're running summation. 
            $sum: 1
        },
        'distanceCompleted': {
            $sum: '$distance'
        }
    }
}, {
    $project: {
        // an id can be added here, but when omitted, 
        // it is created automatically on the fly for you
        _id: "$_id",
        activities: '$activities',
        distanceCompleted: '$distanceCompleted'
    } // Send the aggregation to the 'clientReport' collection available for client use
}], { clientCollection: "leaderboardIndividuals" });
});

Meteor.publish('leaderboard.teams', function () {
  ReactiveAggregate(this, Activities, [{
    $group: {
        '_id': "$team",
        'activities': {
        // In this case, we're running summation. 
            $sum: 1
        },
        'distanceCompleted': {
            $sum: '$distance'
        }
    }
}, {
    $project: {
        // an id can be added here, but when omitted, 
        // it is created automatically on the fly for you
        _id: "$_id",        
        activities: '$activities',
        distanceCompleted: '$distanceCompleted'
    } // Send the aggregation to the 'clientReport' collection available for client use
}], { clientCollection: "leaderboardTeams" });
});

Meteor.publish(
    'distances', function() {
        if (this.userId) {
            return Distance.find({});
        } else {
            return [];
        }
    });
    
Meteor.publish(
    'activities.feed', function() {
        if (this.userId) {
            return Activities.find({},{sort:{start_date:-1}, limit:10, fields: publicActivityFields });
        } else {
            return [];
        }
    });
    
Meteor.publish(
    'activities.user', function() {
        if (this.userId) {
            return Activities.find({_id: this.userId},{sort:{start_date:-1}, fields: publicActivityFields });
        } else {
            return [];
        }
    });
    
Meteor.publish(
    'activities.team', function() {
        var user = Meteor.users.find({_id: this.userId});
        if (this.userId) {
            return Activities.find({team: user.team},{sort:{start_date:-1}, limit:10, fields: publicActivityFields });
        } else {
            return [];
        }
    }
);



