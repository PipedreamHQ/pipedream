// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-update-client",
  name: "Update Client",
  description: "Updates an existing client in a Clockify workspace. Use **List Clients** to find the ID of the client to update. [See the documentation](https://docs.clockify.me/#tag/Client)",
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
      type: "string",
      label: "Name",
      description: "New name of the client",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "New address of the client",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "New note about the client",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.name && !this.address && !this.note) {
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
      },
    });

    $.export("$summary", `Successfully updated client with ID ${this.clientId}`);

    return response;
  },
};
