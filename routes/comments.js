var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// var debug = require('debug')('yelp:comments');

//============================================================
// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
// find campground by id
Campground.findById(req.params.id, function(err, campground){
    if(err){
        console.log(err);
        res.redirect("/campgrounds");
    }else{
        res.render("./comments/new", {campground: campground});
    }
})

});

// Comments create 
router.post("/",middleware.isLoggedIn, function(req,res){
   Campground.findById(req.params.id, function(err, campground) {
       if(err){
           console.log(err);
       } else {
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                   req.flash("error", "Something wents wrong!");
                  console.log(err);
              } else {
                  // add username and id to comment 
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                   comment.save();
                    //   save comment
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    //campground.comments.push(comment._id);
                    //campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
              }
           });
        }
    });
});

//===============================================================
// edit comments
router.get("/:comment_id/edit",middleware.checkcommentowner, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err){
      res.redirect("back");
    } else{
res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    } 
  });
});

// comment update
router.put("/:comment_id",middleware.checkcommentowner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
    if(err){
        res.redirect("back");
    } else{
    // res.redirect("/campgrounds/" +req.params.id);
        // debug(req.params);
        console.log(req.params);
       res.redirect("/campgrounds/"+req.params.comment_id);
    }   
  });
});

//=========================================================
// destry the comment
router.delete("/:comment_id",middleware.checkcommentowner, function(req, res){
//   findByIdAndRemove
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       }else{
           req.flash("success", "Comments deleted");
           res.redirect("/campgrounds/" +req.params.id);
       }
   });         
});



//===============================================================



module.exports= router;