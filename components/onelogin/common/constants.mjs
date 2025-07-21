export const MAPPINGS_OPTIONS = [
  {
    label: "Async - Mappings run after the API returns a response",
    value: "async",
  },
  {
    label: "Sync - Mappings run before the API returns a response",
    value: "sync",
  },
  {
    label: "Disabled - Mappings don't run for this user",
    value: "disabled",
  },
];

export const PASSWORD_ALGORITHM_OPTIONS = [
  "salt+sha256",
  "sha256+salt",
  "bcrypt",
];

export const STATE_OPTIONS = [
  {
    label: "Unapproved",
    value: "0",
  },
  {
    label: "Approved",
    value: "1",
  },
  {
    label: "Rejected",
    value: "2",
  },
  {
    label: "Unlicensed",
    value: "3",
  },
];

export const STATUS_OPTIONS = [
  {
    label: "Unactivated",
    value: "0",
  },
  {
    label: "Active",
    value: "1",
  },
  {
    label: "Suspended",
    value: "2",
  },
  {
    label: "Locked",
    value: "3",
  },
  {
    label: "Password Expired",
    value: "4",
  },
  {
    label: "Awaiting Password Reset",
    value: "5",
  },
  {
    label: "Password Pending",
    value: "7",
  },
  {
    label: "Security Questions Required",
    value: "8",
  },
];

export const EVENT_TYPES = {
  USER_CREATED: 1,
  LOGIN_ATTEMPT: 2,
  DIRECTORY_SYNC: 3,
};

export const LOGIN_STATUS_OPTIONS = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Successful",
    value: "success",
  },
  {
    label: "Failed",
    value: "failed",
  },
];

export const SYNC_STATUS_OPTIONS = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Success",
    value: "success",
  },
  {
    label: "Failed",
    value: "failed",
  },
  {
    label: "In Progress",
    value: "in_progress",
  },
];
