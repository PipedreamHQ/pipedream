import airslate from "../../airslate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airslate-create-new-template",
  name: "Create a New Template",
  description: "Create a new reusable document package that contains fillable documents and forms in the specified organization. [See the documentation](https://docs.airslate.io/docs/airslate-api/templates-api/operations/create-a-organization-template)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    airslate,
    organizationId: {
      propDefinition: [
        airslate,
        "organizationId",
      ],
    },
    templateRequestBody: {
      propDefinition: [
        airslate,
        "templateRequestBody",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airslate.createTemplate({
      organizationId: this.organizationId,
      body: this.templateRequestBody,
    });

    $.export("$summary", `Created new template in organization ${this.organizationId}`);
    return response;
  },
};
