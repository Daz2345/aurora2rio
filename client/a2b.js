if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({key: 'AIzaSyCwvQIJCGO7gvCF1hqQXaptl-8HsdU40Ls', libraries: 'geometry'});
  });
  
    var LeaderboardTeamsSub = Meteor.subscribe('leaderboard.teams');
    var LeaderboardIndividualsSub = Meteor.subscribe('leaderboard.individuals');
    var activitiesSub = Meteor.subscribe('activities.feed');
    var distancesSub = Meteor.subscribe('distances');
    var teamsSub = Meteor.subscribe('teams');  
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
          {key: 'distanceCompleted', label: 'Distance Completed' , sortable: false }
     ];
  }
});

Template.leaderboardTeam.helpers({
  teams: function() {
    return Teams.find({},{sort:{rank:1}}).fetch();
  },
    fields: function() {
    return [
          {key: 'rank', label: 'Rank' , sortable: false},      
          {key: 'team', label: 'Team Name' , sortable: false},
          {key: 'activityCount', label: 'Number of activities' , sortable: false}, 
          {key: 'distanceCompleted', label: 'Distance Completed' , sortable: false}
     ];
  }
});

// Template.activityFeed.onCreated(function() {
//     var self = this;
//       self.autorun(function() {
//         self.subscribe('activities.feed');  
//       });
// });

// Template.mainLayout.onCreated(function() {
//     var self = this;
//       self.autorun(function() {
//         self.subscribe('distances');
//     });
// });

Template.teams.helpers({
  teams: function() {
    return Teams.find({}).fetch();
  },
  fields: function() {
    return [
          {key: 'team', label: 'Team Name'},
          {key: 'athletes', label: 'Team Size'}, 
          {key: 'distanceCompleted', label: 'Distance Completed' , sortByValue: true, sortDirection: 'descending' }
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
          { key: 'team', label: 'Team' },
          { key: 'username', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'distance', label: 'Distance (metres)' },
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
	var futureDate  = new Date(currentDate.getFullYear(), 7, 5, 16, 0, 0);
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

Template.profile.events({
  'click .submitProfile': function(){
    
    var profileForm = document.getElementById('profileForm');
    var profileVals = {};
    
    profileVals.name = profileForm.elements['first-name'].value;
    profileVals.fullName = profileForm.elements['first-name'].value + " " + profileForm.elements['last-name'].value;
    profileVals.team = profileForm.elements['team'].value;

    profileForm.elements['first-name'].value = "";
    profileForm.elements['last-name'].value = "";
    profileForm.elements['team'].value = "";
    
    Meteor.call('Profile.update', profileVals);
        
  }
});

Template.profile.helpers({
  distance: function(){
    return Meteor.user().distanceCompleted;
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
        Meteor.call('users.updateDistance');
        Meteor.call('teams.updateDistance');
        
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

      var downcounter = setInterval(function() {
        if (countdown.getTime().time == distanceToGo) {
        }
        else {
          countdown.decrement();
        }
      }, 500);
    }
  });
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
    self.autorun(function() {
      var aurora = new google.maps.LatLng(51.5119793, -0.3104522),
        rio = new google.maps.LatLng(-22.9068467, -43.1728965);

      var heading = google.maps.geometry.spherical.computeHeading(aurora, rio),
        distance = Distance.findOne({
          'distanceType': 'current'
        }) || {
          distanceCompleted: 0
        },
        endPoint = google.maps.geometry.spherical.computeOffset(aurora, distance.distanceCompleted, heading);

        var journey = new google.maps.Polyline({
          path: [],
          strokeColor: '#A31A7E',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: map.instance
        });

        journey.setPath([aurora, endPoint]);
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
});

Template.userProfile.helpers({
  teams: function() {
    return Teams.find({},{sort:{name:1}});
  },
  showSubmit: function() {
    return Meteor.user().team == "" * Meteor.user().profile.fullName == "";
  },
  showUpdateName: function() {
    return !Meteor.user().profile.fullName;
  },
  showUpdateTeam: function() {
    return !Meteor.user().team;
  }
})