<template>
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <br>
        <div class="container">

            <h1 class="mt-3 green">SECTOR ROTATIONS</h1>
            <div class="title">How different sector ETFs have moved historically.</div>

            <br>

            <button type="button" class="btn btn-success me-2 btn-sm" value=7 @click="ChangeDay($event)">7D</button>
            <button type="button" class="btn btn-success me-2 btn-sm" value=15 @click="ChangeDay($event)">15D</button>
            <button type="button" class="btn btn-success me-2 btn-sm" value=30 @click="ChangeDay($event)">30D</button>
            <button type="button" class="btn btn-success me-2 btn-sm" value=60 @click="ChangeDay($event)">60D</button>
            <button type="button" class="btn btn-success me-2 btn-sm" value=120 @click="ChangeDay($event)">120D</button>

            <br>
            <br>

            <div id="mlinechart"></div>


            <!-- <Datepicker v-model="date"></Datepicker> -->


        </div>

        <br>
        <hr>
        <br>
        <br>

        <div class="container">
            <div class="row">
                <div class="col">
                    <h1 class="mt-3 green">SECTOR PERFORMANCE</h1>
                    <div class="title">Daily Percentage change of each sector index</div>
                    <div class="timeUpdate" id="t2">Update every 30 seconds in trade time (6:30 - 13:00 PST WD). Last
                        update: {{
                                currentTime
                        }}</div>
                    <br>
                    <div id="barchart"></div>

                </div>
                <div class="col" id="c2">
                    <h1 class="mt-3 green">SECTOR WEIGHT</h1>
                    <div class="title">Index Weight and Amounts of Sector BreakDown in S&P 500</div>
                    <br>
                    <div id="piechart"></div>
                </div>
            </div>
        </div>

        <br>
        <hr>
        <br>
        <br>

        <div class="container">


            <h1 class="mt-3 green">MARKET OVERVIEW</h1>
            <div class="title">Overview of the biggest market cap stocks in each sector.</div>
            <div class="timeUpdate" id="t3">Update every 30 seconds in trade time (6:30 - 13:00 PST WD). Last update: {{
                    currentTime
            }}</div>
            <br>

            <span class="mt-1 green" id="ss">Select Sector </span>

            <select @change="onChangeMethod($event)">
                <option>S&P 500</option>
                <option>Technology</option>
                <option>Health Care</option>
                <option>Financials</option>
                <option>Consumer Discretionary</option>
                <option>Communication Services</option>
                <option>Industrials</option>
                <option>Consumer Staples</option>
                <option>Energy</option>
                <option>Utilities</option>
                <option>Real Estate</option>
                <option>Materials</option>
            </select>

            <br>
            <div id="treechart"></div>



        </div>


    </main>
</template>




<script setup>


import { ref, onMounted, onUnmounted, onUpdated } from 'vue';
import axios from 'axios';
import { getFinanceData2 } from '../assets/api/http.js';
import * as d3 from 'd3';
import Plotly from 'plotly.js-dist';


function ChangeDay(event) {
    drawMLPlot("mlinechart", event.target.value);
}


function onChangeMethod(event) {
    drawTreePlot(event.target.value, "treechart");
    // console.log(document.getElementById('test1'));
}

function convertTime(s) {
    return Math.floor(
        s.getTime() / 1000
    );
}

function getBeforeDate(day) {
    let now = new Date().getTime();
    let before = new Date(now - ((day > 0 && day ? day : 0) * 86400 * 1000));
    let year = before.getFullYear();
    let month = before.getMonth() + 1;
    let date = before.getDate();
    return year + '-' + (month < 9 ? '0' + month : month) + '-' + (date < 9 ? '0' + date : date)
}

function getQueryDate(day) {
    let queryData = {
        params: {
            period1: convertTime(new Date(getBeforeDate(day))),
            period2: convertTime(new Date()),
            interval: '1d',
            events: 'history',
            includeAdjustedClose: true
        }
    }

    return queryData

}

