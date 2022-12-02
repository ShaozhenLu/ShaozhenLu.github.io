<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <br>
    <div class="container">

      <h1 class="mt-3 green">MARKET INDEX SUMMARY</h1>
      <div class="title">Three Main Stock Index Trending Chart</div>
      <!-- <h2 class="mt-3 green">the chart of {{ index_name }}</h2> -->
      <br>
      <button class="btn btn-success me-2" @click="getIndex('SPY')">SPY</button>
      <button class="btn btn-primary me-2" @click="getIndex('QQQ')">QQQ</button>
      <button class="btn btn-info me-2" @click="getIndex('IWM')">IWM</button>

      <br>
      <br>
      <div id='myDiv'></div>
      <br>
      <hr>
      <br>
      <h1 class="mt-3 green">INTRADAY PRICE</h1>
      <div class="note">{{msg}}</div>
      <Datepicker v-model="picked" @update:model-value="handleChange" :disabledDates="{ dates: disabledDate }"/>
      <div class="row align-items-start">
        <div class="col">
          <!-- <div class="shadow p-3 mb-5 bg-body rounded"> -->
          <div id="SPY"></div>
          <div class="note">The SPDR S&P 500 trust is an exchange-traded fund (ETF) which is designed to track the S&P
            500 stock market index.</div>
          <!-- </div> -->
        </div>
        <div class="col">
          <div id="QQQ"></div>
          <div class="note">Invesco QQQ is an exchange-traded fund (ETF) that tracks the Nasdaq-100 Index™.</div>
        </div>
        <div class="col">
          <div id="IWM"></div>
          <div class="note">The iShares Russell 2000 is an exchange-traded fund (ETF) seeking to track the investment
            results of an index composed of small-capitalization U.S. equities.</div>
        </div>
      </div>
      <br>
      <hr>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { getFinanceData2 } from '../assets/api/http.js';
import * as d3 from 'd3';
import Plotly from 'plotly.js-dist';
import { getFinanceData3 } from '../assets/api/stock.js';
import * as Plot from "@observablehq/plot";
import Datepicker from 'vue3-datepicker'
import { add } from 'date-fns'

const msg = ref('Date');
const picked = ref(new Date());
const future_date = []
for (var num=0; num<=31;num++){
  future_date.push(add(new Date(), { days:num }))
}
const disabledDate = future_date
function handleChange(){
  console.log(picked.value);
  minstock('SPY');
  minstock('QQQ');
  minstock('IWM');
}


function convertTime(s) {
  return Math.floor(
    s.getTime() / 1000
  );
}

function convertLastDay(s) {
  return Math.floor(
    (s.getTime() - 1000 * 60 * 60 * 24 * 2) / 1000
  );
}

let queryData = {
  params: {
    period1: convertTime(new Date("2021-01-01")),
    period2: convertTime(new Date()),
    interval: '1d',
    events: 'history',
    includeAdjustedClose: true

  }
};
let stockdata = reactive();
let index_name = ref('SPY');
// let message = ref('the index chart of '+ index_name.value);
function getIndex(name) {
  index_name.value = name;

  stockdata =
    getFinanceData2(index_name.value, queryData).then((res) => {
      return d3.csvParse(res.data)
    });
  getIndexChart();
}

