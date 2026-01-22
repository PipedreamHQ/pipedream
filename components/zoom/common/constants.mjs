const BASE_URL = "https://api.zoom.us";
const VERSION_PATH = "/v2";
const MAX_RESOURCES = 300;

const MEETING_TYPES = [
  {
    value: "scheduled",
    label: "All valid previous (unexpired) meetings, live meetings, and upcoming scheduled meetings",
  },
  {
    value: "live",
    label: "All ongoing meetings",
  },
  {
    value: "upcoming",
    label: "All upcoming meetings, including live meetings",
  },
  {
    value: "previous_meetings",
    label: "All the previous meetings",
  },
];

export default {
  BASE_URL,
  VERSION_PATH,
  MAX_RESOURCES,
  MEETING_TYPES,
};
