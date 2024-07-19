import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, useLayoutEffect } from "react";
import { schemeTableau10 } from "d3-scale-chromatic";
import { scaleLinear, scaleBand, scaleOrdinal } from "@vx/scale";
import { Group } from "@vx/group";
import RacingAxisTop from "./RacingAxisTop";
import RacingBarGroup from "./RacingBarGroup";
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import { dataContinent } from "./util/dataCountry";
import FormControlLabel from '@mui/material/FormControlLabel';

const RacingBarChart = React.forwardRef(({
  numOfBars,
  width,
  height,
  margin,
  keyframes,
  onStart,
  onStop,
}, ref) => {
  const [{ frameIdx, animationKey, playing }, setAnimation] = useState({
    frameIdx: 0,
    animationKey: 0,
    playing: false,
  });
  const [dataRegion, setDataRegio] = useState([])
  const [regionContinent, setRegionContinent] = useState(dataContinent)
  const updateFrameRef = useRef();
  // when replay, increment the key to rerender the chart.
  useEffect(() => {
    if (!updateFrameRef.current) {
      const { date: currentDate, data: frameData } = frame;
      setDataRegio(frameData.slice(0, numOfBars))
      updateFrameRef.current = setTimeout(() => {
        setAnimation(({ frameIdx: prevFrameIdx, playing, ...others }) => {
          const isLastFrame = prevFrameIdx === keyframes.length - 1;
          const nextFrameIdx = isLastFrame ? prevFrameIdx : prevFrameIdx + 1;
          return {
            ...others,
            frameIdx: playing ? nextFrameIdx : prevFrameIdx,
            playing: !!(playing && !isLastFrame),
          }
        });
        updateFrameRef.current = null;
      }, 250);
    }
  });
  const barGroupRef = useRef();
  const axisRef = useRef();
  useImperativeHandle(ref, () => ({
    replay: () => {
      clearTimeout(updateFrameRef.current);
      updateFrameRef.current = null;
      setAnimation(({ animationKey, ...others }) => ({
        ...others,
        frameIdx: 0,
        animationKey: animationKey + 1,
        playing: true,
      }));
    },
    start: () => {
      setAnimation(animation => ({
        ...animation,
        playing: true,
      }));
    },
    stop: () => {
      setAnimation(animation => ({
        ...animation,
        playing: false,
      }));
      barGroupRef.current.stop();
      axisRef.current.stop();
    },
    playing,
  }));
  const prevPlayingRef = useRef(playing);
  useEffect(() => {
    if (prevPlayingRef.current !== playing) {
      if (playing) {
        onStart();
      } else {
        onStop();
      }
    }
    prevPlayingRef.current = playing;
  }, [playing]);
  useLayoutEffect(() => {
    if (barGroupRef.current) {
      if (playing) {
        barGroupRef.current.start();
        axisRef.current.start();
      }
    }
  });
  const frame = keyframes[frameIdx];
  const { date: currentDate, data: frameData } = frame;
  const sumTotalValues = frameData.reduce((a, b) => a + (b['value'] || 0), 0)
  const values = frameData.map(({ value }) => value);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const domainMax = Math.max(...values);
  const xScale = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax]
  });
  const yScale = useMemo(
    () =>
      scaleBand({
        domain: Array(numOfBars)
          .fill(0)
          .map((_, idx) => idx),
        range: [0, yMax]
      }),
    [numOfBars, yMax]
  );
  const nameList = useMemo(
    () => {
      if (keyframes.length === 0) {
        return []
      }
      return keyframes[0].data.map(d => d.name);
    },
    [keyframes]
  );
  const colorScale = useMemo(
    () =>
      scaleOrdinal(schemeTableau10)
        .domain(nameList)
        .range(schemeTableau10),
    [nameList]
  );

  const dateInYear = currentDate.getFullYear();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  const handleChangeCheckbox = (event, name) => {
    console.log('event', event)
    console.log('name', name)
    console.log('checked', event.target.checked)
    const filter = regionContinent.map((item) => {
      if (item.name === name) {
        item.active = event.target.checked
      }
      return item
    })
    setRegionContinent(filter);
  }

  console.log('dataRegion', dataRegion)
  console.log('regionContinent', regionContinent)
  
  return (
    <>
      <Stack direction="row" spacing={2} style={{ marginBottom: "1rem" }}>
        <p style={{ marginTop: '0.5rem' }}>Region:</p> 
        {playing ? (       regionContinent?.map((item) => (
             <FormControlLabel
              label={item.name}
              color={item.color}
              control={<Checkbox value={item.name} checked={item.active} onChange={(event) => handleChangeCheckbox(event, item.name)}/>}
              style={{ color: item.color }}
              sx={{
              color: `${item.color}`,
              '&.Mui-checked': {
                color: `${item.color}`,
                border: `${item.color}`
              },
        }}
            />
          
          ))) : <p style={{ color: "red", marginTop: '0.5rem' }}>Please push PLAY before filter</p>
   
        }
        
    </Stack>
  <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left} key={animationKey}>
        <RacingBarGroup
          frameData={dataRegion.filter((elem) => !regionContinent.find(({ name, active }) => elem.category === name && !active))}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          ref={barGroupRef}
        />
        <text
          textAnchor="end"
          style={{ fontSize: "4.25em" }}
          x={xMax}
          y={500}
        >
          {dateInYear}
        </text>
         <text
          textAnchor="end"
          style={{ fontSize: "2.25em" }}
          x={xMax}
          y={yMax}
        >
         Total: {numberWithCommas(sumTotalValues.toFixed())}
        </text>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={yMax}
          stroke="black"
        />
        <RacingAxisTop
          domainMax={domainMax}
          xMax={xMax}
          ref={axisRef}
        />
      </Group>
      </svg>
    </>
  );
});

RacingBarChart.defaultProps = {
  width: 600,
  height: 450,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 100
  },
};

export default RacingBarChart;
