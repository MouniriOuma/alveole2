import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8081/users";
const SIGN_USER_API_BASE_URL = "http://localhost:8081/api/auth";

class UserService {
  getUsers() {
    return axios.get(USER_API_BASE_URL);
  }

  getUserById(userId) {
    return axios.get(USER_API_BASE_URL + '/' + userId);
  }

  deleteUser(userId) {
    return axios.delete(USER_API_BASE_URL + '/' + userId);
  }

  registerUser(user) {
    return axios.post(SIGN_USER_API_BASE_URL + '/signup', user);
  }

  updateUser(userId, user) {
    return axios.put(SIGN_USER_API_BASE_URL + '/users/' + userId, user);
  }

  getUserRoleByUsername(username) {
    return axios.get(USER_API_BASE_URL + '/role/' + username);
  }

  logout() {
    return axios.post(SIGN_USER_API_BASE_URL + '/signout');
  }

}

export default new UserService();
