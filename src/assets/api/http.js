import Axios from 'axios';
Axios.defaults.withCredentials = true;
Axios.defaults.baseURL = '/api';
// Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//https://query2.finance.yahoo.com/v8/finance/chart/AAPL?useYfid=true&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&period1=1620432000&period2=1669270486
export const axios = Axios;

export const getFinanceData = function (name, data){
   return  Axios.get('/v8/finance/chart/' + name, data)
}

export const getFinanceData2 = function (name, query){
   return  Axios.get('/v7/finance/download/' + name, query)
}
//TSLA?interval=1d&events=history&includeAdjustedClose=true&period1=1612137600&period2=1669269399'

