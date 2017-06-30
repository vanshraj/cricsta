 $(window).on('load', function () {
 	ajaxSingleCall();
 });
function ajaxSingleCall(){
	$.ajax({
		type: 'POST',
		url: "/playerData",
		dataType: 'json'
		})
		.done(function(data) {
			staticFeed(data);
		})
		.fail(function() {
			console.log("Ajax failed to fetch data");
		});

	$.ajax({
		type: 'POST',
		url: "/matchDataProb",
		dataType: 'json'
		})
		.done(function(data) {
			data.forEach(addWinProb1Canvas);
			ajaxCalls();
		})
		.fail(function() {
			console.log("Ajax failed to fetch data");
		});
}

function ajaxCalls() {
    // run your ajax call here
    $.ajax({
	type: 'POST',
	url: "/matchData",
	dataType: 'json'
	})
		.done(function(data) {
			liveFeed(data);
			setTimeout(ajaxCalls, 1000);
		})
		.fail(function() {
			console.log("Ajax failed to fetch data");
		});
}

//declare global variable
var prevWinProb;
var team1name;
var team1score;
var team2name;
var team2score;

function staticFeed(data){
	$('.team1namebatsmen').text(data.team1.name + " Batsmen");
	$('.team1namebowler').text(data.team1.name +" Bowlers");
	$('.team2namebatsmen').text(data.team2.name+" Batsmen");
	$('.team2namebowler').text(data.team2.name+ " Bowlers");
	data.team1.batsmen.forEach(addPlayer1Canvas);
	data.team2.batsmen.forEach(addPlayer2Canvas);
	data.team1.bowlers.forEach(addPlayer3Canvas);
	data.team2.bowlers.forEach(addPlayer4Canvas);
}

