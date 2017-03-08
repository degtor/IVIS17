
updateSideBar = function(){
	d3.select("#sidebarOneCountry").selectAll(".value").remove()

	var code = name2code(landETT.properties.name);
			
	// Append values to sidebarOneContry with the class=value and they will be cleared in the line above on new click
	d3.select("#country-name").insert("h2").attr("class", "value").html(landETT.properties.name)
	d3.select("#year-label").insert("h3").attr("class", "value").html(year)
	d3.select("#co2-label").insert("h3").attr("class", "value").html(Math.round(countries[code].co2[year]*100)/100)
	d3.select("#trade-label").insert("h3").attr("class", "value").html(Math.round(countries[code].tradingBalance[year]*100)/100)
	d3.select('#additional-countries-hint').insert("p").attr("class", "value").html("Select two countries to compare them");
	if (countries[code].exports[year] == undefined) {
		console.log("No export data found for the year " + year);
		d3.select('#top-export-container').insert("p").attr("class", "value").html("No export data for "+landETT.properties.name+" in "+year);
	} else {
		console.log("Export data not undefined" + countries[code].exports[year]["IND"].partner);
		d3.select('#top-export-container').insert("h4").attr("class", "value").html("TOP 5 EXPORT");
		for (i in countries[code].exports[year]) {
			d3.select('#top-5-export').insert("li").attr("class", "value").html(countries[code].exports[year][i].partner);
			console.log("This is i: " + i);
		}
	}
}
