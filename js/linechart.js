
function drawLine(selectedCountries, id, type){

//var data = d3.entries(countries[name2code(selectedCountries[0].properties.name)].co2);
// var data2 = d3.entries(countries[name2code(selectedCountries[1].properties.name)].co2);
var legendRectSize = 18;
var legendSpacing = 4;
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 450 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;


var radius = Math.min(width, height) / 2;


// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);


// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(4).tickFormat(d3.format("d"));

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); })
	  .defined(function(d) {return d.value != "";});
 
 //Setting color scale
    var colorList = ["#EEEEEE", "#0091EA"];
    var lineColor = d3.scale.linear().domain([0,5]).range(colorList)

// Adds the svg canvas
var mySVG = d3.select(id)
    .append("svg")
        .attr('class', 'lineChart')
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


var legend = mySVG.selectAll('.legend')
      .data(selectedCountries)
      .enter()
      .append('g')
      .attr('class', 'line-legend')
      .attr('transform', function(d, i) {
    var height = -legendRectSize - legendSpacing;
    var offset =  height * selectedCountries.length;
    var horz = -2 * legendRectSize;
    var vert = i * height - offset;
    return 'translate(' + horz + ',' + vert + ')';
  });



    legend.append('rect')
        .attr('width', legendRectSize)
  .attr('height', legendRectSize)
      .style('fill', function(d,i){ return lineColor(i);})
      .style('stroke', function(d,i){ return lineColor(i);})
      .attr('rx', 10)
      .attr('ry', 10)
      .attr("x", 450)



    legend.append('text')
      .attr('x', 470)
      .attr("y", legendRectSize - legendSpacing)
      .attr("class", function(d,i){return "textis-"+name2code(selectedCountries[i].properties.name)})

      .text(function(d){ return d.properties.name;})
        .attr('text-transform', 'capitalize')
        .attr('font-size', '12px')
        .attr('opacity', 0.5)


// Get the data

  for(i in selectedCountries){
    var code = name2code(selectedCountries[i].properties.name);
    if(type == "co2"){
      var data = d3.entries(countries[code].co2);
    }
    else{
      var data = d3.entries(countries[code].tradingBalance);
    }
   
    // Scale the range of the data (same years for both sets)
    x.domain(d3.extent(data, function(d) {return d.key; }));
    
    //Co2 from 0-30 and trading balance from -30 to 30
    if(type == "co2"){
      y.domain([0, 30]);
    }
    else{
      y.domain([-30,30])
    }

 
    // Add the valueline path.
    mySVG.append("path")
        .attr("class", "line")
        .attr('id', code)
        .attr("d", valueline(data))
        .attr("stroke", lineColor(i))
        .on("mouseover", function (d) {    
          d3.select(this)                          //on mouseover of each line, give it a nice thick stroke
          .style("stroke-width",'4px');
          d3.selectAll(".textis-"+this.id).style("opacity", 1)

        })
        .on("mouseout", function(d) {        //undo everything on the mouseout
            d3.select(this)
              .style("stroke-width",'2px'); 
              d3.selectAll(".textis-"+this.id).style("opacity", 0.5)     
        })
 
  } 


    // Add the X Axis
    mySVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    mySVG.append("g")
        .attr("class", "y axis")
        .call(yAxis);


// text label for the axis
if(type == "co2"){
  mySVG.append("text")
    .attr("class","anchor")
    .attr("y", -30)
    .attr("x",0 )
    .attr("dy", "1em")
        .style("padding-left", "100px")

    .style("text-anchor", "middle")
    .text("ton CO2/capita");  
} 
else{
 mySVG.append("text")
    .attr("class","anchor")
    .attr("y", -30)
    .attr("x",0 )
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("padding-left", "100px")
    .text("Trading balance");  
  }  
    
    mySVG.append("text")
    .attr("class","anchor")
      .attr("y", height-10)
      .attr("x",width+35)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("YEAR"); 

}


function clearLineChart(id){
    var mySVG = d3.select(id).html("");
}


