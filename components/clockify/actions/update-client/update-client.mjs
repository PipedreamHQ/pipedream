// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-update-client",
  name: "Update Client",
  description: "Updates an existing client in a Clockify workspace. Use **List Clients** to find the ID of the client to update. [See the documentation](https://docs.clockify.me/#tag/Client/operation/updateClient)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    clientId: {
      propDefinition: [
        clockify,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: false,
    },
    name: {
      propDefinition: [
        clockify,
        "clientName",
      ],
      description: "New name of the client",
      optional: true,
    },
    address: {
      propDefinition: [
        clockify,
        "clientAddress",
      ],
      description: "New address of the client",
    },
    note: {
      propDefinition: [
        clockify,
        "clientNote",
      ],
      description: "New note about the client",
    },
    archived: {
      propDefinition: [
        clockify,
        "archived",
      ],
      description: "Archive or unarchive the client. Note: an active (non-archived) client can't be deleted.",
    },
  },
  async run({ $ }) {
    if (this.name === undefined
      && this.address === undefined
      && this.note === undefined
      && this.archived === undefined) {
      throw new ConfigurationError("Set at least one field to update.");
    }

    const response = await this.clockify.updateClient({
      $,
      workspaceId: this.workspaceId,
      clientId: this.clientId,
      data: {
        name: this.name,
        address: this.address,
        note: this.note,
        archived: this.archived,
      },
    });

    $.export("$summary", `Successfully updated client with ID ${this.clientId}`);

    return response;
  },
};
