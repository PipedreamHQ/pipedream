import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";

export default {
  key: "github-disable-workflow",
  name: "Disable Workflow",
  description: "Disables a workflow and sets the **state** of the workflow to **disabled_manually**. [See the documentation](https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#disable-a-workflow)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    workflowId: {
      propDefinition: [
        github,
        "workflowId",
        ({ repoFullname }) => ({
          repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.github.disableWorkflow({
        repoFullname: this.repoFullname,
        workflowId: this.workflowId,
      });

      $.export("$summary", `Successfully disabled the workflow with Id: ${this.workflowId}!`);

      return response;
    } catch (e) {
      throw new ConfigurationError(e?.response?.data?.message);
    }
  },
};
