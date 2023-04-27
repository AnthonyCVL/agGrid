import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from "chartjs-plugin-datalabels";


function Chart(props) {

    const getChartDataBar = (chart) => {
        chart.p_arrayGroup = groupBy(chart.p_data, chart.p_categoria, chart.p_valor)
        let dataDisplay = chart.p_limite === null || chart.p_limite === 0 ? chart.p_arrayGroup : chart.p_arrayGroup.slice(0, chart.p_limite)
        return ({
            labels: dataDisplay.map(item => item[chart.p_categoria]),
            datasets: [
                {
                    label: chart.p_categoria,
                    data: dataDisplay.map(item => item[chart.p_valor]),
                    backgroundColor: getRandomColor()
                }
            ],
        })
    }

    const getChartDataPie = (chart) => {
        let limite = chart.p_limite === null ? 0 : chart.p_limite
        console.log('getChartDataPie')
        console.log(chart.p_limite)
        chart.p_arrayGroup = groupBy(chart.p_data, chart.p_categoria, chart.p_valor)
        let sum = chart.p_arrayGroup.reduce((a, b) => a + b[chart.p_valor], 0)
        console.log('chart.p_arrayGroup')
        console.log(chart.p_arrayGroup)
        console.log(chart.p_valor)
        let arrayPercentage = chart.p_arrayGroup.map(item => {
            item.percentage = item[chart.p_valor] / sum
            return item
        })
        console.log('arrayPercentage')
        console.log(arrayPercentage)
        let arrayDisplay = arrayPercentage.filter(item => item.percentage>=chart.p_limite/100).map(item => item)
        console.log('arrayDisplay')
        console.log(arrayDisplay)
        console.log('arrayPercentage')
        console.log(arrayPercentage)
        let others = arrayPercentage.reduce((a, b) => a + (b['percentage']*100 < chart.p_limite ? b['percentage']  : 0), 0)
        console.log(others)
        let dataDisplay = arrayDisplay.map(item => item.percentage)
        let labelDisplay = arrayDisplay.map(item => item[chart.p_categoria])
        dataDisplay.push(others)
        labelDisplay.push('Otros')
        console.log('dataDisplay')
        console.log(dataDisplay)
        console.log('labelDisplay')
        console.log(labelDisplay)
        return ({
            labels: labelDisplay,
            datasets: [
                {
                    label: chart.p_categoria,
                    data: dataDisplay,
                    backgroundColor: chart.p_arrayGroup.map(item => getRandomColor())
                }
            ],
        })
    }

    const groupBy = (data, category, values) => {
        console.log('groupBy')
        console.log(category)
        const resultArr = [];
        const groupByLocation = data.reduce(getReducer(category, values), {});
        // Finally calculating the sum based on the location array we have.
        Object.keys(groupByLocation).forEach((item) => {
            groupByLocation[item] = groupByLocation[item].reduce((a, b) => a + b);
            const array = []
            array[category] = item
            array[values] = groupByLocation[item]
            resultArr.push(array)
        })
        //resultArr.sort((a, b) => b[values] - a[values]);
        resultArr.sort((a, b) => a[category].localeCompare(b[category]))
        return resultArr
    }

    function getReducer(category, values) {
        // Child function (reducer)
        function reducer(group, item) {
            const cat = item[category];
            group[cat] = group[cat] ?? [];
            group[cat].push(parseFloat(values == "contar" ? 1 : item[values]));
            return group;
        }
        return reducer
    }

    const getRandomColor = () => {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    const getChartTitle = (title, category, value) => {
        return title === '' || title === undefined
            ? category + (value === 'contar'
                ? ''
                : ' vs ' + value)
            : title
    }
    const formatDatalabel = (value) => {
        return value < 1000 ? value : Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const formatDatalabelPercentage = (value) => {
        return (value * 100).toFixed(0) + '%'
    }

    const buildChartBar = (chartData) => {
        return (
            <Bar
                options={{
                    resposive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: getChartTitle(chartData.p_titulo, chartData.p_categoria, chartData.p_valor),
                        },
                        datalabels: {
                            display: true,
                            color: "black",
                            formatter: formatDatalabel,
                            anchor: "end",
                            offset: -20,
                            align: "start"
                        }
                    },
                }}
                data={getChartDataBar(chartData)}
            />
        )
    }

    const buildChartPie = (chartData) => {
        return (
            <Pie
                options={{
                    resposive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: getChartTitle(chartData.p_titulo, chartData.p_categoria, chartData.p_valor),
                        },
                        datalabels: {
                            color: "black",
                            formatter: formatDatalabelPercentage,
                        },
                        labels: {
                            render: 'percentage'
                        }
                    },
                }}
                data={getChartDataPie(chartData)}
            />
        )
    }

    const getChart = () => {
        if (props.type === 'Bar') {
            return buildChartBar(props.chartData)
        }
        if (props.type === 'Pie') {
            return buildChartPie(props.chartData)
        }
    }

    return (
        getChart()
    );
}

export default Chart;