
var margin = {top:10, right:10, bottom:90, left:10};

var width = 500 - margin.left - margin.right;

var height = 200 - margin.top - margin.bottom;

var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)

var yScale = d3.scale.log().range([height, 0]);




var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
      
      
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");


var barChartWidth = "80%";
//Create svg-area for bar chart
var svg = d3.select( "#chart")
            .append( "svg" )
            .attr('id', 'barChart')
            .attr( "width", width+margin.left + margin.right )
            .attr( "height", height+margin.top + margin.bottom )
            .attr( "display", "block")
            .attr( "margin", "auto");


function drawBarChart(){

  console.log("in chart");
  //Year to display is now set in fetch_data.js

  var data = d3.entries(countries).sort(
                                        function(a,b){
                                          //sorting from 1-8 of continentID to get 
                                          //order of data for the bars to match the map
                                          return d3.ascending(a.value.continentID, b.value.continentID);
                                        });
  //Create tooltip
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.value.name + "</br>Co2: " + Math.round(d.value.co2[year] * 100) / 100;
  })

  xScale.domain(data.map(function(d) { return d.value.name; }));
  yScale.domain([0.001, d3.max(data, function(d) { return d.value.co2[year]; })]);


  //Make selection and connect to data              
  var selection = svg.selectAll( ".bar" )
                    //Fetching countries data and sorts it before creating bars
                     .data(data);


  svg.call(tip);
  
    //Create new bars
    selection.enter()
      .append( "rect" )
      .attr('class', 'bar')
      .attr('id', function(d){
        return d.value.code
      })
      .attr( "x", function(d) { return xScale(d.value.name); })
      .attr( "width", xScale.rangeBand())
      .attr( "fill", "black" )

    //Set bar heights based on data
    selection
      .attr( "height", function(d) { return height - yScale(d.value.co2[year]); })

      //Set y position to get bars in right orientation
      .attr( "y", function(d) { return yScale(d.value.co2[year]*0.2); })

      //Show tooltip on hover
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

      // remove any unused bars
      selection.exit()
        .remove();

}

document.addEventListener("DOMContentLoaded", resizeBar);
d3.select(window).on('resize', resizeBar); 

function resizeBar() {
  console.log('----resize function----');
  // update width
  width = parseInt(d3.select('#barChart').style('width'), 10);
  width = width - margin.left - margin.right;

  height = parseInt(d3.select("#barChart").style("height"));
  height = height - margin.top - margin.bottom;
  console.log('----resiz width----'+width);
  console.log('----resiz height----'+height);
  // resize the chart
  
    xScale.range([0, width]);
    xScale.rangeRoundBands([0, width], .03);
    yScale.range([height, 0]);
    yScale.rangeRoundBands([0, height], .03);


    d3.select(svgContainer.node().parentNode)
        .style('width', (width + margin.left + margin.right) + 'px')
        .style('height',((height + margin.top + margin.bottom) + "px"));

    svgContainer.selectAll('.bar')
      .attr("x", function(d) { return xScale(d.value.name); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d.value.co2[year]); })
      .attr("height", yScale.rangeBand());
                     
   
}
