import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-get-issue",
  name: "Get Issue",
  description: "Get an existing issue from a Taiga project. [See the documentation](https://docs.taiga.io/api.html#issues-get)",
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
    const response = await this.taiga.getIssue({
      $,
      issueId: this.issueId,
    });

    $.export("$summary", `Retrieved issue: ${response.id}`);
    return response;
  },
};
