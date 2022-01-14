import React, {useState} from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3';
import { accessorPropsType, callAccessor } from "./utils";
import Tooltip from './Tooltip'

const Bars = ({ 
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  
   ...props }) => {
     
  const [hoveredBar,setHoveredBar] = useState('null')


  const xScale = props.xScale
  const yScale = props.yScale


  function onMouseEnter() {
    setHoveredBar()
    console.log('passou aqui')
    
/*
    const x = xScale(d.x0)
  + (xScale(d.x1) - xScale(d.x0)) / 2
  + dimensions.margin.left
    const y = yScale(yAccessor(d))
  + dimensions.margin.top

   tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)
      */

    
  
  }
  
  function onMouseLeave (e,d) {
    
  }

  console.log('hovered',hoveredBar)

  return (
    <React.Fragment>
    {data.map((d, i) => (
      <rect {...props}
        className="Bars__rect"
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={d3.max([callAccessor(widthAccessor, d, i), 0])}
        height={d3.max([callAccessor(heightAccessor, d, i), 0])}
        onMouseEnter={()=> setHoveredBar(d)}
      />
    ))}
  </React.Fragment>
  )

}



Bars.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
}

Bars.defaultProps = {
}

export default Bars

