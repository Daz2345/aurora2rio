
fetchActivities = function() {

//   Users.find().forEach(function(user) {

        var options = {
          "method": "GET",
          "hostname": "www.strava.com",
          "port": null,
          "path": "/api/v3/athlete/activities",
          "headers": {
            "authorization": "Bearer b803f7e4376e6b4f1ee94c9148cb6345e9e97bed" //+ user.services.strava.accessToken,
          }
        };
        
        var req = HTTP.request(options, function (res) {
          var chunks = [];
        
          res.on("data", function (chunk) {
            chunks.push(chunk);
          });
        
          res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
          });
        });
        
        req.end();
//   });
};

// Meteor.methods({
//   fetchActivities: function () {
//     fetchActivities();
//   },

// });

function insertActivity(element, index, array) {
    console.log(element);
    Meteor.call('Activities.insert', element);
}

Meteor.methods({
    'Activities.insert'(activity) {
        Activities.insert(activity);
    },
    'fetchActivities'() {
    
        Meteor.users.find().forEach(function(user) {

            var options = {
                "headers": {
                    "authorization": "Bearer " + user.services.strava.accessToken,
                }
            };

            try {
                var result = HTTP.call("GET", "https://www.strava.com/api/v3/athlete/activities", options);
                // console.log(result);
                result.data.forEach(insertActivity);
                return true;
            }
            catch (e) {
                // Got a network error, time-out or HTTP error in the 400 or 500 range.
                return false;
            }
    })
}});