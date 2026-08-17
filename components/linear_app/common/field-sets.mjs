/**
 * Per-resource field sets for the `fields` payload param (see ./fields.mjs).
 *
 * Shared rather than declared per action so that two actions returning the same
 * resource cannot drift: Search Issues and Get View Issues both return Issues, and a
 * 40-entry validation list copied into each would inevitably diverge.
 */

// Documented Issue fields (the `issue` GraphQL fragment).
const ISSUE_KNOWN = [
  "archivedAt",
  "assignee",
  "autoArchivedAt",
  "autoClosedAt",
  "botActor",
  "branchName",
  "canceledAt",
  "completedAt",
  "createdAt",
  "creator",
  "customerTicketCount",
  "cycle",
  "description",
  "dueDate",
  "estimate",
  "favorite",
  "id",
  "identifier",
  "labelIds",
  "lastAppliedTemplate",
  "number",
  "parent",
  "previousIdentifiers",
  "priority",
  "priorityLabel",
  "project",
  "projectMilestone",
  "snoozedBy",
  "snoozedUntilAt",
  "sortOrder",
  "startedAt",
  "startedTriageAt",
  "state",
  "subIssueSortOrder",
  "team",
  "title",
  "trashed",
  "triagedAt",
  "updatedAt",
  "url",
];

// Enough to identify an issue, report its status, and act on it afterwards.
const ISSUE_COMPACT = [
  "id",
  "identifier",
  "title",
  "state",
  "assignee",
  "priorityLabel",
];

// What `description` (the issue body) and the nested relation objects cost, stated
// once so both issue-returning actions give the agent the same guidance.
const ISSUE_GUIDANCE = "`description` (the issue body) and the nested `team`, `project`, `cycle` and `parent` objects are what make this response large; request them only when you need more than the issue's identity and status.";

export default {
  issue: {
    known: ISSUE_KNOWN,
    compact: ISSUE_COMPACT,
    guidance: ISSUE_GUIDANCE,
  },
};
