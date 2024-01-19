import airslate from "../../airslate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "airslate-create-new-organization",
  name: "Create New Organization",
  description: "Creates a new organization in airSlate with optional settings. [See the documentation](https://docs.airslate.io/docs/airslate-api/organizations-api/operations/create-a-organization)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    airslate,
    organizationRequestBody: {
      propDefinition: [
        airslate,
        "organizationRequestBody",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airslate.createOrganization({
      body: this.organizationRequestBody || {},
    });

    $.export("$summary", "Successfully created a new organization");
    return response;
  },
};
