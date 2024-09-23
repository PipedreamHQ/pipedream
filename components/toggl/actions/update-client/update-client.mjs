import toggl from "../../toggl.app.mjs";

export default {
  key: "toggl-update-client",
  name: "Update Client",
  description: "Updates an existing client in Toggl. [See the documentation](https://engineering.toggl.com/docs/api/clients#put-change-client)",
  version: "0.0.1",
  type: "action",
  props: {
    toggl,
    workspaceId: {
      propDefinition: [
        toggl,
        "workspaceId",
      ],
    },
    clientId: {
      propDefinition: [
        toggl,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    name: {
      propDefinition: [
        toggl,
        "clientName",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        toggl,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const client = await this.toggl.getClient({
      $,
      workspaceId: this.workspaceId,
      clientId: this.clientId,
    });
    const response = await this.toggl.updateClient({
      $,
      workspaceId: this.workspaceId,
      clientId: this.clientId,
      data: {
        name: this.name || client.name,
        notes: this.notes || client.notes,
        wid: this.workspaceId,
      },
    });
    if (response.id) {
      $.export("$summary", `Successfully updated client with ID: ${response.id}`);
    }
    return response;
  },
};
