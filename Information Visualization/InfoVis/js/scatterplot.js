function clearscatter(){

  $('#scatter-load')[0].innerHTML = "";
}

function scatterplot(data) {
    // just to have some space around items. 
    var margins = {
        "left": 50,
            "right": 30,
            "top": 30,
            "bottom": 40
    };
    
    var width = 0.5 * window.innerWidth;
    var height = 540;
    // this will be our colour scale. An Ordinal scale.
    
    // we add the SVG component to the scatter-load div
    
    var svg = d3.select("#scatter-load").append("svg").attr("width", width).attr("height", height).append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    
    // this sets the scale that we're using for the X axis. 
    // the domain define the min and max variables to show. In this case, it's the min and max prices of items.
    // this is made a compact piece of code due to d3.extent which gives back the max and min of the price variable within the dataset
    // function timeparse(d){
//       return d.starttime.slice(11,13);
//   } 
//   function speedparse(d){
//       return parseInt(d.avspeed);
//   }
    var x = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return parseInt(d.avspeed);
    }))
    // the range maps the domain to values from 0 to the width minus the left and right margins (used to space out the visualization)
        .range([0, width - margins.left - margins.right]);

    // this does the same as for the y axis but maps from the rating variable to the height to 0. 
    var y = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.starttime.slice(11,13);
    }))
    // Note that height goes first due to the weird SVG coordinate system
    .range([height - margins.top - margins.bottom, 0]);

    // we add the axes SVG co mponent. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr('class','xxx').attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr('class','yyy').attr("class", "y axis");

    // this is our X axis label. Nothing too special to see here.
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("x", width -200)
        .attr("y", height - 35)
        .attr("class", "label")
        .text("Average Speed")
        .style('font-weight','1200')
        .style("font-size","14px")
        .style('font-family','monospace');

      svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("x", -100)
        .attr("y", -25)
        .attr("transform", "rotate(-90)")
        .text("Time in Hours")
        .attr("class", "label")
        .style('font-weight','1200')
        .style("font-size","14px")
        .style('font-family','monospace');


    // this is the actual definition of our x and y axes. The orientation refers to where the labels appear - for the x axis, below or above the line, and for the y axis, left or right of the line. Tick padding refers to how much space between the tick and the label. There are other parameters too - see https://github.com/mbostock/d3/wiki/SVG-Axes for more information
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    // this is where we select the axis we created a few lines earlier. See how we select the axis item. in our svg we appended a g element with a x/y and axis class. To pull that back up, we do this svg select, then 'call' the appropriate axis object for rendering.    
    svg.selectAll("g.y.axis").call(yAxis);
    svg.selectAll("g.x.axis").call(xAxis);

    // now, we can get down to the data part, and drawing stuff. We are telling D3 that all nodes (g elements with class node) will have data attached to them. The 'key' we use (to let D3 know the uniqueness of items) will be the name. Not usually a great key, but fine for this example.
    var chocolate = svg.selectAll("g.node").data(data, function (d) {
        return d.taxiid;
    });

    // we 'enter' the data, making the SVG group (to contain a circle and text) with a class node. This corresponds with what we told the data it should be above.
    
    var chocolateGroup = chocolate.enter().append("g").attr("class", "node")
    // this is how we set the position of the items. Translate is an incredibly useful function for rotating and positioning items 
    .attr('transform', function (d) {
        return "translate(" + x(parseInt(d.avspeed)) +"," + y(d.starttime.slice(11,13)) + ")";
    });

    // we add our first graphics element! A circle! 
    chocolateGroup.append("circle")
        .attr("r", 3)
        .attr("class", "dot")
        .style("fill", 'darkolivegreen');

    // now we add some text, so we can see what each item is.
    // chocolateGroup.append("text")
    //     .style("text-anchor", "middle")
    //     .attr("dy", -10)
    //     .text(function (d) {
    //         // this shouldn't be a surprising statement.
    //         return d.taxiid;
    // });
}

// function scatterplot(trips){
//   // Configs
//   console.log('from scatter');
//   var Chart = {
//     margin: {left:10, top:40, right:10, bottom:10},
//     width: window.innerWidth - 50,
//     height: 540,
//     sideWidth: 40,
//     bottomHeight: 60,
//   }
//   // pardaina
//   var BarArea = {
//     width: Chart.width - Chart.margin.left - Chart.margin.right - Chart.sideWidth,
//     height: Chart.height - Chart.margin.top - Chart.margin.bottom - Chart.bottomHeight,
//   }
//   var Bar = {
//     padding: .01,
//     outerPadding: .02,
//     color: 'teal',
//     startColor: 'darkolivegreen',
//   }

 
//   var dataTrigger = false;

 
//   // Setup
//   var data;
//   var svg = d3.select('#scatter')
//   .attr({
//     width: Chart.width,
//     height: Chart.height 
//   });

