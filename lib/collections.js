Activities = new Mongo.Collection('activities');

Distance = new Mongo.Collection('distance');

Teams = new Mongo.Collection('teams');

TeamNames = new Mongo.Collection('teamNames');


if (Meteor.isClient) {
    LeaderboardTeams = new Mongo.Collection('leaderboardTeams');
    LeaderboardIndividuals = new Mongo.Collection('leaderboardIndividuals');
}