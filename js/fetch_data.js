/* 	Creating a list of objects with each country as an object. The partners are not ranked in any way. 
	Structure of countries:

countries =
	{	Country code:{	
					name: country name,
					code: country code,
					topImport:{
						import partner1 country code:{
							indicator, 
							indicator type, 
							indicator value, 
							partner, 
							category, 
							year
						}import partner2 country code:{
							indicator... 
						}
					topExport{
						export partner1 country code:{
							indicator... 
						}
				}
	}	Country 2 code {
					name: country name, 
					code: country code...},
		Country 3 code {
					name: country name, 
					code: country code...} and so on */

var countries;

function readCountries(callback){
	// Create list object containing objects with Key = Country Code and Value = {Country: Name of country} 
		d3.csv('data/iso_countries.csv', function(data){
		countries = {};	
		for(i in data){
		// Adding country object to list object
		countries[data[i]['ISO 3166-1 3 Letter Code']] = {'code': data[i]['ISO 3166-1 3 Letter Code'], 'name': data[i]['Common Name'], 'topExport': {}, 'topImport': {}}
		}
		callback(null);
	})
}

// Waits until readCountries is ready and then runs readData
var q1 = d3.queue();
	q1.defer(readCountries);
	q1.await(readData);

// Queing all datafiles and waits until they are all in. When done, it moves on to getTop5ExportImport
function readData(){
	var q2 = d3.queue();
	for(i in countries){
		q2.defer(d3.csv, 'data/allcountries_allyears_at_glance/en_'+countries[i].code+'_At-a-Glance.csv')			
	}
	q2.awaitAll(getTop5ExportImport)
}

// Takes out all data for top 5 export and top 5 import
function getTop5ExportImport(error, files){
	if(error){
		console.log("Ops, something went wrong")
	}
	exports = [];
	imports = [];
	for(i in files){
		file = files[i];
		for(j in file){
			if(file[j].Indicator == "Trade (US$ Mil)-Top 5 Export Partner"){
				exports.push(file[j])
			}else if(file[j].Indicator == "Trade (US$ Mil)-Top 5 Import Partner"){
				imports.push(file[j])
			};			
		}
	}
	sortTop5ExportImport(exports, imports);
}

// Sorts all the top 5 export and import data by country 
// Adding the whole object(indicator, partner, category, reporter, year) to the export/import-list with the country code as key
function sortTop5ExportImport(exports, imports){
	// loops through list of export data 
	for(i in exports){
		// loops all countries in code-name list and compares name to reporting country name in export-list
		for(j in countries){
			if(countries[j].name == exports[i].Reporter){
				// compares export partner with names in countries code-name list and adds partner country to 
				// reporting countries topExport. Adds partner as an object with partner country code as key and data as value. 
				for(k in countries){
					if(countries[k].name == exports[i].Partner){
						countries[j].topExport[countries[k].code] = exports[i];
					}
				}
			}
		}
	}
	// Same as above for import
	for(i in imports){
		for(j in countries){
			if(countries[j].name == imports[i].Reporter){
				for(k in countries){
					if(countries[k].name == imports[i].Partner){
						countries[j].topImport[countries[k].code] = imports[i];
					}
				}
			}
		}
	}
	// Our adorable list of countries
	console.log(countries)
}

