// legacy_hash_id: a_eli54j
import { axios } from "@pipedream/platform";

export default {
  key: "gitlab-create-issue",
  name: "Create issue",
  description: "Creates a new issue",
  version: "0.1.1",
  type: "action",
  props: {
    gitlab: {
      type: "app",
      app: "gitlab",
    },
    id: {
      type: "integer",
      description: "The ID or [URL-encoded path of the project](https://docs.gitlab.com/ee/api/README.html#namespaced-path-encoding) owned by the authenticated user",
    },
    iid: {
      type: "string",
      description: "The internal ID of the project's issue (requires admin or project owner rights)",
      optional: true,
    },
    title: {
      type: "string",
      description: "The title of an issue",
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
      description: "The ID of a user to assign issue",
      optional: true,
    },
    milestone_id: {
      type: "string",
      description: "The global ID of a milestone to assign issue",
      optional: true,
    },
    labels: {
      type: "string",
      description: "Comma-separated label names for an issue",
      optional: true,
    },
    created_at: {
      type: "string",
      description: "Date time string, ISO 8601 formatted, e.g. `2016-03-11T03:45:40Z` (requires admin or project/group owner rights)",
      optional: true,
    },
    due_date: {
      type: "string",
      description: "Date time string in the format YEAR-MONTH-DAY, e.g. `2016-03-11`",
      optional: true,
    },
    merge_request_to_resolve_discussions_of: {
      type: "integer",
      description: "The IID of a merge request in which to resolve all issues. This will fill the issue with a default description and mark all discussions as resolved. When passing a description or title, these values will take precedence over the default values.",
      optional: true,
    },
    discussion_to_resolve: {
      type: "string",
      description: "The ID of a discussion to resolve. This will fill in the issue with a default description and mark the discussion as resolved. Use in combination with `merge_request_to_resolve_discussions_of`.",
      optional: true,
    },
    weight: {
      type: "integer",
      description: "The weight of the issue. Valid values are greater than or equal to 0.",
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
      method: "post",
      url: `https://gitlab.com/api/v4/projects/${this.id}/issues`,
      headers: {
        Authorization: `Bearer ${this.gitlab.$auth.oauth_access_token}`,
      },
      data: {
        iid: this.iid,
        title: this.title,
        description: this.description,
        confidential: this.confidential,
        assignee_ids: this.assignee_ids,
        milestone_id: this.milestone_id,
        labels: this.labels,
        created_at: this.created_at,
        due_date: this.due_date,
        merge_request_to_resolve_discussions_of: this.merge_request_to_resolve_discussions_of,
        discussion_to_resolve: this.discussion_to_resolve,
        weight: this.weight,
        epic_id: this.epic_id,
        epic_iid: this.epic_iid,
      },
    });
  },
};
