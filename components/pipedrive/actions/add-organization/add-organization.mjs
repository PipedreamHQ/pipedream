import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-organization",
  name: "Add Organization",
  description: "Creates a new organization (company) in Pipedrive. Only `Organization Name` is required."
    + " Pass an owner ID from **List User ID Options** to assign someone other than the authorized user."
    + " Example: `Organization Name` `Northgate Logistics Ltd`, `Owner ID` `12345678`."
    + " Pipedrive does not deduplicate organizations by name, so check **List Organizations** first to avoid creating a duplicate."
    + " Use the returned `id` as the organization ID in **Add Person**, **Add Deal** or **Add Lead**."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization)",
  version: "0.1.23",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    name: {
      type: "string",
      label: "Organization Name",
      description: "The name of the organization, e.g. `Northgate Logistics Ltd`.",
    },
    ownerId: {
      label: "Owner ID",
      description: "The ID of the user to set as owner of the organization, e.g. `12345678`. If omitted, the authorized user is used. Use **List User ID Options** to find it (the `value` field).",
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
      description: "Who can see the organization: `1` (owner & followers) or `3` (entire company), e.g. `3`. If omitted, the account's default visibility for organizations is used.",
    },
  },
  async run({ $ }) {
    try {
      const resp = await this.pipedriveApp.addOrganization({
        name: this.name,
        owner_id: this.ownerId,
        visible_to: this.visibleTo,
      });

      $.export("$summary", "Successfully added organization");

      return resp;
    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
