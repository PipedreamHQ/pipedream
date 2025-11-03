const APPLICATION_STATUS_GROUPS = [
  "ALL",
  "ALL_ACTIVE",
  "NEW",
  "ACTIVE",
  "INACTIVE",
  "HIRED",
];

const JOB_STATUS_GROUPS = [
  "ALL",
  "DRAFT_AND_OPEN",
  "Open",
  "Filled",
  "Draft",
  "Deleted",
  "On Hold",
  "Canceled",
];

const APPLICATION_SORT_FIELDS = [
  "first_name",
  "job_title",
  "rating",
  "phone",
  "status",
  "last_updated",
  "created_date",
];

export default {
  APPLICATION_STATUS_GROUPS,
  JOB_STATUS_GROUPS,
  APPLICATION_SORT_FIELDS,
};
