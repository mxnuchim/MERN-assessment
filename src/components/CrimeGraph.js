import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const CrimeGraph = () => {
  const [crimeData, setCrimeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartReady, setChartReady] = useState(false);

  const targetRef = useRef();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data } = await axios.get(
        'https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv'
      );
      console.log('data --> ', data.data);

      setCrimeData(data.data);
      setChartReady(true);
      setLoading(false);
    };

    fetchData();
  }, []);

  const options = {
    // default is `save`
    method: 'open',
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: 'letter',
      // default is 'portrait'
      orientation: 'landscape',
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: 'image/png',
      qualityRatio: 1,
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true,
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true,
      },
    },
  };

  // React.useEffect(() => {
  //   // Generate PDF when chartReady is true and data is available
  //   if (chartReady && crimeData.length > 0) {
  //     generatePDF(targetRef, options);
  //   }
  // }, [chartReady, crimeData]);

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
    <div className="flex items-center justify-center h-screen w-full">
      {loading ? (
        <span>Loading data...</span>
      ) : (
        <div className="w-full p-3 md:p-10" ref={targetRef}>
          <Line data={lineChartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default CrimeGraph;
