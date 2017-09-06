var mongoose = require('mongoose');
mongoose.connect( process.env.DATABASEURL);
var db = mongoose.connection;
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

// Match Schema
var MatchSchema = mongoose.Schema({
	matchId: { type: String},
	totalOver:{ type: Number, default: 50},
	team1:{ name:{type: String}, wickets:{type: Number}, over:{type: SchemaTypes.Double}, actualScore:{type: Number}, predScore:{type: Number}, winProb:{type: Number}, odds:{type: Number} },
	team2:{ name:{type: String}, wickets:{type: Number}, over:{type: SchemaTypes.Double}, actualScore:{type: Number}, predScore:{type: Number}, winProb:{type: Number}, odds:{type: Number} },
	prob1:{ value:{type: Number}, percentage:{type: Number} },
	prob2:{ value:{type: Number}, percentage:{type: Number} },
	prob3:{ value:{type: Number}, percentage:{type: Number} },
	prob4:{ value:{type: Number}, percentage:{type: Number} },
	prob5:{ value:{type: Number}, percentage:{type: Number} },
	prob6:{ value:{type: Number}, percentage:{type: Number} },
	prob7:{ value:{type: Number}, percentage:{type: Number} },
	date:{ type: Date }
});

var PlayerSchema = mongoose.Schema({
	matchId: { type: String},
	start:{ type: Date, default: Date.now},
	date:{ type: Date, default: Date.now },
	team1:{
		name:{type: String},
		color:{type: String},
		batsmen:[ { name:{type:String}, points:{type: Number}, runsScored:{type: Number}, ballsPlayed:{type: Number}, keeper:{type: Boolean} } ],
		bowlers:[ { name:{type:String}, points:{type: Number}, wicketsTaken:{type: Number}, runsConceded:{type: Number} } ]
	},
	team2:{
		name:{type:String},
		color:{type: String},
		batsmen:[ { name:{type:String}, points:{type: Number}, runsScored:{type: Number}, ballsPlayed:{type: Number}, keeper:{type: Boolean} } ],
		bowlers:[ { name:{type:String}, points:{type: Number}, wicketsTaken:{type: Number}, runsConceded:{type: Number} } ]
	}
});

//exporting schemas
var Match = mongoose.model('Match', MatchSchema);
var Player = mongoose.model('Player', PlayerSchema);

module.exports = Match;
module.exports = Player;

//exporting schema functions

module.exports.getMatchDataOne = function(callback){
	var d = new Date();
    d.setUTCSeconds(00);
    d.setUTCMilliseconds(000);
    d = d.toISOString();
	var query = { date:{ $lt:d } };
	Match.find(query).limit(1).sort({ date: -1 }).exec(callback)
}

module.exports.getMatchDataFive = function(callback){
	var d = new Date();
    d.setUTCSeconds(00);
    d.setUTCMilliseconds(000);
    m = d.getUTCMinutes();
    x = m%10;
    z = (x<5)? 0:5;
    m = m-x+z 
    d.setUTCMinutes(m);
    d = d.toISOString();
	var query = { date:{ $lt:d } };
	Match.find(query).limit(1).sort({ date: -1 }).exec(callback)
}

module.exports.getMatchLatestData = function(callback){
	var query = {};
	Match.find(query).limit(1).sort({ date: -1 }).exec(callback)
}

module.exports.getMatchAllProb = function(match,callback){
	var query = { 'matchId': match[0].matchId };
	Match.find(query,'team1.predScore team1.winProb team2.winProb team1.over team2.over team1.name team2.name ').sort({ 'team1.over': 1,'team2.over': 1 }).exec(callback);
}

module.exports.getMatchFirstProb = function(match,callback){
	var query = { 'matchId': match[0].matchId };
	Match.findOne(query,'team1.predScore team2.predScore').sort({'team1.over': 1}).exec(callback);
}


module.exports.getPlayerData = function(match,callback){
	var query = { 'matchId': match[0].matchId };
	Player.findOne(query).sort({ date: -1 }).exec(callback);
}

module.exports.updateId = function(callback){
	var query = { 'matchId': '2262017RSAvsENG' };
	Match.update(query,{ $set:{'matchId':'2162017RSAvsENG'} },{multi:true}).exec(callback);
}