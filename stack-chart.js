(function() {
  var width = 700;
  var height = 400;

  var dataset = [
    { apples: 5, oranges: 10, grapes: 22 },
    { apples: 4, oranges: 12, grapes: 28 },
    { apples: 2, oranges: 19, grapes: 32 },
    { apples: 7, oranges: 23, grapes: 35 },
    { apples: 23, oranges: 17, grapes: 43 }
  ];

  var stack = d3
    .stack()
    .keys(['apples', 'oranges', 'grapes'])
    .order(d3.stackOrderDescending);
  var series = stack(dataset);
  // output of stack is having the format of Array<Array<[start, end]>>
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var xScale = d3
    .scaleBand()
    .domain(d3.range(dataset.length))
    .rangeRound([0, width])
    .paddingInner(0.05);
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d.apples + d.oranges + d.grapes)])
    .rangeRound([height, 0]);

  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var groups = svg
    .selectAll('g')
    .data(series)
    // each d here is a stack
    .enter()
    .append('g')
    .style('fill', (_, i) => color(i));

  groups
    .selectAll('rect')
    .data(d => d)
    // each d here is now a category within the stack
    .enter()
    .append('rect')
    .attr('x', (_, i) => xScale(i))
    .attr('y', height)
    .attr('height', 0)
    .attr('width', xScale.bandwidth())
    .transition()
    .duration(500)
    .attr('y', d => yScale(d[1]))
    .attr('height', d => yScale(d[0]) - yScale(d[1]));
})();
