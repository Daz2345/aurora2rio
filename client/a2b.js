if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({key: 'AIzaSyCwvQIJCGO7gvCF1hqQXaptl-8HsdU40Ls', libraries: 'geometry'});
  });
  
    var LeaderboardTeamsSub = Meteor.subscribe('leaderboard.teams');
    var LeaderboardIndividualsSub = Meteor.subscribe('leaderboard.individuals');
    var activitiesSub = Meteor.subscribe('activities.feed');
    var distancesSub = Meteor.subscribe('distances');
    var athletes = Meteor.subscribe('athletes');
    var teamsSub = Meteor.subscribe('teams');  
    var userData = Meteor.subscribe('userData');
    var sunburst = Meteor.subscribe('sunburst');
    var sponsoredUser = Meteor.subscribe('sponsoredDataUser');
    var sponsoredTeam = Meteor.subscribe('sponsoredDataTeam');    
}

Template.leaderboard.onRendered(function() {
    $('.tabular.menu .item').tab();
});

Template.leaderboardIndividual.helpers({
  individuals: function() {
    return Meteor.users.find({},{sort:{rank:1}}).fetch();
  },
    fields: function() {
    return [
          {key: 'rank', label: 'Rank' , sortable: false},
          {key: 'profile.fullName', label: 'Name' , sortable: false},
          {key: 'activityCount', label: 'Number of activities' , sortable: false}, 
          {key: 'distanceCompleted', label: 'Distance Completed' , sortable: false, fn: function(value, object, key) { return Math.round(value)} }
     ];
  }
});

Template.leaderboardTeam.helpers({
  teams: function() {
    return Teams.find({distanceCompleted:{$exists:true}},{sort:{rank:1}}).fetch();
  },
    fields: function() {
    return [
          {key: 'rank', label: 'Rank' , sortable: false},      
          {key: 'name', label: 'Team Name' , sortable: false},
          {key: 'activityCount', label: 'Number of activities' , sortable: false}, 
          {key: 'distanceCompleted', label: 'Distance Completed' , sortable: false, fn: function(value, object, key) { return Math.round(value)}}
     ];
  }
});

Template.activityFeed.helpers({
    activities: function() {
        return Activities.find({}).fetch();
    },
    distanceInKm: function(activity) {
        return Math.floor(activity.distance / 1000);
    },
    fields: function(){
      return [
          { key: 'start_date', label: 'When', fn: function(value, object, key) { return moment(value).format('Do MMMM - HH:mm'); }, sortByValue: true, sortDirection: 'descending' },
          { key: 'teamName', label: 'Team' },
          { key: 'username', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'distance', label: 'Distance (metres)', fn: function(value, object, key) { return Math.round(value)} },
          { key: 'location_country', label: 'Country' }
        ];
    }
});

Template.loginButtons.onRendered(function() {
	$('.ui .dropdown .item').removeClass('item');   
});

Template.top.onRendered(function() {

      // fix menu when passed
      $('.ui.large.secondary.inverted.pointing.menu.noborder')
        .visibility({
          once: false,
          onBottomPassed: function() {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function() {
            $('.fixed.menu').transition('fade out');
          }
        });

      // create sidebar and attach to menu open
      $('.ui.sidebar')
        .sidebar('attach events', '.toc.item');

}); 

Template.homeContent.onRendered(function() {
  
  var currentDate = new Date();
	var futureDate  = new Date(currentDate.getFullYear(), 7, 6, 0, 0, 0);
	// Calculate the difference in seconds between the future and current date
	var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;
	// Instantiate a coutdown FlipClock
	var clock = $('.clock').FlipClock(diff, {
		clockFace: 'DailyCounter',
		countdown: true
	});

$('.ui.dropdown')
  .dropdown()
;

}); 

Template.leaderboardTeam.events({
  'click .submitTeam': function(){
    var teamForm = document.getElementById('newTeam');
    var teamVals = {
      name: teamForm.elements['teamName'].value,
      sponsorLink: teamForm.elements['sponsorLink'].value     
    };
    
    Meteor.call('Team.create', teamVals);
    
  }
});

Template.logoutbutton.events({
  'click .logout': function() {
    Meteor.logout();
  }
});

Template.homeContent.events({
    'click .submitActivity': function(e) {
      
      var activityForm = document.getElementById('activityForm');
      
        var activity = {
          distance: activityForm.elements["distance"].value,
          type: activityForm.elements["type"].value,
          location_country: activityForm.elements["country"].value          
        };
        
        activityForm.elements["distance"].value = "";
        activityForm.elements["type"].value = "";
        activityForm.elements["country"].value  = "";         
        
        Meteor.call('Activities.insert.manual', activity);
        FlowRouter.go('feed');
    }
});

Template.countdown.onCreated(function() {
  Meteor.autorun(function() {
    // subscribe to the posts publication
    var subscription = Meteor.subscribe('distances');

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      var currentDist = Distance.findOne({"distanceType": "current"}) || {distanceCompleted: 0},
        previousDist = Distance.findOne({"distanceType": "previous"}) || {distanceCompleted: 0},
        distanceToGo = 9280 - (Math.floor(currentDist.distanceCompleted / 1000)),
        distanceLast = 9280 - (Math.floor(previousDist.distanceCompleted / 1000));

      if (distanceLast != 9280) {
          distanceLast = distanceLast + 10;
      }

      var countdown = $('.countdown').FlipClock(distanceLast, {
        clockFace: 'Counter',
        countdown: true,
        minimumDigits: 4
      });

      setInterval(function() {
        if (countdown.getTime().time == distanceToGo) {
        }
        else {
          countdown.decrement();
        }
      }, 500);
    }
  });
});