//   var bars;
//   //pardaina
//   // svg.append('clippath')
//   //   .attr('id', 'chart-area')
//   //   .append('rect')
//   //   .attr({
//   //   x: Chart.margin.left + Chart.sideWidth,
//   //   y: Chart.margin.top,
//   //   width: BarArea.width,
//   //   height: BarArea.height,
//   // });
//   // Add an x-axis label.
//   svg.append("text")
//     .attr("class", "x label")
//     .attr("text-anchor", "end")
//     .attr("x", Chart.width - 100)
//     .attr("y", Chart.height - 30)
//     .text("average speed")
//     .style("font-size","14px")
//     .style("font-family","monospace");

//   // Add a y-axis label.
//   svg.append("text")
//     .attr("class", "y label")
//     .attr("text-anchor", "end")
//     .attr("x", -100)
//     .attr("y", 6)
//     .attr("dy", ".75em")
//     .attr("transform", "rotate(-90)")
//     .text("time of day")
//     .style("font-size","14px")
//     .style("font-family","monospace");  

//   // pardaina
//   // var barGroup = svg.append('g')
//   // .attr('id', 'bars')
//   // .attr('clip-path', 'url(#chart-area)')
//   // .attr('transform',
//   //       `translate(${Chart.margin.left + Chart.sideWidth}, ${Chart.margin.top})`)
//   // .attr('clip-path', 'url(#chart-area)');


//   svg.append('g')
//     .attr('transform', 'translate(' +
//           (Chart.margin.left + Chart.sideWidth) + ', ' +
//           (Chart.margin.top + BarArea.height) + ')')
//     .classed('axis', true)
//     .classed('x', true)
//     .attr('class','xscaaxis')
//     .classed('nostroke', true);

//   svg.append('g')
//     .attr('transform',
//           `translate(${Chart.margin.left + Chart.sideWidth}, ${Chart.margin.top})`)
//     .attr('class','yscaaxis')
//     .classed('axis', true)
//     .classed('y', true);

//   var tooltip = d3.select('#tooltip');


//   var newIndex = 0;

//   // Rendering
//   // data = JSON.parse(JSON.stringify(dataset2));
//   data = JSON.parse(JSON.stringify(trips));
//   // console.log("expensesCount",expensesCount);
//   // in place of this data send another
//   // alert(data);
//   console.log(data);
//   renderChart();
 
//   function timeparse(d){
//       return d.starttime.slice(11,13);
//   } 
//   function speedparse(d){
//       return parseInt(d.avspeed);
//   }
//   function renderChart() {
//     // console.log(d3.max(data, (d) => {return parseInt(d.avspeed) }));
//     var xScale = d3.scale
//     .linear()
//     .domain([0,d3.max(data, (d) => {return parseInt(d.avspeed) })])
//     .range([0,BarArea.width]);

//     console.log(d3.max(data, (d) => {return parseInt(d.avspeed); }));
//     var yScale = d3.scale.linear()
//     .domain([0,d3.max(data, (d) => {return d.starttime.slice(11,13) })])
//     .range([BarArea.height, 0]);

//     var xAxis = d3.svg.axis()
//     .scale(xScale)
//     .orient('bottom');

//     var yAxis = d3.svg.axis()
//     .scale(yScale)
//     .orient('left');
    
//     d3.select('.xscaaxis')
        
//         .call(xAxis);
        
//     d3.select('.yscaaxis')
//         .call(yAxis);

//     var chocolate = svg.selectAll("g.node").data(data);
    
//     var chocolateGroup = chocolate.enter().append("g").attr("class", "node")
//     .attr('transform', function (d) {
//         return "translate(" + xScale(parseInt(d.avspeed)) + "," + yScale(d.starttime.slice(11,13)) + ")";
//     });
//     chocolateGroup.append("circle")
//         .attr("r", 5)
//         .attr("class", "dot")
//         .style("fill", "red");


//   }
//   // enter ma
//   // .on('mouseenter', showTip)
//   //     .on('mouseleave', hideTip);

//   function showTip(x) {
//     tooltip.style({
//       left: `${d3.event.clientX}px`,
//       top: `${d3.event.clientY}px`,
//       visibility: 'visible'
//     }).text(`Average Speed ${x['key']} : Number ${x['values']}`);
//   }


//   function hideTip() {
//     tooltip.style('visibility', 'hidden');
//   }
// }