const BASE_URL = "https://public-api.granola.ai";
const VERSION_PATH = "/v1";

// The API caps page_size at 30 per request; paginate internally at the max.
const PAGE_SIZE = 30;
const DEFAULT_MAX_RESULTS = 100;

const NOTE_INCLUDE = {
  TRANSCRIPT: "transcript",
};

export default {
  BASE_URL,
  VERSION_PATH,
  PAGE_SIZE,
  DEFAULT_MAX_RESULTS,
  NOTE_INCLUDE,
};
