import agentset from "../../agentset.app.mjs";
import { slugify } from "../../common/utils.mjs";

export default {
  key: "agentset-create-namespace",
  name: "Create Namespace",
  description: "Creates a namespace for the authenticated organization. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/namespaces/create)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agentset,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the namespace to create",
    },
  },
  async run({ $ }) {
    const response = await this.agentset.createNamespace({
      $,
      data: {
        name: this.name,
        slug: slugify(this.name),
      },
    });

    $.export("$summary", `Successfully created namespace with ID: ${response.data.id}`);
    return response;
  },
};
