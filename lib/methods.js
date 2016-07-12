Meteor.methods({
    'Activities.insert.manual' (activity) {
        var activitySubmit = {
            start_date: moment().toISOString(),
            distance: parseInt(activity.distance, 10),
            type: activity.type,
            location_country: activity.location_country,
            userId: this.userId,
            username: Meteor.user().profile.fullName,
            teamId: Meteor.user().team || "No Team",
            teamName: Teams.findOne({_id: Meteor.user().team}).name || "No Team"
        };

        Activities.insert(activitySubmit);
        
        Meteor.call('updateDistanceCompleted');
        
    },
    'Profile.update' (profileVals) {
        Meteor.users.update(this.userId, {
          $set: {
            'profile.name': profileVals.name,
            'profile.fullName': profileVals.fullName,
            'team': profileVals.team,
            'teamName': Teams.findOne({_id: profileVals.team}).name || ""
          }
        });
    },
    'Team.create' (teamVals) {
        Teams.insert(teamVals);
    },
    'sponsorship.create' (sponsorshipVals) {
        sponsorshipVals.createdAt = new Date();
        sponsorshipVals.createdByLoggedInUser = this.userId || 'external';
        Sponsorship.insert(sponsorshipVals)
    }
})