d3.select(window).on("resize", throttle);

//Declaring initial variables
var country; 

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 9])
    .on("zoom", move);


var width = document.getElementById('container').offsetWidth;
var height = width / 1.9;
var topo,projection,worldPath,worldSvg,worldG;
var graticule = d3.geo.graticule();
var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");
var landETT;
var landTwo; 
var clickState = 0;
var mapDone = false;
var colorRange = ["#5AA9EC", "#EAE8E6", "#F3C14B"];

//Calling setup-function to start setting up map
setup(width, height, "#container");

//legend
var legendFullHeight = height;
var legendFullWidth = 50;

var legendMargin = { top: 20, bottom: 20, left: 5, right: 20 };

// use same margins as main plot
var legendWidth = legendFullWidth - legendMargin.left - legendMargin.right;
var legendHeight = legendFullHeight - legendMargin.top - legendMargin.bottom;

var legendSvg = d3.select('#map-legend')
	.attr('width', legendFullWidth)
	.attr('height', legendFullHeight)
	.append('g')
	.attr('transform', 'translate(' + legendMargin.left + ',' +
	legendMargin.top + ')');

updateColourScale(colorRange);	
	
function updateColourScale(scale) {	
	// append gradient bar
	var gradient = legendSvg.append('defs')
		.append('linearGradient')
		.attr('id', 'gradient')
		.attr('x1', '0%') // bottom
		.attr('y1', '100%')
		.attr('x2', '0%') // to top
		.attr('y2', '0%')
		.attr('spreadMethod', 'pad');

	// programatically generate the gradient for the legend
	// this creates an array of [pct, colour] pairs as stop
	// values for legend
	var pct = linspace(0, 100, scale.length).map(function(d) {
		return Math.round(d) + '%';
	});

	var colourPct = d3.zip(pct, scale);

	colourPct.forEach(function(d) {
		gradient.append('stop')
			.attr('offset', d[0])
			.attr('stop-color', d[1])
			.attr('stop-opacity', 1);
	});

	legendSvg.append('rect')
		.attr('x1', 0)
		.attr('y1', 0)
		.attr('width', legendWidth)
		.attr('height', legendHeight)
		.style('fill', 'url(#gradient)');

	// create a scale and axis for the legend
	var legendScale = d3.scale.linear()
		.domain([-3, 3])
		.range([legendHeight, 0]);

	var legendAxis = d3.svg.axis()
		.scale(legendScale)
		.orient("right")
		.tickValues(d3.range(-3, 4))
		.tickFormat(d3.format("d"));

	legendSvg.append("g")
		.attr("class", "legend axis")
		.attr("transform", "translate(" + legendWidth + ", 0)")
		.call(legendAxis);
}
	
function linspace(start, end, n) {
	var out = [];
	var delta = (end - start) / (n - 1);

	var i = 0;
	while(i < (n - 1)) {
		out.push(start + (i * delta));
		i++;
	}

	out.push(end);
	return out;
}
	
//Setting up countries
//variables 'container' and 'theclass' changes depending on large or small map-view
function setup(width, height, container){
  projection = d3.geo.robinson()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI)
    .center( [ 0 , 20] );

  worldPath = d3.geo.path().projection(projection);

  worldSvg = d3.select(container).append("svg")
      .attr("class", "world")
      .attr("width", width)
      .attr("height", height)
      .append("g");;

      if(container == "#container"){
      	worldSvg
      		.call(zoom)
      		.on("click", click);
  		}
  		else{
  			worldSvg.attr("class", "countrySizePos");
  		}

  worldG = worldSvg.append("g");
}

//Drawing large map
//d3.json("world-topo-min.json", function(error, world) {
//  var countries = topojson.feature(world, world.objects.countries).features;
//  topo = countries;
//});


