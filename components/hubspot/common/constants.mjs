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
  EMAIL: "/email/public/v1",
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

const DEFAULT_COMPANY_PROPERTIES = [
  "name",
  "domain",
  "industry",
  "about_us",
  "phone",
  "address",
  "address2",
  "city",
  "state",
  "zip",
  "country",
  "website",
  "type",
  "description",
  "founded_year",
  "hs_createdate",
  "hs_lastmodifieddate",
  "hs_object_id",
  "is_public",
  "timezone",
  "total_money_raised",
  "total_revenue",
  "owneremail",
  "ownername",
  "numberofemployees",
  "annualrevenue",
  "lifecyclestage",
  "createdate",
  "web_technologies",
];

const DEFAULT_DEAL_PROPERTIES = [
  "dealtype",
  "dealname",
  "amount",
  "description",
  "closedate",
  "createdate",
  "num_associated_contacts",
  "hs_forecast_amount",
  "hs_forecast_probability",
  "hs_manual_forecast_category",
  "hs_next_step",
  "hs_object_id",
  "hs_lastmodifieddate",
  "hubspot_owner_id",
  "hubspot_team_id",
];

const DEFAULT_TICKET_PROPERTIES = [
  "subject",
  "content",
  "source_type",
  "createdate",
  "hs_pipeline",
  "hs_pipeline_stage",
  "hs_resolution",
  "hs_ticket_category",
  "hs_ticket_id",
  "hs_ticket_priority",
  "hs_lastmodifieddate",
  "hubspot_owner_id",
  "hubspot_team_id",
];

const DEFAULT_PRODUCT_PROPERTIES = [
  "createdate",
  "description",
  "name",
  "price",
  "tax",
  "hs_lastmodifieddate",
];

const DEFAULT_LINE_ITEM_PROPERTIES = [
  "name",
  "description",
  "price",
  "quantity",
  "amount",
  "discount",
  "tax",
  "createdate",
  "hs_object_id",
  "hs_product_id",
  "hs_images",
  "hs_lastmodifieddate",
  "hs_line_item_currency_code",
  "hs_sku",
  "hs_url",
  "hs_cost_of_goods_sold",
  "hs_discount_percentage",
  "hs_term_in_months",
];

const ENGAGEMENT_TYPE_OPTIONS = [
  {
    label: "Note",
    value: "notes",
  },
  {
    label: "Task",
    value: "tasks",
  },
  {
    label: "Meeting",
    value: "meetings",
  },
  {
    label: "Email",
    value: "emails",
  },
  {
    label: "Call",
    value: "calls",
  },
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
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_LINE_ITEM_PROPERTIES,
  ENGAGEMENT_TYPE_OPTIONS,
};
