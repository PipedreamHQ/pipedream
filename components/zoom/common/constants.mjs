const BASE_URL = "https://api.zoom.us";
const VERSION_PATH = "/v2";
const MAX_RESOURCES = 300;
const NUMERIC_MEETING_ID_REGEX = /^\d+$/;

const ERROR_CODES = {
  TRANSCRIPT_NOT_FOUND: 3322,
};

const RECORDING_FILE_TYPES = {
  TRANSCRIPT: "TRANSCRIPT",
};
const RECORDING_STATUS_COMPLETED = "completed";

const TRANSCRIPT_RESTRICTION_REASONS = {
  NOT_READY: "NOT_READY",
  NO_TRANSCRIPT_DATA: "NO_TRANSCRIPT_DATA",
};

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

const CLOUD_RECORD_TRASH_TYPE_OPTIONS = [
  {
    label: "List all meeting recordings from the trash",
    value: "meeting_recordings",
  },
  {
    label: "List all individual recording files from the trash",
    value: "recording_file",
  },
];

export default {
  BASE_URL,
  VERSION_PATH,
  MAX_RESOURCES,
  NUMERIC_MEETING_ID_REGEX,
  ERROR_CODES,
  RECORDING_FILE_TYPES,
  RECORDING_STATUS_COMPLETED,
  TRANSCRIPT_RESTRICTION_REASONS,
  MEETING_TYPES,
  CLOUD_RECORD_TRASH_TYPE_OPTIONS,
};
