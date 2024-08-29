import crunchbase from "../../crunchbase.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crunchbase-get-organization",
  name: "Get Organization Details",
  description: "Retrieve details about an organization. [See the documentation](https://data.crunchbase.com/reference/get_data-entities-organizations-entity-id)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    crunchbase,
    entityId: {
      propDefinition: [
        crunchbase,
        "entityId",
      ],
    },
    fieldIds: {
      propDefinition: [
        crunchbase,
        "fieldIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.crunchbase.getOrganizationDetails({
      entityId: this.entityId,
      fieldIds: this.fieldIds,
    });
    $.export("$summary", `Successfully retrieved details for organization with ID ${this.entityId}`);
    return response;
  },
};
