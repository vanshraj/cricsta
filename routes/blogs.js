var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');

//all blog route
router.get('/', function(req, res, next) {
	res.redirect('/blog/page/1')
});

router.get('/search/page/:i',function(req, res, next){
	if(req.params.i>0){
		Post.getPaginatedPostsSearch(req.params.i, req.query.searchQuery, function(err,posts){
			if(err) throw err;
			Post.getNFeaturedPosts(5,function(err, featuredPosts){
				if(err) throw err;
				res.render('blog/blog',{
					title: 'Blog',
					posts:posts.docs,
					page:posts.page,
					pages:posts.pages,
					featuredPosts: featuredPosts,
					search: true,
					searchQuery: req.query.searchQuery
				});
			});
		});
	}
	else{
		throw "Undefined Page";
	}
});

router.get('/page/:i',function(req, res, next){
	if(req.params.i>0){
		Post.getPaginatedPosts(req.params.i,function(err,posts){
			if(err) throw err;
			Post.getNFeaturedPosts(5,function(err, featuredPosts){
				if(err) throw err;
				res.render('blog/blog',{
					title: 'Blog',
					posts:posts.docs,
					page:posts.page,
					pages:posts.pages,
					featuredPosts: featuredPosts
				});
			});
		});
	}
	else{
		throw "Undefined Page";
	}
});

// adding blog routes
router.get('/add', isAuthenticated, isAdmin,function(req, res, next){
	res.render('blog/addblog',{title:'Add Blog'});
});

router.post('/add',isAuthenticated, isAdmin, function(req, res, next){
	//get form values
	var newPost = new Post({
		head: req.body.head,
		featured: false,
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

//single blog route
router.get('/show/:id',function(req, res, next){
	Post.getPost(req.params.id,function(err,post){
		if(err) throw err;
		Post.getNextLink(post,function(err,nextLink){
			if(err) throw err;
			Post.getPreviousLink(post,function(err,previousLink){
				if(err) throw err;
				res.render('blog/show',{ post:post, next: nextLink, previous: previousLink });
			});
		});
	});
});

//add comments
router.post('/addComment',isAuthenticated,function(req,res,next){
	// console.log(req.body.comment+" "+ req.body.userId+" "+req.body.postId);
	var newComment = {
		'text': req.body.comment,
		'author': req.body.userId
	}
	var postId = req.body.postId;
	Post.addComment(postId, newComment, function(err,comment){
		if(err) throw err;
		// console.log(comment);
		// res.send(comment);
		req.flash('success','Comment Added');
		res.location('/blog/show/'+postId+"#comments");
		res.redirect('/blog/show/'+postId+"#comments");
	});
});

//delete comment
router.post('/deleteComment',isAuthenticated, function(req,res,next){
	var commentId=req.body.commentId;
	var postId=req.body.postId;
	var authorId=req.body.authorId;
	var userId=req.body.userId;
	if((""+authorId)==(""+userId))
		Post.deleteComment(postId, commentId, function(err, comment){
			if(err) throw err;
			req.flash('success','Comment Deleted');
			res.location('/blog/show/'+postId+"#comments");
			res.redirect('/blog/show/'+postId+"#comments");
		});
	else{
		req.flash('error','You Can only delete your own comment');
		res.location('/blog/show/'+postId);
		res.redirect('/blog/show/'+postId);
	}
});

//middleware
function isAuthenticated(req, res, next) {
	if(req.isAuthenticated())
        return next();
    req.session.redirectTo = "/blog"+req.url;
    req.flash('error','Please Login First')
    res.redirect('/users/login');
}

function isAdmin(req, res, next){
	if(req.user.type=='admin')
		return next();
	req.flash('error','You cannot add blogs.')
    res.redirect(req.url);
}

module.exports = router;