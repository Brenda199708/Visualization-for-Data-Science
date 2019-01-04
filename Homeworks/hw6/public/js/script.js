
let votePercentageChart = new VotePercentageChart();

let tileChart = new TileChart();

// let shiftChart = new TrendChart();


//load the data corresponding to all the election years
//pass this data and instances of all the charts that update on year selection to yearChart's constructor
d3.csv("data/yearwiseWinner.csv").then(electionWinners => {
    // console.log(electionWinners);
	try{	
	    let shiftChart = new TrendChart(electionWinners);
		let electoralVoteChart = new ElectoralVoteChart(shiftChart);
	    let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners, shiftChart);
	    yearChart.update();
	}
	catch(error){
		console.log(error);
	}
});