function liveFeed(data){
	//if new value updated then change table
	if(data.team1.winProb!=prevWinProb){
		$('.computer .matchHeader').html("<h3 class='ui horizontal divider header'><i class='line chart icon'></i>"+"Live - Today's Match Prediction - "+data.team1.name+" vs "+data.team2.name+"</h3>");
		$('.mobile .matchHeader h5').text("Live - Today's Match Prediction - "+data.team1.name+" vs "+data.team2.name);
		prevWinProb = data.team1.winProb;
		team1name=data.team1.name;
		team2name=data.team2.name;
		team1score=data.team1.actualScore+"/"+data.team1.wickets+" ("+data.team1.over+ " overs)";
		team2score=data.team2.actualScore+"/"+data.team2.wickets+" ("+data.team2.over+ " overs)";
		var flag = (data.prob3.percentage==100)&&(data.prob4.percentage==0);
		if( data.team1.wickets==10 || data.team2.over > 0 || flag)
			$('.firstInningsProb').fadeOut();
		else
			$('.firstInningsProb').fadeIn();
		addWinProb1Canvas(data);
		addWinProbCanvas(data);
		addPredScoreCanvas(data);
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

//for mobile responsive player stats
if($(window).width() >= 1024) {
    var x = Chart.defaults.global.defaultFontSize;
    var labelNum=60;
}else{
	var x = 6;
	var labelNum=0;
}
var playerOption={
		"animation": {
        	"duration": 1,
						"onComplete": function () {
							var chartInstance = this.chart,
								ctx = chartInstance.ctx;
							
							ctx.font = Chart.helpers.fontString(x, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'bottom';

							this.data.datasets.forEach(function (dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function (bar, index) {
									var data = dataset.data[index];  
									if(data!=0)                          
										ctx.fillText(data+" runs scored", bar._model.x - labelNum, bar._model.y +5);
								});
							});
						}
        },
		scales: {
			xAxes: [{
				ticks: {
                	beginAtZero:true
            	}
			}],
            yAxes: [{
            	barPercentage: 0.9
            }]
        },
		tooltips: {
            enabled:false,
        },
		responsive: true,
        title:{
            display:false
        }
	}
var playerOption1={
	"animation": {
    	"duration": 1,
					"onComplete": function () {
						var chartInstance = this.chart,
							ctx = chartInstance.ctx;
						
						ctx.font = Chart.helpers.fontString(x, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
						ctx.textAlign = 'center';
						ctx.textBaseline = 'bottom';

						this.data.datasets.forEach(function (dataset, i) {
							var meta = chartInstance.controller.getDatasetMeta(i);
							meta.data.forEach(function (bar, index) {
								var data = dataset.data[index];  
								if(data!=0)                          
									ctx.fillText(data+" wickets taken", bar._model.x -labelNum, bar._model.y +5);
							});
						});
					}
    },
	scales: {
		xAxes: [{
			ticks: {
            	beginAtZero:true
        	}
		}],
        yAxes: [{
        	barPercentage: 0.9
        }]
    },
	tooltips: {
        enabled:false,
    },
	responsive: true,
    title:{
        display:false
    }
}
//player configs
var batsmenConfig1 = {
	type: "horizontalBar",
	data: {
		labels:[],
		datasets: [{
			label: "Runs Scored",
			backgroundColor:'rgba(242,113,28,0.6)',
			borderColor: 'rgba(242,113,28,0.6)',
			data: [],
		}]
	},
	options:playerOption,
}
var batsmenConfig2 = {
	type: "horizontalBar",
	data: {
		labels:[],
		datasets: [{
			label: "Runs Scored",
			backgroundColor:'rgba(242,113,28,0.6)',
			borderColor: 'rgba(242,113,28,0.6)',
			data: [],
		}]
	},
	options:playerOption,
}
var bowlerConfig1 = {
	type: "horizontalBar",
	data: {
		labels:[],
		datasets: [{
			label:"Wickets Taken",
			backgroundColor:'rgba(242,113,28,0.6)',
			borderColor: 'rgba(242,113,28,0.6)',
			data: [],
		}]
	},
	options:playerOption1,
}
var bowlerConfig2 = {
	type: "horizontalBar",
	data: {
		labels:[],
		datasets: [{
			label:"Wickets Taken",
			backgroundColor:'rgba(242,113,28,0.6)' ,
			borderColor: 'rgba(242,113,28,0.6)',
			data: [],
		}]
	},
	options:playerOption1,
}

//adding data
function addPlayer1Canvas(data){
	var x = batsmenConfig1.data;
	x.labels.push(data.name);
	x.datasets[0].data.push(Math.round(data.runsScored* 100) / 100);
	// x.datasets[1].data.push(Math.round(data.ballsPlayed* 100) / 100);
	batsmenChart1.update();
}
function addPlayer2Canvas(data){
	var x = batsmenConfig2.data;
	x.labels.push(data.name);
	x.datasets[0].data.push(Math.round(data.runsScored* 100) / 100);
	// x.datasets[1].data.push(Math.round(data.ballsPlayed* 100) / 100);
	batsmenChart1.update();
}
function addPlayer3Canvas(data){
	var x = bowlerConfig1.data;
	x.labels.push(data.name);
	x.datasets[0].data.push(Math.round(data.wicketsTaken* 100) / 100);
	// x.datasets[1].data.push(Math.round(data.runsConceded* 100) / 100);
	bowlerChart1.update();
}
function addPlayer4Canvas(data){
	var x = bowlerConfig2.data;
	x.labels.push(data.name);
	x.datasets[0].data.push(Math.round(data.wicketsTaken* 100) / 100);
	// x.datasets[1].data.push(Math.round(data.runsConceded* 100) / 100);
	bowlerChart2.update();
}



//win Prob canvas things
function addWinProb1Canvas(data) {
	//first innings
	if(data.team2.over<0.1){
		addPredScoreCanvas(data);
		var oddData = winProb1Config.data;
		team1name=data.team1.name;
		team2name=data.team2.name;
		oddData.datasets[0].label= team1name + " Winning Probability";
		oddData.datasets[1].label= team2name + " Winning Probability";
		oddData.datasets[0].data.push({
			y:data.team1.winProb,
			x:data.team1.over
		});
		oddData.datasets[1].data.push({
			y:data.team2.winProb,
			x:data.team1.over
		});
		winProb1Chart.update();	
	}else{
		//second innings
		var oddData = winProb1Config.data;
		if(data.team2.over>=0.1){
			var pickAnnot = winProb1Config.options.annotation.annotations[0];
			pickAnnot.value=data.team1.over;
			pickAnnot.label.enabled = true;	
		}
		oddData.datasets[0].data.push({
			y:data.team1.winProb,
			x:data.team1.over+data.team2.over
		});
		oddData.datasets[1].data.push({
			y:data.team2.winProb,
			x:data.team1.over+data.team2.over
		});
		winProb1Chart.update();
	}
};

var winProb1Config = {
	type: 'line',
	data: {
		labels:[],
		datasets: [{
			label: "Team1 Winning Probability",
			lineTension: 1,
			pointRadius: 2,
			pointBackgroundColor:'rgba(0,0,0,0)',
			pointBorderColor:'rgba(242,113,28,0)',
			backgroundColor:'rgba(242,113,28,0.6)' ,
			borderColor: 'rgba(242,113,28,0.6)',
			fill: false,
			data: [],
		}, {
			label: "Team2 Winning Probability",
			lineTension: 1,
			pointRadius: 2,
			pointBackgroundColor:'rgba(0,0,0,0)',
			pointBorderColor:'rgba(0,0,0,0)',
			backgroundColor: 'rgba(0,0,0,0.6)',
			borderColor: 'rgba(0,0,0,0.6)',
			fill: false,
			data: []
		}]
	},
	options: {
		annotation:{
			drawTime: 'afterDatasetsDraw',
			annotations: [{
				type: 'line',
				mode: 'vertical',
				scaleID: 'x-axis-0',
				value: '0',
				borderColor: 'rgba(242,113,28,0.6)',
				borderWidth: 2,
				label: {
					backgroundColor: 'rgba(0,0,0,0.3)',
					fontFamily: "sans-serif",
					fontSize: 12,
					fontColor: "#fff",
					xPadding: 6,
					yPadding: 6,
					cornerRadius: 6,
					position: "center",
					xAdjust: 0,
					yAdjust: 80,
					enabled: false,
					content: "End of First Innings"
				}
			}]
		},
		tooltips: {
            enabled:true
        },
		responsive: true,
        title:{
            display:false
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
				ticks: {
                	beginAtZero:true
            	},
				scaleLabel: {
					display: true,
					labelString: 'Winning Probability'
				}
			}]
		},
	}
};


//pred score canvas things
function addPredScoreCanvas(data) {
	//first innings
		var oddData = predScoreConfig.data;
		team1name=data.team1.name;
		oddData.datasets[0].label= team1name + " Predicted Score";
		oddData.datasets[0].data.push({
			y:(Math.round(data.team1.predScore* 100) / 100),
			x:data.team1.over
		});
		predScoreChart.update();	
	
};

var predScoreConfig = {
	type: 'line',
	data: {
		labels:[],
		datasets: [{
			label: "First Innings Predicted Score",
			lineTension: 1,
			pointRadius: 2,
			pointBackgroundColor:'rgba(0,0,0,0)',
			pointBorderColor:'rgba(242,113,28,0)',
			backgroundColor:'rgba(242,113,28,0.6)' ,
			borderColor: 'rgba(242,113,28,0.6)',
			fill: false,
			data: [],
		}]
	},
	options: {
		tooltips: {
            enabled:true
        },
		responsive: true,
        title:{
            display:false
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
				ticks: {
                	beginAtZero:false
            	},
				scaleLabel: {
					display: true,
					labelString: 'Predicted Score'
				}
			}]
		},
	}
};

