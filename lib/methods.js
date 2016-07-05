Meteor.methods({
    'Activities.insert.manual' (activity) {
        var activitySubmit = {
            start_date: new Date(),
            distance: parseInt(activity.distance, 10),
            type: activity.type,
            location_country: activity.location_country,
            userId: this.userId,
            username: Meteor.user().profile.fullName,
            team: Meteor.user().team || Meteor.user().profile.fullName,
            teamName: Teams.findOne({_id: Meteor.user().team}).name || Meteor.user().profile.fullName
        };

        Activities.insert(activitySubmit);
        
        Meteor.call('updateDistanceCompleted');
        
    },
    'Profile.update' (profileVals) {
        Meteor.users.update(this.userId, {
          $set: {
            'profile.name': profileVals.name,
            'profile.fullName': profileVals.fullName,
            'team': profileVals.team
          }
        });
    },
    'Team.create' (teamVals) {
        Teams.insert(teamVals);
    }
})