const CHARACTER_SETS = [
  "GSM",
  "Unicode",
  "Auto",
];

const LANGUAGES = [
  {
    label: "English UK",
    value: "en-GB",
  },
  {
    label: "English Australian",
    value: "en-AU",
  },
  {
    label: "French",
    value: "fr-FR",
  },
  {
    label: "Spanish",
    value: "es-ES",
  },
  {
    label: "German",
    value: "de-DE",
  },
];

const MESSAGE_STATUSES = [
  "Acknowledged",
  "Authorised",
  "Connecting",
  "Delivered",
  "Dispatched",
  "Expired",
  "Failed",
  "FailedAuthorisation",
  "PartiallyDelivered",
  "Processing",
  "Queued",
  "Rejected",
  "Scheduled",
  "Sent",
  "Submitted",
];

const MESSAGE_TYPES = [
  "SMS",
  "Voice",
];

export default {
  CHARACTER_SETS,
  LANGUAGES,
  MESSAGE_STATUSES,
  MESSAGE_TYPES,
};
