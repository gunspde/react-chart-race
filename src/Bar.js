import React, { useEffect } from "react";
import { Bar as VxBar } from "@vx/shape";
import { Text as VxText } from "@vx/text";
import { useState } from "react/cjs/react.production.min";

const Bar = ({ color, x, y, width, height, name, value }) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const text = `${name} ${numberWithCommas(value)}`;
  const customColor = name === 'Bangladesh 🇧🇩' && '#483D8B'
    || name === 'Brazil 🇧🇷' && '#DAA520'
    || name === 'China 🇨🇳' && '#483D8B'
    || name === 'France 🇫🇷' && '#9370DB'
    || name === 'Germany 🇩🇪' && '#9370DB'
    || name === 'India 🇮🇳' && '#483D8B'
    || name === 'Indonesia 🇮🇩' && '#483D8B'
    || name === 'Italy 🇮🇹' && '#9370DB'
    || name === 'Japan 🇯🇵' && '#483D8B'
    || name === 'Russia 🇷🇺' && '#9370DB'
    || name === 'United Kingdom 🇬🇧' && '#9370DB'
    || name === 'United States 🇺🇸' && '#9370DB'
  
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
