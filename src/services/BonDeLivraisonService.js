import axios from 'axios';

const BON_DE_LIVRAISON_API_BASE_URL = "http://localhost:8081/bon-de-livraison";

class BonDeLivraisonService {
    getAllBonDeLivraisons() {
        return axios.get(BON_DE_LIVRAISON_API_BASE_URL);
    }

    getBonDeLivraisonById(id) {
        return axios.get(BON_DE_LIVRAISON_API_BASE_URL + '/' + id);
    }

    createBonDeLivraison(bonDeLivraison) {
        return axios.post(BON_DE_LIVRAISON_API_BASE_URL, bonDeLivraison);
    }

    updateBonDeLivraison(id, bonDeLivraison) {
        return axios.put(BON_DE_LIVRAISON_API_BASE_URL + '/update/' + id, bonDeLivraison);
    }

    deleteBonDeLivraison(id) {
        return axios.delete(BON_DE_LIVRAISON_API_BASE_URL + '/delete/' + id);
    }

    exportBonDeLivraisonToPDF(id) {
        return axios.get(BON_DE_LIVRAISON_API_BASE_URL + '/export/pdf/' + id, { responseType: 'blob' });
    }
}

export default new BonDeLivraisonService();
