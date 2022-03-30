/**
 * Object type names for Hubspot CRM objects and engagements, as defined by the
 * [Hubspot API
 * docs]{@link https://developers.hubspot.com/docs/cms/data/crm-objects}
 */
const ObjectType = {
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

/** Association categories for association types, as defined by the [Hubspot API
 * docs]{@link https://developers.hubspot.com/docs/api/crm/associations/v4}
 */
const AssociationCategory = {
  HUBSPOT_DEFINED: "HUBSPOT_DEFINED",
  USER_DEFINED: "USER_DEFINED",
  INTEGRATOR_DEFINED: "INTEGRATOR_DEFINED",
};

export {
  ObjectType,
  HUBSPOT_OWNER,
  AssociationCategory,
};
