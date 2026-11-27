const BASE_URL = "https://api.sign.cylontechnology.com/api/v1";

// Mirrors EnvelopeStatusEnum in the NevTan Sign API.
// REJECTED covers both "declined by a signer" and "voided by the sender".
const ENVELOPE_STATUS = {
  DRAFT: 1,
  SENT: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  REJECTED: 5,
  ON_HOLD: 6,
};

const ENVELOPE_STATUS_LABELS = {
  [ENVELOPE_STATUS.DRAFT]: "Draft",
  [ENVELOPE_STATUS.SENT]: "Sent",
  [ENVELOPE_STATUS.IN_PROGRESS]: "In Progress",
  [ENVELOPE_STATUS.COMPLETED]: "Completed",
  [ENVELOPE_STATUS.REJECTED]: "Declined / Voided",
  [ENVELOPE_STATUS.ON_HOLD]: "On Hold",
};

const ENVELOPE_STATUS_OPTIONS = Object.entries(ENVELOPE_STATUS_LABELS).map(([
  value,
  label,
]) => ({
  label,
  value: Number(value),
}));

// Number of existing envelopes emitted as sample events when a source is deployed.
const MAX_HISTORICAL_EVENTS = 25;

export default {
  BASE_URL,
  ENVELOPE_STATUS,
  ENVELOPE_STATUS_LABELS,
  ENVELOPE_STATUS_OPTIONS,
  MAX_HISTORICAL_EVENTS,
};
