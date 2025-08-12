import axios from 'axios';

const API_URL = 'http://localhost:8081/api/bookings/statistics?timePeriod=all-time'; // Update if needed

const getStatistics = (timePeriod='all-time') => {
  return axios.get(`${API_URL}?timePeriod=${timePeriod}`);
};

export default { getStatistics };

