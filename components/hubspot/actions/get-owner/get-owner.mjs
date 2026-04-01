import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-owner",
  name: "Get Owner",
  description:
    "Get a single HubSpot owner (user) by ID. Use **List Owners** to discover IDs or filter by email."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/crm-owners-v3/owners/get-crm-v3-owners-ownerId)",
  version: "0.0.2"
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "Numeric HubSpot owner ID (e.g. from **List Owners**).",
    },
  },
  async run({ $ }) {
    const owner = await this.hubspot.getOwner({
      $,
      ownerId: this.ownerId,
    });

    const label = owner?.email || owner?.id || this.ownerId;
    $.export("$summary", `Retrieved owner \`${label}\``);
    return owner;
  },
};
