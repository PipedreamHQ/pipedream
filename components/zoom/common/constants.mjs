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

const MEETING_SUMMARY_TYPES = [
  {
    value: "scheduled",
    label: "Scheduled meetings",
  },
  {
    value: "instant",
    label: "Instant meetings",
  },
  {
    value: "recurring",
    label: "Recurring meetings",
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
  MEETING_TYPES,
  MEETING_SUMMARY_TYPES,
  CLOUD_RECORD_TRASH_TYPE_OPTIONS,
};
