const BASE_URL = "https://tablejourney.com/api/v1";
const DOCS_URL = "https://tablejourney.com/api/v1/docs";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_STAYS_LIMIT = 50;

const KIND_OPTIONS = [
  {
    label: "Group: places to eat",
    value: "eat",
  },
  {
    label: "Group: places to drink",
    value: "drink",
  },
  {
    label: "Group: bakeries and cafes",
    value: "bake",
  },
  {
    label: "Group: food tours, classes, day trips and festivals",
    value: "do",
  },
  "restaurants",
  "casual-dining",
  "fine-dining",
  "street-food",
  "budget-eating",
  "hidden-gems",
  "brunch",
  "late-night",
  "markets",
  "bars",
  "wine-bars",
  "breweries",
  "nightlife",
  "cafes",
  "coffee-roasters",
  "bakeries",
  "food-tours",
  "cooking-classes",
  "day-trips-food",
  "festivals",
];

const DIETARY_OPTIONS = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "halal",
  "kosher",
  "dairy-free",
  "nut-free",
  "pescatarian",
];

const PARTNER_OPTIONS = [
  {
    label: "GetYourGuide",
    value: "gyg",
  },
  {
    label: "Viator",
    value: "viator",
  },
  {
    label: "Musement",
    value: "musement",
  },
];

export default {
  BASE_URL,
  DOCS_URL,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MAX_STAYS_LIMIT,
  KIND_OPTIONS,
  DIETARY_OPTIONS,
  PARTNER_OPTIONS,
};
