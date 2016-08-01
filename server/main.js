var publicActivityFields = {
    id: 1,
    distance: 1,
    location_city: 1,
    location_country: 1,
    type: 1,
    username: 1,
    start_date: 1,
    teamId: 1,
    teamName: 1
};

Teams._ensureIndex('name', {unique: true});

Meteor.publish("sponsoredDataTeam", function() {
    if (this.userId) {
        var teamId = Meteor.users.find({
            _id: this.userId
        }).team;
        return Sponsorship.find({
            sponsored: teamId
        });
    }
    else {
        return [];
    }
});

Meteor.publish("sponsoredDataUser", function() {
    if (this.userId) {
        return Sponsorship.find({
            sponsored: this.userId
        });
    }
    else {
        return [];
    }
});

Meteor.publish("userData", function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                'profile.fullName': 1,
                'profile.name': 1,
                'team': 1,
                'teamName': 1
            }
        });
    }
    else {
        return [];
    }
});

Meteor.publish('athletes', function () {
    return Meteor.users.find({}, {fields:{_id:1, 'profile.fullName': 1}});
});

Meteor.publish('teams', function () {
    return Teams.find({}, {fields:{_id:1, 'name': 1}});
});

Meteor.publish('leaderboard.individuals', function() {
    if (this.userId) {
        return Meteor.users.find({
            distanceCompleted: {
                $exists: true
            },
            rank: {
                $exists: true
            }
        }, {
            fields: {
                'profile.fullName': 1,
                rank: 1,
                teamName: 1,
                distanceCompleted: 1,
                activityCount: 1
            },
            sort: {
                rank: 1
            }
        });
    }
    else {
        return [];
    }
});

Meteor.publish('leaderboard.teams', function() {
    if (this.userId) {
        return Teams.find({}, {
            sort: {
                rank: 1
            }
        });
    }
    else {
        return [];
    }
});

Meteor.publish('sunburst', function() {
    if (this.userId) {
    return SunburstData.find({}, {
        sort: {
            createdAt: -1
        },
        limit: 1
    });
    }
    else {
        return [];
    }
});

Meteor.publish('distances', function() {
    return Distance.find({});
});

Meteor.publish('activities.feed', function() {
    if (this.userId) {
        return Activities.find({}, {
            sort: {
                start_date: -1
            },
            fields: publicActivityFields,
            limit: 20
        });
    }
    else {
        return [];
    }
});

Meteor.publish(
    'activities.user',
    function() {
        if (this.userId) {
            return Activities.find({
                _id: this.userId
            }, {
                sort: {
                    start_date: -1
                },
                fields: publicActivityFields
            });
        }
        else {
            return [];
        }
    });

Meteor.publish(
    'activities.team',
    function() {
        var user = Meteor.users.find({
            _id: this.userId
        });
        if (this.userId) {
            return Activities.find({
                team: user.team
            }, {
                sort: {
                    start_date: -1
                },
                limit: 10,
                fields: publicActivityFields
            });
        }
        else {
            return [];
        }
    }
);
