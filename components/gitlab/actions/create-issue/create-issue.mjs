import gitlab from "../../gitlab.app.mjs";
import lodash from "lodash";

export default {
  key: "gitlab-create-issue",
  name: "Create issue",
  description: "Creates a new issue. [See the documentation](https://docs.gitlab.com/ee/api/issues.html#new-issue)",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    title: {
      propDefinition: [
        gitlab,
        "title",
      ],
      description: "The title of the issue",
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
      description: "The users to assign issue to",
    },
  },
  async run({ $ }) {
    const data = lodash.pickBy({
      title: this.title,
      description: this.description,
      labels: this.labels,
      assignee_ids: this.assigneeIds,
    });
    data.labels = data.labels?.join();
    const response = await this.gitlab.createIssue(this.projectId, {
      data,
    });
    $.export("$summary", `Created issue ${this.title}`);
    return response;
  },
};
