import crunchbase from "../../crunchbase.app.mjs";

export default {
  key: "crunchbase-get-organization",
  name: "Get Organization Details",
  description: "Retrieve details about an organization. [See the documentation](https://data.crunchbase.com/reference/get_data-entities-organizations-entity-id)",
  version: "0.0.1",
  type: "action",
  props: {
    crunchbase,
    entityId: {
      propDefinition: [
        crunchbase,
        "entityId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.crunchbase.getOrganizationDetails({
      $,
      entityId: this.entityId,
    });

    $.export("$summary", `Successfully retrieved details for organization with ID ${this.entityId}`);
    return response;
  },
};