//win prob doughnut canvas things
function addWinProbCanvas(data) {
	var probData = winProbConfig.data;
	probData.labels[0]=team1name;
	probData.labels[1]=team2name;
	probData.datasets[0].data[0]=data.team1.winProb;
	probData.datasets[0].data[1]=data.team2.winProb;
	winProbChart.update();	
};

var winProbConfig = {
	type: 'doughnutLabels',
	data: {
		datasets: [{
			data: [],
			backgroundColor: ['rgba(242,113,28,0.8)','rgba(0,0,0,0.8)'],
			label: 'Winning Probability'
		}],
		labels: [" "," "]
	},
	options: {
		responsive: true,
		legend: {
			reverse: true,
			position: 'top',
		},
		title: {
			display: false
		},
		animation: {
			animateScale: true,
			animateRotate: true
		}
	}
};



//loading canvas
window.onload = function() {
	var winProb1Canvas = $(".winprobcanvas1");
	window.winProb1Chart = new Chart(winProb1Canvas, winProb1Config);
	var predScoreCanvas = $(".predscorecanvas");
	window.predScoreChart = new Chart(predScoreCanvas, predScoreConfig);
	var winProbCanvas = $(".winprobcanvas");
	window.winProbChart = new Chart(winProbCanvas, winProbConfig);
	var batsmenCanvas1 = $(".batsmencanvas1");
	window.batsmenChart1 = new Chart( batsmenCanvas1, batsmenConfig1);
	var batsmenCanvas2 = $(".batsmencanvas2");
	window.batsmenChart2 = new Chart( batsmenCanvas2, batsmenConfig2);
	var bowlerCanvas1 = $(".bowlercanvas1");
	window.bowlerChart1 = new Chart( bowlerCanvas1, bowlerConfig1);
	var bowlerCanvas2 = $(".bowlercanvas2");
	window.bowlerChart2 = new Chart( bowlerCanvas2, bowlerConfig2);
};


