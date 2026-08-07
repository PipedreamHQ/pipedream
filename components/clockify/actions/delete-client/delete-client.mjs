// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-delete-client",
  name: "Delete Client",
  description: "Deletes a client from a Clockify workspace. This cannot be undone. Clockify only allows deleting archived clients, so this action archives the client first if it isn't already. Use **List Clients** to find the ID of the client to delete. [See the documentation](https://docs.clockify.me/#tag/Client)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    await this.clockify.updateClient({
      $,
      workspaceId: this.workspaceId,
      clientId: this.clientId,
      data: {
        archived: true,
      },
    });

    await this.clockify.deleteClient({
      $,
      workspaceId: this.workspaceId,
      clientId: this.clientId,
    });

    $.export("$summary", `Successfully deleted client with ID ${this.clientId}`);

    return {
      success: true,
    };
  },
};
