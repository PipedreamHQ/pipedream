import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-organization",
  name: "Add Organization",
  description: "Adds a new organization. See the Pipedrive API docs for Organizations [here](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization)",
  version: "0.1.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    name: {
      type: "string",
      label: "Name",
      description: "Organization name",
    },
    ownerId: {
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this organization. When omitted, the authorized user ID will be used.",
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
      description: "Visibility of the organization. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
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
