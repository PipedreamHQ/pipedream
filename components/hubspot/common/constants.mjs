import {
  HUBSPOT_OWNER,
  OBJECT_TYPE,
  OBJECT_TYPES,
  SEARCHABLE_OBJECT_TYPES,
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
  AUTOMATIONV3: "/automation/v3",
  AUTOMATIONV4: "/automation/v4",
  DEAL: "/deals/v1",
  BUSINESS_UNITS: "/business-units/v3",
  MARKETINGV3: "/marketing/v3",
  CONTENT: "/content/api/v2",
  COMMUNICATION_PREFERENCES: "/communication-preferences/v4",
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

const DEFAULT_LEAD_PROPERTIES = [
  "hs_associated_contact_email",
  "hs_associated_contact_lastname",
  "hs_lead_name",
  "hs_associated_company_domain",
  "hs_associated_contact_firstname",
  "hs_associated_company_name",
];

const DEFAULT_EMAIL_PROPERTIES = [
  "hs_timestamp",
  "hs_email_direction",
  "hs_email_html",
  "hs_email_status",
  "hs_email_subject",
  "hs_email_text",
  "hs_attachment_ids",
  "hs_email_headers",
];

const DEFAULT_MEETING_PROPERTIES = [
  "hs_timestamp",
  "hubspot_owner_id",
  "hs_meeting_title",
  "hs_meeting_body",
  "hs_internal_meeting_notes",
  "hs_meeting_external_url",
  "hs_meeting_location",
  "hs_meeting_start_time",
  "hs_meeting_end_time",
  "hs_meeting_outcome",
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

const LANGUAGE_OPTIONS = [
  {
    label: "Afrikaans",
    value: "af",
  },
  {
    label: "Arabic (Egypt)",
    value: "ar-eg",
  },
  {
    label: "Bulgarian",
    value: "bg",
  },
  {
    label: "Bengali",
    value: "bn",
  },
  {
    label: "Czech",
    value: "cs",
  },
  {
    label: "Danish",
    value: "da",
  },
  {
    label: "Greek",
    value: "el",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "Spanish",
    value: "es",
  },
  {
    label: "Spanish (Mexico)",
    value: "es-mx",
  },
  {
    label: "Finnish",
    value: "fi",
  },
  {
    label: "French",
    value: "fr",
  },
  {
    label: "French (Canada)",
    value: "fr-ca",
  },
  {
    label: "Hebrew (Israel)",
    value: "he-il",
  },
  {
    label: "Croatian",
    value: "hr",
  },
  {
    label: "Hungarian",
    value: "hu",
  },
  {
    label: "Indonesian",
    value: "id",
  },
  {
    label: "Italian",
    value: "it",
  },
  {
    label: "Japanese",
    value: "ja",
  },
  {
    label: "Korean",
    value: "ko",
  },
  {
    label: "Lithuanian",
    value: "lt",
  },
  {
    label: "Malay",
    value: "ms",
  },
  {
    label: "Dutch",
    value: "nl",
  },
  {
    label: "Norwegian (Norway)",
    value: "no-no",
  },
  {
    label: "Polish",
    value: "pl",
  },
  {
    label: "Portuguese",
    value: "pt",
  },
  {
    label: "Portuguese (Brazil)",
    value: "pt-br",
  },
  {
    label: "Romanian",
    value: "ro",
  },
  {
    label: "Russian",
    value: "ru",
  },
  {
    label: "Slovak",
    value: "sk",
  },
  {
    label: "Slovenian",
    value: "sl",
  },
  {
    label: "Swedish",
    value: "sv",
  },
  {
    label: "Thai",
    value: "th",
  },
  {
    label: "Tagalog",
    value: "tl",
  },
  {
    label: "Ukrainian",
    value: "uk",
  },
  {
    label: "Vietnamese",
    value: "vi",
  },
  {
    label: "Chinese (China)",
    value: "zh-cn",
  },
  {
    label: "Chinese (Hong Kong)",
    value: "zh-hk",
  },
  {
    label: "Chinese (Taiwan)",
    value: "zh-tw",
  },
];

export {
  API_PATH,
  ASSOCIATION_CATEGORY,
  BASE_URL,
  DEFAULT_COMPANY_PROPERTIES,
  DEFAULT_CONTACT_PROPERTIES,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_EMAIL_PROPERTIES,
  DEFAULT_LEAD_PROPERTIES,
  DEFAULT_LIMIT,
  DEFAULT_LINE_ITEM_PROPERTIES,
  DEFAULT_MEETING_PROPERTIES,
  DEFAULT_PRODUCT_PROPERTIES,
  DEFAULT_TICKET_PROPERTIES,
  ENGAGEMENT_TYPE_OPTIONS,
  HUBSPOT_OWNER,
  LANGUAGE_OPTIONS,
  OBJECT_TYPE,
  OBJECT_TYPES,
  SEARCHABLE_OBJECT_TYPES,
};

