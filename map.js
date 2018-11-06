(function() {
  var width = 700;
  var height = 500;
  var path = d3.geoPath(d3.geoMercator().translate([width / 3, height / 3]));
  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  function processData(json) {
    svg
      .selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path);
  }

  d3.json('malaysia.json').then(processData);
})();