//Drawing map and/or small country depending on mapType
function draw(topo) {
	//if(mapType == "large"){
		// worldSvg.append("path")
	 //     .datum(graticule)
	 //     .attr("class", "graticule")
	 //     .attr("d", worldPath);

	   worldG.append("path")
	    .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
	    .attr("class", "equator")
	    .attr("d", worldPath);
	country = worldG.selectAll(".country").data(topo);

	//check id attrubite here (d.properties.name for large, d.id for small???)
	//With d.properties.name for both the info-box shows up on hover for both
	country.enter().insert("path")
      .attr("class", "country")
      .attr("d", worldPath)
      .attr("id", function(d,i) { return name2code(d.properties.name); })
      .attr("title", function(d,i) { return d.properties.name; });
  		

  //Setting colors for the map
  updateMapColors();
  countryInteraction();

  mapDone = true;
}

//Function that holds all interaction functionality with a country
function countryInteraction(){
 	//offsets for tooltips
  	var offsetL = document.getElementById('container').offsetLeft+20;
  	var offsetT = document.getElementById('container').offsetTop+10;
  	//tooltips
	//var clickState = 0;  //clickstate needs to be a gobal variable to fix the handle bug. //David
	var sidebarDiv = document.getElementById('sidebar');
	var mapScreen = document.getElementById('mapScreen');
	d3.select("#compareLineChart").classed("hidden", true);

	country
	//Hover a country
    .on("mousemove", function(d,i) {
		f = 0;

		//Nollställfärgen på alla bars //Funkar inte riktigt eftersom alla förflyttningar verkar räknas som en ny mouse-over
		// d3.selectAll(".bar")
		//   	.attr('fill', 'blue');

		//Hämtar export-/importinfo från data
		var code = name2code(d.properties.name);
		var exportInfo = "";
		var importInfo = "";
//		var countryExports = countries[code].exports[2015]
//		var countryImports = countries[code].imports[2015]

//		for(var key in countryExports) {
//		    exportInfo += "</br>" + countryExports[key].partner;
//		}

//		for(var key in countryImports) {
//		    importInfo += "</br>" + countryImports[key].partner;
//		}

      var mouse = d3.mouse(worldSvg.node()).map( function(d) { return parseInt(d); } );


      tooltip.classed("hidden", false)
             .attr("style", "left:"+(mouse[0]+ offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.name + "</br></br>  Top  exports: " + exportInfo + "</br></br>  Top  imports: " + importInfo);

      })

	//Stop hovering a country
  	.on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true);

       //ta bort eventuell highlight på bar chart 
     //   var code = name2code(d.properties.name);

     //   d3.select(".bar#" + code)
		  	// .attr('fill', 'black');
      })

      //Clicking a country
	  .on("click", function(d, i) {
		  if (multipleCountriesCheckbox.val() == "true") {
			  d3.select("#sidebarOneCountry").classed("hidden", true);
			  multipleCountries.push[d]; //FRIDA detta är knasboll och funkar inte. Vet ej varför du kanske vill göra om från början.
		  }
		  console.log(multipleCountries);
	  	//If first country to be clicked
		  if (clickState == 0 && multipleCountriesCheckbox.val() != "true") {
		  	d3.select("#sidebarNoCountry").classed("hidden", true);
		  	d3.select("#sidebarOneCountry").classed("hidden", false);
		  	d3.select("#sidebarMultipleCountries").classed("hidden", true);

			  landETT = d;

			//Clear multiple lineChart if we have one
			clearLineChart();
			clearTradeLineChart();

			//Create code for country
			var kod = name2code(landETT.properties.name);
			
			// Update sidebar values and draw pie chart and line chart
	        updateSideBar();
  			drawPieChart();
			drawLineTradeBalance(countries[kod].tradingBalance);

			//clickState++; OBS! FRIDA DU KANSKE VILL ANVÄNDA DET HÄR SEN?
        
		} 
		//If second country to be clicked
		else if (clickState == 1) {
			d3.selectAll(".compareWorld").remove();
			d3.select("#sidebarOneCountry").classed("hidden", true);
			d3.select("#sidebarMultipleCountries").classed("hidden", false);

			landTwo = d;

			//var mouse = d3.mouse(worldSvg.node()).map( function(d) { return parseInt(d); } );

			var width = document.getElementById('compareContainer').offsetWidth/2;
			var height = width / 1.9;

			//Kan eventuell kolla hur man väljer fler länder här.
			//setup(width,height, "#compareContainer", "compareWorld");
			//draw([landETT]);
			//setup(width,height, "#compareContainer", "compareWorld");
			//draw([landTwo]);
			
			//Create code for each country
			var kod1 = name2code(landETT.properties.name);
			var kod2 = name2code(landTwo.properties.name);

			//Call multiple line chart 
			drawLine(countries[kod1].co2, countries[kod2].co2);
			clickState = 0;
		  }


	  //Nollställ eventuell  highlightad stapel
	  d3.selectAll(".bar")
	  	.attr('fill', 'black');


	  //Hämtar landskod så kan fylla i rätt land 
	  var code = name2code(d.properties.name);

	  //Highlighta ny stapel i bar chart
	  d3.select(".bar#" + code)
	  	.attr('fill', 'orange');


      var mouse = d3.mouse(worldSvg.node()).map( function(d) { return parseInt(d); } );

      tooltip.classed("hidden", false)
             .attr("style", "left:"+(mouse[0]+ offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.name);
	  });

}