function getTrace(sector, xdata, ydata) {
    return {
        type: "scatter",
        mode: "lines",
        name: sector,
        x: xdata,
        y: ydata,
        // line: {'shape': 'spline'}
        hovertemplate: "%{x}<br>%{y}",
    }
}

function drawPiePlot(id) {

    d3.csv('sector_weight.csv').then(data => {

        const sector = data.map(x => x.Sector)
        const number = data.map(x => x.Number)
        const percentage = data.map(x => x["Index Weight"])

        var data = [{
            type: "pie",
            values: percentage,
            labels: sector,
            text: number,
            textinfo: "label+percent",
            textposition: "inside",
            automargin: true,
            hovertemplate:
                "<b>%{label}</b><br>" +
                "Index Weight: %{percent}<br>" +
                "Number: %{text}<br>" +
                "<extra></extra>"
        }]

        var layout = {
            height: 400,
            width: 400,
            margin: { "t": 10, "b": 10, "l": 80, "r": 10 },
            showlegend: false
        }

        Plotly.newPlot(id, data, layout)


    })

}


function drawMLPlot(id, day) {

    let sectorArr = [
        { name: 'S&P index', code: 'SPY' },
        { name: 'Information Technology', code: 'XLK' },
        { name: 'Health Care', code: 'XLV' },
        { name: 'Financials', code: 'XLF' },
        { name: 'Consumer Discretionary', code: 'XLY' },
        { name: 'Communication Services', code: 'XLC' },
        { name: 'Industrials', code: 'XLI' },
        { name: 'Consumer Staples', code: 'XLP' },
        { name: 'Energy', code: 'XLE' },
        { name: 'Utilities', code: 'XLU' },
        { name: 'Real Estate', code: 'XLRE' },
        { name: 'Materials', code: 'XLB' }
    ];

    var tickers = sectorArr.map(x => x.code)

    let axiosArr = [];
    tickers.forEach((name) => {
        axiosArr.push(getFinanceData2(name, getQueryDate(180)).then((res) => {
            return d3.csvParse(res.data)
        }));
    })

    var datedata = [];

    axios.all(axiosArr).then((axiosArr) => {

        if (datedata.length === 0) {
            datedata = axiosArr[0].map(x => x.Date).slice(-day)
            //console.log(datedata)
        }

        //console.log(axiosArr)

        var mydata = [];

        sectorArr.forEach((d, index) => {
            //console.log(index)
            var ydata = axiosArr[index].map(x => x["Adj Close"])
            // 切片
            var change = [0];
            for (let i = 0; i < day - 1; i++) {
                change.push((ydata.slice(-day)[i + 1] / ydata.slice(-day)[0]) - 1);
            }
            //console.log(change);

            var name = d.name + '(' + d.code + ')'

            mydata.push(getTrace(name, datedata, change))

        })

        //console.log(mydata);

        var layout = {
            autosize: true,
            width: 1300,
            height: 700,
            showlegend: true,
            legend: {
                "orientation": "h",
                x: -0.05,
                y: 1.22,
            },
            xaxis: {
                title: 'Date',
                autorange: true,
                range: [datedata[0], datedata[datedata.length - 1]],
                rangeslider: { range: [datedata[0], datedata[datedata.length - 1]] },
                type: 'date'
            },
            yaxis: {
                title: 'Cumulative Change(%)',
                autorange: true,
                type: 'linear',
                tickformat: ',.2%',
                range: [0, 1]

            },
            title: {
                text: 'Date: ' + datedata[0] + ' to ' + datedata[datedata.length - 1],
                font: {
                    size: 13
                },
                x: 0.92,
                y: 0.86

            },
        };

        Plotly.newPlot(id, mydata, layout);


    })


}

