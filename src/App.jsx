import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { getTimelineData, getScatterData } from "./utils/dummyData"
import regeneratorRuntime from "regenerator-runtime";
import * as d3Collection from 'd3-collection';
import * as d3Selection from 'd3-selection';
import "./styles.css"
import { schemeGreys } from "d3";


const App = () => {
  const [dataTimeView, setDataTimeView] = useState()
  const [dataSumulas,setDataSumulas] = useState()
  const [currentZoomState, setCurrentZoomState] = useState();

  const svgRef = useRef();
  const wrapperRef = useRef();

const listOfMinisters = [...new Set(dataTimeView?.map(item=>item.minister))]
console.log('listOfMinisters0',listOfMinisters)
listOfMinisters.sort();
const selectedMinisters = listOfMinisters

const listOfDocumentTypes = [...new Set(dataTimeView?.map(item => item.doctype))];
listOfDocumentTypes.sort();
const selectedDocTypes = listOfDocumentTypes

console.log('doctype',listOfDocumentTypes)

async function fetchDataSumulas() {
  const response = await fetch('http://localhost:5000/get_sumulasvinc', {
method:"POST"
  }).then(response=>response.json())
  setDataSumulas(response)
}


 async function fetchDataTimeView() {
  const response =  await fetch('http://localhost:5000/get_time_view',{
    method:"POST",
  }).then(response=>response.json());
  setDataTimeView(response)
 }


 let currentZoomScale = 1;

useEffect(()=> {

  let dimensions = {
    elementId: 'timeview',
    sumulasData: dataSumulas,
    data: dataTimeView,
    margin: {
        top: 30,
        right: 40,
        bottom: 40,
        left: 45
    },
    height: 800,
    width: 800,
    xAttr: 'data',
    yAttr: 'sumulavinc',
    sv_implicit: 'sv_implicit',
    expAttr: 'total_explicit',
    impAttr: 'total_implicit',
    ministers: null,
    showImplicit: true,
    showExplicit: true,
    selectedDocTypes: selectedDocTypes,
    selectedMinisters: selectedMinisters,
    allXTicks: allXTicks
  }

  const svg = d3.select(svgRef.current)
  .attr("id", "globalViewChart")
            
            //.attr("preserveAspectRatio", "xMidYMid meet")
           .attr("preserveAspectRatio", "none")  
  .attr("transform",
  "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");
  
  ;
  const svgContent = svg.select(".content");
  
  const allXTicks =  dataTimeView?.map((d)=>{
    return d.data
  })
console.log('allXticks0',allXTicks)



  
  

  if(dataTimeView) {

  const countCitationsSummed = d3Collection.nest()
    .key((d)=> {
      return[dimensions.yAttr]
    })
    .key((d)=> {
      return [dimensions.xAttr]
    })
    .rollup(function(d){
      //return d3.sum(d, function(g) { return g.total_explicit});
      return{
          total_explicit: d3.sum(d, function(g) { return g.total_explicit}),
          total_implicit: d3.sum(d, function(g) { return g.total_implicit})
      }
    
   })
  .entries(dataTimeView);
//  console.log('countCitationsSummed',countCitationsSummed)

  const newData = []
  let i;
  countCitationsSummed.forEach(function (item, index) {
      for(i = 0; i < item.values.length; i++)
          newData.push({"data": item.values[i].key, "sumulavinc": item.key, "total_explicit": item.values[i].value.total_explicit, "total_implicit": item.values[i].value.total_implicit});
  });
  //console.log('newData',newData)

  const allSumulasNumbers = dataSumulas.map((d)=> {
    return d.sumula;
  })

  //console.log('allSumulasNumbers',allSumulasNumbers)

  const allYTicks = [...new Set(dataTimeView?.map((d)=> {
    if(d[dimensions.yAttr] == null || d[dimensions.yAttr] == 'null' || d[dimensions.yAttr] == 'undefined')
    debugger;
return d[dimensions.yAttr];
  }).concat(allSumulasNumbers))].sort((a,b)=> b - a)

  //console.log('allYTicks',allYTicks)

  let allSumulasDate = [...new Set(dataSumulas.map(function (d) {
    return d.publication;
}))];
 
 let newAllXTicks = [...new Set(allXTicks.concat(dataSumulas))].sort();

 //console.log('newAllXTicks',newAllXTicks)
 //console.log('allSumulasDate',allSumulasDate)

 let parseDate = d3.timeParse("%Y-%m")
 let formatTime = d3.timeFormat("%Y-%m")
 let formatTimePT = d3.timeFormat("%m-%Y");

 newAllXTicks = allXTicks.map(function (strDate) {
  let date = parseDate(strDate);
  return date;
}).sort(function (a, b) {
  return new Date(b.date) - new Date(a.date);
});
console.log('allXTicks1', newAllXTicks )

let sizeDomain = d3.extent(dataTimeView,((d)=> {
  if (dimensions.showExplicit && dimensions.showImplicit) {
    return d[dimensions.impAttr] + d[dimensions.expAttr];
  }
    
  else if (dimensionsshowExplicit) {
    return d[expAttr]
  }
  else if (dimensionsshowImplicit) {
    return d[dimensions.impAttr]
  }
}))
console.log('sizeDOmain',sizeDomain)

let xScale = d3.scaleTime()
  .range([0,dimensions.width])
  .domain([newAllXTicks[0]
    .setMonth(newAllXTicks[0]
      .getMonth()-1),newAllXTicks[newAllXTicks.length-1]
       .setMonth(newAllXTicks[newAllXTicks.length-1]
        .getMonth()+1)])


      console.log('yghuhuhi',xScale)
/*
const barRect = svgContent.selectAll(".myBars")
  .data(newAllXTicks)
  .join('rect')
  .attr("width",dimensions.width)
  .attr("height",dimensions.height)
  .style("fill","none")
  .style("pointer-events","all")
  console.log()
*/




            //$("#resetzoom").click(restartXScale);

console.log('aSUDHASUDHUASHUASDHUASHUAS',dimensions.width - dimensions.margin.left - dimensions.margin.right)

  let clip = svgContent.select("defs").select("clipPath")
  .attr("id", "clip")
  .join("rect")
  .attr("width", dimensions.width - dimensions.margin.left - dimensions.margin.right)
  .attr("height",  dimensions.height - dimensions.margin.top - dimensions.margin.bottom)
  .attr("x", 0)


/*
  let chartArea = svg.append('g')
        .attr("clip-path", "url(#clip)")
       
*/
       let chartArea = svgContent.join('g')
          .attr("clip-path", "url(#clip)")
          .attr("width",dimensions.width - dimensions.margin.left - dimensions.margin.right - 300)
          .attr("height",  dimensions.height - dimensions.margin.top - dimensions.margin.bottom - 300)
          .attr("x", 0)
          .attr("y", 0);
        //Axes

  let xAxis = svg.select('.x-axis')
      .join("g")
        .attr("transform", "translate(0," + (dimensions.height - 25) +")")
        .call(
          d3.axisBottom(xScale)
          .ticks(2)
          .tickFormat(d3.timeFormat("%Y-%m")) //Uncomment here to english
          //.tickFormat(formatTimePT) //Uncomment here to portuguese
      );

      xAxis.selectAll("g")
      .attr("idx", function (d, i) {
          return formatTime(d);
      });

      let y = d3.scaleBand()
      .range([dimensions.height, 0])
      .domain(allYTicks)
      .padding(0.01);

      let yAxis = svg.select('.y-axis')
      .join("g")
      .call(d3.axisLeft(y))
      .attr("transform", "translate(40,0)")//magic number, change it at will
      

      yAxis.selectAll("g")
      .attr("idy", function (d, i) {
          return d;
      });

      let xAxisGrid = svg.select('.x-axis-grid')
      .join('g')
      //.attr('class', 'x-axis-grid')
      .attr('transform', 'translate(0,' + dimensions.height + ')')
      .call(
          d3.axisBottom(xScale)
          .tickSize(-dimensions.height)
          .tickFormat('')
          .ticks(6)
      );

      svg.select(".y-axis-title")
      .attr("text-anchor", "middle") 
      .attr("width",22)
      .attr("transform", `translate(${13}, ${dimensions.height/2}) rotate(-90)`) 
      .text("Binding Precedent");  //Uncomment here to english
      //.text("Súmula Vinculante"); //Uncomment here to portuguese

      svg.select(".x-axis-title")
      .attr("text-anchor", "middle") 
      .attr("transform", `translate(${dimensions.width/2}, ${dimensions.height})`) //Uncomment here to english
      .text("Publication Date"); //Uncomment here to english
      //.attr("transform", `translate(${width/2}, ${height+38})`) //Uncomment here to portuguese
      //.text("Data de Publicação");//Uncomment here to portuguese

      //total axis building
      let groupedY = d3Collection.nest()
        .key(function(d) {
          return d[dimensions.yAttr]
        })
        .entries(dataTimeView);


        let yAxisTotal = svg.select(".y-axis-total")
        .join("g")
            .attr('transform', `translate(${dimensions.width - 35},0)`)
            .call(
                d3.axisRight(y)
                .tickSize(0)
                .tickFormat((d, i) => {

                    let item = groupedY.filter(function (groupedYitem) {
                        return groupedYitem.key == d;
                    })[0];

                    let sum = 0;
                    if (item) {
                        sum = item.values.reduce((acc, b) => {

                            let valueToSum = 0;
                            if(dimensions.showExplicit)
                                valueToSum = valueToSum + b[dimensions.expAttr];
                            if (dimensions.showImplicit)
                                valueToSum = valueToSum + b[dimensions.impAttr];
                        
                            return acc + valueToSum
                        }, 0);
                    }

                    return sum.toLocaleString('en-IN');
                })
            );

            yAxisTotal.selectAll('text')
            .style('text-anchor', 'end')
            .attr("y", 0)
            .attr("x", 0)
            .attr("dy", ".35em");

        yAxisTotal.selectAll("g")
            .attr("idy", function (d, i) {
                return d;
            })

      //size channel building

      let size = d3.scaleSqrt()
      .domain(sizeDomain)
      .range([sizeDomain[0], 5]);

      let sizeZoom = d3.scaleSqrt()
      .domain(sizeDomain)
      .range([sizeDomain[0], 0]);


      function computeHeight(d,dimensions)
      {
          if(dimensions.showExplicit && dimensions.showImplicit)
              return size(d[dimensions.impAttr] + d[dimensions.expAttr]);
          else if (dimensions.showExplicit)
          {
              if (d[dimensions.expAttr] != 0)               
                  return size(d[dimensions.expAttr]);
              return 0;
          }
          else if (dimensions.showImplicit)
          {
              if (d[dimensions.impAttr] != 0)               
                  return size(d[dimensions.impAttr]);
              return 0;
          }
      }

      

        //sumulas label X Publication date
        let graphSumulas =chartArea.selectAll()
        .data(dataSumulas, function (d) {
            return d.title;
        })
        .enter()


        //graph building

        let graph = chartArea.selectAll(".myBars")
        .data(dataTimeView, function (d) {
            return d[dimensions.yAttr] + ':' + d[dimensions.xAttr];
        })
        //.enter();

        console.log('graph',graph)

        const barsExist = document.getElementById("bars")
        if(barsExist) {
            return 
        } else {
          graph
          .join("rect")
              .attr("id","bars")
              .attr("class","myBars")
              .attr("x", function (d) { 
                  let leftCorner = xScale(parseDate(d[dimensions.xAttr]));
                  return leftCorner + 1; //to align rect and grid of dates.
              })
              .attr("width", function(d){
                  return 3;
              })
              .attr("height", function (d) {
                  return computeHeight(d, dimensions);
              })
              .attr("y", function(d) {
                  let z =  computeHeight(d, dimensions);
                  return  y(d[dimensions.yAttr]) + y.bandwidth() / 2 - z;
              })
              .attr("class", function (d) {
                  let cls = "";
                  if(dimensions.showExplicit && dimensions.showImplicit)
                  {
                      if(d[dimensions.impAttr] == 0) //there is no implicit citation in this circle
                          cls = "time-view-circle";
                      else if(d[dimensions.expAttr] == 0) //there is no implicit citation in this circle
                          cls = "time-view-circle-with-implicit-citation";
                      else //there are both types of citation
                          cls = "time-view-circle-with-both-implicit-explicit";
                  }
                  else if (dimensions.showExplicit && d[dimensions.expAttr] != 0)
                      cls = "time-view-circle";
                  else if (dimensions.showImplicit && d[dimensions.impAttr] != 0)
                      cls = "time-view-circle-with-implicit-citation";
  
                  return cls;
              })
              .attr("idz", function (d, i) {
                  return `${d[dimensions.yAttr]}_${d[dimensions.xAttr]}`;
              })
              .attr("idx", function (d, i) {
                  return `${d[dimensions.xAttr]}`;
              })
              .attr("idy", function (d, i) {
                  return `${d[dimensions.yAttr]}`;
              }) /*.on("mouseover", function (d, i) {
  
  
                  // Los ticks labels del eje y
                  let selected_tick_axis_y = d3.selectAll(`.tick[idy="${d[dimensions.yAttr]}"]`);
                  selected_tick_axis_y.attr('class', 'tick selected-tick');
  
                  // Los ticks labels del eje x
                  let selected_tick_axis_x = d3.selectAll(`.tick[idx="${d[dimensions.xAttr]}"]`);
                  selected_tick_axis_x.attr('class', 'tick selected-tick');
  
                  // Toda la fila circulos con la misma sumula
                  let selected_circles_by_yAxis = d3.selectAll(`.time-view-circle[idy="${d[dimensions.yAttr]}"]`);
                  selected_circles_by_yAxis.attr('class', 'time-view-circle time-view-circle-selected');
  
                  let selected_circles_both_types_citation_by_yAxis = d3.selectAll(`.time-view-circle-with-both-implicit-explicit[idy="${d[dimensions.yAttr]}"]`);
                  selected_circles_both_types_citation_by_yAxis.attr('class', 'time-view-circle-with-both-implicit-explicit time-view-circle-selected');
  
                  let selected_circles_potential_citation_by_yAxis = d3.selectAll(`.time-view-circle-with-implicit-citation[idy="${d[dimensions.yAttr]}"]`);
                  selected_circles_potential_citation_by_yAxis.attr('class', 'time-view-circle-with-implicit-citation time-view-circle-selected');
  
        
              })
              */
     
        }
        


            var zoom = d3.zoom()
            .scaleExtent([.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
            .extent([
                [0, 0],
                [dimensions.width, dimensions.height]
            ])
            //.on("zoom", updateChart);
            .on("zoom",(event)=> {
              const zoomState = event.transform;
              let newX = event.transform.rescaleX(xScale)

                  
              xAxis.call(d3.axisBottom(newX)?.ticks(12)
              .tickFormat(d3.timeFormat("%Y-%m"))); //Uncomment here to english
              //.tickFormat(formatTimePT)); //Uncomment here to portuguese 
              
              xAxisGrid.call( 
                d3.axisBottom(newX)
                .tickSize(-dimensions.height)
                .tickFormat('')
                .ticks(12)
            );

            let t = event?.transform;
  
              currentZoomScale = t?.k;
  
              chartArea
                  .selectAll("rect").attr("transform", t);
  
              chartArea
                  .selectAll("circle")
                  .attr("cx", function (d) {
                      return newX(parseDate(d[dimensions.xAttr]));
                  })
                  .attr("cy", function (d) {
                      return t.y + t.k* (y(d[dimensions.yAttr]) + y.bandwidth() / 2);
                  })
  
              chartArea
                  .selectAll("path")
                  .attr("transform", function (d) {
                      return d3.zoomIdentity.translate(newX(parseDate(d.publication)) , t.y + t.k* (y(d.sumula) + y.bandwidth() / 2) ).scale(t.k);
                  });
  
              chartArea
                  .selectAll("image")
                  .attr("transform", function (d) {
                      return d3.zoomIdentity.translate(newX(parseDate(d.publication)) - t.k*8 , t.y + t.k* (y(d.sumula) + y.bandwidth() / 2 - 15)).scale(t.k);
                  });
  
              yAxis.attr("transform", d3.zoomIdentity.translate(0, t?.y).scale(t?.k));
              yAxis.selectAll("text")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
              yAxis.selectAll("line")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
  
              yAxisTotal.attr("transform", d3.zoomIdentity.translate(dimensions.width, t.y).scale(t.k));
              yAxisTotal.selectAll("text")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
              yAxisTotal.selectAll("line")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
  
  
                 
              setCurrentZoomState(zoomState)


            })            
            svg.call(zoom)
            //prevent dblclick default and restart scale
            //svg.on("dblclick.zoom", restartXScale);

            function restartXScale() {
              
              svg.transtion()
                .duration(750)
                .call(zoom.transform,d3.zoomIdentity)
            }

/*
            function updateChart() {

              // recover the new scale
              let newX = d3Selection.event.transform.rescaleX(x); //y is defined through scaleBand, which is ordinal, so the this manner (i.e., rescaleY) does not work.
  
              // update axes with these new boundaries
              
              xAxis.call(d3.axisBottom(newX)?.ticks(12)
              .tickFormat(d3.timeFormat("%Y-%m"))); //Uncomment here to english
              //.tickFormat(formatTimePT)); //Uncomment here to portuguese
  
              //update grid lines
              
              xAxisGrid.call(
                  d3.axisBottom(newX)
                  .tickSize(-dimensions.height)
                  .tickFormat('')
                  .ticks(12)
              );
  
              //Redefining y scale
            /*
              let t = d3.event?.transform;
  
              currentZoomScale = t?.k;
  
              chartArea
                  .selectAll("rect").attr("transform", t);
  
              chartArea
                  .selectAll("circle")
                  .attr("cx", function (d) {
                      return newX(parseDate(d[dimensions.xAttr]));
                  })
                  .attr("cy", function (d) {
                      return t.y + t.k* (y(d[dimensions.yAttr]) + y.bandwidth() / 2);
                  })
  
              chartArea
                  .selectAll("path")
                  .attr("transform", function (d) {
                      return d3.zoomIdentity.translate(newX(parseDate(d.publication)) , t.y + t.k* (y(d.sumula) + y.bandwidth() / 2) ).scale(t.k);
                  });
  
              chartArea
                  .selectAll("image")
                  .attr("transform", function (d) {
                      return d3.zoomIdentity.translate(newX(parseDate(d.publication)) - t.k*8 , t.y + t.k* (y(d.sumula) + y.bandwidth() / 2 - 15)).scale(t.k);
                  });
  
              yAxis.attr("transform", d3.zoomIdentity.translate(0, t?.y).scale(t?.k));
              yAxis.selectAll("text")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
              yAxis.selectAll("line")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
  
              yAxisTotal.attr("transform", d3.zoomIdentity.translate(width, t.y).scale(t.k));
              yAxisTotal.selectAll("text")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
              yAxisTotal.selectAll("line")
                  .attr("transform",d3.zoomIdentity.scale(1/t.k));
  
  
              tooltipsPubDate.selectAll('div.tooltip-pub-date')
                  .style('left', function (d) {
                      return `${newX(parseDate(d.publication)) + posCanvas.left + dimensions.margin.left}px`;
                  })
                  .style('top', function (d) {
                      return `${t.y + posCanvas.top + dimensions.margin.top + t.k* (y(d.sumula) + y.bandwidth() / 2)}px`;
                  })
                 
          };
      */


  }
 
},[dataTimeView,currentZoomState])


 useEffect(()=> {
   fetchDataTimeView()
 },[])

  
useEffect(()=> {
  fetchDataSumulas()
},[])

const id = 'ZoomableBarChart'
console.log(dataTimeView)
console.log(dataSumulas)

/*

      */

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem",marginTop:'300px',padding:'20px' }}>
      <div className="flot-chart-content">
    <svg ref={svgRef} width = "800" height= "800">
    <defs>
          <clipPath id={'#clip'}>
            <rect x="0" y="0" width="500" height="500" />
          </clipPath>
        </defs>
   
        <g className="content" >
  
      
      </g>

      <g className="x-axis" />
      <g className="y-axis" />
      <g className="y-axis-total" />
      <g id = {'grid'} className="x-axis-grid"/>
      <text className="y-axis-title"/>
      <text className="x-axis-title"/>
    
    </svg>
    </div>
  </div>
  )
}

export default App

