import { select } from "d3";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import './LineHooks1.css'

const Line = props => {
  const svgRef = useRef();
  var margin = { top: 20, right: 30, bottom: 30, left: 30 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;

  var bisectDate = d3.bisector(function (d) {
    return d.date;
  }).left;
  var formatValue = d3.format(",");
  var dateFormatter = d3.timeFormat("%m/%d/%y");
  useEffect(() => {
    const data = props.data.map(d => {
      return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value };
    });
    const svg = select(svgRef.current);

    var x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      )
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.value;
        })
      ])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          })
      );

    var focus = svg
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle").attr("r", 5);

    focus
      .append("rect")
      .attr("class", "tooltipBox")
      .attr("width", 100)
      .attr("height", 50)
      .attr("x", 10)
      .attr("y", -22)
      .attr("rx", 4)
      .attr("ry", 4);

    focus
      .append("text")
      .attr("class", "tooltip-date")
      .attr("x", 18)
      .attr("y", -2);

    focus
      .append("text")
      .attr("x", 18)
      .attr("y", 18)
      .text("value:");

    focus
      .append("text")
      .attr("class", "tooltip-likes")
      .attr("x", 60)
      .attr("y", 18);

    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function () {
        focus.style("display", null);
      })
      .on("mouseout", function () {
        focus.style("display", "none");
      })
      .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.attr(
        "transform",
        "translate(" + x(d.date) + "," + y(d.value) + ")"
      );
      focus.select(".tooltip-date").text(
        dateFormatter(d.date));
      focus.select(".tooltip-likes").text(formatValue(d.value));
    }
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
