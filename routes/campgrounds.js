var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// index list
router.get("/", function(req, res){
    
        // get all campgrounds from db
        Campground.find({}, function(err, allcampgrounds){
            if(err){
            console.log(err);
            }else{
            res.render("campgrounds/index",{campgrounds:  allcampgrounds, currentUser: req.user});      
            }
        }); 
    });


// creaet add new campground
router.post("/",middleware.isLoggedIn, function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author = {
            id:   req.user._id,
        username: req.user.username
    };
    var newCampground= { name: name, image: image, description: desc, author: author };

// create camp and add in db
Campground.create(newCampground,function(err, newcreated){
  if(err){
      console.log(err);
  }  else{
//   redirect
    res.redirect("/campgrounds");  
  }
});
    
}); 

// show form to crrate new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");    
});


// show more info about the campground
router.get("/:id", function(req, res){
//   find the camp with provide id 
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
if(err){
    console.log(err);
    
    }else{
        console.log(foundCampground);
        // render show template with that campground 
        res.render("campgrounds/show", {campground: foundCampground});  
    } 
   });
   
});

// edit campground
router.get("/:id/edit",middleware.checkcampgroundowner, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});          
  });
});  

// update campground
router.put("/:id", function(req, res){
    // find the update in correct campground

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, update){
    if(err){
       res.redirect("/campgrounds"); 
    }else{
      res.redirect("/campgrounds/" +req.params.id);  
      }    
    })
    // redirect
});


// destry campground
router.delete("/:id",middleware.checkcampgroundowner ,  function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
        res.redirect("/campgrounds"); 
    }else{
      res.redirect("/campgrounds");  
      }    
    })
});




module.exports= router;
