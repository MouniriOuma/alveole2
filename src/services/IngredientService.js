import axios from 'axios';

const INGREDIENT_API_BASE_URL = "http://localhost:8081/ingredients";

class IngredientService {
  getIngredients() {
    return axios.get(INGREDIENT_API_BASE_URL);
  }

  createIngredient(ingredient) {
    return axios.post(INGREDIENT_API_BASE_URL, ingredient);
  }

  getIngredientById(ingredientId) {
    return axios.get(INGREDIENT_API_BASE_URL + '/' + ingredientId);
  }

  updateIngredient(ingredient, ingredientId) {
    return axios.put(INGREDIENT_API_BASE_URL + '/' + ingredientId, ingredient);
  }

  deleteIngredient(ingredientId) {
    return axios.delete(INGREDIENT_API_BASE_URL + '/' + ingredientId);
  }

  updateIngredientStock(ingredientId, quantity) {
    return axios.put(INGREDIENT_API_BASE_URL + '/' + ingredientId + '/stock' + '/' + quantity);
  }

}

export default new IngredientService();
