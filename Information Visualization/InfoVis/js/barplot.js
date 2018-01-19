function clearbar(){
  $('#chart')[0].innerHTML = "";
}
function barplot(trips){
  // Configs
  var expensesCount = d3.nest()
                      .key(function(d) { return parseInt(d.avspeed); })
                      .rollup(function(v) { return v.length; })
                      .entries(trips);
  console.log(expensesCount);
  var Chart = {
    margin: {left:10, top:40, right:10, bottom:10},
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
  var svg = d3.select('#chart')
  .attr({
    width: Chart.width,
    height: Chart.height 
  });

  var bars;
  svg.append('clippath')
    .attr('id', 'chart-area')
    .append('rect')
    .attr({
    x: Chart.margin.left + Chart.sideWidth,
    y: Chart.margin.top,
    width: BarArea.width,
    height: BarArea.height,
  });
  // Add an x-axis label.
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", Chart.width - 100)
    .attr("y", Chart.height - 30)
    .text("average speed")
    .style("font-size","14px")
    .style("font-family","monospace");

  // Add a y-axis label.
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -100)
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("number of taxies")
    .style("font-size","14px")
    .style("font-family","monospace");  

  var barGroup = svg.append('g')
  .attr('id', 'bars')
  .attr('clip-path', 'url(#chart-area)')
  .attr('transform',
        `translate(${Chart.margin.left + Chart.sideWidth}, ${Chart.margin.top})`)
  .attr('clip-path', 'url(#chart-area)');

  svg.append('g')
    .attr('transform', 'translate(' +
          (Chart.margin.left + Chart.sideWidth) + ', ' +
          (Chart.margin.top + BarArea.height) + ')')
    .classed('axis', true)
    .classed('x', true)
    .classed('nostroke', true);

  svg.append('g')
    .attr('transform',
          `translate(${Chart.margin.left + Chart.sideWidth}, ${Chart.margin.top})`)
    .classed('axis', true)
    .classed('y', true);

  var tooltip = d3.select('#tooltip');


  var newIndex = 0;

  // Rendering
  // data = JSON.parse(JSON.stringify(dataset2));
  data = JSON.parse(JSON.stringify(expensesCount));
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
        return [y+20, 'white']
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
      .text((d) => {return d['values']})
      .style('font-size','22px');

    labels.exit().remove();

    // TODO: how to calculate this 20
    console.log(xScale.rangeBand());
    console.log(xScale);
    if (xScale.rangeBand() > 20) {
      d3.select('.x.axis')
        .transition()
        .duration(1500)
        .ease('elastic')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-20)');
    } else {
      d3.select('.x.axis').selectAll('.tick').remove();
    }

    d3.select('.y.axis')
      .transition()
      .duration(1000)
      .call(yAxis);
  }


  function showTip(x) {
    tooltip.style({
      left: `${d3.event.clientX}px`,
      top: `${d3.event.clientY}px`,
      visibility: 'visible'
    }).text(`Average Speed ${x['key']} : Number ${x['values']}`);
  }


  function hideTip() {
    tooltip.style('visibility', 'hidden');
  }
}