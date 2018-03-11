var     express= require("express"),
        app= express(),
        methodOverride = require("method-override"),
        bodyParser= require("body-parser"),
        flash     = require("connect-flash"),
        Campground= require("./models/campground"),
        Comment = require("./models/comment"),
        seedDB = require("./seeds"),
        User  = require("./models/user"),
        passport = require("passport"),
        LocalStrategy = require('passport-local').Strategy;

        
//  requiring routes   
var     commentRoutes = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes = require("./routes/index");
    

var     mongoose= require("mongoose");

        // mongoose.connect("mongodb://localhost/v4");
mongoose.connect("mongodb://veeren:veeren@ds028310.mlab.com:28310/veeren");        
        //seedDB();     //seed the databse


app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//passport config
app.use(require("express-session")({
    secret: "veeren is the best",
    resave: false,
    saveUninitialized: false
})); 
 
 
app.use(flash());  
// for using auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP , function(){
    console.log("The yelpcamp server has is started");
});