function drawTreePlot(sector, id) {

    d3.json('treemap_dict.json').then(data => {
        var tickers = data[sector].labels.slice(1);

        let axiosArr = [];
        tickers.forEach((name) => {
            axiosArr.push(getFinanceData2(name, getQueryDate(5)).then((res) => {
                return d3.csvParse(res.data)
            }));
        })

        axios.all(axiosArr).then((axiosArr) => {
            let md = {};

            const currentDate = axiosArr[0].slice(-1)[0].Date;

            tickers.forEach((element, index) => {
                md[element] = axiosArr[index];
            });
            // console.log(md)

            let pctArr = [100];

            tickers.forEach((name) => {
                pctArr.push((md[name].map(x => x["Adj Close"]).slice(-1)[0] / md[name].map(x => x["Adj Close"]).slice(-2)[0]) - 1);

            })


            var p = Array(data[sector].labels.length).fill(sector);
            var colorss1 = d3.scaleLinear().domain([-0.3, 0]).range(["red", "darkred"]);
            var colorss2 = d3.scaleLinear().domain([0, 0.3]).range(["darkgreen", "green"]);
            let colorarr = pctArr.map(x => {
                if (x == 100) {
                    return 'white';
                }
                if (x == 0) {
                    return 'lightgrey';
                }
                if (x < 0) {
                    return colorss1(x);
                }
                if (x > 0) {
                    return colorss2(x);
                }
            });


            p[0] = "";
            const res = [{
                type: "treemap",
                labels: data[sector].labels,
                parents: p,
                values: data[sector].mktcap,
                text: pctArr.map(x => x * 100),
                texttemplate: "%{label}<br>%{text:.2f}%",
                hoverinfo: "label+text",
                hovertemplate: "%{label}<br>%{text:.2f}%<extra></extra>",
                textfont: { 'size': 20 },
                marker: { colors: colorarr }
            }]

            const layout = {
                autosize: false,
                width: 800,
                height: 600,
                margin: {
                    l: 0,
                    r: 20,
                    b: 20,
                    t: 20,
                    pad: 4
                },
                title: {
                    text: 'Date:' + currentDate,
                    font: {
                        size: 15
                    },
                    x: 0.95,
                    y: 0.93

                },
            };

            Plotly.newPlot(id, res, layout);

        })


    });

}

function drawBar(id) {

    // array that sector name match code
    var sectorArr = [
        { name: 'Information Technology', code: '^SP500-45' },
        { name: 'Health Care', code: '^SP500-35' },
        { name: 'Financials', code: '^SP500-40' },
        { name: 'Consumer Discretionary', code: '^SP500-25' },
        { name: 'Communication Services', code: '^SP500-50' },
        { name: 'Industrials', code: '^SP500-20' },
        { name: 'Consumer Staples', code: '^SP500-30' },
        { name: 'Energy', code: '^GSPE' },
        { name: 'Utilities', code: '^SP500-55' },
        { name: 'Real Estate', code: '^SP500-60' },
        { name: 'Materials', code: '^SP500-15' }
    ];

    var nameArr = sectorArr.map(item => { return item.name });
    var codeArr = sectorArr.map(item => { return item.code });
    var axiosArr = [];


    codeArr.forEach((code) => {
        axiosArr.push(
            getFinanceData2(code, getQueryDate(5)).then((res) => {
                return d3.csvParse(res.data);
            })
        );
    });

    axios.all(axiosArr).then((axiosArr) => {

        let md = new Object();

        codeArr.forEach((code, index) => {
            md[code] = axiosArr[index];
        });
        // console.log('in axios', md)



        ////calculate change rate

        var rawData = {};
        const currentDate = md["^GSPE"][md["^GSPE"].length - 1]['Date']
        // console.log(currentDate);

        codeArr.forEach((code) => {
            let close1 = md[code][md[code].length - 1]['Adj Close'];
            let close2 = md[code][md[code].length - 2]['Adj Close'];
            let sector = sectorArr.find(item => item.code === code)['name']
            rawData[sector] = (close1 - close2) / close2;

        })


        //reshape rawData to data
        var data = [];
        nameArr.forEach((name, index) => {
            let newrow = {};
            newrow['name'] = name;
            newrow['rate'] = rawData[name];
            data[index] = newrow;
        })

        //sort data based on value
        data.sort((a, b) => d3.ascending(a.rate, b.rate))


        //draw chart
        var margin = { top: 40, right: 10, bottom: 50, left: 150 },
            width = 500,
            height = 300;

        var svg = d3.select(id).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var y = d3.scaleBand().range([height, 0]).padding(0.1);
        var x = d3.scaleLinear().range([0, width]);

        // decide extent of x value
        function extent() {
            return d3.min(data, d => d.rate) > 0 ? [0, d3.max(data, d => d.rate)]
                : d3.max(data, d => d.rate) < 0 ? [d3.min(data, d => d.rate), 0]
                    : d3.extent(data, d => d.rate)
        };

        x.domain(extent());
        y.domain(data.map(d => d.name));

        var xAxis = d3.axisBottom(x)
            .ticks(8).tickFormat(d3.format(".1%"));
        var yAxis = d3.axisRight(y);

        // append the rectangles and tooltips for the bar chart
        var tooltip = d3.select('body').append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff');

        var rect = svg.append('g')
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", d => "bar bar--" + (d.rate < 0 ? "negative" : "positive"))
            .attr("x", d => x(Math.min(0, d.rate)))
            .attr("y", d => y(d.name))
            .attr("width", d => Math.abs(x(d.rate) - x(0)))
            .attr("height", y.bandwidth())
            .on('mouseover', function (d) {
                tooltip.style('visibility', 'visible')
            })
            .on('mousemove', function (event, d) {
                tooltip
                    .style('top', event.pageY - 5 + 'px')
                    .style('left', event.pageX + 10 + 'px')
                    .html(`${d.name}<div>Percentage Change: ${(d.rate * 100).toFixed(4)}%</div>`)
                    .style('font-size', '12px')
            })
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
            });

        // add the x Axis
        let xAxisGroup = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom * 0.8)
            .text("Percentage Change");

        // add the y Axis
        let yAxisGroup = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        yAxisGroup.selectAll('.tick')
            .data(data)
            .select('text')
            .attr('x', d => d.rate - 9)
            .style('text-anchor', 'end')
            .style('font-size', '12px')

        const title = svg
            .append('g')
            .attr("font-size", "15px")
            .attr("fill", "#333")
            .attr(
                'transform',
                `translate(380, -20)`
            )
            .append('text');
        title.text('Date: ' + currentDate);



    })


};


