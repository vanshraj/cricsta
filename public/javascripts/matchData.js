$(document).ready(function(){
	$.ajax({
		type: 'GET',
		url: "/matchData",
		dataType: 'json'
		})
			.done(function(data) {
				liveFeed(data);
			})
			.fail(function() {
				console.log("Ajax failed to fetch data");
			});
	setInterval(function runner() {
	    // run your ajax call here
	    $.ajax({
		type: 'GET',
		url: "/matchData",
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

//declare global variable
var prevWinProb;
var team1name;
var team1score;
var team2name;
var team2score;

function liveFeed(data){
	//if new value updated then change table
	if(data.team1.winProb!=prevWinProb){

		prevWinProb = data.team1.winProb;
		team1name=data.team1.name;
		team2name=data.team2.name;
		team1score=data.team1.actualScore+"/"+data.team1.wickets+" ("+data.team1.over+ " overs)";
		team2score=data.team2.actualScore+"/"+data.team2.wickets+" ("+data.team2.over+ " overs)";
		if( data.team1.wickets==10 || data.team1.over==50.0 || data.team2.over > 0 )
			$('.firstInningsProb').fadeOut();
		else
			$('.firstInningsProb').fadeIn();
		// addOddsCanvas(data);
		// addWinProbCanvas(data);
		$('.matchHeader.computer').html("<h3 class='ui horizontal divider header'><i class='bar chart icon'></i>"+"Live - Today's Match Prediction - "+data.team1.name+" vs "+data.team2.name+"</h3>");
		$('.matchHeader.mobile h5').text("Live - Today's Match Prediction - "+data.team1.name+" vs "+data.team2.name);
		$('.team1name').text(team1name);
		$('.team1actual').text(team1score);
		$('.team1odds').text(Math.round(data.team1.odds* 100) / 100);
		$('.team1winprob').text(data.team1.winProb+"%");
		$('.team1pred').text(Math.round(data.team1.predScore* 100) / 100);
		$('.team2name').text(team2name);
		$('.team2actual').text(team2score);
		$('.team2odds').text(Math.round(data.team2.odds* 100) / 100);
		$('.team2winprob').text(data.team2.winProb+"%");
		$('.team2pred').text(Math.round(data.team2.predScore* 100) / 100);
		$('.prob1value').text(data.prob1.value+"+");
		$('.prob2value').text(data.prob2.value+"+");
		$('.prob3value').text(data.prob3.value+"+");
		$('.prob4value').text(data.prob4.value+"+");
		$('.prob5value').text(data.prob5.value+"+");
		$('.prob6value').text(data.prob6.value+"+");
		$('.prob7value').text(data.prob7.value+"+");
		$('.prob1percent').text(data.prob1.percentage+"%");
		$('.prob2percent').text(data.prob2.percentage+"%");
		$('.prob3percent').text(data.prob3.percentage+"%");
		$('.prob4percent').text(data.prob4.percentage+"%");
		$('.prob5percent').text(data.prob5.percentage+"%");
		$('.prob6percent').text(data.prob6.percentage+"%");
		$('.prob7percent').text(data.prob7.percentage+"%");	
	}
}


//odds canvas things
function addOddsCanvas(data) {
	var oddData = oddsConfig.data;
	oddData.datasets[0].label= team1name + " Odds";
	oddData.datasets[1].label= team2name + " Odds";
	oddData.datasets[0].data.push({
		y:(Math.round(data.team1.odds* 100) / 100),
		x:data.team1.over
	});
	oddData.datasets[1].data.push({
		y:(Math.round(data.team2.odds* 100) / 100),
		x:data.team1.over
	});
	oddsChart.update();	
};

var oddsConfig = {
	type: 'line',
	data: {
		labels:[],
		datasets: [{
			label: "Team1 Odds",
			backgroundColor:'rgba(235,23,1,0.8)' ,
			borderColor: 'rgba(235,23,1,0.8)',
			fill: false,
			data: [],
		}, {
			label: "Team2 Odds",
			backgroundColor: 'rgba(25,233,1,0.8)',
			borderColor: 'rgba(25,233,1,0.8)',
			fill: false,
			data: []
		}]
	},
	options: {
		responsive: true,
        title:{
            display:true,
            text:"Odds Time Series"
        },
		scales: {
			xAxes: [{
				type: 'linear',
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Overs'
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Odds'
				}
			}]
		},
	}
};

//win prob canvas things
function addWinProbCanvas(data) {
	var probData = winProbConfig.data;
	probData.labels[0]=team1name;
	probData.labels[1]=team2name;
	probData.datasets[0].data[0]=data.team1.winProb;
	probData.datasets[0].data[1]=data.team2.winProb;
	winProbChart.update();	
};

var winProbConfig = {
	type: 'doughnut',
        data: {
            datasets: [{
                data: [],
                backgroundColor: ['rgba(235,23,1,0.8)','rgba(25,233,1,0.8)'],
                label: 'Winning Probability'
            }],
            labels: ["",""]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Winning Probability'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
};


//loading canvas
// window.onload = function() {
// 	var oddsCanvas = $(".oddscanvas");
// 	window.oddsChart = new Chart(oddsCanvas, oddsConfig);
// 	var winProbCanvas = $(".winprobcanvas");
// 	window.winProbChart = new Chart(winProbCanvas, winProbConfig);	
// };