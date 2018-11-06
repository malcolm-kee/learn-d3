(function() {
  var width = 700;
  var height = 300;
  var dataset = {
    nodes: [
      { name: 'Adam' },
      { name: 'Bob' },
      { name: 'Carrie' },
      { name: 'Malcolm' },
      { name: 'Edward' },
      { name: 'Felicity' },
      { name: 'George' },
      { name: 'Hannah' },
      { name: 'Iris' },
      { name: 'Jerry' }
    ],
    edges: [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 1, target: 5 },
      { source: 2, target: 5 },
      { source: 2, target: 5 },
      { source: 3, target: 4 },
      { source: 5, target: 8 },
      { source: 5, target: 9 },
      { source: 6, target: 7 },
      { source: 7, target: 8 },
      { source: 8, target: 9 }
    ]
  };

  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var force = d3
    .forceSimulation(dataset.nodes)
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink(dataset.edges))
    .force(
      'center',
      d3
        .forceCenter()
        .x(width / 2)
        .y(height / 2)
    );

  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var edges = svg
    .selectAll('line')
    .data(dataset.edges)
    .enter()
    .append('line')
    .style('stroke', '#ccc')
    .style('stroke-width', 1);

  var nodes = svg
    .selectAll('circle')
    .data(dataset.nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .style('fill', (_, i) => color(i));

  nodes.append('title').text(d => d.name);

  nodes.call(
    d3
      .drag()
      .on('start', d => {
        if (!d3.event.active) force.alphaTarget(0.3).restart();

        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', d => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', d => {
        if (!d3.event.active) force.alphaTarget(0);

        d.fx = null;
        d.fy = null;
      })
  );

  force.on('tick', () => {
    edges
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodes.attr('cx', d => d.x).attr('cy', d => d.y);
  });
})();
