function drawBarChart(){

  //Year to display is now set in fetch_data.js

  //Create tooltip
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.value.name + "</br>Co2: " + Math.round(d.value.co2[year] * 100) / 100;
  })

  //Create svg-area for bar chart
	var svg = d3.select( "#chart")
              .append( "svg" )
              .attr( "width", 2200 )
              .attr( "height", 280 );

  //Make selection and connect to data              
  var selection = svg.selectAll( "rect" )
                     .data(d3.entries(countries));

  svg.call(tip);

    //Create new bars
    selection.enter()
      .append( "rect" )
      .attr('class', 'bar')
      .attr('id', function(d){
        return d.value.code
      })
      .attr( "x", function(d,i){
        return i*11;
      })
      .attr( "width", 10 )
      .attr( "fill", "black" )

    //Set bar heights based on data
    selection
      .attr( "height", function(d){
        return d.value.co2[year]*3
      })

      //Set y position to get bars in right orientation
      .attr( "y", function(d){
        return 100 - d.value.co2[year]*3;
      })

      //Show tooltip on hover
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

      // remove any unused bars
      selection.exit()
        .remove();


}
