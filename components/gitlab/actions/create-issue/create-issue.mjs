import gitlab from "../../gitlab.app.mjs";
import lodash from "lodash";

export default {
  key: "gitlab-create-issue",
  name: "Create issue",
  description: "Creates a new issue. [See docs](https://docs.gitlab.com/ee/api/issues.html#new-issue)",
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
    const opts = lodash.pickBy(lodash.pick(this, [
      "title",
      "description",
      "labels",
      "assigneeIds",
    ]));
    opts.labels = opts.labels?.join();
    const response = await this.gitlab.createIssue(this.projectId, opts);
    $.export("$summary", `Created issue ${this.title}`);
    return response;
  },
};
