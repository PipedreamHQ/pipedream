const DEFAULT_PAGE_LIMIT = 20; // max is 500 per page

const STATUS_OPTIONS = [
  "open",
  "won",
  "lost",
  "deleted",
];

const PROJECT_STATUS_OPTIONS = [
  "open",
  "completed",
  "canceled",
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

const LEAD_FIELD_OPTIONS = [
  "custom_fields",
  "notes",
  "title",
];

const DEAL_SORT_BY_OPTIONS = [
  "id",
  "update_time",
  "add_time",
];

const SORT_DIRECTION_OPTIONS = [
  "asc",
  "desc",
];

const DEAL_INCLUDE_FIELDS_OPTIONS = [
  "next_activity_id",
  "last_activity_id",
  "first_won_time",
  "products_count",
  "files_count",
  "notes_count",
  "followers_count",
  "email_messages_count",
  "activities_count",
  "done_activities_count",
  "undone_activities_count",
  "participants_count",
  "last_incoming_mail_time",
  "last_outgoing_mail_time",
  "smart_bcc_email",
  "source_lead_id",
];

const PERSON_SORT_BY_OPTIONS = [
  "id",
  "update_time",
  "add_time",
];

const ORGANIZATION_SORT_BY_OPTIONS = [
  "id",
  "update_time",
  "add_time",
];

const ORGANIZATION_INCLUDE_FIELDS_OPTIONS = [
  "next_activity_id",
  "last_activity_id",
  "open_deals_count",
  "related_open_deals_count",
  "closed_deals_count",
  "related_closed_deals_count",
  "email_messages_count",
  "people_count",
  "activities_count",
  "done_activities_count",
  "undone_activities_count",
  "files_count",
  "notes_count",
  "followers_count",
  "won_deals_count",
  "related_won_deals_count",
  "lost_deals_count",
  "related_lost_deals_count",
  "smart_bcc_email",
];

const FILTER_TYPE_OPTIONS = [
  "deals",
  "leads",
  "org",
  "people",
  "products",
  "activity",
  "projects",
];

const PERSON_INCLUDE_FIELDS_OPTIONS = [
  "next_activity_id",
  "last_activity_id",
  "open_deals_count",
  "related_open_deals_count",
  "closed_deals_count",
  "related_closed_deals_count",
  "participant_open_deals_count",
  "participant_closed_deals_count",
  "email_messages_count",
  "activities_count",
  "done_activities_count",
  "undone_activities_count",
  "files_count",
  "notes_count",
  "followers_count",
  "won_deals_count",
  "related_won_deals_count",
  "lost_deals_count",
  "related_lost_deals_count",
  "last_incoming_mail_time",
  "last_outgoing_mail_time",
  "marketing_status",
  "doi_status",
  "smart_bcc_email",
];

export default {
  STATUS_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  FIELD_OPTIONS,
  VISIBLE_TO_OPTIONS,
  INCLUDE_FIELDS_OPTIONS,
  DEFAULT_PAGE_LIMIT,
  FIELD,
  LEAD_FIELD_OPTIONS,
  DEAL_SORT_BY_OPTIONS,
  SORT_DIRECTION_OPTIONS,
  DEAL_INCLUDE_FIELDS_OPTIONS,
  PERSON_SORT_BY_OPTIONS,
  PERSON_INCLUDE_FIELDS_OPTIONS,
  ORGANIZATION_SORT_BY_OPTIONS,
  ORGANIZATION_INCLUDE_FIELDS_OPTIONS,
  FILTER_TYPE_OPTIONS,
};
