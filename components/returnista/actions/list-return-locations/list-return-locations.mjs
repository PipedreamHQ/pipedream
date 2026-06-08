import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-list-return-locations",
  name: "List Return Locations",
  description: "Lists all return locations (warehouse or depot addresses) configured for an account."
    + " Return locations are the physical addresses where consumers send returned items."
    + " Use this tool to discover available location IDs before creating or updating a location."
    + " To create a new return location, use **Create Return Location**."
    + " To update an existing location, pass the location ID to **Update Return Location**."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-locations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    returnista,
    accountId: {
      propDefinition: [
        returnista,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnLocations({
      $,
      accountId: this.accountId,
    });
    const locations = response?.data ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${locations.length} return location(s)`);
    return response;
  },
};
