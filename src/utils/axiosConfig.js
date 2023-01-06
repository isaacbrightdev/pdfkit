
import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://137.184.98.149/api/'
});
export default instance;

