Activities = new Mongo.Collection('activities');

Distance = new Mongo.Collection('distance');

Teams = new Mongo.Collection('teams');

TeamNames = new Mongo.Collection('teamsNames');


if (Meteor.isClient) {
    LeaderboardTeams = new Mongo.Collection(null);
    LeaderboardIndividual = new Mongo.Collection(null);
}