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

const CHANNEL_OPTIONS = [
  {
    value: 2018,
    label: "airbnbOfficial",
  },
  {
    value: 2002,
    label: "homeaway",
  },
  {
    value: 2005,
    label: "bookingcom",
  },
  {
    value: 2007,
    label: "expedia",
  },
  {
    value: 2009,
    label: "homeawayical",
  },
  {
    value: 2010,
    label: "vrboical",
  },
  {
    value: 2000,
    label: "direct",
  },
  {
    value: 2013,
    label: "bookingengine",
  },
  {
    value: 2015,
    label: "customIcal",
  },
  {
    value: 2016,
    label: "tripadvisorical",
  },
  {
    value: 2017,
    label: "wordpress",
  },
  {
    value: 2019,
    label: "marriott",
  },
  {
    value: 2020,
    label: "partner",
  },
  {
    value: 2021,
    label: "gds",
  },
  {
    value: 2022,
    label: "google",
  },
];

export default {
  DEFAULT_LIMIT,
  CATEGORIES,
  TASK_STATUS,
  COMMUNICATION_TYPES,
  CHANNEL_OPTIONS,
};
