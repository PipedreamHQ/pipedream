export default {
  REGISTRANT_STATUSES_OPTIONS: [
    "pending",
    "approved",
    "denied",
  ],
  PURCHASING_TIME_FRAME_OPTIONS: [
    "Within a month",
    "1-3 months",
    "4-6 months",
    "More than 6 months",
    "No timeframe",
  ],
  ROLE_IN_PURCHASE_PROCESS_OPTIONS: [
    "Decision Maker",
    "Evaluator/Recommender",
    "Influencer",
    "Not involved",
  ],
  NUMBER_OF_EMPLOYEES_OPTIONS: [
    "1-20",
    "21-50",
    "51-100",
    "101-500",
    "501-1,000",
    "1,001-5,000",
    "5,001-10,000",
    "More than 10,000",
  ],
  MEETING_TYPE_OPTIONS: [
    {
      label: "An instant meeting",
      value: 1,
    },
    {
      label: "A scheduled meeting",
      value: 2,
    },
    {
      label: "A recurring meeting with no fixed time",
      value: 3,
    },
    {
      label: "A recurring meeting with fixed time",
      value: 8,
    },
  ],
  RECURRENCE_TYPE_OPTIONS: [
    {
      label: "Daily",
      value: 1,
    },
    {
      label: "Weekly",
      value: 2,
    },
    {
      label: "Monthly",
      value: 3,
    },
  ],
  RECURRENCE_MONTHLY_WEEK_OPTIONS: [
    {
      label: "Last week of the month.",
      value: -1,
    },
    {
      label: "First week of the month.",
      value: 1,
    },
    {
      label: "Second week of the month.",
      value: 2,
    },
    {
      label: "Third week of the month.",
      value: 3,
    },
    {
      label: "Fourth week of the month.",
      value: 4,
    },
  ],
  SETTINGS_JOIN_BEFORE_HOST_TIME_OPTIONS: [
    {
      label: "Allow the participant to join the meeting anytime",
      value: 0,
    },
    {
      label: "Allow the participant to join 5 minutes before the meeting's start time",
      value: 5,
    },
    {
      label: "Allow the participant to join 5 minutes before the meeting's start time",
      value: 10,
    },
  ],
  SETTINGS_APPROVAL_TYPE_OPTIONS: [
    {
      label: "Automatically approve registration.",
      value: 0,
    },
    {
      label: "Manually approve registration.",
      value: 1,
    },
    {
      label: "No registration required.",
      value: 2,
    },
  ],
  REGISTRATION_TYPE_OPTIONS: [
    {
      label: "Attendees register once and can attend any meeting occurrence.",
      value: 1,
    },
    {
      label: "Attendees must register for each meeting occurrence.",
      value: 2,
    },
    {
      label: "Attendees register once and can select one or more meeting occurrences to attend.",
      value: 3,
    },
  ],
  SETTINGS_AUDIO_OPTIONS: [
    {
      label: "Both telephony and VoIP.",
      value: "both",
    },
    {
      label: "VoIP only.",
      value: "voip",
    },
    {
      label: "Telephony only.",
      value: "telephony",
    },
  ],
  SETTINGS_AUDIO_RECORDING_OPTIONS: [
    {
      label: "Auto-recording disabled.",
      value: "none",
    },
    {
      label: "Record the meeting locally.",
      value: "local",
    },
    {
      label: "Record the meeting to the cloud.",
      value: "cloud",
    },
  ],
  WEBINAR_TYPE_OPTIONS: [
    {
      label: "Webinar",
      value: 5,
    },
    {
      label: "Recurring webinar with no fixed time",
      value: 6,
    },
    {
      label: "Recurring webinar with fixed time",
      value: 9,
    },
  ],
  DAYS_OF_THE_WEEK_OPTIONS: [
    {
      label: "Sunday",
      value: 1,
    },
    {
      label: "Monday",
      value: 2,
    },
    {
      label: "Tuesday",
      value: 3,
    },
    {
      label: "Wednesday",
      value: 4,
    },
    {
      label: "Thursday",
      value: 5,
    },
    {
      label: "Friday",
      value: 6,
    },
    {
      label: "Saturday",
      value: 7,
    },
  ],
  CLOUD_RECORD_ACTION_OPTIONS: [
    {
      label: "Move recording to trash",
      value: "trash",
    },
    {
      label: "Delete recording permanently",
      value: "delete",
    },
  ],
  CLOUD_RECORD_TRASH_TYPE_OPTIONS: [
    {
      label: "List all meeting recordings from the trash",
      value: "meeting_recordings",
    },
    {
      label: "List all individual recording files from the trash",
      value: "recording_file",
    },
  ],
  LIST_MEETINGS_TYPE_OPTIONS: [
    "scheduled",
    "live",
    "upcoming",
  ],
  UPDATE_MEETING_REGISTRANT_ACTION_OPTIONS: [
    "approve",
    "cancel",
    "deny",
  ],
};
