var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASEURL);
var db = mongoose.connection;
var User = require('../models/user');

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


var Post = mongoose.model('Post', PostSchema);

module.exports = Post;

module.exports.getAllPosts = function(callback){
	var query = {};
	Post.find(query,null, {sort: {date: -1}})
            .populate('author')
            .populate('comments.author')
            .exec(callback)
}

module.exports.createPost =function( newPost, callback){
	newPost.save(callback);
}