Template.homeContent.helpers({
  completedDistance: function(){
    return Distance.findOne({"distanceType": "current"}) >= 9280000 ;
  }
});

Template.map.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(15.1204303,-23.7452564),
        zoom: 3,
        scrollwheel: false
      };
    }
  }
});

Template.map.onCreated(function() {

  var self = this;

  GoogleMaps.ready('map', function(map) {

      var aurora = new google.maps.LatLng(51.5119793, -0.3104522),
        rio = new google.maps.LatLng(-22.9068467, -43.1728965);

        var journey = new google.maps.Polyline({
          path: [],
          strokeColor: '#A31A7E',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: map.instance
        });
  
        self.autorun(function() {
          var heading = google.maps.geometry.spherical.computeHeading(aurora, rio),
            distance = Distance.findOne({
              'distanceType': 'current'
            }) || {
              distanceCompleted: 0
            },
            endPoint = google.maps.geometry.spherical.computeOffset(aurora, distance.distanceCompleted, heading);
            
          journey.getPath().removeAt(1);
          journey.getPath().removeAt(0);
          journey.getPath().insertAt(0, aurora);
          journey.getPath().insertAt(1, endPoint);
        });
      
        var dh = "The home of dunnhumby’s global headquarters, our London office opened in 1998, nine years after the company was founded in the West London flat of Edwina Dunn and Clive Humby. Located in Ealing, about 20 km west of central London, the office is actually comprised of two buildings, Aurora House and Ealing Cross (and now holds considerably more people than our founders' spare bedroom). ",
            br = "The 2016 Summer Olympics will take place in Rio de Janeiro, Brazil, from August 5 to August 21, 2016";
        
        addMarker(aurora, dh, map.instance);
        addMarker(rio, br, map.instance);
        
        function addMarker(location, contentString, map) {
          // Add the marker at the clicked location, and add the next-available label
          // from the array of alphabetical characters.
          var marker = new google.maps.Marker({
            position: location,
            map: map
          });
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
        }
  });
});

Template.userProfile.helpers({
  profileUpdate: function(){
    return (Meteor.user().profile.fullName == undefined) ? true : false;
  },
  teams: function() {
    return Teams.find({},{sort:{name:1}});
  },
  firstName: function() {
    return Meteor.user().profile.name;
  },
  lastName: function() {
    return Meteor.user().profile.fullName.replace(Meteor.user().profile.name + " ","");
  },
  team: function() {
    return Teams.find(Meteor.user().team).name;
  }
});

Template.settings.events({
  'click a': function (event) {
    event.preventDefault();
    window.open(event.target.href, '_blank');
  },
  'click .submitProfile': function(){
    
    var profileForm = document.getElementById('profileForm');
    var profileVals = {};
    
    profileVals.name = profileForm.elements['firstName'].value || "";
    profileVals.fullName = profileVals.name + " " + profileForm.elements['lastName'].value || "";
    profileVals.team = $("select[name='team']").find(':selected').data('value') || "";

    Meteor.call('Profile.update', profileVals);
        
  },
  'click .submitTeam': function(){
    
    var addHttp = function (url) {
      if (!/^(f|ht)tps?:\/\//i.test (url)) {
        url = "http://" + url;
      }
      return url;
    };
    
    var teamForm = document.getElementById('newTeam');
    var teamVals = {
      name: teamForm.elements['teamName'].value  
    };
    
    Meteor.call('Team.create', teamVals);
    
  }
});

