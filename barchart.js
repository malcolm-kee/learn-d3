(function() {
  var w = 600;
  var h = 250;
  /**
   * @type {Array<{key: number; value: number;}>}
   */
  var dataset;
  var svg;

  var xScale;
  var yScale;

  var generateData = (function() {
    var id = 1;
    var max = 40;

    return function generateData() {
      return {
        key: id++,
        value: Math.round(Math.random() * max)
      };
    };
  })();

  function generateDataSet(length = 20) {
    var results = [];
    for (let index = 0; index < length; index++) {
      results.push(generateData());
    }
    return results;
  }

  const getKey = d => d.key;

  function init() {
    dataset = generateDataSet();

    svg = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d.value)])
      .range([0, h]);

    svg
      .selectAll('rect')
      .data(dataset, getKey)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => h - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => yScale(d.value))
      .attr('fill', d => `rgb(0,0,${Math.round(d.value * 10)})`)
      .on('click', sortBars)
      .append('title')
      .text(d => d.value);

    svg
      .selectAll('text')
      .data(dataset, getKey)
      .enter()
      .append('text')
      .text(d => d.value)
      .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('y', d => h - yScale(d.value) + 14)
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('text-anchor', 'middle');
  }

  function refreshChart() {
    dataset = generateDataSet(dataset.length);

    yScale.domain([0, d3.max(dataset, d => d.value)]);

    renderChart();
  }

  function renderChart(keyFn) {
    svg
      .selectAll('rect')
      .data(dataset, keyFn)
      .transition()
      .duration(500)
      .attr('y', d => h - yScale(d.value))
      .attr('x', (_, i) => xScale(i))
      .attr('height', d => yScale(d.value))
      .attr('fill', d => `rgb(0,0,${Math.round(d.value * 10)})`)
      .select('title')
      .text(d => d.value);

    svg
      .selectAll('text')
      .data(dataset, keyFn)
      .transition()
      .duration(500)
      .text(d => d.value)
      .attr('x', (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('y', d => h - yScale(d.value) + 14);
  }

  function addDataToChart() {
    dataset.push(generateData());

    svg
      .selectAll('rect')
      .data(dataset, getKey)
      .enter()
      .append('rect')
      .attr('x', w)
      .attr('y', d => h - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => yScale(d.value))
      .attr('fill', d => `rgb(0,0,${Math.round(d.value * 10)})`)
      .on('click', sortBars);

    svg
      .selectAll('text')
      .data(dataset, getKey)
      .enter()
      .append('text')
      .text(d => d.value)
      .attr('x', w + xScale.bandwidth() / 2)
      .attr('y', d => h - yScale(d.value) + 14)
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('text-anchor', 'middle');

    transitionChart();
  }

  function removeDataFromChart() {
    dataset.shift();

    svg
      .selectAll('rect')
      .data(dataset, getKey)
      .exit()
      .transition()
      .duration(500)
      .attr('x', -xScale.bandwidth())
      .remove();

    svg
      .selectAll('text')
      .data(dataset, getKey)
      .exit()
      .transition()
      .duration(500)
      .attr('x', -xScale.bandwidth())
      .remove();

    transitionChart();
  }

  function transitionChart() {
    xScale.domain(d3.range(dataset.length));
    yScale.domain([0, d3.max(dataset, d => d.value)]);

    svg
      .selectAll('rect')
      .data(dataset, getKey)
      .transition()
      .duration(500)
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => h - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => yScale(d.value))
      .attr('fill', d => `rgb(0,0,${Math.round(d.value * 10)})`);

    svg
      .selectAll('text')
      .data(dataset, getKey)
      .transition()
      .duration(500)
      .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr('y', d => h - yScale(d.value) + 14)
      .text(d => d.value);
  }

  var sortBars = (function() {
    var sortOrder = false;
    return function() {
      sortOrder = !sortOrder;
      dataset.sort((a, b) => (sortOrder ? a.value - b.value : b.value - a.value));
      renderChart(getKey);
    };
  })();

  init();
  d3.select('#magic-btn').on('click', refreshChart);
  d3.select('#add-btn').on('click', addDataToChart);
  d3.select('#remove-btn').on('click', removeDataFromChart);
})();
