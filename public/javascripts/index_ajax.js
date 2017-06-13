$(document).ready(function(){
	setInterval(function runner() {
	    // run your ajax call here
	    $.ajax({
		type: 'GET',
		url: process.env.MATCH_DATA_URL,
		dataType: 'json'
		})
			.done(function(data) {
				liveFeed(data);
			})
			.fail(function() {
				console.log("Ajax failed to fetch data");
			});
	}, 1000);
	
});

var prevWinProb;//declare global variable
function liveFeed(data){
	//if new value updated then change table
	if(data.team1.winProb!=prevWinProb){
		prevWinProb = data.team1.winProb;
		$('.team1name').text(data.team1.name);
		$('.team1actual').text(data.team1.actualScore+"/"+data.team1.wickets+" ("+data.team1.over+ " overs)");
		$('.team1odds').text(Math.round(data.team1.odds* 100) / 100);
		$('.team1winprob').text(data.team1.winProb);
		$('.team1pred').text(Math.round(data.team1.predScore* 100) / 100);
		$('.team2name').text(data.team2.name);
		$('.team2actual').text(data.team2.actualScore+"/"+data.team2.wickets+" ("+data.team2.over+ " overs)");
		$('.team2odds').text(Math.round(data.team2.odds* 100) / 100);
		$('.team2winprob').text(data.team2.winProb);
		$('.team2pred').text(Math.round(data.team2.predScore* 100) / 100);
		$('.prob1value').text(data.prob1.value);
		$('.prob2value').text(data.prob2.value);
		$('.prob3value').text(data.prob3.value);
		$('.prob4value').text(data.prob4.value);
		$('.prob5value').text(data.prob5.value);
		$('.prob6value').text(data.prob6.value);
		$('.prob7value').text(data.prob7.value);
		$('.prob1percent').text(data.prob1.percentage+"%");
		$('.prob2percent').text(data.prob2.percentage+"%");
		$('.prob3percent').text(data.prob3.percentage+"%");
		$('.prob4percent').text(data.prob4.percentage+"%");
		$('.prob5percent').text(data.prob5.percentage+"%");
		$('.prob6percent').text(data.prob6.percentage+"%");
		$('.prob7percent').text(data.prob7.percentage+"%");	
	}
}
