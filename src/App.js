import React, { useState } from "react";
import RacingBarChart from "./RacingBarChart";
import useKeyframes from "./useKeyframes";
import useWindowSize from "./useWindowSize";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopCircleIcon from '@mui/icons-material/StopCircle';
const dataUrl = "/data/category-brands.csv";
const numOfBars = 12;
const numOfSlice = 10;
const chartMargin = {
  top: 30,
  right: 10,
  bottom: 30,
  left: 10,
};

function App() {
  const { width: windowWidth } = useWindowSize();
  const chartWidth = windowWidth - 64;
  const chartHeight = 600;
  const keyframes = useKeyframes(dataUrl, numOfSlice);
  const chartRef = React.useRef();
  const handleReplay = () => {
    chartRef.current.replay();
  }
  const handleStart = () => {
    chartRef.current.start();
  }
  const handleStop = () => {
    chartRef.current.stop();
  }
  const playing = chartRef.current ? chartRef.current.playing : false;
  const [_, forceUpdate] = useState();
  console.log('keyframes', keyframes)
  return (
    <div style={{ margin: "0 2em" }}>
            <h1>Population growth per country 1950 to 2021</h1>
      
      <div style={{ paddingTop: "1em" , marginBottom: "1rem"}}>
        <Stack direction="row" spacing={2} style={{marginBottom: "1rem"}}>
          <Button variant="outlined" onClick={handleReplay} endIcon={<ReplayCircleFilledIcon />}>
            Try again
          </Button>
          <Button variant="contained" onClick={playing ? handleStop : handleStart}
            endIcon={playing ? <PlayCircleFilledIcon /> : <StopCircleIcon />}
            color={!playing? "success":"error"}
          >
                { playing ? 'Pause' : 'Play' }
          </Button>
        </Stack>
        {keyframes.length > 0 && (
          <RacingBarChart
            keyframes={keyframes}
            numOfBars={numOfBars}
            width={chartWidth}
            height={chartHeight}
            margin={chartMargin}
            onStart={() => forceUpdate(true)}
            onStop={() => forceUpdate(false)}
            ref={chartRef}
          />
        )}
      </div>

    </div>
  );
}

export default App;
