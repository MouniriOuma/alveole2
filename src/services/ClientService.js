import axios from 'axios';

const CLIENT_API_BASE_URL = "http://localhost:8081/clients/clients";

class ClientService {
  getClients() {
    return axios.get(CLIENT_API_BASE_URL);
  }

  createClient(client) {
    return axios.post(CLIENT_API_BASE_URL, client);
  }

  getClientById(clientIce) {
    return axios.get(CLIENT_API_BASE_URL + '/' + clientIce);
  }

  updateClient(client, clientIce) {
    return axios.put(CLIENT_API_BASE_URL + '/' + clientIce, client);
  }

  deleteClient(clientIce) {
    return axios.delete(CLIENT_API_BASE_URL + '/' + clientIce);
  }
}

export default new ClientService();
