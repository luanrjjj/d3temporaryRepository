import React from "react"

 const Tooltip = ({data}) => {
    console.log('asduhasudhuasasu',data)
    
    return (
        <div className="Tooltip" >
          <h1>{data.temperature}</h1>
        </div>
      )
}

export default Tooltip;