function checkUpdate() {

    var currentDate = new Date()

    if (!(currentDate.getDay() % 6)) {
        return false
    }
    else {
        var startTime = '6:30:00';
        var endTime = '13:00:00';
        var startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);

        var endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);

        var valid = startDate < currentDate && endDate > currentDate

        return valid
    }

}



let timer = 0;
let currentTime = ref(new Date().toLocaleString());
onMounted(() => {
    console.log('On Mounted Start');
    drawMLPlot("mlinechart", 120);
    drawBar("#barchart");
    drawTreePlot("S&P 500", "treechart");
    drawPiePlot("piechart")


    if (checkUpdate()) {
        timer = setInterval(() => {
            currentTime = new Date().toLocaleString();
            document.getElementById("t2").innerHTML = "Update every 30 seconds in trade time (6:30 - 13:00 PST WD). Last update: " + currentTime;
            document.getElementById("t3").innerHTML = "Update every 30 seconds in trade time (6:30 - 13:00 PST WD). Last update: " + currentTime;

            drawTreePlot("S&P 500", "treechart");
            const svg = d3.select('#barchart');
            svg.selectAll("*").remove();
            drawBar("#barchart");
        }, 1000 * 30)
    }

})
onUpdated(() => {
    console.log('on Updated Start')
})
onUnmounted(() => {
    console.log('Page exit, timer end')
    clearInterval(timer);
})



</script>

<style scoped>
.title {
    font-size: 20px;
    color: rgb(70, 70, 70);
}

.timeUpdate {
    font-size: 15px;
    margin-top: 5px;
    color: rgb(101, 99, 99);
}

#c2 {
    margin-left: 30px;

}


#ss {
    font-size: 1.2vw;
    margin-right: 1vw;
}

pre {
    border: hsla(160, 100%, 37%, 1) 2px solid;
}

::v-deep(.bar--positive) {
    fill: rgb(48, 150, 48);
}

::v-deep(.bar--negative) {
    fill: rgb(187, 48, 48);
}
</style>