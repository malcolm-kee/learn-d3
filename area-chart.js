(function() {
  var height = 400;
  var width = 700;
  var padding = 40;
  var dangerCutoff = 350;
  var xScale, yScale;

  function rowConverter(d) {
    return {
      date: new Date(+d.year, +d.month - 1),
      average: parseFloat(d.average)
    };
  }

  function computeScale(dataset) {
    xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, d => d.date))
      .range([padding, width - padding])
      .nice();

    yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, d => (d.average >= 0 ? d.average : undefined)))
      .range([height - padding, padding])
      .nice();
  }

  function drawRegions() {
    var svg = d3.select('svg');
    // draw separator
    svg
      .append('line')
      .attr('x1', padding)
      .attr('y1', yScale(dangerCutoff))
      .attr('x2', width - padding)
      .attr('y2', yScale(dangerCutoff))
      .attr('stroke', 'red')
      .attr('stroke-dasharray', 4);

    svg
      .append('clipPath')
      .attr('id', 'safe-region')
      .append('rect')
      .attr('x', padding)
      .attr('y', yScale(dangerCutoff))
      .attr('width', width - 2 * padding)
      .attr('height', height - padding - yScale(dangerCutoff));

    svg
      .append('clipPath')
      .attr('id', 'danger-region')
      .append('rect')
      .attr('x', padding)
      .attr('y', padding)
      .attr('width', width - 2 * padding)
      .attr('height', yScale(dangerCutoff) - padding);
  }

  function drawArea(dataset) {
    // draw line
    var area = d3
      .area()
      .defined(d => d.average >= 0)
      .x(d => xScale(d.date))
      .y0(() => yScale.range()[0])
      .y1(d => yScale(d.average));

    d3.select('svg')
      .append('path')
      .datum(dataset)
      .attr('class', 'area')
      .attr('d', area)
      .attr('clip-path', 'url(#safe-region)');

    d3.select('svg')
      .append('path')
      .datum(dataset)
      .attr('class', 'area danger')
      .attr('d', area)
      .attr('clip-path', 'url(#danger-region)');
  }

  function drawAxis() {
    var xAxis = d3.axisBottom(xScale);
    d3.select('svg')
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - padding})`)
      .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    d3.select('svg')
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis);
  }

  function processData(dataset) {
    d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    computeScale(dataset);
    drawRegions();
    drawArea(dataset);
    drawAxis();
  }

  d3.csv('mauna_loa_co2_monthly_averages.csv', rowConverter).then(processData);
})();
