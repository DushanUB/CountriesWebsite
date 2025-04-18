import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

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

  const pieData = {
    labels: Object.keys(populationByRegion),
    datasets: [{
      data: Object.values(populationByRegion),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
  };

  const barData = {
    labels: Object.keys(languageDistribution).slice(0, 10),
    datasets: [{
      label: 'Number of Countries',
      data: Object.values(languageDistribution).slice(0, 10),
      backgroundColor: '#36A2EB'
    }]
  };

  return (
    <div className="statistics-container my-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Population by Region</h5>
            </div>
            <div className="card-body">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Top 10 Languages</h5>
            </div>
            <div className="card-body">
              <Bar data={barData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;