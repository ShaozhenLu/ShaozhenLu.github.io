<template>
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <br>
        <div class="container">

            <h1 class="mt-3 green">Daily Global Stock Market Index </h1>
            <div class="title">Overview of the stock index in the world </div>
            <div class="timeUpdate" id="t1">Live Update every 30 seconds. Last update: {{currentTime}}</div>
            <br>


            <div id="mapchart"></div>

        </div>
    </main>
</template>
  
<script setup>


import { ref, onMounted, onUnmounted, onUpdated } from 'vue';
import axios from 'axios';
import { getFinanceData2 } from '../assets/api/http.js';
import * as d3 from 'd3';
import Plotly from 'plotly.js-dist';



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

let sectorArr = [
    { name: 'S&P 500', code: '^GSPC', country: "United States" },
    { name: 'Dow Jones Industrial Average', code: '^DJI', country: "United States" },
    { name: 'MOEX Russia Index', code: 'IMOEX.ME', country: "Russia" },
    { name: 'Nikkei 225', code: '^N225', country: "Japan" },
    { name: 'SSE Composite Index', code: '000001.SS', country: "China" },
    { name: 'FTSE 100', code: '^FTSE', country: "United Kingdom" },
    { name: 'DAX PERFORMANCE-INDEX', code: '^GDAXI', country: "Germany" },
    { name: 'CAC 40', code: '^FCHI', country: "France" },
    { name: 'BEL 20', code: '^BFX', country: "Belgium" },
    { name: 'S&P/ASX 200', code: '^AXJO', country: "Australia" },
    { name: 'S&P BSE SENSEX', code: '^BSESN', country: "India" },
    { name: 'Jakarta Composite Index', code: '^JKSE', country: "Indonesia" },
    { name: 'FTSE Bursa Malaysia KLCI', code: '^KLSE', country: "Malaysia" },
    // { name: 'S&P/NZX 50 INDEX GROSS', code: '^NZ50', country: "New Zealand" },
    { name: 'KOSPI Composite Index', code: '^KS11', country: "Korea" },
    { name: 'IBOVESPA', code: '^BVSP', country: "Brazil" },
    { name: 'IPC MEXICO', code: '^MXX', country: "Mexico" },
    { name: 'S&P/TSX Composite index', code: '^GSPTSE', country: "Canada" },


];



function drawPlot() {


    var tickers = sectorArr.map(x => x.code)

    let axiosArr = [];
    tickers.forEach((name) => {
        axiosArr.push(getFinanceData2(name, getQueryDate(5)).then((res) => {
            return d3.csvParse(res.data)
        }));
    })


    const country = sectorArr.map(x => x.country)
    const position = sectorArr.map(x => x.position)
    const index = sectorArr.map(x => x.name)

    axios.all(axiosArr).then((axiosArr) => {

        let change = []
        let labelText = []
        let dateRange = []
        // console.log(axiosArr)
        sectorArr.forEach((d, index) => {

            change.push(((axiosArr[index].slice(-2)[1]["Adj Close"] / axiosArr[index].slice(-2)[0]["Adj Close"]) - 1) * 100)

            labelText.push(axiosArr[index].slice(-1)[0]["Date"] + '<br>' + d.name + ": " + axiosArr[index].slice(-1)[0]["Adj Close"])

            dateRange.push(axiosArr[index].slice(-1)[0]["Date"])
        })


        var zscale = d3.scaleLinear().domain(d3.extent(change)).range([0, 1]);
        // console.log(zscale)

        const change_sort = change.sort(function (a, b) { return a - b });

        var colorss1 = d3.scaleLinear().domain([-5, 0]).range(["red", "darkred"]);
        var colorss2 = d3.scaleLinear().domain([0, 5]).range(["darkgreen", "green"]);
        let colorarr = change_sort.map(x => {
            if (x == 0) {
                return [zscale(x), 'lightgrey'];
            }
            if (x < 0) {
                return [zscale(x), colorss1(x)];
            }
            if (x > 0) {
                return [zscale(x), colorss2(x)];
            }
        })


        var data = [{
            type: 'choropleth',
            locationmode: 'country names',
            locations: country,
            z: change,
            text: labelText,
            hoverinfo: "location+text+z",
            hovertemplate: "%{location}<br>%{text}<br>Change: %{z:.2f}%<extra></extra>",
            colorscale: colorarr,
            autocolorscale: false,
            zmin: change_sort[0],
            zmax: change_sort.reverse()[0],
            marker: {
                line: {
                    color: 'white',
                    width: 2
                }
            },
            showscale: false

        }];

        var layout = {
            autosize: true,
            width: 1300,
            height: 700,
            title: {
                text: 'Date:' + d3.extent(dateRange)[0] + ' - ' + d3.extent(dateRange)[1],
                font: {
                    size: 15
                },
                x: 0.8,
                y: 0.92

            },
            geo: {
                showframe: false,
                showland: true,
                landcolor: "lightgrey",
                countrycolor: "lightgrey",
                coastlinecolor: "lightgrey",
                framecolor: "lightgrey",
                projection: {
                    type: 'robinson'
                }
            },
            margin: {
                l: 0,
                r: 200,
                b: 0,
                t: 30,
                pad: 2
            }
        };
        Plotly.newPlot("mapchart", data, layout, { showLink: false });



    });

}



let timer = 0;
let currentTime = ref(new Date().toLocaleString());


onMounted(() => {
    console.log('On Mounted Start');
    drawPlot();

    timer = setInterval(() => {
        drawPlot();
        currentTime = new Date().toLocaleString();
        document.getElementById("t1").innerHTML = "Live Update every 30 seconds. Last update: " + currentTime;
    }, 1000 * 30 )


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
</style>