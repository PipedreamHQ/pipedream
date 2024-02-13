import turbotPipes from "../../turbot_pipes.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "turbot_pipes-create-organization",
  name: "Create Organization",
  description: "Creates a new organization in Turbot Pipes. [See the documentation](https://redocly.github.io/redoc/?url=https://pipes.turbot.com/api/latest/docs/openapi.json&nocors#tag/orgs/operation/org_create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    turbotPipes,
    orgName: {
      propDefinition: [
        turbotPipes,
        "orgName",
      ],
    },
    orgDescription: {
      propDefinition: [
        turbotPipes,
        "orgDescription",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.turbotPipes.createOrganization({
      orgName: this.orgName,
      orgDescription: this.orgDescription,
    });

    $.export("$summary", `Successfully created organization '${this.orgName}'`);
    return response;
  },
};
