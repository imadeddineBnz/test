import axios from "axios";
const axiosInstance = axios.create({
     baseURL : 'http://192.168.1.17:8000/api/',
    // baseURL : "http://192.168.33.86:8080/coursePHP/",
    timeout : 10000,
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json.,"
    }
    
});
axiosInstance.interceptors.request.use((config)=>{
    const token = localStorage.getItem('authToken');
    axiosInstance.defaults.headers['Authorization']= `Bearer ${localStorage.getItem('authToken')}`;
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
axiosInstance.interceptors.response.use(
    (response) => response, 
    (error) => {
      if (error.response?.status === 401) {
        alert('Unauthorized! Please log in again.');
        localStorage.removeItem('authToken');
        window.location.href = '/sign_in'; 
      } else if (error.response?.status === 500) {
        alert('Server error! Please try again later.');
      } else {
        alert('An error occurred. Please try again.');
      }
      return Promise.reject(error); 
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken'); // Retrieve token from local storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
export default axiosInstance;