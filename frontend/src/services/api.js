import axios from "axios";

const REST_COUNTRIES_BASE_URL = "https://restcountries.com/v3.1";
const BACKEND_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with error handling
const api = axios.create({
  timeout: 10000,
  baseURL: BACKEND_BASE_URL
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Country not found'));
    }
    return Promise.reject(error);
  }
);

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await api.get(`${REST_COUNTRIES_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

// Search country by name
export const searchCountryByName = async (name) => {
  try {
    const response = await api.get(`${REST_COUNTRIES_BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error searching country:', error);
    throw new Error('Country not found');
  }
};

// Filter by region
export const filterByRegion = async (region) => {
  try {
    const response = await api.get(`${REST_COUNTRIES_BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error('Error filtering by region:', error);
    throw new Error('Failed to filter by region');
  }
};

// Get country by code
export const getCountryByCode = async (code) => {
  try {
    const response = await api.get(`${REST_COUNTRIES_BASE_URL}/alpha/${code}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching country by code:', error);
    throw new Error('Country not found');
  }
};

// Get country languages
export const getCountryLanguages = async (code) => {
  try {
    const response = await api.get(`${REST_COUNTRIES_BASE_URL}/alpha/${code}`);
    return response.data[0].languages;
  } catch (error) {
    console.error('Error fetching country languages:', error);
    return {};
  }
};

// Filter by language
export const filterByLanguage = async (language) => {
  try {
    const allCountries = await getAllCountries();
    return allCountries.filter(country => 
      country.languages && 
      Object.values(country.languages).some(lang => 
        lang.toLowerCase().includes(language.toLowerCase())
      )
    );
  } catch (error) {
    console.error('Error filtering by language:', error);
    throw new Error('Failed to filter by language');
  }
};

// User Authentication
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Login failed');
  }
};

// Favorites management
export const addToFavorites = async (userId, countryCode) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      '/favorites', 
      { userId, countryCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw new Error('Failed to add to favorites');
  }
};

export const getFavorites = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(
      `/favorites/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw new Error('Failed to fetch favorites');
  }
};

// Remove from favorites
export const removeFromFavorites = async (userId, countryCode) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(
      `/favorites`,
      { 
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, countryCode }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Failed to remove from favorites');
  }
};

// Get country statistics
export const getCountryStatistics = async () => {
  try {
    const countries = await getAllCountries();
    return {
      totalCountries: countries.length,
      totalPopulation: countries.reduce((sum, country) => sum + country.population, 0),
      averagePopulation: Math.round(
        countries.reduce((sum, country) => sum + country.population, 0) / countries.length
      ),
      regionCount: countries.reduce((acc, country) => {
        acc[country.region] = (acc[country.region] || 0) + 1;
        return acc;
      }, {}),
      languageCount: countries.reduce((acc, country) => {
        if (country.languages) {
          Object.values(country.languages).forEach(lang => {
            acc[lang] = (acc[lang] || 0) + 1;
          });
        }
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw new Error('Failed to get statistics');
  }
};

export default api;