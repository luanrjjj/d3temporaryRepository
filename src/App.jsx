import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { getTimelineData, getScatterData } from "./utils/dummyData"
import regeneratorRuntime from "regenerator-runtime";
import * as d3Collection from 'd3-collection';


const App = () => {
  const [dataTimeView, setDataTimeView] = useState()
  const [dataSumulas,setDataSumulas] = useState()

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


useEffect(()=> {
  const svg = d3.select(svgRef.current);
  const svgContent = svg.select(".content");
  
  const allXTicks =  dataTimeView?.map((d)=>{
    return d.data
  })
console.log('allXticks0',allXTicks)



  
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
    height: 500,
    width: 500,
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
  console.log('countCitationsSummed',countCitationsSummed)

  const newData = []
  let i;
  countCitationsSummed.forEach(function (item, index) {
      for(i = 0; i < item.values.length; i++)
          newData.push({"data": item.values[i].key, "sumulavinc": item.key, "total_explicit": item.values[i].value.total_explicit, "total_implicit": item.values[i].value.total_implicit});
  });
  console.log('newData',newData)

  const allSumulasNumbers = dataSumulas.map((d)=> {
    return d.sumula;
  })

  console.log('allSumulasNumbers',allSumulasNumbers)

  const allYTicks = [...new Set(dataTimeView?.map((d)=> {
    if(d[dimensions.yAttr] == null || d[dimensions.yAttr] == 'null' || d[dimensions.yAttr] == 'undefined')
    debugger;
return d[dimensions.yAttr];
  }).concat(allSumulasNumbers))].sort((a,b)=> b - a)

  console.log('allYTicks',allYTicks)

  let allSumulasDate = [...new Set(dataSumulas.map(function (d) {
    return d.publication;
}))];
 
 const newAllXTicks = [...new Set(allXTicks.concat(dataSumulas))].sort();

 console.log('newAllXTicks',newAllXTicks)
 
console.log('allSumulasDate',allSumulasDate)


  }




const barRect = svgContent.selectAll(".myBars")
  .join('rect')
  .attr("width",dimensions.width)
  .attr("height",dimensions.height)
  .style("fill","none")
  .style("pointer-events","all")
  console.log()
},[dataTimeView])


 useEffect(()=> {
   fetchDataTimeView()
 },[])

  
useEffect(()=> {
  fetchDataSumulas()
},[])

const id = 'ZoomableBarChart'
console.log(dataTimeView)
console.log(dataSumulas)

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
  )
}

export default App

