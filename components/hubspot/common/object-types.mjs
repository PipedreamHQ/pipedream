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
];

export {
  OBJECT_TYPE,
  OBJECT_TYPES,
  HUBSPOT_OWNER,
};
