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

  // Sort languages by frequency and get top 10
  const sortedLanguages = Object.entries(languageDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const pieData = {
    labels: Object.keys(populationByRegion),
    datasets: [{
      data: Object.values(populationByRegion),
      backgroundColor: [
        '#2196F3',  // Blue
        '#4CAF50',  // Green
        '#FFC107',  // Amber
        '#F44336',  // Red
        '#9C27B0',  // Purple
        '#FF9800'   // Orange
      ],
      borderColor: 'white',
      borderWidth: 2
    }]
  };

  const barData = {
    labels: sortedLanguages.map(([lang]) => lang),
    datasets: [{
      label: 'Number of Countries',
      data: sortedLanguages.map(([,count]) => count),
      backgroundColor: '#2196F3',
      borderColor: '#1976D2',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Global Statistics
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Population by Region
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={pieData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Top 10 Languages
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Statistics;