Template.settings.helpers({
  teamCreate: function() {
    return (Meteor.user().teamName == undefined) ? true : false;
  },
    teams: function() {
    return Teams.find({}, {sort: {name:1}}).fetch();
  },
    team: function() {
    return Meteor.user().teamName;
  },
  fields: function() {
    return [{key: 'name', label: 'Team Name'},{key: 'sponsorLink', label: 'Sponsorship Page', fn: function (value) {
    return new Spacebars.SafeString("<a href=" + value + ">" + value + "</a>");
}}];
  }
});

Template.settings.onRendered(function() {
    $('.tabular.menu .item').tab();
});


Template.sponsorsTeam.helpers({
  Sponsorship: function(){
    return Sponsorship.find({sponsoredType: "Team"})
  },
  fields: function(){
    return [{key: 'name', label: 'Sponsor'}, {key: 'contact', label: 'Contact'}, {key: 'pledge', label: 'Sponsored / Pledge'}];
  }
});

Template.sponsorsAthlete.helpers({
  Sponsorship: function(){
    return Sponsorship.find({sponsoredType: "Individual"})
  },
  fields: function(){
    return [{key: 'name', label: 'Sponsor'}, {key: 'contact', label: 'Contact'}, {key: 'pledge', label: 'Sponsored / Pledge'}];
  }
});

Template.sponsor.helpers({
  teams: function() {
    return Teams.find({},{sort:{name:1}});
  },
  athletes: function(){
    return Meteor.users.find({},{sort:{"profile.fullName":1}});    
  },
  correctInsert: function(){
    return (Session.get('correctInsert')) ? "success" : "";
  },
  sponsored: function(){
    return Session.get('sponsored');
  }
});

Template.logoutbutton.helpers({
  userName: function() {
    var nm;
    if (Meteor.user().profile !== undefined) {
      nm = Meteor.user().profile.fullName;
    } else {
      nm = "Please fill in your name via settings";
    }
    return nm;
  }
});

Template.sponsor.onRendered(function() {
    Session.set('sponsored', "");
    Session.set('correctInsert', false);
    $('.tabular.menu .item').tab();
    $('#search-select1').dropdown();
    $('#search-select2').dropdown();    
    $('.ui.form').form({
    fields: {
      name     : 'empty',
      pledge   : 'empty',
      contact : 'empty'
    }
  });
    Session.set('sponsored', 'athlete');
});

Template.sponsor.events({
  'click .athleteSponsor': function() {
    Session.set('sponsored', 'athlete');
  },
  'click .teamSponsor': function() {
    Session.set('sponsored', 'team');
  },
  'click .submitTeam': function(){
    var sponsorshipForm = document.getElementById('sponsorForm'),
        sponsoredId = (Session.get("sponsored") === "athlete") ? $('#search-select1').dropdown('get value') : $('#search-select2').dropdown('get value'),
        sponsoredType = (Session.get("sponsored") === "athlete") ? 'Individual' : 'Team';

    var sponsoredVal;
    if (Session.get("sponsored") === "athlete") {
      sponsoredVal = Meteor.users.findOne({_id: sponsoredId}).profile.fullName;
    } else {
      sponsoredVal = Teams.findOne({_id: sponsoredId}).name
    }        
        
    var sponsorshipVals = {
          name: sponsorshipForm.elements['name'].value,
          pledge: sponsorshipForm.elements['pledge'].value,
          contact: sponsorshipForm.elements['contact'].value,
          sponsored: sponsoredId,
          sponsoredName: sponsoredVal,
          sponsoredType: sponsoredType
        };

    sponsorshipForm.elements['name'].value = "";
    sponsorshipForm.elements['pledge'].value = "";
    sponsorshipForm.elements['contact'].value = "";    
    $('#search-select1').dropdown('clear');
    $('#search-select2').dropdown('clear');
    
    Meteor.call('sponsorship.create', sponsorshipVals);
    Session.set('correctInsert', true);
    Session.set('sponsored', sponsoredVal);    
  }
})