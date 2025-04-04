const DEFAULT_PAGE_LIMIT = 20; // max is 500 per page

const STATUS_OPTIONS = [
  "open",
  "won",
  "lost",
  "deleted",
];

const FIELD_OPTIONS = [
  "custom_fields",
  "email",
  "notes",
  "phone",
  "name",
];

const VISIBLE_TO_OPTIONS = [
  {
    label: "Owner & followers (private)",
    value: 1,
  },
  {
    label: "Entire company (shared)",
    value: 3,
  },
];

const INCLUDE_FIELDS_OPTIONS = [
  "person.picture",
];

const FIELD = {
  ADD_TIME: "add_time",
  UPDATE_TIME: "update_time",
};

export default {
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  VISIBLE_TO_OPTIONS,
  INCLUDE_FIELDS_OPTIONS,
  DEFAULT_PAGE_LIMIT,
  FIELD,
};
