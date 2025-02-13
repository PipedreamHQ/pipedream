const LOCATION_TYPES = [
  "country",
  "state",
  "city",
  "postcode",
  "street",
  "amenity",
  "locality",
];

const FORMATS = [
  "json",
  "xml",
  "geojson",
];

const TRANSPORTATION_MODES = [
  "drive",
  "light_truck",
  "medium_truck",
  "truck",
  "heavy_truck",
  "truck_dangerous_goods",
  "long_truck",
  "bus",
  "scooter",
  "motorcycle",
  "bicycle",
  "mountain_bike",
  "road_bike",
  "walk",
  "hike",
  "transit",
  "approximated_transit",
];

const ROUTE_OPTIMIZATION_TYPES = [
  "balanced",
  "short",
  "less_maneuvers",
];

const UNITS = [
  "metric",
  "imperial",
];

export default {
  LOCATION_TYPES,
  FORMATS,
  TRANSPORTATION_MODES,
  ROUTE_OPTIMIZATION_TYPES,
  UNITS,
};
