// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-owners",
  name: "List Owners",
  description:
    "List owners (users) in the HubSpot account. Returns owner IDs, names, and emails. Use this to discover valid values for the `hubspot_owner_id` property when creating or updating any CRM object (contacts, companies, deals, tickets, etc.). [See the documentation](https://developers.hubspot.com/docs/api/crm/owners)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    email: {
      type: "string",
      label: "Email",
      description: "Filter owners by email address. Returns all owners if not provided.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.email) {
      params.email = this.email;
    }

    const { results: owners } = await this.hubspot.getOwners({
      $,
      params,
    });

    const output = owners.map((owner) => ({
      id: owner.id,
      email: owner.email,
      firstName: owner.firstName,
      lastName: owner.lastName,
      archived: owner.archived || false,
    }));

    $.export(
      "$summary",
      `Found ${output.length} owner${output.length === 1
        ? ""
        : "s"}`,
    );
    return output;
  },
};
