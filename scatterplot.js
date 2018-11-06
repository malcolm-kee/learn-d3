(function() {
  function generateData() {
    var maxX = 500;
    var maxY = 100;

    return [Math.round(Math.random() * maxX), Math.round(Math.random() * maxY)];
  }

  function generateDataSet() {
    var results = [];

    for (let index = 0; index < 20; index++) {
      results.push(generateData());
    }

    return results;
  }
  var dataset = generateDataSet();

  var w = 500;
  var h = 200;
  var padding = 30;

  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  var xScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[0])])
    .range([padding, w - padding * 2])
    .nice();

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([h - padding, padding])
    .nice();

  svg
    .append('g')
    .attr('id', 'circles')
    .attr('clip-path', 'url(#chart-area)')
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 2)
    .attr('fill', 'black');

  var xAxis = d3.axisBottom(xScale);

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale).ticks(5);

  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .append('clipPath')
    .attr('id', 'chart-area')
    .append('rect')
    .attr('x', padding)
    .attr('y', padding)
    .attr('width', w - padding * 3)
    .attr('height', h - padding * 2);

  function updateChart() {
    dataset = generateDataSet();
    xScale.domain([0, d3.max(dataset, d => d[0])]);
    yScale.domain([0, d3.max(dataset, d => d[1])]);

    svg
      .selectAll('circle')
      .data(dataset)
      .transition(5000)
      .ease(d3.easeLinear)
      .on('start', function() {
        d3.select(this)
          .attr('fill', 'magenta')
          .attr('r', 3);
      })
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(d[1]))
      .transition()
      .duration(1000)
      .attr('fill', 'black')
      .attr('r', 2);

    svg
      .select('.x.axis')
      .transition()
      .duration(1000)
      .call(xAxis);

    svg
      .select('.y.axis')
      .transition()
      .duration(1000)
      .call(yAxis);
  }

  d3.select('#magic-btn').on('click', updateChart);
})();
