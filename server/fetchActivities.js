function insertActivity(element, index, array, user) {
    
    if (!!Activities.findOne({id: element.id})) {
        console.log('duplicate activity');  
    } else {
        element.username = user.profile.fullName;
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

            var options = {
                "headers": {
                    "authorization": "Bearer " + user.services.strava.accessToken
                }
            };

            try {
                var result = HTTP.call("GET", "https://www.strava.com/api/v3/athlete/activities", options);
                // console.log(result);
                result.data.forEach(insertActivity(user));
                return true;
            }
            catch (e) {
                // Got a network error, time-out or HTTP error in the 400 or 500 range.
                return false;
            }
    });
}});