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

// var images = [
//     "pizza",
//     "sleeping",
//     "swimmer",
//     "bicyclist",
//     "runner",
//     "repeat",
//     ,
//     ,
//     ,
//     ,
//     ,
//     ,
//     "pizza",
//     "sleeping",
//     "swimmer",
//     "bicyclist",
//     "runner",
//     "repeat",
//     "dunnhumbyLogo"
//     ];

// var text = [
//     ,
//     ,
//     ,
//     ,
//     ,
//     ,
//     "eat.",
//     "sleep.",
//     "swim.",
//     "bike.",
//     "run.",
//     "repeat.",
//     "eat.",
//     "sleep.",
//     "swim.",
//     "bike.",
//     "run.",
//     "repeat.",
// ];


// Template.imageswapper.helpers({
//     currentText: function() {
//         return text[Session.get("CurrentImage")];
//     },
//     currentImage: function() {
//         var currentImageCount = Session.get("CurrentImage");
//         if (currentImageCount === 18) {
//         } else {
//             // <i class={{currentImage}}></i>
//         return "twa twa-5x twa-" + images[Session.get("CurrentImage")];
//         }
//     },
//     showImage: function() {
//         return Session.get("CurrentImage") === 18;
//     }
    
// });

// Template.imageswapper.onCreated(function() {
//     Session.set("hasRun", false);
//     if (!Session.get("hasRun")) {
//         Session.set("CurrentImage", 0);

//         this.runimages = setInterval(function(){
//             var currentImageCount = Session.get("CurrentImage");
//             if (currentImageCount === 18) {
//                 if (!Session.get("hasRun")) {
//   Session.set("CurrentImage", 0);
//   Session.set("hasRun", true);  
//                 } else {
//   clearInterval(this.runimages);
//                 }
//             } else {
//                 Session.set("CurrentImage", currentImageCount + 1);
//             }
//         },500);    
//     }
// })