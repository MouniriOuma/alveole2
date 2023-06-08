import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8081/users";
const CREATE_USER_API_BASE_URL = "http://localhost:8081/api/auth";

class UserService {
  getUsers() {
    return axios.get(USER_API_BASE_URL);
  }

  createUser(user) {
    return axios.post(USER_API_BASE_URL, user);
  }

  registerUser(user) {
    return axios.post(CREATE_USER_API_BASE_URL + '/signup', user);
  }

  getUserById(userId) {
    return axios.get(USER_API_BASE_URL + '/' + userId);
  }

  updateUser(userId, user) {
    return axios.put(CREATE_USER_API_BASE_URL + '/users/' + userId, user);
  }

  deleteUser(userId) {
    return axios.delete(USER_API_BASE_URL + '/' + userId);
  }
}

export default new UserService();
