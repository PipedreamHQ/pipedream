import gitlab from "../../gitlab.app.mjs";
import lodash from "lodash";

export default {
  key: "gitlab-edit-issue",
  name: "Edit Issue",
  description: "Updates an existing project issue. [See docs](https://docs.gitlab.com/ee/api/issues.html#edit-issue)",
  version: "0.2.0",
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    issueIid: {
      propDefinition: [
        gitlab,
        "issueIid",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    title: {
      propDefinition: [
        gitlab,
        "title",
      ],
      description: "The title of the issue",
      optional: true,
    },
    description: {
      propDefinition: [
        gitlab,
        "description",
      ],
      description: "The description of the issue",
    },
    labels: {
      propDefinition: [
        gitlab,
        "labels",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      description: "Comma-separated label names for an issue. Set to an empty string to unassign all labels",
    },
    assigneeIds: {
      propDefinition: [
        gitlab,
        "assignee",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      type: "string[]",
      label: "Assignee IDs",
      description: "The ID of the user(s) to assign the issue to. Set to 0 or provide an empty value to unassign all assignees",
    },
    stateEvent: {
      propDefinition: [
        gitlab,
        "stateEvent",
      ],
    },
    discussionLocked: {
      type: "boolean",
      label: "Lock Discussion",
      description: "Flag indicating if the issue's discussion is locked. If the discussion is locked only project members can add or edit comments",
      optional: true,
    },
  },
  async run({ $ }) {
    const opts = lodash.pickBy(lodash.pick(this, [
      "title",
      "description",
      "labels",
      "assigneeIds",
      "stateEvent",
      "discussionLocked",
    ]));
    opts.labels = opts.labels?.join();
    const response = await this.gitlab.editIssue(this.projectId, this.issueIid, opts);
    $.export("$summary", `Edited issue ${this.title}`);
    return response;
  },
};