function redraw() {
  width = document.getElementById('container').offsetWidth;
  height = width / 2;
  d3.select('svg').remove();
  setup(width,height, "#container", "world");
  draw(topo);
}


function move() {

  var t = d3.event.translate;
  var s = d3.event.scale;
  zscale = s;
  var h = height/4;


  t[0] = Math.min(
    (width/height)  * (s - 1),
    Math.max( width * (1 - s), t[0] )
  );

  t[1] = Math.min(
    h * (s - 1) + h * s,
    Math.max(height  * (1 - s) - h * s, t[1])
  );

  zoom.translate(t);
  worldG.attr("transform", "translate(" + t + ")scale(" + s + ")");

  //adjust the country hover stroke width based on zoom level
  d3.selectAll(".country").style("stroke-width", 1.5 / s);

}

var throttleTimer;

function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}

//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
}

//Updating map-values
function updateMapColors(){
	    d3.selectAll("path.country")
        .style("fill", function(){
      		
      		//Hämta landskod	
      		var kod = this.id;

      		//Om landet från kartan inte inte finns i iso-listan
      		if(kod==''){
            return "black"
	      	}

	      	//Hämta trading balance för rätt år och land
      		var tradingBalance = countries[kod].tradingBalance[year];

      		//Fixa färgskala 
      		var color = d3.scale.linear().domain([-30,0,30]).range(colorRange); 

          //Returnera svart om data saknas
            if (tradingBalance == ".." || tradingBalance == undefined){
              return "black";
            }

            //Generera annars färg beroende på trading balance 
            else{
              return color(tradingBalance); 
            }
        });
}

var multipleCountriesCheckbox = $('#multipleCountriesCheckbox');
var sidebar = $("#sidebar");

multipleCountriesCheckbox.change(function(){
	cb = $(this);
	cb.val(cb.prop('checked'));

	multipleCountries = [];
	//Object for storing selected countries RESET on toggle

	if (multipleCountriesCheckbox.val() == "true") {
		d3.select("#sideBarChart").classed("hidden", false);
		d3.select("#sidebarOneCountry").classed("hidden", true);
		d3.select("#multipleCountries").classed("hidden", false);
		d3.select("#sidebarNoCountry").classed("hidden", true);
	} else {
		d3.select("#sidebarNoCountry").classed("hidden", false);
		d3.select("#sidebarOneCountry").classed("hidden", false);
		d3.select("#multipleCountries").classed("hidden", true);
	}
});

$('.leftTriangle').click(function() {
	if (sidebar.attr("out") == "false") {
		sidebar.attr("out", "true");
		$(".streck1").addClass("rotate rotate_transition");
		sidebar
			.css({
				position: "absolute",
				marginLeft: 0, marginTop: 0,
				right:0
			})
			.animate({
				right: "50%"
			}, 600 );
	} else {
		$(".streck1").removeClass("rotate rotate_transition");
		sidebar.attr("out", "false");
		sidebar
			.animate({
				right: 0
			}, 600 );
	}


});


