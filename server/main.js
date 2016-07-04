var publicActivityFields = {
    id:1,
    distance:1,
    location_city:1,
    location_country:1,
    type:1,
    username:1,
    start_date:1,
    team: 1
};

Meteor.publish('leaderboard.individuals', function () {
    return Meteor.users.find({},{fields:{'profile.fullName':1, rank:1, distanceCompleted:1, activityCount:1}, sort:{rank:1}});
});

Meteor.publish('leaderboard.teams', function () {
    return Meteor.users.find({},{fields:{name:1, rank:1, distanceCompleted:1, activityCount:1}, sort:{rank:1}});
});

Meteor.publish('sunburst.data', function(){
   
   var sbData = "";
   
   var dataval = Activities.aggregate([
              {$group: {_id: {team: "$team", username: "$username", type: "$type"}, distanceCompleted: {$sum: "$distance"}}}
            ]);

   dataval.forEach(function(activity) {
         sbData = sbData + activity._id.team + "-" + activity._id.username + "-" + activity._id.type + "," + activity.distanceCompleted + "\n";
    });
   this.added("sunburstData", null, {myString: sbData});
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



