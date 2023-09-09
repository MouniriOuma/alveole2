import axios from 'axios';

const PRODUCT_COST_API_BASE_URL = "http://localhost:8081/productCosts";

class ProductCostService {
    getProductCosts() {
        return axios.get(PRODUCT_COST_API_BASE_URL);
    }

    createProductCost(ProductCost) {
        return axios.post(PRODUCT_COST_API_BASE_URL, ProductCost);
    }

    getProductCostById(id) {
        return axios.get(PRODUCT_COST_API_BASE_URL + '/' + id);
    }


    deleteProductCost(id) {
        return axios.delete(PRODUCT_COST_API_BASE_URL + '/' + id);
    }
}

export default new ProductCostService();
