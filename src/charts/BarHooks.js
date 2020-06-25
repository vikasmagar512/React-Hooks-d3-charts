import * as d3 from "d3";
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import React, { useRef, useEffect, useState } from "react";

const Bar = props => {
  const svgRef = useRef();
  var margin = { top: 20, right: 30, bottom: 30, left: 30 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;

  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleBand()
      .domain(d3.range(props.data.length))
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, d3.max(props.data, d => d)]).nice()
      .range([height - margin.bottom, margin.top])

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale)
      .ticks(props.data.length)
    // .tickSizeOuter(0);

    svg
      .select(".x-axis")
      .style("transform", `translateY(${height - margin.bottom}px)`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale)
      .ticks(null, props.data.format)
    // .ticks(props.data.length) 

    // svg.select(".domain").remove()

    svg
      .select(".y-axis")
      .style("transform", `translateX(${margin.left}px)`)
      .style("transform", `translateX(${margin.left}px)`)
      .call(yAxis)

    svg
      .selectAll(".bar")
      .data(props.data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (value, index) => xScale(index))
      .attr("width", xScale.bandwidth())
      .transition()
      .attr("fill", colorScale)
      .attr("y", d => yScale(d))
      .attr("height", d => yScale(0) - yScale(d))
  }, [props.data]);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default Bar;
