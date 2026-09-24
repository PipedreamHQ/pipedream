// Asana task fields that can be reported as changed by a webhook event
// (developers.asana.com/reference/task). Many of these — custom_fields, tags,
// followers, dependencies, dependents, parent, memberships — are omitted from
// a task's default GET response unless explicitly requested via opt_fields,
// so sampling one live task's own keys misses them; a fixed catalog is the
// only way to list the complete, supported set.
const TASK_FIELDS = [
  "approval_status",
  "assignee",
  "assignee_section",
  "actual_time_minutes",
  "completed",
  "completed_at",
  "custom_fields",
  "dependencies",
  "dependents",
  "due_at",
  "due_on",
  "external",
  "followers",
  "html_notes",
  "memberships",
  "name",
  "notes",
  "num_subtasks",
  "parent",
  "projects",
  "start_at",
  "start_on",
  "tags",
  "workspace",
];

export default {
  key: "asana-list-task-fields",
  name: "List Task Fields",
  description: "Returns the task field identifiers that can be reported as changed by an Asana webhook, for use with the Task Fields prop on webhook triggers such as **Task Field Updated in Project**. This is a fixed catalog (per Asana's task schema), not derived from any specific project or task, since many fields (e.g. `custom_fields`, `tags`, `followers`) aren't present on a task's default response unless explicitly requested. Example: call with no params → returns `['approval_status', 'assignee', 'completed', 'due_on', 'tags', ...]`. [See the documentation](https://developers.asana.com/reference/task)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {},
  async run({ $ }) {
    $.export("$summary", `Found ${TASK_FIELDS.length} fields`);
    return TASK_FIELDS;
  },
};
