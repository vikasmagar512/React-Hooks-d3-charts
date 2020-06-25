import React, { useEffect, useRef } from "react";
import {
  select,
  axisBottom,
  stack,
  max,
  scaleLinear,
  axisLeft,
  stackOrderAscending,
  area,
  scalePoint,
  curveCardinal
} from "d3";
import * as d3 from 'd3'
/*
 * Component that renders a StackedBarChart
*/

function StackedBar(props) {
  const svgRef = useRef();
  var margin = { top: 20, right: 30, bottom: 30, left: 30 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;
  const { data, keys, colors } = props


  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // stacks / layers
    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending);
    const layers = stackGenerator(data);
    const extent = [
      0,
      max(layers, layer => max(layer, sequence => sequence[1]))
    ];

    // scales
    const xScale = scalePoint()
      .domain(data.map(d => d.year))
      .range([0, width - margin.right]);

    const yScale = scaleLinear()
      .domain(extent)
      .range([height, margin.top])

    // area generator
    const areaGenerator = area()
      .x(sequence => xScale(sequence.data.year))
      .y0(sequence => yScale(sequence[0]))
      .y1(sequence => yScale(sequence[1]))
      .curve(curveCardinal);

    // rendering
    svg
      .selectAll(".layer")
      .data(layers)
      .join("path")
      .attr("class", "layer")
      .attr("fill", layer => colors[layer.key])
      .attr("d", areaGenerator)
      .attr("transform", `translate(${margin.left}, 0)`)

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);
  }, [colors, data, keys]);

  return (
    <React.Fragment>
      <div>
        <svg
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        >
          <g
            ref={svgRef}
            transform={`translate(${margin.left}, ${margin.top})`}
          >
            <g className="x-axis" />
            <g className="y-axis" />
          </g>
        </svg>
      </div>
    </React.Fragment>
  );
}

export default StackedBar;