var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASEURL);
var db = mongoose.connection;
var User = require('../models/user');
var mongoosePaginate = require('mongoose-paginate');

// Post Schema
var PostSchema = mongoose.Schema({
	head: {type: String},
	body: {type: String},
	date: {type: Date},
	tags: [String],
	comments: [{ 
		text: String,
		author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
	}],
	author: { type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

PostSchema.plugin(mongoosePaginate);

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;

//get single post according to id
module.exports.getPost = function(id, callback){
	Post.findById(id).exec(callback);
}

//get all posts
module.exports.getAllPosts = function(callback){
	var query = {};
	Post.find(query,null, {sort: {date: -1}})
			.limit(2)
            .populate('author')
            .populate('comments.author')
            .exec(callback)
}

//paginated posts
module.exports.getPaginatedPosts = function(i,callback){
	var query ={};
	Post.paginate(query, {sort: { date: -1 }, page: i, limit: 5 }, callback);
}

//get next previous
module.exports.getNextLink = function(post, callback){
	var query= { date:{$gt: post.date} };
	Post.findOne(query,'_id').sort({date: 1}).limit(1).exec(callback);
}
module.exports.getPreviousLink = function(post, callback){
	var query= { date:{$lt: post.date} };
	Post.findOne(query,'_id').sort( {date: -1}).limit(1).exec(callback);
}

//get n featured blogs
module.exports.getNFeaturedPosts = function(n, callback){
	var query = { featured: true};
	Post.find(query,'_id head body').sort({date: -1}).limit(n).exec(callback);
}

//create a new post
module.exports.createPost =function( newPost, callback){
	newPost.save(callback);
}