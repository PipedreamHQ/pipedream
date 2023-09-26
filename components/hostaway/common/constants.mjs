const DEFAULT_LIMIT = 20;

const CATEGORIES = [
  {
    value: 1,
    label: "Cleaning",
  },
  {
    value: 2,
    label: "Maintenance",
  },
  {
    value: 3,
    label: "Check-in",
  },
  {
    value: 4,
    label: "Check-out",
  },
  {
    value: 5,
    label: "Back office",
  },
  {
    value: 6,
    label: "Other",
  },
];

const TASK_STATUS = [
  "pending",
  "confirmed",
  "inProgress",
  "completed",
  "cancelled",
];

const COMMUNICATION_TYPES = [
  "email",
  "channel",
  "sms",
  "whatsapp",
];

export default {
  DEFAULT_LIMIT,
  CATEGORIES,
  TASK_STATUS,
  COMMUNICATION_TYPES,
};
