import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-delete-issue",
  name: "Delete Issue",
  description: "Delete an existing issue from a Taiga project. [See the documentation](https://docs.taiga.io/api.html#issues-delete)",
  version: "0.0.1",
  type: "action",
  props: {
    taiga,
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    issueId: {
      propDefinition: [
        taiga,
        "issueId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taiga.deleteIssue({
      $,
      issueId: this.issueId,
    });

    $.export("$summary", `Deleted issue: ${this.issueId}`);
    return response;
  },
};
