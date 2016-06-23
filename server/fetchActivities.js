var username = '';
var userIdVal = '';

function insertActivity(element, index, array) {
    
    if (!!Activities.findOne({id: element.id})) {
        console.log('duplicate activity');  
    } else {
        element.username = username;
        element.userId = userIdVal
        Meteor.call('Activities.insert', element);
    }
}

Meteor.methods({
    'Activities.insert'(activity) {
        console.log('insert activity');
        Activities.insert(activity);
    },
    'fetchActivities'() {
        console.log('fetching activities');
        Meteor.users.find().forEach(function(user) {
            if (!!user.services.strava.accessToken) {
                username = user.profile.fullName;
                userIdVal = user.Id;
                
                var options = {
                    "headers": {
                        "authorization": "Bearer " + user.services.strava.accessToken
                    }
                };
    
                try {
                    var result = HTTP.call("GET", "https://www.strava.com/api/v3/athlete/activities", options);
                    // console.log(result);
                    result.data.forEach(insertActivity);
                    var completedDistance = Activities.find({}, {fields:{distance:1}}),
                        completedDistanceTotal = completedDistance.reduce(function(previousValue, currentValue, currentIndex, array){
                            return previousValue + currentValue;
                        });
                    
                    Distance.insert({"distanceCompleted" : completedDistanceTotal, createdAt: new Date()});
                    return true;
                }
                catch (e) {
                    // Got a network error, time-out or HTTP error in the 400 or 500 range.
                    return false;
                }
            }
    });
}});