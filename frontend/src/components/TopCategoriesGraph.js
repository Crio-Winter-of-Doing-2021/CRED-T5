import React, { useEffect, useRef } from "react";
import Chartjs from "chart.js";

const Chart = ({ categories }) => {
    const categoryLabels = categories.map(category => {
        return category.category;
    });
    const categoryData = categories.map(category => {
        return category.count;
    });
    const chartContainer = useRef(null);
    useEffect(() => {
        const chartConfig = {
            type: "pie",
            data: {
                labels: categoryLabels,
                datasets: [
                    {
                        label: "# of transcations of each category",
                        data: categoryData,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(254, 1, 205, 0.2)"
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                            "rgba(254, 1, 205, 1)"
                        ],
                        borderWidth: 1
                    }
                ]
            }
        };
        if (chartContainer && chartContainer.current) {
            // eslint-disable-next-line
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            // console.log(newChartInstance);
        }
    }, [chartContainer,categoryData,categoryLabels]);
    return (
        <div>
            <canvas ref={chartContainer} />
        </div>
    );
};

export default Chart;
