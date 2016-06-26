if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({key: 'AIzaSyCwvQIJCGO7gvCF1hqQXaptl-8HsdU40Ls', libraries: 'geometry'});
  });
}

Template.activityFeed.onCreated(function() {
    var self = this;
      self.autorun(function() {
        self.subscribe('activities.feed');  
      });
});

Template.mainLayout.onCreated(function() {
    var self = this;
      self.autorun(function() {
        self.subscribe('distances');
    });
});

Template.activityFeed.helpers({
    activities: function() {
        return Activities.find({}).fetch();
    },
    distanceInKm: function(activity) {
        return Math.floor(activity.distance / 1000);
    }
});

Template.loginButtons.onRendered(function() {

	$('.ui .dropdown .item').removeClass('item');   
    Session.set('hascounted', false);	
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

      var countdown = $('.countdown').FlipClock(distanceLast, {
        clockFace: 'Counter',
        countdown: true,
        minimumDigits: 4
      });

      var downcounter = setInterval(function() {
        if (countdown.getTime().time == distanceToGo) {
          // countdown.stop();
          // // clearInterval(downcounter);
          // Session.set('hascounted', true);                
        }
        else {
          // if (!countdown.running()) {
          //   countdown.start();
          // }
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
        center: new google.maps.LatLng(9.366, -21.475),
        zoom: 3,
        scrollwheel: false
      };
    }
  }
});

var journey;

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
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: map.instance
        });

        journey.setPath([aurora, endPoint]);

    });
  });
})