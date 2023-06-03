import axios from 'axios';

const WATER_ELEC_API_BASE_URL = "http://localhost:8081/waterElecs";

class WaterElecService {
  getWaterElec() {
    return axios.get(WATER_ELEC_API_BASE_URL);
  }

  createWaterElec(bill) {
    return axios.post(WATER_ELEC_API_BASE_URL, bill);
  }

  getWaterElecById(billNum) {
    return axios.get(WATER_ELEC_API_BASE_URL + '/' + billNum);
  }

  updateWaterElec(bill, billNum) {
    return axios.put(WATER_ELEC_API_BASE_URL + '/' + billNum, bill);
  }

  deleteWaterElec(billNum) {
    return axios.delete(WATER_ELEC_API_BASE_URL + '/' + billNum);
  }
}

export default new WaterElecService();
