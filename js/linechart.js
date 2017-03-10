
function drawLine(selectedCountries, id, type){

//var data = d3.entries(countries[name2code(selectedCountries[0].properties.name)].co2);
// var data2 = d3.entries(countries[name2code(selectedCountries[1].properties.name)].co2);

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 450 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

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
    .y(function(d) { return y(d.value); });


// Define the line
var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value); });


// Adds the svg canvas
var mySVG = d3.select(id)
    .append("svg")
        .attr('class', 'lineChart')
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


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
        .attr("d", valueline(data));

// LABELS - choosing the 50th value of the co2 to get aproximately right height placement
        if(data[52].value != "" || data[52].value != ".." || data[52] != undefined){
          mySVG.append("text")
          .attr("transform", "translate(" + (width+3) + "," + y(data[52].value) + ")") 
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "black")
          .text(selectedCountries[i].properties.name);  
        }
  } 

    // Add the valueline path.
 /*   mySVG.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

     mySVG.append("path")
            .attr("class", "line")
            .attr("d", valueline2(data2))
            .style("stroke", "black"); */ 

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

    //labels for each line
 //   mySVG.append("text")
//        .attr("transform", "translate(" + (width+3) + "," + y(data[50].value) + ")")
 //       .attr("dy", ".35em")
   //     .attr("text-anchor", "start")
     //   .style("fill", "black")
      //  .text(selectedCountries[0].properties.name);

}

function clearLineChart(id){
    var mySVG = d3.select(id).html("");
}


