document.addEventListener('DOMContentLoaded', function () {

    let tableBody = document.querySelector('#tbody');

    let dataButtons = document.querySelectorAll('button[data-btn]');

    dataButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            fetchDataForLineChart(e.currentTarget.dataset.btn);
        })
    });

    fetchDataForLineChart("5");
    fetchDataForPieChart();


    async function fetchDataForLineChart(period) {
        let fetchurl = await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=${period}`);
        let resp = await fetchurl.json();

       Highcharts.chart({
        chart: {
            renderTo: 'container',
            type: 'line',
            style: {
                fontFamily: 'monospace',
            },
            backgroundColor: 'black'
        },
        title: {
            text: 'COVID-19 HISTORICAL REPORT',
            style: {
                color: '#fff'
            }
        },
        xAxis: {
            labels: {
            overflow: 'justify',
            },
            categories: Object.keys(resp.cases),
            min: 0,
            max: 19,
            scrollbar: {
                enabled: true
            }
        },
        yAxis: {
            title: {
                text: 'CASES',
                style: {
                    color: '#fff'
                }
            }
        },
        tooltip: {
            split: true
        },
        plotOptions: {
            line: {
                lineWidth: 3,
                states: {
                hover: {
                    lineWidth: 6
                }
                },
                marker: {
                    enabled: false
                },
            }
        },
        legend: {
            color: 'white',
            backgroundColor: 'grey'
        },      
        series: [
            {
                name: 'cases',
                color: '#ee0',
                data: Object.values(resp.cases),
            }, 
            {
                name: 'deaths',
                color: '#f00',
                data: Object.values(resp.deaths)
            },
            {
                name: 'recovered',
                data: Object.values(resp.recovered),
                color: '#0f0'
            }
        ]
    });
       return 'Data fetched';
    
    }

    async function fetchDataForPieChart() {

        let fetchurl = await fetch(`https://disease.sh/v3/covid-19/all`);
        let resp = await fetchurl.json();

        tableBody.innerHTML = `
            <tr>
                <td>Cases</td>
                <td>${resp.cases}</td>
            </tr>
            <tr>
                <td>Active</td>
                <td>${resp.active}</td>
            </tr>
            <tr>
                <td>Recovered</td>
                <td>${resp.recovered}</td>
            </tr>
            <tr>
                <td>Deaths</td>
                <td>${resp.deaths}</td>
            </tr>
        `

        Highcharts.chart('pie', {
            chart: {
                style: {
                    fontFamily: 'monospace',
                },
                backgroundColor: 'black',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Overview'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        color: '#fff',
                    }
                }
            },
            series: [{
                name: 'Count',
                colorByPoint: true,
                data: [{
                    name: 'Active Cases',
                    color: '#7cb5ec',
                    y: (resp.active/resp.cases)*100 ,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Recovered',
                    color: '#90ed7d',
                    y: (resp.recovered/resp.cases)*100
                }, {
                    name: 'Death',
                    color: '#d00',
                    y: (resp.deaths/resp.cases)*100
                }]
            }]
        });

        return 'data fetched';
    }
    
});




