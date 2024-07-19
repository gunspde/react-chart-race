import React, { useEffect } from "react";
import { Bar as VxBar } from "@vx/shape";
import { Text as VxText } from "@vx/text";
import { useState } from "react/cjs/react.production.min";

const Bar = ({ color, x, y, width, height, name, value }) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  const text = `${name} ${numberWithCommas(value)}`;
  
  const customColor = color === '#4e79a7' && '#DDA0DD' || color === '#f28e2c' && '#D8BFD8'
                    || color === '#e15759' && '#F0E68C' || color === '#76b7b2' && '#9370DB'
                    || color === '#59a14f' && '#DDA0DD' || color === '#edc949' && '#D8BFD8'
                    || color === '#af7aa1' && '#F0E68C' || color === '#9c755f' && '#9370DB'
                    || color === '#bab0ab' && '#DDA0DD' || '#DDA0DD'
  
  return (
    <React.Fragment>
      <VxBar
        x={x}
        y={y}
        width={width}
        height={height}
        fill={customColor}
        style={{ opacity: 0.8 }}
      />
      <VxText x={x + 10} y={y + height / 2}>
        {text}
      </VxText>
    </React.Fragment>
  );
};

export default Bar;
