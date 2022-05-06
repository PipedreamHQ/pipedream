const BASE_URL = "https://api.openweathermap.org";

const GEO_PATH = "/geo";
const GEO_VERSION_PATH = "/1.0";

const WEATHER_PATH = "/data";
const WEATHER_VERSION_PATH = "/2.5";

const FORCAST_PATH = "/data";
const FORCAST_VERSION_PATH = "/2.5/forecast";

const Category = {
  GEO: 1,
  WEATHER: 2,
  FORCAST: 3,
};

export default {
  BASE_URL,
  GEO_PATH,
  GEO_VERSION_PATH,
  WEATHER_PATH,
  WEATHER_VERSION_PATH,
  FORCAST_PATH,
  FORCAST_VERSION_PATH,
  Category,
};
