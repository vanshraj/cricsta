var mongoose = require('mongoose');
mongoose.connect( process.env.DATABASEURL);
var db = mongoose.connection;

// Match Schema
var MatchSchema = mongoose.Schema({
	team1:{ name:{type: String}, wickets:{type: Number}, over:{type: Number}, actualScore:{type: Number}, predScore:{type: Number}, winProb:{type: Number}, odds:{type: Number} },
	team2:{ name:{type: String}, wickets:{type: Number}, over:{type: Number}, actualScore:{type: Number}, predScore:{type: Number}, winProb:{type: Number}, odds:{type: Number} },
	prob1:{ value:{type: Number}, percentage:{type: Number} },
	prob2:{ value:{type: Number}, percentage:{type: Number} },
	prob3:{ value:{type: Number}, percentage:{type: Number} },
	prob4:{ value:{type: Number}, percentage:{type: Number} },
	prob5:{ value:{type: Number}, percentage:{type: Number} },
	prob6:{ value:{type: Number}, percentage:{type: Number} },
	prob7:{ value:{type: Number}, percentage:{type: Number} },
	date:{ type: Date}
});

var Match = mongoose.model('Match', MatchSchema);

module.exports = Match;

module.exports.getMatchData = function(callback){
	var query = {};
	Match.find(query).limit(1).sort({ date: -1 }).exec(callback)
}
