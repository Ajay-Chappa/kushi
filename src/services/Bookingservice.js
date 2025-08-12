import axios from 'axios';
 
const API_BASE_URL = 'http://localhost:8081/api/bookings';
 
const getBookings = () => {
  return axios.get(API_BASE_URL);
};
 
export default {
  getBookings,
};
 