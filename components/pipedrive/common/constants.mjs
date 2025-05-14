const DEFAULT_PAGE_LIMIT = 20; // max is 500 per page

const STATUS_OPTIONS = [
  "open",
  "won",
  "lost",
  "deleted",
];

const FIELD_OPTIONS = [
  "custom_fields",
  "email",
  "notes",
  "phone",
  "name",
];

const VISIBLE_TO_OPTIONS = [
  {
    label: "Owner & followers (private)",
    value: 1,
  },
  {
    label: "Entire company (shared)",
    value: 3,
  },
];

const INCLUDE_FIELDS_OPTIONS = [
  "person.picture",
];

const FIELD = {
  ADD_TIME: "add_time",
  UPDATE_TIME: "update_time",
};

// TODO: remove this when all are converted to use the new API
const API = { 
  WEBHOOKS: [
    "WebhooksApi",
    "AddWebhookRequest",
  ],
  USERS: [
    "UsersApi",
  ],
  USER_SETTINGS: [
    "UserSettingsApi",
  ],
  USER_CONNECTIONS: [
    "UserConnectionsApi",
  ],
  TEAMS: [
    "TeamsApi",
  ],
  SUBSCRIPTIONS: [
    "SubscriptionsApi",
  ],
  STAGES: [
    "StagesApi",
  ],
  ROLES: [
    "RolesApi",
  ],
  RECENTS: [
    "RecentsApi",
  ],
  PRODUCTS: [
    "ProductsApi",
  ],
  PRODUCT_FIELDS: [
    "ProductFieldsApi",
  ],
  PIPELINES: [
    "PipelinesApi",
  ],
  PERSONS: [
    "PersonsApi",
    "NewPerson",
    "BasicPerson",
  ],
  PERSON_FIELDS: [
    "PersonFieldsApi",
  ],
  PERMISSION_SETS: [
    "PermissionSetsApi",
  ],
  ORGANIZATIONS: [
    "OrganizationsApi",
    "NewOrganization",
  ],
  ORGANIZATION_RELATIONSHIPS: [
    "OrganizationRelationshipsApi",
  ],
  ORGANIZATION_FIELDS: [
    "OrganizationFieldsApi",
  ],
  NOTES: [
    "NotesApi",
  ],
  NOTE_FIELDS: [
    "NoteFieldsApi",
  ],
  MAILBOX: [
    "MailboxApi",
  ],
  LEADS: [
    "LeadsApi",
  ],
  LEAD_SOURCES: [
    "LeadSourcesApi",
  ],
  LEAD_LABELS: [
    "LeadLabelsApi",
  ],
  ITEM_SEARCH: [
    "ItemSearchApi",
  ],
  GOALS: [
    "GoalsApi",
  ],
  GLOBAL_MESSAGES: [
    "GlobalMessagesApi",
  ],
  FILTERS: [
    "FiltersApi",
    "AddFilterRequest",
    "UpdateFilterRequest",
  ],
  FILES: [
    "FilesApi",
  ],
  DEALS: [
    "DealsApi",
    "NewDeal",
    "UpdateDealRequest",
  ],
  DEAL_FIELDS: [
    "DealFieldsApi",
  ],
  CURRENCIES: [
    "CurrenciesApi",
  ],
  CALL_LOGS: [
    "CallLogsApi",
  ],
  ACTIVITY_TYPES: [
    "ActivityTypesApi",
  ],
  ACTIVITY_FIELDS: [
    "ActivityFieldsApi",
  ],
  ACTIVITIES: [
    "ActivitiesApi",
    "ActivityPostObject",
    "ActivityPutObject",
  ],
};

const FILTER_TYPE = {
  DEALS: "deals",
  LEADS: "leads",
  ORG: "org",
  PEOPLE: "people",
  PRODUCTS: "products",
  ACTIVITY: "activity",
};

export default {
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  VISIBLE_TO_OPTIONS,
  INCLUDE_FIELDS_OPTIONS,
  DEFAULT_PAGE_LIMIT,
  FIELD,
  FILTER_TYPE,
  API
};
