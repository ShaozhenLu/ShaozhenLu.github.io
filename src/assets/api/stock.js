import Axios from 'axios';
Axios.defaults.withCredentials = false;
export const getFinanceData3 = function (query){
  return  Axios.get('https://www.alphavantage.co/query' , query)
}