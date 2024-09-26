export const LIMIT = 100;

export const MESSAGE_OPTIONS = [
  "visitor.dial-completed",
  "visitor.call-scheduled",
  "manager.call-completed",
  "user.missed-call-complaint",
];

export const CALL_STATUSES = [
  {
    label: "New",
    value: "new",
  },
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "In Progress",
    value: "in-progress",
  },
  {
    label: "Ringing",
    value: "ringing",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Manager Failed",
    value: "manager-failed",
  },
  {
    label: "User Failed",
    value: "user-failed",
  },
  {
    label: "Failed",
    value: "failed",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];
