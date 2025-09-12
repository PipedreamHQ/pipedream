import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-create-workflow",
  name: "Create a New Workflow",
  description: "Create a new workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/post-automation-v3-workflows)",
  version: "0.0.2",
  type: "action",
  props: {
    hubspot,
    name: {
      type: "string",
      label: "Workflow Name",
      description: "The name of the workflow to create",
    },
    type: {
      propDefinition: [
        hubspot,
        "type",
      ],
    },
    actions: {
      propDefinition: [
        hubspot,
        "actions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.createWorkflow({
      data: {
        name: this.name,
        type: this.type,
        actions: parseObject(this.actions),
      },
      $,
    });

    $.export("$summary", `Successfully created workflow: ${this.name}`);
    return response;
  },
};
