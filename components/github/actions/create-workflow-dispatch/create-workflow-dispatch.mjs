import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";

export default {
  key: "github-create-workflow-dispatch",
  name: "Create Workflow Dispatch",
  description: "Creates a new workflow dispatch event. [See the documentation](https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
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
    ref: {
      type: "string",
      label: "Ref",
      description: "The git reference for the workflow. The reference can be a branch or tag name.",
    },
    inputs: {
      type: "object",
      label: "Inputs",
      description: "Input keys and values configured in the workflow file. The maximum number of properties is 10. Any default properties configured in the workflow file will be used when inputs are omitted.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.github.createWorkflowDispatch({
        repoFullname: this.repoFullname,
        workflowId: this.workflowId,
        data: {
          ref: this.ref,
          inputs: this.inputs,
        },
      });

      $.export("$summary", "Workflow dispatch successfully created!");

      return response;
    } catch (e) {
      throw new ConfigurationError(e?.response?.data?.message);
    }
  },
};
