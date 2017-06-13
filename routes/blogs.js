var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');

//blog route
router.get('/', function(req, res, next) {
	Post.getAllPosts(function(err,posts){
		res.render('blog/blog',{
			title:'Blog',
			posts:posts
		});
	});
});


// adding blog routes
router.get('/add', isAuthenticated, isAdmin,function(req, res, next){
	res.render('blog/addblog',{title:'Add Blog'});
});

router.post('/add',isAuthenticated, isAdmin, function(req, res, next){
	//get form values
	var newPost = new Post({
		head: req.body.head,
		body: req.body.body,
		author: req.user._id,
		date: new Date(),
		tags: req.body.tags.replace(/\s/g, '').split(",")
	});
	
	Post.createPost(newPost, function(err, post){
		if(err) throw err;
	});
	
	req.flash('success','Post Submitted');
	res.location('/blog');
	res.redirect('/blog');

});

//middleware
function isAuthenticated(req, res, next) {
	if(req.isAuthenticated())
        return next();

    req.flash('error','Please Login First')
    res.redirect('/users/login');
}

function isAdmin(req, res, next){
	if(req.user.type=='admin')
		return next();
	req.flash('error','You cannot add blogs.')
    res.redirect('/');
}

module.exports = router;