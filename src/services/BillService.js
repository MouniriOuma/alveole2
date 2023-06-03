import axios from 'axios';

const BILL_API_BASE_URL = "http://localhost:8081/bills";

class BillService {
  getBills() {
    return axios.get(BILL_API_BASE_URL);
  }

  createBill(bill) {
    return axios.post(BILL_API_BASE_URL, bill);
  }

  getBillById(billNumber) {
    return axios.get(BILL_API_BASE_URL + '/' + billNumber);
  }

  updateBill(bill, billNumber) {
    return axios.put(BILL_API_BASE_URL + '/' + billNumber, bill);
  }

  deleteBill(billNumber) {
    return axios.delete(BILL_API_BASE_URL + '/' + billNumber);
  }
}

export default new BillService();
