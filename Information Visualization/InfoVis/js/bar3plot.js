function clearbar3(){
  $('#chart3')[0].innerHTML = "";
}
function bar3plot(trips){
  // Configs

  var expensesCount = d3.nest()
          .key(function (d) { return d.taxiid } )
          .rollup(function(v) { return d3.sum(v, function(d) { return d.distance; }); })
          .entries(trips)
          .sort(function(a,b){return d3.descending(a.values,b.values); });
  expensesCount = expensesCount.slice(0,20);
  var Chart = {
    margin: {left:30, top:40, right:10, bottom:10},
    width: window.innerWidth - 50,
    height: 270,
    sideWidth: 40,
    bottomHeight: 60,
  }
  var BarArea = {
    width: Chart.width - Chart.margin.left - Chart.margin.right - Chart.sideWidth,
    height: Chart.height - Chart.margin.top - Chart.margin.bottom - Chart.bottomHeight,
  }
  var Bar = {
    padding: .01,
    outerPadding: .02,
    color: 'teal',
    startColor: 'darkolivegreen',
  }

 
  var dataTrigger = false;

 
  // Setup
  var data;
  var svg1 = d3.select('#chart3')
  .attr({
    width: Chart.width,
    height: Chart.height 
  });

  var bars;
  svg1.append('clippath')
    .attr('id', 'chart-area')
    .append('rect')
    .attr({
    x: Chart.margin.left + Chart.sideWidth,
    y: Chart.margin.top,
    width: BarArea.width,
    height: BarArea.height,
  });
  // Add an x-axis label.
  svg1.append("text")
    .attr("class", "label")
    .attr("text-anchor", "end")
    .attr("x", Chart.width - 100)
    .attr("y", Chart.height - 30)
    .text("Taxi Id")
    .style("font-size","14px")
    .style("font-family","monospace");

  // Add a y-axis label.
  svg1.append("text")
    .attr("class", "label")
    .attr("text-anchor", "end")
    .attr("x", -115)
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Distance")
    .style("font-size","14px")
    .style("font-family","monospace");  

  var barGroup = svg1.append('g')
  .attr('id', 'bars')
  .attr('clip-path', 'url(#chart-area)')
  .attr('transform',
        `translate(${Chart.margin.left + Chart.sideWidth}, ${Chart.margin.top})`)
  .attr('clip-path', 'url(#chart-area)');

  svg1.append('g')
    .attr('transform', 'translate(' +
          (Chart.margin.left + Chart.sideWidth) + ', ' +
          (Chart.margin.top + BarArea.height) + ')')
    .attr('class','x3axis')
    .classed('axis', true)
    .classed('x', true)
    .classed('nostroke', true);

  svg1.append('g')
    .attr('transform',
          `translate(${Chart.margin.left + Chart.sideWidth}, ${Chart.margin.top})`)
    .attr('class','y3axis')
    
    .classed('axis', true)
    .classed('y', true);

  
  var tooltip = d3.select('#tooltip3');


  var newIndex = 0;

  // Rendering
  // data = JSON.parse(JSON.stringify(dataset2));
  data = JSON.parse(JSON.stringify(expensesCount));
  // console.log(data);
  // console.log("expensesCount",expensesCount);
  // in place of this data send another
  // alert(data);
  renderChart();
 

  function renderChart() {
    var xScale = d3.scale
    .ordinal()
    .rangeRoundBands([0, BarArea.width], Bar.padding, Bar.outerPadding)
    .domain(data.map((v, i) => {return v['key']}));

    var yScale = d3.scale.linear()
    .range([BarArea.height, 0])
    .domain([0, d3.max(data, (d) => {return d['values']})]);

    var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

    var yAxis = d3.svg.axis()
    .ticks(5)
    .scale(yScale)
    .orient('left');

    var totalDelay = 500;
    var oneByOne = (d, i) => {return totalDelay * i / data.length};

    
    bars = barGroup.selectAll('rect')
      .data(data, (d) => {return d['key']});

    bars.enter()
      .append('rect')
      .attr({
      x: (d) => {return xScale(d['key'])},
      y: BarArea.height,
      width: xScale.rangeBand(),
      height: 0,
      fill: Bar.startColor,
    })
      .on('mouseenter', showTip)
      .on('mouseleave', hideTip);

    bars.transition()
      .duration(1500)
      .delay(oneByOne)
      .ease('elastic')
      .attr({
      x: (d) => {return xScale(d['key'])},
      y: (d) => {return yScale(d['values'])},
      width: xScale.rangeBand(),
      height: (d) => {return BarArea.height - yScale(d['values'])},
      fill: Bar.color,
    });

    bars.exit()
      .transition()
      .duration(500)
      .attr({
      y: BarArea.height,
      height: 0,
      color: Bar.startColor,
    })
      .remove();

    var labels = barGroup.selectAll('text');
    if (xScale.rangeBand() > 25) {
      labels = labels.data(data, (d) => {return d['key']});
    } else {
      labels = labels.data([]);
    }

    labels.enter()
      .append('text')
      .classed('label', true)
      .classed('noselect', true)
      .classed('unclickable', true)
      .attr('fill', 'white');

    var belowOrAbove = (d) => {
      var y = yScale(d['values']);
      if (y + 30 < BarArea.height) {
        return [y+30, 'white']
      } else {
        return [y - 10, 'black']
      }
    };

    labels.transition()
      .duration(1500)
      .delay(oneByOne)
      .ease('elastic')
      .attr({
      x: (d) => {return xScale(d['key']) + xScale.rangeBand()/2},
      y: (d) => {return belowOrAbove(d)[0]},
      fill: (d) => {return belowOrAbove(d)[1]},
    })
      .text((d) => {return (parseInt(parseInt(d['values'])/1000) + "K") ; })
      // .text((d) => {return d['values'] })
      .style('font-size','22px');

    labels.exit().remove();

    // TODO: how to calculate this 20
    
    if (xScale.rangeBand() > 20) {
      d3.select('.x3axis')
        .transition()
        .duration(1500)
        .ease('elastic')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-20)');
    } else {
      d3.select('.y2axis').selectAll('.tick').remove();
    }

    d3.select('.y3axis')
      .transition()
      .duration(1000)
      .call(yAxis);
  }


  function showTip(x) {
    var dollar = x['values']
    tooltip.style({
      left: `${d3.event.clientX}px`,
      top: `${d3.event.clientY}px`,
      visibility: 'visible'
    }).text(`Time ID is ${x['key']} :  Distance covered ${x['values']}`);
  }


  function hideTip() {
    tooltip.style('visibility', 'hidden');
  }
}