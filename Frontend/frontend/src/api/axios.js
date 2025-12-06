import axios from 'axios';

// Create a simple cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/api' : 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache interceptor for GET requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache control for GET requests
    if (config.method === 'get') {
      config.cacheTimestamp = Date.now();
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for caching
API.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method === 'get' && response.config.cacheTimestamp) {
      const cacheKey = `${response.config.url}_${JSON.stringify(response.config.params)}`;
      apiCache.set(cacheKey, {
        data: response.data,
        timestamp: response.config.cacheTimestamp
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to check cache
const getCachedData = (url, params = {}) => {
  const cacheKey = `${url}_${JSON.stringify(params)}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  return null;
};

// Enhanced get method with cache support
API.getCached = async (url, config = {}) => {
  const cachedData = getCachedData(url, config.params);
  if (cachedData) {
    return { data: cachedData };
  }
  
  return API.get(url, config);
};

// Clear cache function
API.clearCache = () => {
  apiCache.clear();
};

export default API;
