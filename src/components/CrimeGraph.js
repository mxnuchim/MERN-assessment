import axios from 'axios';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const CrimeGraph = () => {
  const [crimeData, setCrimeData] = useState();
  const [loading, setLoading] = useState();

  const fetchData = async () => {
    setLoading(true);

    const { data } = await axios.get(
      'https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv'
    );
    console.log(data.data);

    setCrimeData(data.data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  // Extract and structure data for the line chart
  const years = crimeData && crimeData.map((entry) => entry.data_year);
  const burglaryData = crimeData && crimeData.map((entry) => entry.Burglary);

  // Create the line chart data object
  const lineChartData = {
    labels: years,
    datasets: [
      {
        label: 'Burglary',
        fill: false,
        borderColor: '#1463FF',
        borderWidth: 2,
        data: burglaryData,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Arrests',
        },
      },
      x: {
        grid: {
          display: false, // Disable X-axis grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Burglary',
        align: 'start',
      },
    },
  };

  return (
    <div className="flex items-center justify-center h-screen w-full p-4">
      {loading ? (
        <span>Loading data...</span>
      ) : (
        <Line data={lineChartData} options={chartOptions} />
      )}
    </div>
  );
};

export default CrimeGraph;
