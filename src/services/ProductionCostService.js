import axios from 'axios';

const PRODUCTION_COST_API_BASE_URL = "http://localhost:8081/productionCosts";

class ProductionCostService {
    getProductionCosts() {
        return axios.get(PRODUCTION_COST_API_BASE_URL);
    }

    createProductionCost(productionCost) {
        return axios.post(PRODUCTION_COST_API_BASE_URL, productionCost);
    }

    getProductionCostById(id) {
        return axios.get(PRODUCTION_COST_API_BASE_URL + '/' + id);
    }

    updateProductionCost(id, productionCost) {
        return axios.put(PRODUCTION_COST_API_BASE_URL + '/' + id, productionCost);
    }

    deleteProductionCost(id) {
        return axios.delete(PRODUCTION_COST_API_BASE_URL + '/' + id);
    }
}

export default new ProductionCostService();
