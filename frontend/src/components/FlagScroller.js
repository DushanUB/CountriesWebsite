import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { getAllCountries } from '../services/api';

const FlagScroller = () => {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    const fetchFlags = async () => {
      const countries = await getAllCountries();
      setFlags(countries.map(country => ({
        flag: country.flags.png,
        name: country.name.common
      })));
    };
    fetchFlags();
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0, // Changed from right to left
        top: 64, // Height of AppBar
        bottom: 0,
        width: '170px', // Doubled from 80px to 160px
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)', // Changed from borderLeft to borderRight
        overflowY: 'hidden',
        zIndex: 1000,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
          zIndex: 1
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          animation: 'scrollFlags 120s linear infinite', // Changed from 60s to 120s for slower animation
          '@keyframes scrollFlags': {
            '0%': {
              transform: 'translateY(0)'
            },
            '100%': {
              transform: 'translateY(-50%)'
            }
          }
        }}
      >
        {/* Double the flags array to create seamless loop */}
        {[...flags, ...flags].map((flag, index) => (
          <Box
            key={index}
            sx={{
              width: '160px',
              height: '120px',
              padding: '12px',
              img: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px', // Added border radius
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.1)', // Added subtle border
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }
            }}
          >
            <img src={flag.flag} alt={flag.name} title={flag.name} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FlagScroller;