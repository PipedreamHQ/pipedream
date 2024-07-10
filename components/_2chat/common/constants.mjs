const TIME_PERIODS = [
  {
    value: "all-time",
    label: "Will trigger the new conversation event when the user messages you for the first time ever",
  },
  {
    value: "hour",
    label: "Will trigger the new conversation event after 1 hour of no messages",
  },
  {
    value: "day",
    label: "Will trigger the new conversation event after 1 day of no messages",
  },
  {
    value: "week",
    label: "Will trigger the new conversation event after 1 week of no messages",
  },
  {
    value: "month",
    label: "Will trigger the new conversation event after 1 month of no messages",
  },
  {
    value: "year",
    label: "Will trigger the new conversation event after 1 year of no messages",
  },
];

export default {
  TIME_PERIODS,
};
