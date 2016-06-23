if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({key: 'AIzaSyCwvQIJCGO7gvCF1hqQXaptl-8HsdU40Ls', libraries: 'geometry'});
  });
}

Template.activityFeed.onCreated(function() {
    this.autorun(() => {
        this.subscribe('activities.feed');
    });
});

Template.countDown.onCreated(function() {
    this.autorun(() => {
        this.subscribe('distance.all');
    });
});

Template.activityFeed.helpers({
    activities: function() {
        return Activities.find({}).fetch();
    },
    distanceInKm: function(activity) {
        return activity.distance / 1000;
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

Template.countdown.onRendered(function(){
    var distanceToGo = 9270; //- Distance.findOne({"distanceType": "current"}).distance
	var distanceLast = 9280; //- Distance.findOne({"distanceType": "last"}).distance
    
	var countdown = $('.countdown').FlipClock(distanceLast, {
		clockFace: 'Counter',
		countdown: true,
		minimumDigits: 4
	});
	
    var downcounter = setInterval(function() {
            if (countdown.getTime().time == distanceToGo) {
                countdown.stop();
                clearInterval(downcounter);
                Session.set('hascounted', true);                
            } else {
                countdown.decrement();
            }
        }, 1000);
});

Template.map.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(19.366, -46.475),
        zoom: 3,
        scrollwheel: false
      };
    }
  }
});

Template.map.onCreated(function(){
  GoogleMaps.ready('map', function(map) {
      
    var aurora = new google.maps.LatLng(51.5119793,-0.3104522),
        rio = new google.maps.LatLng(-22.9068467,-43.1728965);
    
    var heading = google.maps.geometry.spherical.computeHeading(aurora, rio),
        startPoint = aurora,
        distance = 300000,
        endPoint = google.maps.geometry.spherical.computeOffset(aurora, distance, heading);
        
    var journey = new google.maps.Polyline({
        path: [aurora, endPoint],
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map.instance
    });
    // var markerCurrent = new google.maps.Marker({
    //       position: endPoint,
    //       map: map.instance
    //     });        
  });    
})