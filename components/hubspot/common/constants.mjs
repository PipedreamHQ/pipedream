import {
  HUBSPOT_OWNER,
  OBJECT_TYPE,
  OBJECT_TYPES,
  SEARCHABLE_OBJECT_TYPES,
  SEARCHABLE_OBJECT_PROPERTIES,
} from "./object-types.mjs";

const BASE_URL = "https://api.hubapi.com";
const API_PATH = {
  PROPERTIES: "/properties/v1",
  CONTACTS: "/contacts/v1",
  ENGAGEMENTS: "/engagements/v1",
  EMAIL: "/email/public/v1/",
  EVENTS: "/events/v3",
  FORMS: "/forms/v2",
  FORM_INTEGRATIONS: "/form-integrations/v1",
  FILES: "/files/v3",
  BROADCAST: "/broadcast/v1",
  CRMV3: "/crm/v3",
  CRMV4: "/crm/v4",
  CMS: "/cms/v3",
  AUTOMATION: "/automation/v2",
  DEAL: "/deals/v1",
};

/** Association categories for association types, as defined by the [Hubspot API
 * docs]{@link https://developers.hubspot.com/docs/api/crm/associations/v4}
 */
const ASSOCIATION_CATEGORY = {
  HUBSPOT_DEFINED: "HUBSPOT_DEFINED",
  USER_DEFINED: "USER_DEFINED",
  INTEGRATOR_DEFINED: "INTEGRATOR_DEFINED",
};

const DEFAULT_LIMIT = 100;

const DEFAULT_CONTACT_PROPERTIES = [
  "firstname",
  "lastname",
  "email",
  "company",
  "website",
  "mobilephone",
  "phone",
  "fax",
  "address",
  "city",
  "state",
  "zip",
  "salutation",
  "country",
  "jobtitle",
  "hs_createdate",
  "hs_email_domain",
  "hs_object_id",
  "lastmodifieddate",
  "hs_persona",
  "hs_language",
  "lifecyclestage",
  "createdate",
  "numemployees",
  "annualrevenue",
  "industry",
];

export {
  OBJECT_TYPE,
  OBJECT_TYPES,
  SEARCHABLE_OBJECT_TYPES,
  SEARCHABLE_OBJECT_PROPERTIES,
  HUBSPOT_OWNER,
  BASE_URL,
  API_PATH,
  ASSOCIATION_CATEGORY,
  DEFAULT_LIMIT,
  DEFAULT_CONTACT_PROPERTIES,
};