//Making new doughnut model for chart
Chart.defaults.doughnutLabels = Chart.helpers.clone(Chart.defaults.doughnut);

var helpers = Chart.helpers;
var defaults = Chart.defaults;

Chart.controllers.doughnutLabels = Chart.controllers.doughnut.extend({
	updateElement: function(arc, index, reset) {
    var _this = this;
    var chart = _this.chart,
        chartArea = chart.chartArea,
        opts = chart.options,
        animationOpts = opts.animation,
        arcOpts = opts.elements.arc,
        centerX = (chartArea.left + chartArea.right) / 2,
        centerY = (chartArea.top + chartArea.bottom) / 2,
        startAngle = opts.rotation, // non reset case handled later
        endAngle = opts.rotation, // non reset case handled later
        dataset = _this.getDataset(),
        circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
        innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius,
        outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius,
        custom = arc.custom || {},
        valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

    helpers.extend(arc, {
      // Utility
      _datasetIndex: _this.index,
      _index: index,

      // Desired view properties
      _model: {
        x: centerX + chart.offsetX,
        y: centerY + chart.offsetY,
        startAngle: startAngle,
        endAngle: endAngle,
        circumference: circumference,
        outerRadius: outerRadius,
        innerRadius: innerRadius,
        label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
      },

      draw: function () {
      	var ctx = this._chart.ctx,
						vm = this._view,
						sA = vm.startAngle,
						eA = vm.endAngle,
						opts = this._chart.config.options;
				
					var labelPos = this.tooltipPosition();
					var segmentLabel = vm.circumference / opts.circumference * 100;
					
					ctx.beginPath();
					
					ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
					ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
					
					ctx.closePath();
					ctx.strokeStyle = vm.borderColor;
					ctx.lineWidth = vm.borderWidth;
					
					ctx.fillStyle = vm.backgroundColor;
					
					ctx.fill();
					ctx.lineJoin = 'bevel';
					
					if (vm.borderWidth) {
						ctx.stroke();
					}
					
					if (vm.circumference > 0.15) { // Trying to hide label when it doesn't fit in segment
						ctx.beginPath();
						ctx.font = helpers.fontString(opts.defaultFontSize, opts.defaultFontStyle, opts.defaultFontFamily);
						ctx.fillStyle = "#fff";
						ctx.textBaseline = "top";
						ctx.textAlign = "center";
            
            // Round percentage in a way that it always adds up to 100%
						ctx.fillText(segmentLabel.toFixed(0) + "%", labelPos.x, labelPos.y);
					}
      }
    });

    var model = arc._model;
    model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor);
    model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor);
    model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth);
    model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor);

    // Set correct angles if not resetting
    if (!reset || !animationOpts.animateRotate) {
      if (index === 0) {
        model.startAngle = opts.rotation;
      } else {
        model.startAngle = _this.getMeta().data[index - 1]._model.endAngle;
      }

      model.endAngle = model.startAngle + model.circumference;
    }

    arc.pivot();
  }
});


