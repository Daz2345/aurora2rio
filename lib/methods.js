Meteor.methods({
    'Activities.insert.manual' (activity) {
        var activitySubmit = {
            start_date: moment().toISOString(),
            distance: parseInt(activity.distance, 10),
            type: activity.type,
            location_country: activity.location_country,
            userId: this.userId,
            username: (Meteor.user().profile !== undefined) ? Meteor.user().profile.fullName : "No name submitted",
            teamName: (Meteor.user().team !== undefined) ? Teams.findOne({_id: Meteor.user().team}).name : "No Team",
            teamId: Meteor.user().team || "No Team"
        };

        // activitySubmit.teamName = (Meteor.user().team !== undefined) ? Teams.findOne({_id: Meteor.user().team}).name : "No Team";
        if (activitySubmit.distance > 0) {
            Activities.insert(activitySubmit);
            Meteor.call('updateDistanceCompleted');
        }
    },
    'Profile.update' (profileVals) {
        var team = Teams.findOne({_id: profileVals.team})
        Meteor.users.update(this.userId, {
          $set: {
            'profile.name': profileVals.name,
            'profile.fullName': profileVals.fullName,
            'team': profileVals.team,
            'teamName': (team == undefined) ? "" : team.name
          }
        });
    },
    'Team.create' (teamVals) {
        teamVals.createdAt = new Date();
        if (Teams.find({name: teamVals.name}).fetch().length == 0) {
            Teams.insert(teamVals);
        }
    },
    'sponsorship.create' (sponsorshipVals) {
        sponsorshipVals.createdAt = new Date();
        sponsorshipVals.createdByLoggedInUser = this.userId || 'external';
        Sponsorship.insert(sponsorshipVals)
    }
})