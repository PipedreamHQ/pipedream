import prodatakey from "../../prodatakey.app.mjs";

export default {
  key: "prodatakey-retrieve-organization",
  name: "Retrieve Organization",
  description: "Retrieve an existing organization. [See the documentation](https://developer.pdk.io/web/2.0/rest/organizations#retrieve-an-organization)",
  version: "0.0.1",
  type: "action",
  props: {
    prodatakey,
    organizationId: {
      propDefinition: [
        prodatakey,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.prodatakey.retrieveOrganization({
      $,
      organizationId: this.organizationId,
    });

    $.export("$summary", `Successfully retrieved organization: ${response.name}`);
    return response;
  },
};
