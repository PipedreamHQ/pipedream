const BASE_URL = "https://api.metatext.ai";
const VERSION_PATH = "/v1";

const MODEL_TYPE = {
  ANSWERING: {
    value: "answering",
    label: "Answering",
  },
  CLASSIFICATION: {
    value: "inference",
    label: "Classification",
  },
  GENERATION: {
    value: "generation",
    label: "Generation",
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  MODEL_TYPE,
};
