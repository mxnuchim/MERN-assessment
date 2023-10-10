import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import { Chart as ChartJS, registerables } from 'chart.js';
import { images } from '../assets';

const { location } = images;

ChartJS.register(...registerables);

const CrimeGraph = () => {
  const [crimeData, setCrimeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartReady, setChartReady] = useState(false);

  const targetRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data } = await axios.get(
        'https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv'
      );
      // console.log('data --> ', data);

      setCrimeData(data.data);
      setChartReady(true);
      setLoading(false);
    };

    fetchData();
  }, []);

  const options = {
    method: 'open',
    filename: 'crime_graph.pdf',
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.SMALL,
      format: 'letter',
      orientation: 'landscape',
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };

  useEffect(() => {
    // Generate PDF with a 2-second delay when chartReady is true and data is available
    if (chartReady && crimeData.length > 0) {
      setTimeout(() => {
        generatePDF(targetRef, options);
      }, 500);
    }
  }, [chartReady, crimeData]);

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
        display: false,
        text: 'Burglary',
        align: 'start',
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-full">
      {loading ? (
        <span className="my-[30%]">Loading data...</span>
      ) : (
        <div className="w-full p-3 md:p-5 flex flex-col gap-5" ref={targetRef}>
          <div className="flex items-center">
            <div className="flex gap-2 items-center justify-cente mr-4">
              <img src={location} alt="" className="w-6" />
              <span className="">Crime</span>
            </div>
            <GradientLine />
          </div>
          <div className="bg-gray-100 rounded-2xl w-full items-center ">
            <div className="rounded-t-2xl bg-blue-100 w-full flex items-center">
              <span className="text-blue-600 py-3 font-semibold text-sm pl-5">
                Burglary
              </span>
            </div>
            <div className="rounded-2xl bg-white my-10 mx-12 p-10">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          <div className="w-full gap-3">
            <GradientLine />
            <div className="w-full flex items-center justify-between">
              <span className="font-bold text-sm text-blue-600">
                Report Generated on {new Date().toDateString()}
              </span>
              <span className="font-bold text-sm text-black">
                RealAssist Property Report | Page 1 of 25
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrimeGraph;

const GradientLine = () => (
  <div className="h-[4px] w-full bg-gradient-to-r from-blue-600 to-blue-300"></div>
);
