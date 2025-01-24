import * as React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CoinImage from '@/public/image/GameCoin.svg?url';

// Styled component for the Slider
const PrettoSlider = styled(Slider)(({ disabled }) => ({
  marginTop: 10,
  color: '#FFCA28',
  width: 200,
  height: 20,
  '& .MuiSlider-track': {
    border: '2px solid black',
  },
  '& .MuiSlider-thumb': {
    height: 40, // Adjusted the height and width for a better thumb size
    width: 40,
    backgroundImage: `url(https://cryptologos.cc/logos/bitcoin-btc-logo.png)`,
    backgroundSize: 'cover', // Make sure the logo is contained properly within the thumb
    backgroundPosition: 'center',
    border: '2px solid black', // Optional: You can leave it or remove it for a cleaner look
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none', // Hide the default thumb outline
    },
  },
  // Apply `pointer-events: none` when disabled
  ...(disabled && {
    pointerEvents: 'none',
    opacity: 0.5, // Optional: Make it visually look disabled
  }),
}));

export default function CustomizedSlider({ gamePhase }) {
  const [sliderValue, setSliderValue] = React.useState(20);

  const handleSliderChange = (event, newValue) => {
    if (gamePhase !== "drawPhase" ) {
      setSliderValue(newValue);
    }
  };

  return (
    <Box>
      <PrettoSlider
        valueLabelDisplay="auto"
        aria-label="bitcoin slider"
        value={sliderValue}
        onChange={handleSliderChange}
        disabled={gamePhase === "drawPhase" || gamePhase === "results" } // Disable when the game phase is "drawCards"
      />
    </Box>
  );
}
