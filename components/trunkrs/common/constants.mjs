const COUNTRIES = [
  {
    value: "NL",
    label: "Netherlands",
  },
  {
    value: "BE",
    label: "Belgium",
  },
];

const WEBHOOK_EVENTS = [
  "onStateUpdate",
  "onCreation",
  "onCancellation",
  "onReview",
];

const SHIPMENT_SORT_FIELDS = [
  "trunkrsNr",
  "-trunkrsNr",
  "recipient.name",
  "-recipient.name",
  "orderReference",
  "-orderReference",
  "sender.companyName",
  "-sender.companyName",
  "sender.name",
  "-sender.name",
  "timeSlot.id",
  "-timeSlot.id",
  "timeSlot.cutOffTime",
  "-timeSlot.cutOffTime",
  "state.code",
  "-state.code",
  "state.reasonCode",
  "-state.reasonCode",
  "state.timeStamp",
  "-state.timeStamp",
  "service",
  "-service",
];

export default {
  COUNTRIES,
  WEBHOOK_EVENTS,
  SHIPMENT_SORT_FIELDS,
};
