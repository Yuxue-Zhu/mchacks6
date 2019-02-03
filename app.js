var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var app = express();

//db section
//Hosted mongoose database
mongoose.connect('mongodb://Andy:Mchacks2019@ds119755.mlab.com:19755/mcstudy');

//defining schema for a user
var profileSchema = new mongoose.Schema({
	UID: Number,
	username: String,
	email: String,
	year: String,
	classes: Array,
	friends: Array
});
profileSchema.plugin(passportLocalMongoose);
var Profile = mongoose.model("Profile", profileSchema);

//defining schema for a class
var courseSchema = new mongoose.Schema({
	CID: String,
	students: Array
});

var Course = mongoose.model("Course", courseSchema);






// var andy = new Profile({
// 	UID: "1",
// 	Name: "Andy",
// 	age: 20,
// 	friends: ["Yunxi", "Dylan"]
// });

// // andy.save(function(err, profile){
// // 	if(err){
// // 		console.log("Error Encountered!");
// // 	} else {
// // 		console.log("Saving profile to DB");
// // 		console.log(profile);
// // 	}
// // });


// //create function
// Profile.create({
// 	UID: "1",
// 	Name: "Andy",
// 	age: 20,
// 	friends: ["Yunxi", "Dylan"]
// }, function(err, profile){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(profile);
// 	}
// });


// //retrieve all info from database
// Profile.find({}, function(err, profiles){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log()
// 	}
// })







//routing section
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "I am a beauty",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Profile.authenticate()));
passport.serializeUser(Profile.serializeUser());
passport.deserializeUser(Profile.deserializeUser());

//order of routes matters, always put important route first
// "/" => "Hi there"

var friends = [];


app.get("/", function(req, res){
	res.render("home");
});


app.get("/signup", function(req, res){
	//show all available classes 
	Course.find({}, function(err, Allcourses){
		if(err){
			console.log("can't load classes");
			
		} else {
			res.render("signup", {courses:Allcourses});
		}
	})
});


// put the 
app.post("/signup", function(req, res){
	req.body.password
	var UID = req.body.UID;
	var name = req.body.username;
	var email = req.body.email;
	var year = req.body.year;
	var classes = req.body.classes;
	var friends = [];

	var newUsr = {
		UID: UID,
		username: name,
		email: email,
		year: year,
		classes: [classes],
		friends: friends
	};


	

	Profile.register(newUsr, req.body.password, function(err, profile){
		if(err){
			console.log(err);
			
			

		} else {
			passport.authenticate("local")(req,res, function(){

				//something wrong with these codes 
				/*	var newCourse = {
					CID: classes,
					students: [Name]
					}
	
	
					//also post to Class
					Course.create(newCourse);*/

					res.redirect("/");
	

			});

		}
	})

});

//logoin
app.get("/login", function(req,res){
    res.render("login");
})
//login logic
//middleware
app.post("/login", passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect: "/login"
}),function(req,res){
})



// app.post("/addfriend", function(req, res){
// 	var newFriend = req.body.newfriend;
// 	friends.push(newFriend);
// 	res.redirect("/friends");
// });

app.get("/friends", function(req, res){
	res.render("friends", {friends: friends});
});
// //pattern match page
// app.get("/lib/:libName", function(req, res){
// 	var libName = req.params.libName;
// 	res.render("lib", {libName: libName});
// });




//error message page
app.get("*", function(req,res){
	res.send("You current request is not supported")
});



// 3000 is the set port number
app.listen(8100, process.env.IP, function(){
	console.log("McStudy server has started");
});

