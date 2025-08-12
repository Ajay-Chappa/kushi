import axios from 'axios';

const API_BASE_URL = "http://localhost:8081/api/bookings/overview?timePeriod=all-time";

const getOverview = (timePeriod = 'all-time') => {
  return axios.get(`${API_BASE_URL}/overview`, {
    params: { timePeriod }
  });
};

export default {
  getOverview,
};
