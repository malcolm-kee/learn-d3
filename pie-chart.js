(function pieChart() {
  var dataset = [5, 10, 20, 45, 6, 25];
  var width = 400;
  var height = 400;
  var outerRadius = width / 2;
  var innerRadius = 0;

  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var pie = d3.pie();
  var arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var arcs = svg
    .selectAll('g.arc')
    .data(pie(dataset))
    // we don't feed dataset directly to arc, instead we transform it with pie first
    .enter()
    .append('g')
    .attr('class', 'arc')
    .attr('transform', `translate(${outerRadius}, ${outerRadius})`);

  arcs
    .append('path')
    .attr('fill', (_, i) => color(i))
    .attr('d', arc);

  arcs
    .append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text(d => d.value);
})();
