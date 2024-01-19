import airslate from "../../airslate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airslate-update-template",
  name: "Update Template",
  description: "Update a specified template in airSlate. [See the documentation](https://docs.airslate.io/docs/airslate-api/templates-api%2foperations%2fmodify-a-organization-template)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    airslate,
    templateId: {
      propDefinition: [
        airslate,
        "templateId",
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
    const response = await this.airslate.modifyTemplate({
      templateId: this.templateId,
      body: this.templateRequestBody,
    });

    $.export("$summary", `Successfully updated template with ID: ${this.templateId}`);
    return response;
  },
};
