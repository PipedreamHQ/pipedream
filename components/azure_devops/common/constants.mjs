// x-pd-ai: optimized
export const BASE_URL = "https://dev.azure.com";
export const VSSPS_BASE_URL = "https://vssps.dev.azure.com";
export const VSRM_BASE_URL = "https://vsrm.dev.azure.com";
export const ACCOUNTS_BASE_URL = "https://app.vssps.visualstudio.com";

export const ANALYTICS_BASE_URL = "https://analytics.dev.azure.com";
export const ANALYTICS_ODATA_VERSION = "v4.0-preview";
export const COMPLETED_STATE_CATEGORY = "Completed";

export const DEFAULT_API_VERSION = "7.1";
export const GRAPH_API_VERSION = "7.1-preview.1";
export const WORK_ITEM_COMMENTS_API_VERSION = "7.0-preview.3";
export const LEGACY_API_VERSION = "5.0";

export const JSON_PATCH_CONTENT_TYPE = "application/json-patch+json";

export const CONTINUATION_TOKEN_HEADER = "x-ms-continuationtoken";

export const PATCH_OP = {
  ADD: "add",
  REPLACE: "replace",
  REMOVE: "remove",
};

export const AGILE_PROCESS_TEMPLATE_ID = "adcc42ab-9882-485e-a3ed-7678f01f66bc";

export const EMPTY_OBJECT_ID = "0000000000000000000000000000000000000000";

export const PROJECT_VISIBILITY_OPTIONS = [
  "private",
  "public",
];

export const PROJECT_STATE_OPTIONS = [
  "all",
  "createPending",
  "deleted",
  "deleting",
  "new",
  "unchanged",
  "wellFormed",
];

export const SOURCE_CONTROL_TYPE_OPTIONS = [
  "Git",
  "Tfvc",
];

export const WORK_ITEM_EXPAND_OPTIONS = [
  "none",
  "relations",
  "fields",
  "links",
  "all",
];

export const WORK_ITEM_ERROR_POLICY_OPTIONS = [
  "fail",
  "omit",
];

export const CLASSIFICATION_STRUCTURE_GROUP_OPTIONS = [
  {
    label: "Areas",
    value: "areas",
  },
  {
    label: "Iterations",
    value: "iterations",
  },
];

export const WORK_ITEM_LINK_TYPE_OPTIONS = [
  {
    label: "Related",
    value: "System.LinkTypes.Related",
  },
  {
    label: "Child",
    value: "System.LinkTypes.Hierarchy-Forward",
  },
  {
    label: "Parent",
    value: "System.LinkTypes.Hierarchy-Reverse",
  },
  {
    label: "Duplicate",
    value: "System.LinkTypes.Duplicate-Forward",
  },
  {
    label: "Duplicate Of",
    value: "System.LinkTypes.Duplicate-Reverse",
  },
  {
    label: "Successor",
    value: "System.LinkTypes.Dependency-Forward",
  },
  {
    label: "Predecessor",
    value: "System.LinkTypes.Dependency-Reverse",
  },
];

export const PULL_REQUEST_STATUS_OPTIONS = [
  "active",
  "abandoned",
  "completed",
  "notSet",
  "all",
];

export const PULL_REQUEST_UPDATE_STATUS_OPTIONS = [
  "active",
  "abandoned",
  "completed",
];

export const COMMENT_THREAD_STATUS_OPTIONS = [
  "active",
  "byDesign",
  "closed",
  "fixed",
  "pending",
  "unknown",
  "wontFix",
];

export const PULL_REQUEST_VOTE_OPTIONS = [
  {
    label: "Approved (10)",
    value: 10,
  },
  {
    label: "Approved with suggestions (5)",
    value: 5,
  },
  {
    label: "No vote (0)",
    value: 0,
  },
  {
    label: "Waiting for author (-5)",
    value: -5,
  },
  {
    label: "Rejected (-10)",
    value: -10,
  },
];

export const GIT_VERSION_TYPE_OPTIONS = [
  "branch",
  "commit",
  "tag",
];

