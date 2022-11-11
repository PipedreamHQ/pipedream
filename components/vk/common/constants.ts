const BASE_URL = "https://api.vk.com";
const VERSION_PATH = "/method";
const API_VERSION = "5.131";

const SUBTYPES_OPTIONS = [
  {
    label: "Place or small business",
    value: 1,
  },
  {
    label: "Company, organizaton or website",
    value: 2,
  },
  {
    label: "Famous person or group of people",
    value: 3,
  },
  {
    label: "Product or work of art",
    value: 4,
  },
];

const WEBHOOK_ID = "webhookId";
const SECRET_KEY = "secretKey";

export default {
  BASE_URL,
  VERSION_PATH,
  API_VERSION,
  SUBTYPES_OPTIONS,
  WEBHOOK_ID,
  SECRET_KEY,
};
