d3.select(window).on("resize", throttle);

//Declaring initial variables
var country; 

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 9])
    .on("zoom", move);

var width = document.getElementById('container').offsetWidth;
var height = width / 1.9;

//Not using right now
var colors = {
	"Albania": "#8dd3c7",
	"Azerbaijan": "#ffffb3",
	"Argentina": "#bebada",
	"Australia": "#fb8072",
	"Bangladesh": "#80b1d3",
	"Armenia": "#fdb462",
	"Bulgaria": "#b3de69",
	"Belarus": "#fccde5",
	"Chile": "#d9d9d9",
	"China": "#bc80bd",
	"Colombia": "#ccebc5",
	"Croatia": "#ffed6f",
	"Czech Rep.": "#66c2a5",
	"Dominican Rep.": "#fc8d62",
	"El Salvador": "#8da0cb",
	"Estonia": "#e78ac3",
	"Finland": "#a6d854",
	"Georgia": "#ffd92f",
	"Hungary": "#e5c494",
	"India": "#b3b3b3",
	"Japan": "#e41a1c",
	"Latvia": "#377eb8",
	"Lithuania":"#4daf4a",
	"Mexico":"#984ea3",
	"Moldova":"#ff7f00",
	"Macedonia":"#ffff33",
	"United Kingdom":"#a65628",
	"Bosnia":"#f781bf",
	"Algeria":"#999999",
	"Bosnia Herzegovina": "#b3e2cd",
	"Canada":"#fdcdac",
	"Indonesia":"#cbd5e8",
	"Iran":"#f4cae4",
	"Iraq":"#e6f5c9",
	"Jordan":"#fff2ae",
	"South Korea":"#f1e2cc",
	"Kyrgyzstan":"#cccccc",
	"Morocco":"#fbb4ae",
	"Nigeria":"#b3cde3",
	"Pakistan":"#ccebc5",
	"Peru":"#decbe4",
	"Philippines":"#fed9a6",
	"Puerto Rico":"#ffffcc",
	"Saudi Arabia":"#e5d8bd",
	"Singapore":"#fddaec",
	"South Africa":"#f2f2f2",
	"Egypt":"#ccc",
	"Serbia":"#ece2f0",
	"Montenegro":"#d0d1e6",
	"Andorra":"#a6bddb",
	"Brazil":"#67a9cf",
	"Cyprus":"#3690c0",
	"Ethiopia":"#02818a",
	"France":"#016c59",
	"Ghana":"#014636",
	"Guatemala":"#f7fcfd",
	"Hong Kong":"#e0ecf4",
	"Italy":"#bfd3e6",
	"Malaysia":"#9ebcda",
	"Mali":"#8c96c6",
	"Bahrain":"#8c6bb1",
	"Ecuador":"#88419d",
	"Kazakhstan":"#810f7c",
	"Kuwait":"#4d004b",
	"Lebanon":"#f7fcf5",
	"Libya":"#e5f5e0",
	"Netherlands":"#c7e9c0",
};

var topo,projection,worldPath,worldSvg,worldG;
var graticule = d3.geo.graticule();
var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");


//Calling setup-function to start setting up map
setup(width,height, "#container", "world");



//Setting up countries
//variables 'container' and 'theclass' changes depending on large or small map-view
function setup(width,height, container, theclass){
  projection = d3.geo.mercator()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI)
    .center( [ 0 , 20] );

  worldPath = d3.geo.path().projection(projection);

  worldSvg = d3.select(container).append("svg")
      .attr("class", theclass)
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
d3.json("world-topo-min.json", function(error, world) {
  var countries = topojson.feature(world, world.objects.countries).features;
  topo = countries;
  draw(topo, "large");
});


//Drawing map and/or small country depending on mapType
function draw(topo,mapType) {
	console.log(topo);

	if(mapType == "large"){
		worldSvg.append("path")
	     .datum(graticule)
	     .attr("class", "graticule")
	     .attr("d", worldPath);

	  worldG.append("path")
	   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
	   .attr("class", "equator")
	   .attr("d", worldPath);

	}
	country = worldG.selectAll(".country").data(topo);

	//check id attrubite here (d.properties.name for large, d.id for small???)
	//With d.properties.name for both the info-box shows up on hover for both
	country.enter().insert("path")
      .attr("class", "country")
      .attr("d", worldPath)
      .attr("id", function(d,i) { return name2code(d.properties.name); })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) {


      	//Setting colors for the map
      	updateMapColors();
       });

		//Calling interaction function and sends country as variable
	  	countryInteraction(country);

}

//Function that holds all interaction functionality with a country
function countryInteraction(country){
	 //offsets for tooltips
  var offsetL = document.getElementById('container').offsetLeft+20;
  var offsetT = document.getElementById('container').offsetTop+10;
  //tooltips
	//
	var clickState = 0;
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
	  	//If first country to be clicked
		  if (clickState == 0) {
		  	d3.select("#sidebarNoCountry").classed("hidden", true);
		  	d3.select("#sidebarOneCountry").classed("hidden", false);
		  	d3.select("#sidebarMultipleCountries").classed("hidden", true);

			d3.select("#sidebarOneCountry").selectAll(".value").remove()
			
			// Append values to sidebarOneContry with the class=value and they will be cleared in the line above on new click
			d3.select("#country-name").insert("p").attr("class", "value").html(d.properties.name)

			  console.log("i IF " + clickState);
			  landETT = d;

			  var kod=name2code(landETT.properties.name);

			  //Calling drawLine to draw the linechart on countryClick.
			  //Sending the co2 list for that country as attribute.
			  drawLine(countries[kod].co2);

			  //---- Call piechart here as well ---- 


			  clickState++;


		} 
		//If second country to be clicked
		else if (clickState == 1) {
			d3.selectAll(".compareWorld").remove();
			d3.select("#sidebarOneCountry").classed("hidden", true);
			d3.select("#sidebarMultipleCountries").classed("hidden", false);

			console.log("i ELSE IF " + clickState);
			landTwo = d;
			clickState = 0;

			//var mouse = d3.mouse(worldSvg.node()).map( function(d) { return parseInt(d); } );

			var width = document.getElementById('compareContainer').offsetWidth/2;
			var height = width / 1.9;

			//Kan eventuell kolla hur man väljer fler länder här.
			setup(width,height, "#compareContainer", "compareWorld");
			draw([landETT], "small");
			setup(width,height, "#compareContainer", "compareWorld");
			draw([landTwo], "small");

			//Clear lineChart
			clearLineChart();
			  
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
  draw(topo, "large");
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

      		//Om nåt är knas
      		if(kod==''){
	      		return "#000"
	      	}

	      	//Hämta co2 för rätt år och land
      		var tradingBalance = countries[kod].tradingBalance[year];

      		//Generera färg beroende på co2-utsläpp	
      		var color = d3.scale.linear().domain([0,5,20]).range(["#7860B9", "#EAE8E6", "#5AA9EC"]); 
          	return color(tradingBalance); 

        });
}