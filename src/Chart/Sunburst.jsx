import React, {useEffect, useState,useRef} from 'react';
import * as d3 from 'd3'
import data from '../../flare-2.json'

const Sunburst = () => {
  const svgRef = useRef(null);
  const [viewBox, setViewBox] = useState("0,0,0,0");
  const [rootTest,setRootTest] = useState()

    const width = 1200


    const getAutoBox = () => {
      if (!svgRef.current) {
        return "";
      }
    }

    let dimensions = {
        width: window.innerWidth * 0.9,
        height: 1200,
        margin: {
          top: 15,
          right: 15,
          bottom: 40,
          left: 60,
        },
      }


      const hierarquia = d3.hierarchy(data).sum(d=>d.value).sort((a,b)=> b.value - a.value)
      const partição = d3.partition().size([2*Math.PI, root.height +1])(hierarquia)

      setRootTest(partição)
      //console.log(hierarquia,'hierarquia')
      console.log('partião',partição)

      const partition = data => {
        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);


        return d3.partition()
            .size([2 * Math.PI, root.height + 1])
          (root);
      }

    setRootTest(partition(data)) 

      useEffect(()=> {

        const radius = width / 6
        const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
        const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
        const format = d3.format(",d")
      },[])

      useEffect(() => {
        setViewBox(getAutoBox());
      }, []);


      const getColor = (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      };
    
      const getTextTransform = (d) => {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      };
  
return (
  <svg width={width} height={dimensions.height} viewBox={viewBox} ref={svgRef} >
       <g fillOpacity={0.6}>
        {rootTest
          .descendants()
          .filter((d) => d.depth)
          .map((d, i) => (
            <path key={`${d.data.name}-${i}`} fill={getColor(d)} d={arc(d)}>
              <text>
                {d
                  .ancestors()
                  .map((d) => d.data.name)
                  .reverse()
                  .join("/")}
                \n${format(d.value)}
              </text>
            </path>
          ))}
      </g>
      <g
        pointerEvents="none"
        textAnchor="middle"
        fontSize={10}
        fontFamily="sans-serif"
      >
        {rootTest
          .descendants()
          .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
          .map((d, i) => (
            <text
              key={`${d.data.name}-${i}`}
              transform={getTextTransform(d)}
              dy="0.35em"
            >
              {d.data.name}
            </text>
          ))}
      </g>
  </svg>
)

}

export default Sunburst