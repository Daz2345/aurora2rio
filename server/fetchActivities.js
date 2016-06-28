var username = '';
var userIdVal = '';
var userTeam = '';

function insertActivity(element, index, array) {

    if (!!Activities.findOne({
            id: element.id
        })) {
        console.log('duplicate activity');
    }
    else {
        element.username = username;
        element.userId = userIdVal;
        element.team = userTeam;
        Meteor.call('Activities.insert', element);
    }
}

Meteor.methods({
    'Activities.insert' (activity) {
        console.log('insert activity');
        Activities.insert(activity);
    },
    'fetchActivities' () {
        console.log('fetching activities');
        Meteor.users.find().forEach(function(user) {
            if (!!user.services.strava) {
                username = user.profile.fullName;
                userIdVal = user._id;
                userTeam = user.team || username;
                
                var options = {
                    "headers": {
                        "authorization": "Bearer " + user.services.strava.accessToken
                    }
                };

                try {
                    var result = HTTP.call("GET", "https://www.strava.com/api/v3/athlete/activities?after=1466380800", options);
                    // console.log(result);
                    result.data.forEach(insertActivity);
                    return true;
                }
                catch (e) {
                    // Got a network error, time-out or HTTP error in the 400 or 500 range.
                    return false;
                }
            }
        });
    },
    'updateDistanceCompleted' () {
        
        if (Distance.find({}).count() === 0) {
            Distance.insert({
                'distanceType': 'previous',
                "distanceCompleted": 0,
                createdAt: new Date()
            });
                
            Distance.insert({
                'distanceType': 'current',
                "distanceCompleted": 0,
                createdAt: new Date()
            });            
        }
        
        var completedDistanceTotal = Activities.aggregate([
              {$group: {_id: null, distanceCompleted: {$sum: "$distance"}}}
            ]);
            
        var previousDistance = Distance.find({'distanceType': 'current'}).fetch();

        if (completedDistanceTotal.length === 0){
            completedDistanceTotal = previousDistance;
        }    
        
        
        // put this in for live
        if (previousDistance[0].distanceCompleted !== completedDistanceTotal[0].distanceCompleted) {
            Distance.update({'distanceType': 'previous'},{
                'distanceType': 'previous',
                "distanceCompleted": previousDistance[0].distanceCompleted,
                createdAt: new Date()
            },{upsert:true});
            Distance.update({'distanceType': 'current'},{
                'distanceType': 'current',
                "distanceCompleted": completedDistanceTotal[0].distanceCompleted,
                createdAt: new Date()
            },{upsert:true});

        }
        // update users
        Meteor.users.find().forEach(function(user) {
            userIdVal = user._id;
            var userDistance = Activities.aggregate([
              {$match: {userId: userIdVal}},
              {$group: {_id: null, distanceCompleted: {$sum: "$distance"}}},
              {$project:{distanceCompleted: "$distanceCompleted"}}
            ]);
            Meteor.users.update({_id : userIdVal},{$set:{distanceCompleted: userDistance[0].distanceCompleted}}, {upsert:true});
        });        
        
        Meteor.users.find().forEach(function(user) {
            userIdVal = user._id;
            var userRank = Meteor.users.find({distanceCompleted:{$gt: user.distanceCompleted}}).count() + 1;
            Meteor.users.update({_id : userIdVal},{$set:{rank: userRank}}, {upsert:true});
        });         
        // update teams
        // Teams.find().forEach(function(team) {
        //     userIdVal = user._id;
        //     var userDistance = Activities.aggregate([
        //       {$match: {userId: userIdVal}},
        //       {$group: {_id: null, distanceCompleted: {$sum: "$distance"}}}
        //     ]);
        //     Meteor.users.update({user},{$set:{distanceCompleted: userDistance.distanceCompleted}}, {upsert:true});
        // });        
        
        // Meteor.users.find().forEach(function(user) {
        //     userIdVal = user._id;
        //     var userRank = Meteor.users.find({$gt:{distanceCompleted: user.distanceCompleted}}).count() + 1;
        //     Meteor.users.update({_id : userIdVal},{$set:{rank: userRank}}, {upsert:true});
        // });              
    }
});

SyncedCron.add({
  name: 'Pull in numbers from Strava',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 15 minutes');
  },
  job: function() {
    return Meteor.call('fetchActivities');
  }
});

SyncedCron.add({
  name: 'Add up distances',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 5 minutes');
  },
  job: function() {
    return Meteor.call('updateDistanceCompleted');
  }
});

SyncedCron.start();