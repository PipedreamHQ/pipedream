export const LIMIT = 200;

export const MODE_OPTIONS = [
  {
    label: "Countersign Task",
    value: 1,
  },
  {
    label: "Or-sign Task",
    value: 2,
  },
];

export const VC_TYPE_OPTIONS = [
  {
    label: "Lark video conferencing. When this type is selected, other fields of `vchat` are invalid.",
    value: "vc",
  },
  {
    label: "Third-party linked video conferencing. When this type is selected, only the `Icon Type`, `Description`, and	`Meeting URL` fields of `vchat` will take effect.",
    value: "third_party",
  },
  {
    label: "No video conferencing. When this type is selected, other fields of `vchat` are invalid.",
    value: "no_meeting",
  },
  {
    label: "Lark Live. Read-only enumeration value, used only on the client side, not supported through API calls.",
    value: "lark_live",
  },
  {
    label: "Unknown type. Read-only enumeration value, only used for client compatibility, does not support API calls.",
    value: "unknown",
  },
];

export const ICON_TYPE_OPTIONS = [
  {
    label: "Lark Video Conference icon.",
    value: "vc",
  },
  {
    label: "Livestream video conference icon.",
    value: "live",
  },
  {
    label: "Default icon.",
    value: "default",
  },
];

export const VISIBILITY_OPTIONS = [
  {
    label: "Default range, which depends on the calendar visibility. Only the availability status is visible to other people by default.",
    value: "default",
  },
  {
    label: "Public. Event details are displayed.",
    value: "public",
  },
  {
    label: "Private. Details are visible only to the current identity.",
    value: "private",
  },
];

export const ATTENDEE_ABILITY_OPTIONS = [
  {
    label: "Cannot edit events, cannot invite others, and cannot view event invitee list.",
    value: "none",
  },
  {
    label: "Cannot edit events, can invite others, and can view event invitee list.",
    value: "can_see_others",
  },
  {
    label: "Cannot edit events, can invite others, and can view event invitee list.",
    value: "can_invite_others",
  },
  {
    label: "Can edit events, can invite others, and can view event invitee list.",
    value: "can_modify_event",
  },
];

export const FREE_BUSY_STATUS_OPTIONS = [
  {
    label: "Busy. The event is busy.",
    value: "busy",
  },
  {
    label: "Free. The event is free.",
    value: "free",
  },
];
