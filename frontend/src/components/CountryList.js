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
  Divider,
  Container
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
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4,
          width: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
      >
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
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
                    sx={{ 
                      ml: 1,
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976d2 20%, #1565c0 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)'
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 5px rgba(25, 118, 210, 0.4)'
                      }
                    }}
                  >
                    Search
                  </Button>
                ),
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }
                }
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                }
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
              InputProps={{
                sx: {
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    }
                  }
                }
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiMenuItem-root': {
                  color: 'white',
                }
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
              InputProps={{
                sx: {
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    }
                  }
                }
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiMenuItem-root': {
                  color: 'white',
                }
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
              sx={{ 
                height: '56px',
                background: showFavorites ? 
                  'linear-gradient(135deg, #FFA000 0%, #FF6F00 100%)' : 
                  'transparent',
                border: showFavorites ? 
                  'none' : 
                  '1px solid rgba(255, 255, 255, 0.3)',
                color: showFavorites ? 
                  'white' : 
                  'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                boxShadow: showFavorites ?
                  '0 4px 10px rgba(255, 160, 0, 0.3)' :
                  'none',
                '&:hover': {
                  background: showFavorites ?
                    'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)' :
                    'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  transform: 'translateY(-2px)',
                  boxShadow: showFavorites ?
                    '0 6px 15px rgba(255, 160, 0, 0.4)' :
                    '0 4px 10px rgba(255, 255, 255, 0.2)'
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: showFavorites ?
                    '0 2px 5px rgba(255, 160, 0, 0.4)' :
                    '0 2px 5px rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {showFavorites ? 'All Countries' : 'Favorites'}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <ButtonGroup 
                variant="outlined" 
                fullWidth
                sx={{
                  '& .MuiButton-root': {
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      borderColor: 'transparent',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976d2 20%, #1565c0 100%)',
                      }
                    }
                  }
                }}
              >
                <Button
                  startIcon={<SortIcon />}
                  onClick={() => handleSort('name')}
                  className={sortBy === 'name' ? 'Mui-selected' : ''}
                >
                  Name
                </Button>
                <Button
                  startIcon={<PublicIcon />}
                  onClick={() => handleSort('population')}
                  className={sortBy === 'population' ? 'Mui-selected' : ''}
                >
                  Population
                </Button>
                <Button
                  startIcon={<LanguageIcon />}
                  onClick={() => handleSort('area')}
                  className={sortBy === 'area' ? 'Mui-selected' : ''}
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
                sx={{
                  height: '100%',
                  background: showStats ? 
                    'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' : 
                    'rgba(255, 255, 255, 0.05)',
                  border: showStats ? 
                    'none' : 
                    '1px solid rgba(255, 255, 255, 0.3)',
                  color: showStats ? 
                    'white' : 
                    'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  boxShadow: showStats ?
                    '0 4px 10px rgba(46, 125, 50, 0.3)' :
                    'none',
                  '&:hover': {
                    background: showStats ?
                      'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)' :
                      'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateY(-2px)',
                    boxShadow: showStats ?
                      '0 6px 15px rgba(46, 125, 50, 0.4)' :
                      '0 4px 10px rgba(255, 255, 255, 0.2)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: showStats ?
                      '0 2px 5px rgba(46, 125, 50, 0.4)' :
                      '0 2px 5px rgba(255, 255, 255, 0.1)'
                  }
                }}
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
        <Grid 
          container 
          spacing={3}
          sx={{ 
            width: '100%',
            m: 0,
            '& .MuiGrid-item': {
              pl: 3,
              pr: 3,
            }
          }}
        >
          {displayedCountries.map((country) => (
            <Grid 
              key={country.cca3} 
              item 
              xs={12}
              sm={6}
              md={3}
              sx={{
                display: 'flex'
              }}
            >
              <Card 
                className="country-card"
                sx={{ 
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '320px', // Fixed height for uniformity
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  transform: 'perspective(1000px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'perspective(1000px) translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
                  }
                }}
                onClick={() => setSelectedCountry(country)}
              >
                <Box 
                  className="flag-container" 
                  sx={{
                    height: '160px',
                    width: '100%',
                    maxWidth: '270px',
                    minWidth: '270px',
                    margin: '3 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    p: 2,
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <CardMedia
                    component="img"
                    className="flag-img"
                    image={country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    sx={{
                      width: '120%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    color: 'white',
                    p: 2,
                    '&:last-child': {
                      pb: 2
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    className="card-title"
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      pb: 1
                    }}
                  >
                    {country.name.common}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography 
                      variant="body2" 
                      className="card-text"
                      sx={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      <strong>Region:</strong> {country.region}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="card-text"
                      sx={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      <strong>Population:</strong> {country.population.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        animation: 'pulseText 2s ease-in-out infinite',
                        fontSize: '0.8rem',
                        flex: 1,
                        textAlign: 'center',
                        '@keyframes pulseText': {
                          '0%, 100%': { opacity: 0.5 },
                          '50%': { opacity: 1 }
                        }
                      }}
                    >
                      Click to view more details
                    </Typography>
                    <IconButton
                      onClick={(e) => handleAddToFavorites(e, country)}
                      sx={{
                        color: favorites.some(fav => fav.cca3 === country.cca3) ? 'gold' : 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: 'gold',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      {favorites.some(fav => fav.cca3 === country.cca3) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Box>
                </CardContent>
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
                  <Card elevation={0} sx={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                    <CardMedia
                      component="img"
                      image={selectedCountry.flags.png}
                      alt={`Flag of ${selectedCountry.name.common}`}
                      sx={{ 
                        objectFit: 'contain',
                        bgcolor: '#f5f5f5',
                        height: '200px',
                        width: '100%'
                      }}
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