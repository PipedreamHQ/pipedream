import states from "./states.mjs";
import militaryStates from "./military-states.mjs";
import directions from "./directions.mjs";

const BASE_URL = "https://app.docupost.com";
const VERSION_PATH = "/api/1.1/wf";
const TWO_LETTER_ABBREVIATION_CODES = states.concat(militaryStates).concat(directions);

export default {
  BASE_URL,
  VERSION_PATH,
  TWO_LETTER_ABBREVIATION_CODES,
};
