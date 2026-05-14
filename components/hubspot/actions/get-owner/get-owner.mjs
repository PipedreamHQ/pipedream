import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-owner",
  name: "Get Owner",
  description:
    "Get a single HubSpot owner (user) by ID. Select an owner from the dropdown (search by email), enter an ID manually, or use **List Owners** for a full list."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/crm-owners-v3/owners/get-crm-v3-owners-ownerId)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    ownerId: {
      propDefinition: [
        hubspot,
        "ownerId",
      ],
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
