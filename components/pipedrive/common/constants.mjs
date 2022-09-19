const LAST_RESOURCE_PROPERTY = "lastResourceProperty";
const DEFAULT_PAGE_LIMIT = 20;
const DEFAULT_MAX_ITEMS = 100;

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
    value: "1",
  },
  {
    label: "Entire company (shared)",
    value: "3",
  },
];

const INCLUDE_FIELDS_OPTIONS = [
  "person.picture",
];

const EVENT_OBJECT = {
  ACTIVITY: "activity",
  ACTIVITY_TYPE: "activityType",
  DEAL: "deal",
  NOTE: "note",
  ORGANIZATION: "organization",
  PERSON: "person",
  PIPELINE: "pipeline",
  PRODUCT: "product",
  STAGE: "stage",
  USER: "user",
};

const EVENT_ACTION = {
  ADDED: "added",
  UPDATED: "updated",
  MERGED: "merged",
  DELETED: "deleted",
};

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

export default {
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  VISIBLE_TO_OPTIONS,
  INCLUDE_FIELDS_OPTIONS,
  LAST_RESOURCE_PROPERTY,
  EVENT_OBJECT,
  EVENT_ACTION,
  API,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_MAX_ITEMS,
};
