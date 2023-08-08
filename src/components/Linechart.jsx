import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ProductionCostService from '../services/ProductionCostService';

const BarChart = () => {
    /*const [chartData, setChartData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await ProductionCostService.getProductionCosts();

            if (response.data && Array.isArray(response.data)) {
                const data = response.data;
                const dates = data.map(entry => entry.date);
                const costs = data.map(entry => entry.cost);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Production Cost',
                            data: costs,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } else {
                console.log('Invalid response from API');
            }
        } catch (error) {
            console.log(error);
        }
    };*/

    /*useEffect(() => {
        Chart.register(BarController, LinearScale, CategoryScale, Tooltip, Legend);
    }, []);*/

   /* const option = {
        responsive: true,
        plugins: {
            legend: { position: "chartArea" },
            title: {
                display: true,
                text: "Modular Bar Chart",
            },
        },
    };

    const data = {
            labels=["Jan", "Feb", "Mar", "Apr", "May", "Jun"];,
        datasets: [
            {
                label: "Product A",
                data: [ 20, 30, 40, 50, 60,70],
                backgroundColor: "green",
            },
            {
                label:'Product B',
                data:[15,20,25,40,45,60],
                backgroundColor:'blue'
            },

        ],

        };*/


    return (
        <div>
            {/*<Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />*/}
        </div>
    );
};

export default BarChart;
