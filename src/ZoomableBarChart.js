import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisBottom,
  axisLeft,
  zoom,
} from "d3";

import * as d3 from 'd3'
import useResizeObserver from "./useResizeObserver";
import { accessorPropsType, callAccessor } from "./Chart/utils";
import Axis from "./Chart/Axis"
import { useChartDimensions} from './Chart/utils';

function ZoomableBarChart({ data, id = "ZoomableBarChart",xAccessor }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();


  const metricAccessor = d => d.humidity
  const yAccessor = d => d.length

      // 2. Create chart dimensions

  let dimensions1 = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions1.boundedWidth = width
    - dimensions1.margin.left
    - dimensions1.margin.right
  dimensions1.boundedHeight = height
    - dimensions1.margin.top
    - dimensions1.margin.bottom

  // 3. Draw canvas
  /*
  const wrapper = d3.select("#wrapper")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

const bounds = wrapper.append("g")
    .style("transform", `translate(${
      dimensions1.margin.left
    }px, ${
      dimensions1.margin.top
    }px)`)
    */

      // 4. Create scales

  const xScale = d3.scaleLinear()
  .domain(d3.extent(data, metricAccessor))
  .range([0, dimensions1.boundedWidth])
  .nice()


  if (currentZoomState) {
    const newXScale = currentZoomState.rescaleX(xScale);
    xScale.domain(newXScale.domain());
  }

const binsGenerator = d3.bin()
  .domain(xScale.domain())
  .value(metricAccessor)
  .thresholds(12)

const bins = binsGenerator(data)

const yScale = d3.scaleLinear()
  .domain([0, d3.max(bins, yAccessor)])
  .range([dimensions1.boundedHeight, 0])
  .nice()

  // 5. Draw data

  //const binsGroup = svgContent.append("g")

  const binGroups = svgContent.selectAll("g")
    .data(bins)
    .join("g")

  const barPadding = 1

  

  const barRects = svgContent.selectAll(".myBars")
    .data(bins)
    .join("rect")
        .attr("class","myBars")
        .attr("x", d => xScale(d.x0) + barPadding / 2)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", d => d3.max([
          0,
          xScale(d.x1) - xScale(d.x0) - barPadding
        ]))
        .attr("height", d => dimensions1.boundedHeight
          - yScale(yAccessor(d))
        )
        .filter(yAccessor)
        .join("text")
        .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr("y", d => yScale(yAccessor(d)) - 5)
        .text(yAccessor)
        .style("text-anchor", "middle")
        .attr("fill", "darkgrey")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
/*
  const barText = binGroups.filter(yAccessor)
    .selectAll(".myBars")
    .join("text")
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")

/*
  const mean = d3.mean(data, metricAccessor)
  const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions1.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px")

  const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")
      .attr("fill", "maroon")
      .style("font-size", "12px")
      .style("text-anchor", "middle")


*/


//axes
const xAxis = axisBottom(xScale);
svg
  .select(".x-axis")
  .attr("transform", `translate(0, ${height - 60})`)
  .call(xAxis)
/*

  const xAxisLabel = svg.select(".x-axis").append("text")
      .attr("x",width / 2)
      .attr("y", width - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Humidity")
      .style("text-transform", "capitalize")
*/

  const yAxis = axisLeft(yScale);
/*
  svg.select(".y-axis")
  .call(yAxis.tickFormat(function(d){
    return d
  }));
*/
   svg.select(".y-axis")
   .attr("transform", "translate(30,0)")//magic number, change it at will
   .call(yAxis)
 
   
      //zoom

      const zoomBehavior = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);

  }, [ currentZoomState,data,dimensions]);


  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem",marginTop:'300px',padding:'20px' }}>
      <svg ref={svgRef} width = "1100" height= "400">
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width="100%" height="100%" />
          </clipPath>
        </defs>

     
        <g className="content" clipPath={`url(#${id})`}>
       
  
        </g>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default ZoomableBarChart;