//Create svg-area for bar chart
var svg = d3.select( "#chart")
            .append( "svg" )
            .attr('id', 'barChart')
            .attr( "display", "block")
            .attr( "margin", "auto")
            //Möller! Det som är nedanför här till "///" är allt som är tillagt för att skala chartet!
            .attr('viewBox', "0 0 960 1000")
            .attr("preserveAspectRatio","xMidYMid meet");


var chart = $("#barChart"),   //barChart behöver konfigureras om man ska återanvända detta
    aspect = chart.width() / chart.height(),
    container = chart.parent();

$(window).on("resize", function() {
    var targetWidth = container.width();
    var targetHeight = container.height()
    chart.attr("width", targetWidth);     //Här finns det säkert nån smidigare lösning men jag delat targetwidth för att få lämplig bredd!
    chart.attr("height", targetHeight);
}).trigger("resize");

///////och här tar det slut :)


var labels = ["The Americas", "Europe", "Africa", "Asia", "Ociania"];
  
  var x = d3.scale.ordinal()
    .domain(labels)
    .rangePoints([0, 960]);


  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");


  svg.append("g")
    .attr("class", "myaxis")
    .attr("transform","translate(0,50)")
    .call(xAxis);


//Kolla om musknappen är nedtryckt (för att dra i slidern)
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}


function drawBarChart(){

  console.log("in chart");

  //Create tooltip
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    if($('input[name="co2val"]:checked').val() == "capita"){
      return d.value.name + "</br>" + Math.round(d.value.co2[year] * 10) / 10 + " tons CO<sub>2</sub> per capita";
    }

    else{
      return d.value.name + "</br>" + Math.round(d.value.co2total[year]/1000 * 10) / 10 + " million tons CO<sub>2</sub>";
    }
  })

//Setting label for CO2
setLabel();

//Creating data
var data = d3.entries(countries).sort(
                                        function(a,b){
                                          //sorting from 1-8 of continentID to get 
                                          //order of data for the bars to match the map
                                          return d3.ascending(a.value.continentID, b.value.continentID);
                                        })

  //Make selection and connect to data              
  var selection = svg.selectAll( "rect" )
                     .data(data);


  // var nestedData=d3.nest()
  // .key(function(d) {return d.value.continentID;})
  // .sortKeys(d3.ascending)
  // .entries(data);

  // var xScale = d3.scale.ordinal()
  //           .domain(nestedData.map(function (d) { console.log(d.values);return d.value; }))
  
  // var xAxis = d3.svg.axis().scale(xScale).orient("bottom");


//ar xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  svg.call(tip);


    //Create new bars
    selection.enter()
      .append( "rect" )
      .attr('class', 'bar')
      .attr('id', function(d){
        return d.value.code
      })
      .attr( "x", function(d,i){
        return i*5;
      })
      .attr( "width", 4 )
      .attr( "fill", "black" )

    //Set bar heights based on data
    selection
      .attr( "height", function(d){
        if (isNaN(d.value.co2[year])){
          return 0;
        }
        else if ($('input[name="co2val"]:checked').val() == "capita"){
          return d.value.co2[year]*5;
        }

        else if($('input[name="co2val"]:checked').val() == "total"){
          return d.value.co2total[year]/2000;
        }

      })

      //Set y position to get bars in right orientation
      .attr( "y", function(d){
        return 60;  //Quickfix för flipped barchart. Avvaktar
        
        // if (isNaN(d.value.co2[year])){
        //   return 0;
        // }
        // else if (co2val =="capita"){
        //   return 220 - d.value.co2[year]*2;
        // }

        // else if(co2val == "total"){
        //   return 220 - d.value.co2total[year]/50000;
        // }
      })

      

      //Show tooltip on hover if neither mousekey is pressed nor play-funtion active
      .on('mouseover', function(d){
        if(play == false && mouseDown == false){tip.show(d)} 
      })
      .on('mouseout', tip.hide);

      // remove any unused bars
      selection.exit()
        .remove();
}


function setLabel(){
  //Setting label for CO2

if($('input[name="co2val"]:checked').val() == "capita"){
  //write c02 label
  d3.select("#barchartLabel").html("<h4>ton CO2/capita</h4>")
}
else{
  //write total label
  d3.select("#barchartLabel").html("<h4>million ton CO2</h4>")

}
}