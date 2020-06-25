// import * as d3 from "d3";
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3'
import { line, curveCardinal } from "d3";

const Line = props => {
  // const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75]);
  const svgRef = useRef();
  var margin = { top: 20, right: 30, bottom: 30, left: 30 }
  const width = props.width - margin.left - margin.right
  const height = props.height - margin.top - margin.bottom
  // will be called initially and on every data change
  useEffect(() => {
    const { data } = props

    const svg = select(svgRef.current);
    const myLine = d3.line()
      .x((value) => value)
      .y(value => value)
      .curve(curveCardinal);

    svg
      .selectAll("path")
      .data([props.data])
      .join("path")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    var x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d)])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d)])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

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
        />
      </svg>
    </React.Fragment>
  );
};

export default Line;
