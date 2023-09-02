import axios from 'axios';

const FACTURE_API_BASE_URL = "http://localhost:8081/factures";

class FactureService {
    getAllFactures() {
        return axios.get(FACTURE_API_BASE_URL);
    }

    getFactureById(id) {
        return axios.get(FACTURE_API_BASE_URL + '/' + id);
    }

    createFacture(facture) {
        return axios.post(FACTURE_API_BASE_URL, facture);
    }

    updateFacture(id, facture) {
        return axios.put(FACTURE_API_BASE_URL + '/update/' + id, facture);
    }

    deleteFacture(id) {
        return axios.delete(FACTURE_API_BASE_URL + '/delete/' + id);
    }

    exportFactureToPDF(id) {
        return axios.get(FACTURE_API_BASE_URL + '/export/pdf/' + id, { responseType: 'blob' });
    }
}

export default new FactureService();
