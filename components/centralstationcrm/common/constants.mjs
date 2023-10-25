const DEFAULT_LIMIT = 25;

const GENDER = [
  {
    value: "gender_unknown",
    label: "Unknown",
  },
  {
    value: "male_user",
    label: "Male",
  },
  {
    value: "female_user",
    label: "Female",
  },
  {
    value: "family_user",
    label: "Family",
  },
  {
    value: "diverse_user",
    label: "Diverse",
  },
];

const VALUE_TYPE = [
  "total",
  "monthly",
  "hourly",
  "daily",
];

const CURRENT_STATE = [
  {
    value: "open_0",
    label: "New",
  },
  {
    value: "open_25",
    label: "25%",
  },
  {
    value: "open_50",
    label: "50%",
  },
  {
    value: "open_75",
    label: "75%",
  },
  {
    value: "won",
    label: "Won",
  },
  {
    value: "lost",
    label: "Lost",
  },
];

export default {
  DEFAULT_LIMIT,
  GENDER,
  VALUE_TYPE,
  CURRENT_STATE,
};
