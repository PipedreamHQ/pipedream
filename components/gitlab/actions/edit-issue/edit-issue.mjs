// legacy_hash_id: a_eli56O
import { axios } from "@pipedream/platform";

export default {
  key: "gitlab-edit-issue",
  name: "Edit Issue",
  description: "Updates an existing project issue.",
  version: "0.1.1",
  type: "action",
  props: {
    gitlab: {
      type: "app",
      app: "gitlab",
    },
    id: {
      type: "string",
      description: "The ID or [URL-encoded path of the project](https://docs.gitlab.com/ee/api/README.html#namespaced-path-encoding) owned by the authenticated user",
    },
    issue_iid: {
      type: "integer",
      description: "The internal ID of the project's issue (requires admin or project owner rights)",
    },
    title: {
      type: "string",
      description: "The title of an issue",
      optional: true,
    },
    description: {
      type: "string",
      description: "The description of an issue. Limited to 1,048,576 characters.",
      optional: true,
    },
    confidential: {
      type: "boolean",
      description: "Set an issue to be confidential. Default is`false`.",
      optional: true,
    },
    assignee_ids: {
      type: "any",
      description: "The ID of the user(s) to assign the issue to. Set to 0 or provide an empty value to unassign all assignees.",
      optional: true,
    },
    milestone_id: {
      type: "integer",
      description: "The global ID of a milestone to assign the issue to. Set to 0 or provide an empty value to unassign a milestone.",
      optional: true,
    },
    labels: {
      type: "string",
      description: "Comma-separated label names for an issue. Set to an empty string to unassign all labels.",
      optional: true,
    },
    state_event: {
      type: "string",
      description: "The state event of an issue. Set close to close the issue and reopen to reopen it.",
      optional: true,
    },
    updated_at: {
      type: "string",
      description: "Date time string, ISO 8601 formatted, e.g. 2016-03-11T03:45:40Z (requires admin or project owner rights).",
      optional: true,
    },
    due_date: {
      type: "string",
      description: "Date time string in the format YEAR-MONTH-DAY, e.g. 2016-03-11.",
      optional: true,
    },
    weight: {
      type: "integer",
      description: "The weight of the issue. Valid values are greater than or equal to 0.",
      optional: true,
    },
    discussion_locked: {
      type: "boolean",
      description: "Flag indicating if the issue's discussion is locked. If the discussion is locked only project members can add or edit comments.",
      optional: true,
    },
    epic_id: {
      type: "integer",
      description: "ID of the epic to add the issue to. Valid values are greater than or equal to 0.",
      optional: true,
    },
    epic_iid: {
      type: "string",
      description: "IID of the epic to add the issue to. Valid values are greater than or equal to 0. (deprecated, [will be removed in 13.0](https://gitlab.com/gitlab-org/gitlab/issues/35157))",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "put",
      url: `https://gitlab.com/api/v4/projects/${this.id}/issues/${this.issue_iid}`,
      headers: {
        Authorization: `Bearer ${this.gitlab.$auth.oauth_access_token}`,
      },
      data: {
        title: this.title,
        description: this.description,
        confidential: this.confidential,
        assignee_ids: typeof this.assignee_ids == "undefined"
          ? this.assignee_ids
          : JSON.parse(this.assignee_ids),
        milestone_id: this.milestone_id,
        labels: this.labels,
        state_event: this.state_event,
        updated_at: this.updated_at,
        due_date: this.due_date,
        weight: this.weight,
        discussion_locked: this.discussion_locked,
        epic_id: this.epic_id,
        epic_iid: this.epic_iid,
      },
    });
  },
};
