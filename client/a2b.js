Template.activityFeed.onCreated(function() {
    this.autorun(() => {
        this.subscribe('activities.all');
    });
});

Template.activityFeed.helpers({
    activities: function() {
        return Activities.find({}).fetch();
    }
})

var images = [
    "pizza",
    "sleeping",
    "swimmer",
    "bicyclist",
    "runner",
    "repeat",
    ,
    ,
    ,
    ,
    ,
    ,
    "pizza",
    "sleeping",
    "swimmer",
    "bicyclist",
    "runner",
    "repeat",
    "dunnhumbyLogo"
    ];

var text = [
    ,
    ,
    ,
    ,
    ,
    ,
    "eat.",
    "sleep.",
    "swim.",
    "bike.",
    "run.",
    "repeat.",
    "eat.",
    "sleep.",
    "swim.",
    "bike.",
    "run.",
    "repeat.",
];


Template.imageswapper.helpers({
    currentText: function() {
        return text[Session.get("CurrentImage")];
    },
    currentImage: function() {
        var currentImageCount = Session.get("CurrentImage");
        if (currentImageCount === 18) {
        } else {
            // <i class={{currentImage}}></i>
        return "twa twa-5x twa-" + images[Session.get("CurrentImage")];
        }
    },
    showImage: function() {
        return Session.get("CurrentImage") === 18;
    }
    
});

Template.imageswapper.onCreated(function() {
    Session.set("CurrentImage", 0);
    var run = false;
    this.runimages = setInterval(function(){
        var currentImageCount = Session.get("CurrentImage");
        if (currentImageCount === 18) {
            // if (!run) {
            //     Session.set("CurrentImage", 0);
            // } else {
            //     run === true;
                clearInterval(this.runimages);
            // }
        } else {
            Session.set("CurrentImage", currentImageCount + 1);
        }
    },500);    
})