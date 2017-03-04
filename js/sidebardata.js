
updateSideBar = function(){
	d3.select("#sidebarOneCountry").selectAll(".value").remove()

	var code = name2code(landETT.properties.name);
			
	// Append values to sidebarOneContry with the class=value and they will be cleared in the line above on new click
	d3.select("#country-name").insert("p").attr("class", "value").html(landETT.properties.name)
	d3.select("#year-label").insert("p").attr("class", "value").html(year)
	d3.select("#co2-label").insert("p").attr("class", "value").html(Math.round(countries[code].co2[year]*100)/100)
	d3.select("#trade-label").insert("p").attr("class", "value").html(Math.round(countries[code].tradingBalance[year]*100)/100)
}
