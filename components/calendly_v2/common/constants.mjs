export const MEMBERSHIP_ROLE_OPTIONS = [
  "owner",
  "admin",
  "user",
];

export const MAX_CANCELLATION_REASON_LENGTH = 10000;

export default {
  scopes: [
    "user",
    "organization",
  ],
  statuses: [
    "active",
    "canceled",
  ],
  listEventsScopes: [
    "authenticatedUser",
    "organization",
    "user",
    "group",
  ],
  MEMBERSHIP_ROLE_OPTIONS,
  MAX_CANCELLATION_REASON_LENGTH,
};
