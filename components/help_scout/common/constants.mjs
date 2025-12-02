export const PHOTO_TYPE_OPTIONS = [
  "unknown",
  "gravatar",
  "twitter",
  "facebook",
  "googleprofile",
  "googleplus",
  "linkedin",
  "instagram",
];

export const GENDER_OPTIONS = [
  "male",
  "female",
  "unknown",
];

export const CONVERSATION_OPERATIONS = [
  {
    label: "Change subject",
    path: "/subject",
    operation: "replace",
    type: "string",
  },
  {
    label: "Change customer",
    path: "/primaryCustomer.id",
    operation: "replace",
    type: "number",
  },
  {
    label: "Publish draft",
    path: "/draft",
    operation: "replace",
    type: "boolean",
  },
  {
    label: "Move conversation to another inbox",
    path: "/mailboxId",
    operation: "move",
    type: "number",
  },
  {
    label: "Change conversation status",
    path: "/status",
    operation: "replace",
    type: "string",
  },
  {
    label: "Change conversation owner",
    path: "/assignTo",
    operation: "replace",
    type: "number",
  },
  {
    label: "Un-assign conversation",
    path: "/assignTo",
    operation: "remove",
    type: "number",
  },
];
