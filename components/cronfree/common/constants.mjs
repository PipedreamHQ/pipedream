import utils from "./utils.mjs";

const BASE_URL = "https://login.cronfree.com";
const VERSION_PATH = "/zapier";

const WEEKDAYS = [
  {
    label: "Every Day",
    value: "-1",
  },
  {
    label: "Sunday",
    value: "0",
  },
  {
    label: "Monday",
    value: "1",
  },
  {
    label: "Tuesday",
    value: "2",
  },
  {
    label: "Wednesday",
    value: "3",
  },
  {
    label: "Thursday",
    value: "4",
  },
  {
    label: "Friday",
    value: "5",
  },
  {
    label: "Saturday",
    value: "6",
  },
];

const MONTHS = [
  {
    label: "Every Month",
    value: "-1",
  },
  {
    label: "January",
    value: "1",
  },
  {
    label: "February",
    value: "2",
  },
  {
    label: "March",
    value: "3",
  },
  {
    label: "April",
    value: "4",
  },
  {
    label: "May",
    value: "5",
  },
  {
    label: "June",
    value: "6",
  },
  {
    label: "July",
    value: "7",
  },
  {
    label: "August",
    value: "8",
  },
  {
    label: "September",
    value: "9",
  },
  {
    label: "October",
    value: "10",
  },
  {
    label: "November",
    value: "11",
  },
  {
    label: "December",
    value: "12",
  },
];

const DAYS = [
  {
    label: "Every Day",
    value: "-1",
  },
  ...Array.from({
    length: 31,
  }, (_, index) => ({
    label: `${index + 1}`,
    value: `${index + 1}`,
  })),
];

const HOURS = [
  {
    label: "Every Hour",
    value: "-1",
  },
  ...Array.from({
    length: 24,
  }, (_, index) => ({
    label: `${utils.padZero(index)}:00`,
    value: `${index}`,
  })),
];

const MINUTES = [
  {
    label: "Every Minute",
    value: "-1",
  },
  ...Array.from({
    length: 60,
  }, (_, index) => ({
    label: `00:${utils.padZero(index)}`,
    value: `${index}`,
  })),
];

export default {
  BASE_URL,
  VERSION_PATH,
  WEEKDAYS,
  MONTHS,
  DAYS,
  HOURS,
  MINUTES,
};
