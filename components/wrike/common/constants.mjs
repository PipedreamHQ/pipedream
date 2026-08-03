export const TASK_STATUS_OPTIONS = [
  "Active",
  "Deferred",
  "Completed",
  "Cancelled",
];

export const TASK_IMPORTANCE_OPTIONS = [
  "High",
  "Normal",
  "Low",
];

export const PROJECT_STATUS_OPTIONS = [
  "Red",
  "OnHold",
  "Yellow",
  "Completed",
  "Custom",
  "Cancelled",
  "Green",
];

export const TASK_SORT_FIELD_OPTIONS = [
  "Status",
  "Importance",
  "UpdatedDate",
  "CreatedDate",
  "Title",
  "StartFinishInterval",
  "DueDate",
  "LastAccessDate",
  "CompletedDate",
];

export const CONTACT_TYPE_OPTIONS = [
  "Group",
  "Asset",
  "Person",
  "Robot",
];

export const CONTACT_FIELD_OPTIONS = [
  "metadata",
  "currentCostRate",
  "customFields",
  "currentBillRate",
  "jobRoleId",
  "workScheduleId",
];

export const CUSTOM_FIELD_APPLICABLE_ENTITY_TYPE_OPTIONS = [
  "User",
  "WorkItem",
];

export const CUSTOM_FIELD_TYPE_OPTIONS = [
  "Multiple",
  "Percentage",
  "Text",
  "Duration",
  "CalculatedNumeric",
  "Date",
  "CalculatedDate",
  "Numeric",
  "Contacts",
  "Checkbox",
  "Currency",
  "DropDown",
  "LinkToDatabase",
];

export const CUSTOM_FIELD_INHERITANCE_TYPE_OPTIONS = [
  "All",
  "Tasks",
  "Projects",
  "Folders",
];

export const CUSTOM_FIELD_FIELD_OPTIONS = [
  "dataUsageStatistics",
];

export const SPACE_ACCESS_TYPE_OPTIONS = [
  "Locked",
  "Personal",
  "Private",
  "Public",
];

export const SPACE_FIELD_OPTIONS = [
  "members",
  "workScheduleId",
];

export const DEFAULT_LIMIT = 100;
export const MAX_LIMIT = 1000;
