import {
  OBJECT_TYPE,
  OBJECT_TYPES,
  HUBSPOT_OWNER,
} from "./object-types.mjs";

/** Association categories for association types, as defined by the [Hubspot API
 * docs]{@link https://developers.hubspot.com/docs/api/crm/associations/v4}
 */
const ASSOCIATION_CATEGORY = {
  HUBSPOT_DEFINED: "HUBSPOT_DEFINED",
  USER_DEFINED: "USER_DEFINED",
  INTEGRATOR_DEFINED: "INTEGRATOR_DEFINED",
};

export {
  OBJECT_TYPE,
  OBJECT_TYPES,
  HUBSPOT_OWNER,
  ASSOCIATION_CATEGORY,
};
