import React, { useState, useEffect } from "react";
import { getAllCountries, searchCountryByName, filterByRegion, filterByLanguage } from "../services/api";
import { useNavigate } from "react-router-dom";
import './CountryList.css';
import Statistics from './Statistics';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const data = await getAllCountries();
      setCountries(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch countries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
    const sortedCountries = [...countries].sort((a, b) => {
      switch (criteria) {
        case 'name':
          return a.name.common.localeCompare(b.name.common);
        case 'population':
          return b.population - a.population;
        case 'area':
          return b.area - a.area;
        default:
          return 0;
      }
    });
    setCountries(sortedCountries);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchTerm) {
        const result = await searchCountryByName(searchTerm);
        setCountries(result);
      } else {
        await fetchCountries();
      }
      setError(null);
    } catch (err) {
      setError("No countries found with that name");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageFilter = async (language) => {
    setLoading(true);
    try {
      if (language) {
        const result = await filterByLanguage(language);
        setCountries(result);
      } else {
        await fetchCountries();
      }
      setError(null);
    } catch (err) {
      setError("Failed to filter by language");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (e, country) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      if (favorites.some(fav => fav.cca3 === country.cca3)) {
        setFavorites(favorites.filter(fav => fav.cca3 !== country.cca3));
      } else {
        setFavorites([...favorites, country]);
      }
    } catch (error) {
      console.error("Failed to manage favorites:", error);
    }
  };

  const handleFilter = async (region) => {
    setLoading(true);
    try {
      if (region) {
        const result = await filterByRegion(region);
        setCountries(result);
      } else {
        await fetchCountries();
      }
      setError(null);
    } catch (err) {
      setError("Failed to filter countries");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const displayedCountries = showFavorites ? favorites : countries;

  return (
    <div className="container mt-4">
      <div className="filters-container">
        <div className="row mb-3">
          <div className="col-md-8">
            <div className="btn-group">
              <button 
                className={`btn ${sortBy === 'name' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSort('name')}
              >
                Sort by Name
              </button>
              <button 
                className={`btn ${sortBy === 'population' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSort('population')}
              >
                Sort by Population
              </button>
              <button 
                className={`btn ${sortBy === 'area' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSort('area')}
              >
                Sort by Area
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <button 
              className={`btn ${showStats ? 'btn-primary' : 'btn-outline-primary'} w-100`}
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? 'Hide Statistics' : 'Show Statistics'}
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-primary" onClick={handleSearch}>Search</button>
            </div>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select" 
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                handleLanguageFilter(e.target.value);
              }}
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Arabic">Arabic</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select" 
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                handleFilter(e.target.value);
              }}
            >
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <button 
              className={`btn ${showFavorites ? 'btn-primary' : 'btn-outline-primary'} w-100`}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? 'Show All Countries' : 'Show Favorites'}
            </button>
          </div>
        </div>
      </div>

      {showStats && <Statistics countries={countries} />}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {selectedCountry && (
            <div className="country-details mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>{selectedCountry.name.common}</h3>
                <div>
                  <button 
                    className="btn btn-primary me-2"
                    onClick={(e) => handleAddToFavorites(e, selectedCountry)}
                  >
                    {favorites.some(fav => fav.cca3 === selectedCountry.cca3) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedCountry(null)}>Close</button>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <img 
                      src={selectedCountry.flags.png} 
                      alt={`Flag of ${selectedCountry.name.common}`}
                      className="img-fluid mb-3"
                    />
                    {selectedCountry.coatOfArms?.png && (
                      <img 
                        src={selectedCountry.coatOfArms.png}
                        alt={`Coat of Arms of ${selectedCountry.name.common}`}
                        className="img-fluid mb-3"
                        style={{ maxHeight: '100px' }}
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Official Name:</strong> {selectedCountry.name.official}</p>
                        <p><strong>Capital:</strong> {selectedCountry.capital}</p>
                        <p><strong>Region:</strong> {selectedCountry.region}</p>
                        <p><strong>Subregion:</strong> {selectedCountry.subregion}</p>
                        <p><strong>Population:</strong> {selectedCountry.population.toLocaleString()}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Languages:</strong> {Object.values(selectedCountry.languages || {}).join(', ')}</p>
                        <p><strong>Currencies:</strong> {Object.values(selectedCountry.currencies || {}).map(c => `${c.name} (${c.symbol})`).join(', ')}</p>
                        <p><strong>Area:</strong> {selectedCountry.area?.toLocaleString()} km²</p>
                        <p><strong>Time Zones:</strong> {selectedCountry.timezones?.join(', ')}</p>
                        {selectedCountry.capital && (
                          <p><strong>Capital Coordinates:</strong> {selectedCountry.capitalInfo?.latlng?.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      {selectedCountry.maps?.googleMaps && (
                        <a href={selectedCountry.maps.googleMaps} target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2">
                          View on Google Maps
                        </a>
                      )}
                      {selectedCountry.maps?.openStreetMaps && (
                        <a href={selectedCountry.maps.openStreetMaps} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                          View on OpenStreetMap
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            {displayedCountries.map((country) => (
              <div key={country.cca3} className="col-md-4 mb-4">
                <div className="card h-100 country-card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <button 
                      className="favorite-btn"
                      onClick={(e) => handleAddToFavorites(e, country)}
                    >
                      {favorites.some(fav => fav.cca3 === country.cca3) ? '★' : '☆'}
                    </button>
                  </div>
                  <div onClick={() => handleCountryClick(country)} style={{cursor: 'pointer'}}>
                    <img 
                      src={country.flags.png} 
                      alt={`Flag of ${country.name.common}`}
                      className="card-img-top flag-img"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{country.name.common}</h5>
                      <p className="card-text">
                        <strong>Region:</strong> {country.region}<br />
                        <strong>Capital:</strong> {country.capital}<br />
                        <strong>Population:</strong> {country.population.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CountryList;