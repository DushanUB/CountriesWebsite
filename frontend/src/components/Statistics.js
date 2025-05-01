import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Paper, Grid, Typography, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Statistics = ({ countries }) => {
  const populationByRegion = countries.reduce((acc, country) => {
    acc[country.region] = (acc[country.region] || 0) + country.population;
    return acc;
  }, {});

  const languageDistribution = countries.reduce((acc, country) => {
    if (country.languages) {
      Object.values(country.languages).forEach(lang => {
        acc[lang] = (acc[lang] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const sortedLanguages = Object.entries(languageDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const pieData = {
    labels: Object.keys(populationByRegion),
    datasets: [{
      data: Object.values(populationByRegion),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2,
      hoverBackgroundColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
      hoverBorderWidth: 3
    }]
  };

  const barData = {
    labels: sortedLanguages.map(([lang]) => lang),
    datasets: [{
      label: 'Number of Countries',
      data: sortedLanguages.map(([,count]) => count),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 0.8)',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
      hoverBorderColor: 'rgba(54, 162, 235, 1)',
      hoverBorderWidth: 3
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            family: "'Roboto', 'Helvetica', 'Arial', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            let value = context.raw;
            if (value > 1000000) {
              value = (value / 1000000).toFixed(1) + 'M';
            } else if (value > 1000) {
              value = (value / 1000).toFixed(1) + 'K';
            }
            return label + value;
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          },
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        mb: 4,
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        Global Statistics
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              align="center"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                fontWeight: 500
              }}
            >
              Population by Region
            </Typography>
            <Box sx={{ height: 350, position: 'relative' }}>
              <Pie data={pieData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              align="center"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                fontWeight: 500
              }}
            >
              Top 10 Languages
            </Typography>
            <Box sx={{ height: 350, position: 'relative' }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Statistics;