function getIndexChart() {
  stockdata =
    getFinanceData2(index_name.value, queryData).then((res) => {
      return d3.csvParse(res.data)
    });


  function unpack(rows, key) {
    return rows.map(row => {
      return row[key];
    });
  }
  stockdata.then((result) => {

    var trace = {
      x: unpack(result, 'Date'),
      close: unpack(result, 'Close'),
      high: unpack(result, 'High'),
      low: unpack(result, 'Low'),
      open: unpack(result, 'Open'),
      text: unpack(result, 'Volume').map(x=> "volume: " + x),
      name: name,
      // cutomise colors
      increasing: { line: { color: '#649334' } },
      decreasing: { line: { color: '#cc392b' } },

      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y2'
    };

    var trace2 = {
      x: unpack(result, 'Date'),
      y: unpack(result, 'Volume'),
      type: 'bar',
      yaxis: "y",
      marker: {
        color: "rgba(128,128,128,0.3)"
      },
      hoverinfo:'none'
    };
    var data = [trace, trace2];

    var layout = {
      dragmode: 'zoom',
      autosize: true,
      showlegend: false,
      width: 1200,
      height: 700,
      margin: {
        r: 60,
        t: 25,
        b: 40,
        l: 60
      },
      showlegend: false,
      xaxis: {
        autorange: true,
        domain: [0, 1],
        title: 'Date',
        type: 'date',
        rangeselector: {
          x: 0,
          y: 1.2,
          xanchor: 'left',
          font: { size: 12 },
          buttons: [{
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1 month'
          }, {
            step: 'month',
            stepmode: 'backward',
            count: 6,
            label: '6 months'
          }, {
            step: 'all',
            label: 'All dates'
          }]
        }
      },
      yaxis2: {
        autorange: true,
        type: 'linear',
        title: 'Price',
        anchor: 'x', 
        overlaying: 'y', 
        side: 'left'
      },
      yaxis: {
        autorange: true,
        title: 'Volume',
        side: 'right',
        showgrid: false,
      },
      title: {
        text: index_name.value + ' Candlestick Volume Chart',
      },
    };

    var config = { responsive: true }

    Plotly.newPlot('myDiv', data, layout, config);



  });
}


//-------------------3  min-stock ------------------------
function minstock(name) {
  let queryData = {
    params: {
      function: 'TIME_SERIES_INTRADAY',
      symbol: name,
      interval: '5min',
      outputsize: 'full',
      apikey: 'EJCEMTNN0R81B2M5',
    }
  };

  var date = picked.value;
  date = d3.timeFormat("%Y-%m-%d")(date).toString();

  // var date = '2022-11-28'
  let stockdata =
    getFinanceData3(queryData).then((res) => {
      //console.log(res)
      //console.log(res.data['Time Series (5min)'])
      return res.data['Time Series (5min)']
    });

  let color = { "SPY": "#198754", "QQQ": "#0d6efd", "IWM": "#0dcaf0" }

  stockdata.then((result) => {
    console.log(result);
    var timeList_all = [];
    var closeList = [];
    var timeList =[]
    for (var one in result) {

      if (one.substring(0, 10) == date) {
        timeList.push(one);
        closeList.push(result[one]['4. close']);
      }
    
      
    };

    if(timeList.length<2){
      for (var one in result) {
        timeList_all.push(one);
        timeList=timeList_all.slice(0,190);
      }
      for (var two in timeList){
      // console.log(result[timeList[two]])
      closeList.push(result[timeList[two]]['4. close']);
      } 
    }


    // change picked value 

    var dateParse = d3.timeParse("%Y-%m-%d %H:%M:%S");
    var timeobj=dateParse(timeList[0]);
    console.log(timeobj);
    picked.value =timeobj;


    
    var trace1 = {
      x: timeList,
      y: closeList,
      fill: 'tozeroy',
      mode: 'line',
      line: {
        color: color[name],
        width: 3
      }

    };


    var data = [trace1];
    var closeListR = closeList.reverse()

    var layout = {
      title: name,
      // hovermode: "y unified",
      xaxis: {
        showspikes: true
      },
      yaxis: {
        // autorange: true,
        range: [d3.min(closeList) * 0.999, d3.max(closeList)],
        showspikes: true,
        side: "right"

      },
      margin: {
        l: 0,
        r: 40,
        pad: 1
      },
      shapes: [
        {
          type: 'line',
          xref: 'paper',
          x0: 0,
          y0: closeListR[0],
          x1: 1,
          y1: closeListR[0],
          line: {
            color: color[name],
            width: 3,
            dash: 'dot'
          }
        }
      ],
      annotations: [
        {
          xref: 'paper',
          x: 1.15,
          y: closeListR[0],
          // xanchor: 'right',
          // yanchor: 'middle',
          text: closeListR[0],
          showarrow: false,
          font: {
            size: 12,
            color: "white"
          },
          bgcolor: color[name]
        }
      ],
    };

    Plotly.newPlot(name, data, layout);
  })
};





onMounted(() => {
  getIndexChart();
  minstock('SPY');
  minstock('QQQ');
  minstock('IWM');
});

</script>

<style scoped>
.title {
  font-size: 20px;
  color: rgb(70, 70, 70);
}

.note {
  font-size: 15px;
  margin-top: 5px;
  color: rgb(101, 99, 99);
}
</style>