export const WIKI_RECURSION_LEVEL_OPTIONS = [
  "none",
  "oneLevel",
  "full",
];

export const RECURSION_LEVEL_OPTIONS = [
  "none",
  "oneLevel",
  "oneLevelPlusNestedEmptyFolders",
  "full",
];

export const FILE_CHANGE_TYPE_OPTIONS = [
  {
    label: "Add a new file",
    value: "add",
  },
  {
    label: "Edit an existing file",
    value: "edit",
  },
  {
    label: "Delete an existing file",
    value: "delete",
  },
];

export const CONTENT_TYPE_OPTIONS = [
  {
    label: "Raw text",
    value: "rawtext",
  },
  {
    label: "Base64 encoded",
    value: "base64encoded",
  },
];

export const BUILD_STATUS_OPTIONS = [
  "none",
  "inProgress",
  "completed",
  "cancelling",
  "postponed",
  "notStarted",
  "all",
];

export const BUILD_RESULT_OPTIONS = [
  "none",
  "succeeded",
  "partiallySucceeded",
  "failed",
  "canceled",
];

export const BUILD_QUERY_ORDER_OPTIONS = [
  "finishTimeAscending",
  "finishTimeDescending",
  "queueTimeAscending",
  "queueTimeDescending",
  "startTimeAscending",
  "startTimeDescending",
];

export const BUILD_CANCELLING_STATUS = "cancelling";

export const RELEASE_STATUS_OPTIONS = [
  "active",
  "abandoned",
  "draft",
  "undefined",
];

export const GIT_HISTORY_MODE_OPTIONS = [
  "simplifiedHistory",
  "firstParent",
  "fullHistory",
  "fullHistorySimplifyMerges",
];

export const GIT_VERSION_MODIFIER_OPTIONS = [
  "none",
  "previousChange",
  "firstParent",
];

export const BUILD_DELETED_FILTER_OPTIONS = [
  "excludeDeleted",
  "includeDeleted",
  "onlyDeleted",
];

export const BUILD_REASON_OPTIONS = [
  "none",
  "manual",
  "individualCI",
  "batchedCI",
  "schedule",
  "scheduleForced",
  "userCreated",
  "validateShelveset",
  "checkInShelveset",
  "pullRequest",
  "buildCompletion",
  "resourceTrigger",
  "triggered",
  "all",
];

export const RELEASE_APPROVAL_FILTER_OPTIONS = [
  "none",
  "manualApprovals",
  "automatedApprovals",
  "approvalSnapshots",
  "all",
];

export const RELEASE_EXPAND_OPTIONS = [
  "none",
  "tasks",
];

export const SERVICE_ENDPOINT_ACTION_FILTER_OPTIONS = [
  "none",
  "manage",
  "use",
  "view",
];

export const WORK_ITEM_FIELD_EXPAND_OPTIONS = [
  "none",
  "extensionFields",
  "includeDeleted",
];

export const WIKI_TYPE_OPTIONS = [
  {
    label: "Project wiki (Azure DevOps provisions the backing repository)",
    value: "projectWiki",
  },
  {
    label: "Code wiki (published from an existing Git repository)",
    value: "codeWiki",
  },
];

export const GRAPH_SUBJECT_TYPE_OPTIONS = [
  {
    label: "Microsoft account (msa)",
    value: "msa",
  },
  {
    label: "Microsoft Entra ID (aad)",
    value: "aad",
  },
  {
    label: "Service identity (svc)",
    value: "svc",
  },
  {
    label: "Imported identity (imp)",
    value: "imp",
  },
];

export const PIPELINE_CONFIGURATION_TYPE = "yaml";
export const PIPELINE_REPOSITORY_TYPE = "azureReposGit";
export const PIPELINE_ROOT_FOLDER = "\\";

export const DEFAULT_LIMIT = 100;
export const MAX_LIMIT = 1000;
export const MAX_WORK_ITEM_IDS = 200;

export const ITERATION_TIMEFRAME_OPTIONS = [
  "current",
];
