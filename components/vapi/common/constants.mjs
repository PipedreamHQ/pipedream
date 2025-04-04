export const LIMIT = 1000;

export const FIRST_MESSAGE_MODE_OPTIONS = [
  {
    label: "Assistant Speaks First",
    value: "assistant-speaks-first",
  },
  {
    label: "Assistant Waits for User",
    value: "assistant-waits-for-user",
  },
  {
    label: "Assistant Speaks First with Model Generated Message",
    value: "assistant-speaks-first-with-model-generated-message",
  },
];

export const CLIENT_MESSAGE_OPTIONS = [
  "conversation-update",
  "function-call",
  "function-call-result",
  "hang",
  "language-changed",
  "metadata",
  "model-output",
  "speech-update",
  "status-update",
  "transcript",
  "tool-calls",
  "tool-calls-result",
  "transfer-update",
  "user-interrupted",
  "voice-input",
];

export const SERVER_MESSAGE_OPTIONS = [
  "conversation-update",
  "end-of-call-report",
  "function-call",
  "hang",
  "language-changed",
  "language-change-detected",
  "model-output",
  "phone-call-control",
  "speech-update",
  "status-update",
  "transcript",
  "transcript[transcriptType=\"final\"]",
  "tool-calls",
  "transfer-destination-request",
  "transfer-update",
  "user-interrupted",
  "voice-input",
];

export const BACKGROUND_SOUND = [
  {
    label: "Office",
    value: "office",
  },
  {
    label: "Off",
    value: "off",
  },
];
