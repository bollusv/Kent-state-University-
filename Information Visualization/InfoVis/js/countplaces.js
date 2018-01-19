function places_count(trips){
	// function split_helper(streetnames){

	// 	var a = [...new Set(streetnames)]
	// 	return a[0]+' to '+a[a.length - 1]
	// }
	console.log("Till here yes");
	
	var sources = d3.nest()
                      .key(function(d) { return d.streetnames[0]; })
                      .rollup(function(v) { return v.length; })
                      .entries(trips)
                      .sort(function(a, b){ return d3.descending(a.values, b.values); });
    sources = sources.slice(0,10)
    var rest = sources.slice(10,sources.length);
    var sum = 0
    rest.map(function (d) { sum = sum + d.values })
    var stmt;
    for (var i in sources){
		stmt = "<div class = 'content_container'><span class = 'content'>"+sources[i]['key']+"</span><span class = 'number'>"+sources[i]['values']+"</span></div>"
    	$('.source').append(stmt);
    }
    	    
    var destinations = d3.nest()
                      .key(function(d) { return d.streetnames[d.streetnames.length - 1]; })
                      .rollup(function(v) { return v.length; })
                      .entries(trips)
                      .sort(function(a, b){ return d3.descending(a.values, b.values); });
    destinations = destinations.slice(0,61)
    	    
    for (var  i in destinations){
    	stmt = "<div class = 'content_container'><span class = 'content'>"+destinations[i]['key']+"</span><span class = 'number'>"+destinations[i]['values']+"</span></div>"
    	$('.destination').append(stmt);
    }
}
    	
