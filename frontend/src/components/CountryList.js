import React, { useState, useEffect } from "react";
import { getAllCountries, searchCountryByName, filterByRegion, filterByLanguage } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Box,
  Paper,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  CardHeader,
  ButtonGroup,
  Divider
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Sort as SortIcon,
  BarChart as BarChartIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  Public as PublicIcon
} from '@mui/icons-material';
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

  const displayedCountries = showFavorites ? favorites : countries;

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search countries"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    sx={{ ml: 1 }}
                  >
                    Search
                  </Button>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                handleLanguageFilter(e.target.value);
              }}
            >
              <MenuItem value="">All Languages</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="French">French</MenuItem>
              <MenuItem value="Arabic">Arabic</MenuItem>
              <MenuItem value="Chinese">Chinese</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Region"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                handleFilter(e.target.value);
              }}
            >
              <MenuItem value="">All Regions</MenuItem>
              <MenuItem value="Africa">Africa</MenuItem>
              <MenuItem value="Americas">Americas</MenuItem>
              <MenuItem value="Asia">Asia</MenuItem>
              <MenuItem value="Europe">Europe</MenuItem>
              <MenuItem value="Oceania">Oceania</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant={showFavorites ? "contained" : "outlined"}
              startIcon={showFavorites ? <StarIcon /> : <StarBorderIcon />}
              onClick={() => setShowFavorites(!showFavorites)}
              sx={{ height: '56px' }}
            >
              {showFavorites ? 'All Countries' : 'Favorites'}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <ButtonGroup variant="outlined" fullWidth>
                <Button
                  startIcon={<SortIcon />}
                  onClick={() => handleSort('name')}
                  variant={sortBy === 'name' ? 'contained' : 'outlined'}
                >
                  Name
                </Button>
                <Button
                  startIcon={<PublicIcon />}
                  onClick={() => handleSort('population')}
                  variant={sortBy === 'population' ? 'contained' : 'outlined'}
                >
                  Population
                </Button>
                <Button
                  startIcon={<LanguageIcon />}
                  onClick={() => handleSort('area')}
                  variant={sortBy === 'area' ? 'contained' : 'outlined'}
                >
                  Area
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant={showStats ? "contained" : "outlined"}
                startIcon={<BarChartIcon />}
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? 'Hide Statistics' : 'Show Statistics'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {showStats && <Statistics countries={countries} />}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayedCountries.map((country) => (
            <Grid key={country.cca3} item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
              <Card 
                className="country-card"
                sx={{ 
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CardHeader
                  sx={{ color: 'white' }}
                  action={
                    <IconButton
                      onClick={(e) => handleAddToFavorites(e, country)}
                      color={favorites.some(fav => fav.cca3 === country.cca3) ? "warning" : "default"}
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      {favorites.some(fav => fav.cca3 === country.cca3) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  }
                />
                <CardMedia
                  component="img"
                  className="flag-img"
                  image={country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  onClick={() => setSelectedCountry(country)}
                />
                <CardContent sx={{ flexGrow: 1, color: 'white' }}>
                  <Typography variant="h6" gutterBottom className="card-title">
                    {country.name.common}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" className="card-text">
                      Region: {country.region}
                    </Typography>
                    <Typography variant="body2" className="card-text">
                      Capital: {country.capital}
                    </Typography>
                    <Typography variant="body2" className="card-text">
                      Population: {country.population.toLocaleString()}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Button 
                    size="small" 
                    onClick={() => setSelectedCountry(country)}
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedCountry && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{selectedCountry.name.common}</Typography>
                <IconButton onClick={() => setSelectedCountry(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card elevation={0}>
                    <CardMedia
                      component="img"
                      image={selectedCountry.flags.png}
                      alt={`Flag of ${selectedCountry.name.common}`}
                      sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                    />
                  </Card>
                  {selectedCountry.coatOfArms?.png && (
                    <Card elevation={0} sx={{ mt: 2 }}>
                      <CardMedia
                        component="img"
                        image={selectedCountry.coatOfArms.png}
                        alt={`Coat of Arms of ${selectedCountry.name.common}`}
                        sx={{ height: 100, objectFit: 'contain' }}
                      />
                    </Card>
                  )}
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack spacing={2}>
                    <Typography variant="h6">Official Name: {selectedCountry.name.official}</Typography>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <Typography><strong>Capital:</strong> {selectedCountry.capital}</Typography>
                          <Typography><strong>Region:</strong> {selectedCountry.region}</Typography>
                          <Typography><strong>Subregion:</strong> {selectedCountry.subregion}</Typography>
                          <Typography>
                            <strong>Population:</strong> {selectedCountry.population.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <Typography>
                            <strong>Languages:</strong>
                            <Box sx={{ mt: 1 }}>
                              {Object.values(selectedCountry.languages || {}).map((lang, index) => (
                                <Chip 
                                  key={index} 
                                  label={lang} 
                                  size="small" 
                                  sx={{ mr: 0.5, mb: 0.5 }} 
                                />
                              ))}
                            </Box>
                          </Typography>
                          <Typography>
                            <strong>Currencies:</strong>
                            <Box sx={{ mt: 1 }}>
                              {Object.values(selectedCountry.currencies || {}).map((curr, index) => (
                                <Chip 
                                  key={index} 
                                  label={`${curr.name} (${curr.symbol})`} 
                                  size="small" 
                                  sx={{ mr: 0.5, mb: 0.5 }} 
                                />
                              ))}
                            </Box>
                          </Typography>
                          <Typography><strong>Area:</strong> {selectedCountry.area?.toLocaleString()} km²</Typography>
                          <Typography><strong>Time Zones:</strong> {selectedCountry.timezones?.join(', ')}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedCountry.maps?.googleMaps && (
                <Button 
                  href={selectedCountry.maps.googleMaps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </Button>
              )}
              {selectedCountry.maps?.openStreetMaps && (
                <Button 
                  href={selectedCountry.maps.openStreetMaps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on OpenStreetMap
                </Button>
              )}
              <Button onClick={() => setSelectedCountry(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CountryList;