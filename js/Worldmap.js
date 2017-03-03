d3.select(window).on("resize", throttle);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 9])
    .on("zoom", move);

var width = document.getElementById('container').offsetWidth;
var height = width / 1.9;

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
setup(width,height);

function setup(width,height){
  projection = d3.geo.mercator()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI)
    .center( [ 0 , 20] );

  worldPath = d3.geo.path().projection(projection);

  worldSvg = d3.select("#container").append("svg")
      .attr("class", "world")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
      .on("click", click)
      .append("g");

  worldG = worldSvg.append("g");

}

function setup2(width,height){
	projection = d3.geo.mercator()
		.translate([(width/2), (height/2)])
		.scale( width / 2 / Math.PI)
		.center( [ 0 , 20] );

	worldPath = d3.geo.path().projection(projection);

	worldSvg = d3.select("#compareContainer").append("svg")
		.attr("class", "compareWorld")
		.attr("width", width)
		.attr("height", height)
		//.call(zoom)
//		.on("click", click)
		.append("g")
		.attr("class", "countrySizePos");
	worldG = worldSvg.append("g");

}

d3.json("world-topo-min.json", function(error, world) {
  var countries = topojson.feature(world, world.objects.countries).features;
  topo = countries;
  draw(topo);
});

function draw2(clickedCountries, mouse) {
	console.log(mouse);

	//zoom.translate(mouse[0]);
	//worldG.attr("transform", "translate(" + 3 + ")scale(" + 3 + ")");


	var country = worldG.selectAll(".country").data(clickedCountries);

	country.enter().insert("path")
		.attr("class", "country")
		.attr("d", worldPath)
		.attr("id", function(d,i) { return d.id; })
		.attr("title", function(d,i) { return d.properties.name; })
		.style("fill",function(d, i) {


			var kod=name2code(d.properties.name);

			//Om vi har problem med att matcha namn:
			if(kod==undefined){
				return "#000"
			}

			else{
				//Hämta co2 för 2010
				var co2 = countries[kod].co2['2010'];

				//Generera färg beroende på co2 utsläpp
				var color = d3.scale.linear().domain([0,5,20]).range(["#A8FB54", "#FFFE5D", "#EB382F"]);
				return color(co2);
			}
		});
}

function draw(topo, brushSelected) {
	console.log(topo);

  var country = worldG.selectAll(".country").data(topo); 
  
  worldSvg.append("path")
     .datum(graticule)
     .attr("class", "graticule")
     .attr("d", worldPath);

  worldG.append("path")
   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
   .attr("class", "equator")
   .attr("d", worldPath);


	country.enter().insert("path")
      .attr("class", "country")
      .attr("d", worldPath)
      .attr("id", function(d,i) { return name2code(d.properties.name); })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) {


      	var kod=name2code(d.properties.name);

      	//Om vi har problem med att matcha namn:
      	if(kod==undefined){
      		return "#000"
      	}

      	else{
      		//Hämta co2 för 2010
      		var co2 = countries[kod].co2[year];

      		//Generera färg beroende på co2 utsläpp	
      		var color = d3.scale.linear().domain([0,5,20]).range(["#7860B9", "#EAE8E6", "#5AA9EC"]); 
          	return color(co2); 
      	}
       });

  //offsets for tooltips
  var offsetL = document.getElementById('container').offsetLeft+20;
  var offsetT = document.getElementById('container').offsetTop+10;
  //tooltips
	//
	var clickState = 0;
	var sidebarDiv = document.getElementById('sidebar');
	var mapScreen = document.getElementById('mapScreen');
	d3.select("#compareLineChart").classed("hidden", true);
	//f = 0;
  country
    .on("mousemove", function(d,i) {
		f = 0;

		//Nollställfärgen på alla bars //Funkar inte riktigt eftersom alla förflyttningar verkar räknas som en ny mouse-over
		// d3.selectAll(".bar")
		//   	.attr('fill', 'blue');

		//Hämtar export-/importinfo från data
		var code = name2code(d.properties.name);
		var exportInfo = "";
		var importInfo = "";
		var countryExports = countries[code].topExport[2015]
		var countryImports = countries[code].topImport[2015]

		for(var key in countryExports) {
		    exportInfo += "</br>" + countryExports[key].partner;
		}

		for(var key in countryImports) {
		    importInfo += "</br>" + countryImports[key].partner;
		}

      var mouse = d3.mouse(worldSvg.node()).map( function(d) { return parseInt(d); } );


      tooltip.classed("hidden", false)
             .attr("style", "left:"+(mouse[0]+ offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.name + "</br></br>  Top  exports: " + exportInfo + "</br></br>  Top  imports: " + importInfo);

      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true);

       //ta bort eventuell highlight på bar chart 
     //   var code = name2code(d.properties.name);

     //   d3.select(".bar#" + code)
		  	// .attr('fill', 'black');


      })

	  .on("click", function(d, i) {
		  if (clickState == 0) {
			  d3.select("#selectCountry").classed("hidden", true);
			  d3.select("#compareLineChart").classed("hidden", true);
			  d3.select(".sidebarContainer").classed("hidden", false);
			  d3.select("#compareContainer").classed("hidden", true);
			  d3.select(".sidebarContainer").remove();
			  d3.select("#sidebar").insert("div").attr("class", "sidebarContainer");
			  console.log("i IF" + clickState);
			  landETT = d;
			  clickState++;


			  d3.select(".sidebarContainer").insert("p").html(d.properties.name + " BY THE YEAR OF " + "NittoHundra"); //Lägg på data här
			  d3.select(".sidebarContainer").insert("p").html("Annual CO2 per capita: " + "DATAFFS"); //Lägg på data här
			  d3.select(".sidebarContainer").insert("p").html("Trade balance: " + "DATAFNISS" ); //Lägg på data här
			  d3.select(".sidebarContainer").insert("div").attr("class", "top5exports").html("Snygga charts här inne va"); //Lägg in charts här
			  d3.select(".sidebarContainer").insert("p").attr("class", "selectCountry").html("Select additional countries to compare...");
		  } else if (clickState == 1) {
			  d3.selectAll(".compareWorld").remove();
			  d3.select("#compareContainer").classed("hidden", false);
			  d3.select(".sidebarContainer").classed("hidden", true);
			  d3.select("#selectCountry").classed("hidden", true);
			  d3.select("#compareLineChart").classed("hidden", false);
			  console.log("i ELSE IF" + clickState);
			  landTwo = d;
			  clickState = 0;

			  //var mouse = d3.mouse(worldSvg.node()).map( function(d) { return parseInt(d); } );

			  var width = document.getElementById('compareContainer').offsetWidth/2;
			  var height = width / 1.9;

			  //Kan eventuell kolla hur man väljer fler länder här.
			  setup2(width,height);
			  draw2([landETT], mouse);
			  setup2(width,height);
			  draw2([landTwo], mouse);
			  
		  }
		  //Hämtar landskod
		  var code = name2code(d.properties.name);
		  console.log(code);

		  //Nollställ eventuell  highlightad stapel
		  d3.selectAll(".bar")
		  	.attr('fill', 'black');

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
  setup(width,height);
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
      		var co2 = countries[kod].co2[year];

      		//Generera färg beroende på co2-utsläpp	
      		var color = d3.scale.linear().domain([0,5,20]).range(["#7860B9", "#EAE8E6", "#5AA9EC"]); 
          	return color(co2); 

        });
}