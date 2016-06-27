var publicActivityFields = {
    id:1,
    name:1,
    distance:1,
    location_city:1,
    location_country:1,
    type:1,
    username:1,
    start_date:1
};

Meteor.publish(
    'teams', function() {
        if (this.userId) {
            return Teams.find({});
        } else {
            return [];
        }
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



