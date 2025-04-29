/**
 * Object type names for Hubspot CRM objects and engagements, as defined by the
 * [Hubspot API
 * docs]{@link https://developers.hubspot.com/docs/cms/data/crm-objects}
 */
const OBJECT_TYPE = {
  CONTACT: "contact",
  COMPANY: "company",
  DEAL: "deal",
  TICKET: "ticket",
  CALL: "call",
  QUOTE: "quote",
  LINE_ITEM: "line_item",
  MEETING: "meeting",
  PRODUCT: "product",
  FEEDBACK_SUBMISSION: "feedback_submission",
  NOTE: "note",
  EMAIL: "email",
  TASK: "task",
  LEAD: "lead",
};

/**
 * Type name for the Hubspot Owner model
 */
const HUBSPOT_OWNER = "owner";

const OBJECT_TYPES = [
  {
    label: "Contacts",
    value: OBJECT_TYPE.CONTACT,
  },
  {
    label: "Companies",
    value: OBJECT_TYPE.COMPANY,
  },
  {
    label: "Deals",
    value: OBJECT_TYPE.DEAL,
  },
  {
    label: "Tickets",
    value: OBJECT_TYPE.TICKET,
  },
  {
    label: "Calls",
    value: OBJECT_TYPE.CALL,
  },
  {
    label: "Quotes",
    value: OBJECT_TYPE.QUOTE,
  },
  {
    label: "Line Items",
    value: OBJECT_TYPE.LINE_ITEM,
  },
  {
    label: "Meetings",
    value: OBJECT_TYPE.MEETING,
  },
  {
    label: "Products",
    value: OBJECT_TYPE.PRODUCT,
  },
  {
    label: "Feedback Submissions",
    value: OBJECT_TYPE.FEEDBACK_SUBMISSION,
  },
  {
    label: "Emails",
    value: OBJECT_TYPE.EMAIL,
  },
  {
    label: "Notes",
    value: OBJECT_TYPE.NOTE,
  },
  {
    label: "Tasks",
    value: OBJECT_TYPE.TASK,
  },
  {
    label: "Leads",
    value: OBJECT_TYPE.LEAD,
  },
];

const SEARCHABLE_OBJECT_TYPES_ARRAY = [
  OBJECT_TYPE.COMPANY,
  OBJECT_TYPE.CONTACT,
  OBJECT_TYPE.DEAL,
  OBJECT_TYPE.FEEDBACK_SUBMISSION,
  OBJECT_TYPE.PRODUCT,
  OBJECT_TYPE.TICKET,
  OBJECT_TYPE.LINE_ITEM,
  OBJECT_TYPE.LEAD,
];
const SEARCHABLE_OBJECT_TYPES = OBJECT_TYPES.filter(
  (type) => SEARCHABLE_OBJECT_TYPES_ARRAY.includes(type.value),
);

const ENGAGEMENT_TYPES = [
  {
    label: "Note",
    value: "NOTE",
  },
  {
    label: "Task",
    value: "TASK",
  },
  {
    label: "Meeting",
    value: "MEETING",
  },
  {
    label: "Email",
    value: "EMAIL",
  },
  {
    label: "Call",
    value: "CALL",
  },
];

const EMAIL_EVENT_TYPES = [
  {
    label: "Sent",
    value: "SENT",
  },
  {
    label: "Dropped",
    value: "DROPPED",
  },
  {
    label: "Processed",
    value: "PROCESSED",
  },
  {
    label: "Delivered",
    value: "DELIVERED",
  },
  {
    label: "Deferred",
    value: "DEFERRED",
  },
  {
    label: "Bounce",
    value: "BOUNCE",
  },
  {
    label: "Open",
    value: "OPEN",
  },
  {
    label: "Click",
    value: "CLICK",
  },
  {
    label: "Status Change",
    value: "STATUSCHANGE",
  },
  {
    label: "Spam Report",
    value: "SPAMREPORT",
  },
];

export {
  OBJECT_TYPE,
  OBJECT_TYPES,
  HUBSPOT_OWNER,
  SEARCHABLE_OBJECT_TYPES,
  ENGAGEMENT_TYPES,
  EMAIL_EVENT_TYPES,
};
