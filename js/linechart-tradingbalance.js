
function drawLineTradeBalance(data){

console.log("in linechar for trading balance");

var data = d3.entries(data);
//var data2 = d3.entries(data2);

//Get the dimensions of the div
var divDims = d3.select("#line-chart-container").node().getBoundingClientRect();
console.log(divDims);

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = divDims.width - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

// Formats the years approprietly
//var parseYear = d3.time.format("%y").parse;
	
// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
	.ticks(4);
	//.tickFormat(d3.time.format("%y"));

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });


// Define the line
/*var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });*/


// Adds the svg canvas
var mySVG = d3.select("#line-chart-container")
    .append("svg")
        .attr('id', 'lineChart-tradeBalance')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


// Get the data

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) {return parseInt(d.key); }));
    
    y.domain(d3.extent(data, function(d) {return parseFloat(d.value); }));
    //y.domain(d3.extent([-5,5]));

    // Scale the range of the data
    //x.domain(d3.extent(data2, function(d) { return d.key; }));
    
    //y.domain([0, d3.max(data2, function(d) { return d.value; })]);


    // Add the valueline path.
    mySVG.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))
		.style("fill","none");

    /* mySVG.append("path")
            .attr("class", "line")
            .attr("d", valueline2(data2))
            .style("stroke", "red");*/

    // Add the X Axis
    mySVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    mySVG.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}

function clearTradeLineChart(){
    var mySVG = d3.select("#line-chart-container").html("");
}


