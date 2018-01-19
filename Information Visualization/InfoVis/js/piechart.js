function clearpie(){
	$('#pie-chart')[0].innerHTML = "";
	$('#pie-chart2')[0].innerHTML = "";
}
function draw_source_pie(trips){

	var sources = d3.nest()
                      .key(function(d) { return d.streetnames[0]; })
                      .rollup(function(v) { return v.length; })
                      .entries(trips)
                      .sort(function(a, b){ return d3.descending(a.values, b.values); });

	var data = sources.slice(0,7)
    var rest = sources.slice(7,sources.length);
    var sum = 0
    // console.log(rest);
    rest.map(function (d) { sum = sum + d.values })
	data.push({'key': 'Others','values' : sum})

	var w = 0.5 * window.innerWidth;
	var h = 540;
	var r = h/3;
	var color = d3.scale.category20();


	// var data = [{"label":"Category A", "value":40}, 
	// 	          {"label":"Category B", "value":50}, 
	// 	          {"label":"Category C", "value":30}];


	var vis = d3.select('#pie-chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + 300 + "," + 180 + ")");
	var pie = d3.layout.pie().value(function(d){return d.values;});

	// declare an arc generator function
	var arc = d3.svg.arc().outerRadius(r);

	// select paths, use arc generator to draw
	var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
	arcs.append("svg:path")
	    .attr("fill", function(d, i){
	        return color(i);
	    })
	    .attr("d", function (d) {
	        // log the result of the arc generator to show how cool it is :)
	        // console.log(arc(d));
	        return arc(d);
	    });

	// add the text
	arcs.append("svg:text").attr("transform", function(d){
				d.innerRadius = r-30;
				d.outerRadius = r;
	    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
	    return data[i].values;}
		)
		.style('color','white')
		.style("font-size","14px")
    	.style("font-family","monospace");


     var svg2 = d3.select('#pie-chart svg')
							    
							        
	 var legend = svg2.append("g")
		                  .attr("class", "legend1")
		                  .attr('transform', 'translate(0,400)')  
		                  .attr("width", 550)
							    .attr("height", 30*(data.length+1));   


		 legend.selectAll('rect')
						  .data(data.slice(0,4))
						  .enter()
						  .append("rect")
						  .attr("x", 20)
						  .attr("y", function(d, i){ return (i-1) *  25;})
						  .attr("width", 10)
						  .attr("height", 10)
						  .style("fill", function(d,i) { 
						     return color(i);
						  });

	     legend.selectAll('text')
						  .data(data.slice(0,4))
						  .enter()
						  .append("text")
						  .attr("x", 40)
						  .attr("width", 5)
						  .attr("height", 5)
						  .attr("y", function(d, i){ return (i-1) *  25 + 9;})
						  .text(function(d) {
						    return d.key;
						  })
						  .style("font-size","15px")
						  .style("font-family","monospace");

		 var legend1 = svg2.append("g")
		                  .attr("class", "legend2")
		                  .attr('transform', 'translate(80,400)')  
		                  .attr("width", 550)
							    .attr("height", 30*(data.length+1));   


		 legend1.selectAll('rect')
						  .data(data.slice(4,8))
						  .enter()
						  .append("rect")
						  .attr("x", 292)
						  .attr("y", function(d, i){ return (i-1) *  25;})
						  .attr("width", 10)
						  .attr("height", 10)
						  .style("fill", function(d,i) { 
						     return color(i+4);
						  });

	     legend1.selectAll('text')
						  .data(data.slice(4,8))
						  .enter()
						  .append("text")
						  .attr("x", 312)
						  .attr("width", 5)
						  .attr("height", 5)
						  .attr("y", function(d, i){ return (i-1) *  25 + 9;})
						  .text(function(d) {
						    return d.key;
						  })
						  .style("font-size","15px")
						  .style("font-family","monospace");
}
function draw_destination_pie(trips){
	var sources = d3.nest()
                      .key(function(d) { return d.streetnames[d.streetnames.length-1]; })
                      .rollup(function(v) { return v.length; })
                      .entries(trips)
                      .sort(function(a, b){ return d3.descending(a.values, b.values); });

	var data = sources.slice(0,7)
    var rest = sources.slice(7,sources.length);
    var sum = 0
    // console.log(rest);
    rest.map(function (d) { sum = sum + d.values })
	data.push({'key': 'Others','values' : sum})

	var w = 0.5 * window.innerWidth;
	var h = 540;
	var r = h/3;
	var color = d3.scale.category20();


	// var data = [{"label":"Category A", "value":40}, 
	// 	          {"label":"Category B", "value":50}, 
	// 	          {"label":"Category C", "value":30}];


	var vis = d3.select('#pie-chart2').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + 300 + "," + 180 + ")");
	var pie = d3.layout.pie().value(function(d){return d.values;});

	// declare an arc generator function
	var arc = d3.svg.arc().outerRadius(r);

	// select paths, use arc generator to draw
	var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
	arcs.append("svg:path")
	    .attr("fill", function(d, i){
	        return color(i);
	    })
	    .attr("d", function (d) {
	        // log the result of the arc generator to show how cool it is :)
	        // console.log(arc(d));
	        return arc(d);
	    });

	// add the text
	arcs.append("svg:text").attr("transform", function(d){
				d.innerRadius = r-30;
				d.outerRadius = r;
	    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
	    return data[i].values;}
		)
		.style('color','white')
		.style("font-size","14px")
    	.style("font-family","monospace");


     var svg2 = d3.select('#pie-chart2 svg')
							    
							        
	 var legend = svg2.append("g")
		                  .attr("class", "legend1")
		                  .attr('transform', 'translate(0,400)')  
		                  .attr("width", 550)
							    .attr("height", 30*(data.length+1));   


		 legend.selectAll('rect')
						  .data(data.slice(0,4))
						  .enter()
						  .append("rect")
						  .attr("x", 20)
						  .attr("y", function(d, i){ return (i-1) *  25;})
						  .attr("width", 10)
						  .attr("height", 10)
						  .style("fill", function(d,i) { 
						     return color(i);
						  });

	     legend.selectAll('text')
						  .data(data.slice(0,4))
						  .enter()
						  .append("text")
						  .attr("x", 40)
						  .attr("width", 5)
						  .attr("height", 5)
						  .attr("y", function(d, i){ return (i-1) *  25 + 9;})
						  .text(function(d) {
						    return d.key;
						  })
						  .style("font-size","15px")
						  .style("font-family","monospace");

		 var legend1 = svg2.append("g")
		                  .attr("class", "legend2")
		                  .attr('transform', 'translate(80,400)')  
		                  .attr("width", 550)
							    .attr("height", 30*(data.length+1));   


		 legend1.selectAll('rect')
						  .data(data.slice(4,8))
						  .enter()
						  .append("rect")
						  .attr("x", 292)
						  .attr("y", function(d, i){ return (i-1) *  25;})
						  .attr("width", 10)
						  .attr("height", 10)
						  .style("fill", function(d,i) { 
						     return color(i+4);
						  });

	     legend1.selectAll('text')
						  .data(data.slice(4,8))
						  .enter()
						  .append("text")
						  .attr("x", 312)
						  .attr("width", 5)
						  .attr("height", 5)
						  .attr("y", function(d, i){ return (i-1) *  25 + 9;})
						  .text(function(d) {
						    return d.key;
						  })
						  .style("font-size","15px")
						  .style("font-family","monospace");

}