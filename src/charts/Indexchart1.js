import * as d3 from "d3";
import { select, axisBottom } from "d3";
import React, { useRef, useEffect,useState } from "react";
const parseDate = d3.utcParse("%Y-%m-%d")
// const formatDate = d3.utcFormat("%B, %Y")
const IndexChart = props => {
  const svgRef = useRef();
  const margin = { top: 20, right: 30, bottom: 30, left: 30 };
  const width = props.width - margin.left - margin.right;
  const height = props.height - margin.top - margin.bottom;
  const [data, setData] = useState(props.data);

//   useEffect(()=>{
//     async function getData(){
//       const data = d3.merge(Promise.all([
//           d3.csv("./AAPL.csv"),
//           d3.csv("./AMZN.csv"), 
//           d3.csv("./GOOG.csv"),
//           d3.csv("./IBM.csv"), 
//           d3.csv("./MSFT.csv")
//         ])
//       .then((fileo)=>{
//         return fileo.map(fileo => {
//           return fileo.map(d => {
//             const date = parseDate(d["Date"]);
//             // return {name: fileo.name.slice(0, -4), date, value: +d["Close"]};
//             return {name: 'vikas', date, value: +d["Close"]};
//           })
//         })
//       })
//       )
//       debugger
//       console.log(data)
//       setData(data)
//     }
    
//     getData()
// },[])
  // will be called initially and on every data change
  useEffect(() => {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });
    const svg = select(svgRef.current);
    svg.on("mousemove touchmove", moved);

    var group = d3
      .nest()
      .key(function(d) {
        return d.name;
      })
      .entries(data);

    const k = d3.max(group, item => {
      const group = item["values"];
      return d3.max(group, d => d.value) / d3.min(group, d => d.value);
    });

    const bisect = d3.bisector(d => d.date).left;
    const z = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(data.map(d => d.name));

    const rule = svg
      .append("g")
      .append("line")
      .attr("y1", height)
      .attr("y2", 0)
      .attr("stroke", "black");

    const series = d3
      .nest()
      .key(function(d) {
        return d.name;
      })
      .entries(data)
      .map(item => {
        debugger;
        const { key, values } = item;
        const v = values[0].value;
        return {
          key,
          values: values.map(itemo => {
            const { date, value } = itemo;
            return { date, value: value / v };
          })
        };
      });

    const serie = svg
      .append("g")
      .style("font", "bold 10px sans-serif")
      .selectAll("g")
      .data(series)
      .join("g");

    const x = d3
      .scaleUtc()
      .domain(d3.extent(data, d =>{ 
        debugger
        return d.date
      }))
      .range([margin.left, width - margin.right])
      .clamp(true);

    const y = d3
      .scaleLog()
      .domain([1 / k, k])
      .rangeRound([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    serie
      .append("path")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke", d =>{
        debugger
         return z(d.key)})
      .attr("d", d =>{ 
        debugger
        return line(d.values)});

    serie
      .append("text")
      .datum(d => ({ key: d.key, value: d.values[d.values.length - 1].value }))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("x", x.range()[1] + 3)
      .attr("y", d => y(d.value))
      .attr("dy", "0.35em")
      .text(d => d.key)
      .clone(true)
      .attr("fill", d => z(d.key))
      .attr("stroke", null);

    // d3.transition().

    function update(date) {
      date = d3.utcDay.round(date);
      rule.attr("transform", `translate(${x(date) + 0.5},0)`);
      serie.attr("transform", ({ values }) => {
        const i = bisect(values, date, 0, values.length - 1);
        return `translate(0,${y(1) - y(values[i].value / values[0].value)})`;
      });
      svg.property("value", date).dispatch("input");
    }

    function moved() {
      update(x.invert(d3.mouse(this)[0]));
      d3.event.preventDefault();
    }

    update(x.domain()[0]);

  
    const xAxis = axisBottom(x)
      .ticks(width / 80)
      .tickSizeOuter(0);

   svg
     .append("g")
     .attr("transform", "translate(0," + height + ")")
    //  .attr("transform", `translate(0,${height - margin.bottom})`)
     .call(xAxis)
    .call(g => g.select(".domain").remove())

    // const xAxis = axisBottom(x)
    // .ticks(props.data.length) 
    // // .tickSizeOuter(0);

    // svg
    //   .select(".x-axis")
    //   .style("transform", `translateY(${height-margin.bottom}px)`)
    //   .call(xAxis);

    

    // svg.select(".domain").remove()
    

    const yAxis = d3.axisLeft(y)
    .ticks(null, x => +x.toFixed(6) + "×")

    svg.selectAll(".tick line").clone() 
    .attr("stroke-opacity", d => d === 1 ? null : 0.2)
    .attr("x2", width - margin.left - margin.right)

    // svg.select(".domain").remove()

    svg.select(".y-axis")
      .style("transform", `translate(${margin.left},0)`)
      .call(yAxis)
    .call((g)=>g.select(".domain").remove())

     }, [props.data]);

  return (
    <React.Fragment>
      
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <g ref={svgRef} 
          transform={`translate(${margin.left}, ${margin.top})`}>
          <g className="x-axis" />
          <g className="y-axis" />
        </g>
      </svg>
    </React.Fragment>
  );
};

export default IndexChart;
