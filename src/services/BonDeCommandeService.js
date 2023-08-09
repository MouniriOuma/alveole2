import axios from 'axios';

const BON_DE_COMMANDE_API_BASE_URL = "http://localhost:8081/bon-de-commandes";

class BonDeCommandeService {
    getAllBonDeCommandes() {
        return axios.get(BON_DE_COMMANDE_API_BASE_URL);
    }

    getBonDeCommandeById(id) {
        return axios.get(BON_DE_COMMANDE_API_BASE_URL + '/' + id);
    }

    updateBonDeCommande(id, bonDeCommande) {
        return axios.put(BON_DE_COMMANDE_API_BASE_URL + '/update/' + id, bonDeCommande);
    }

    deleteBonDeCommande(id) {
        return axios.delete(BON_DE_COMMANDE_API_BASE_URL + '/delete/' + id);
    }

    exportBonDeCommandeToPDF(id) {
        return axios.get(BON_DE_COMMANDE_API_BASE_URL + '/export/pdf/' + id, { responseType: 'blob' });
    }
}

export default new BonDeCommandeService();
