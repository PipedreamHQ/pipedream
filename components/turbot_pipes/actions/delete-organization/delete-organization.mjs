import turbotPipes from "../../turbot_pipes.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "turbot_pipes-delete-organization",
  name: "Delete Organization",
  description: "Deletes the specified organization. [See the documentation](https://redocly.github.io/redoc/?url=https://pipes.turbot.com/api/latest/docs/openapi.json&nocors#tag/orgs/operation/org_delete)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    turbotPipes,
    organizationId: {
      propDefinition: [
        turbotPipes,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.turbotPipes.deleteOrganization({
      organizationId: this.organizationId,
    });
    $.export("$summary", `Successfully deleted organization with ID ${this.organizationId}`);
    return response;
  },
};
