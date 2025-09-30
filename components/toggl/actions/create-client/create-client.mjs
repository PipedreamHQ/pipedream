import toggl from "../../toggl.app.mjs";

export default {
  key: "toggl-create-client",
  name: "Create Client",
  description: "Create a new client in Toggl. [See the documentation](https://engineering.toggl.com/docs/api/clients#post-create-client)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    toggl,
    workspaceId: {
      propDefinition: [
        toggl,
        "workspaceId",
      ],
    },
    name: {
      propDefinition: [
        toggl,
        "clientName",
      ],
    },
    notes: {
      propDefinition: [
        toggl,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.toggl.createClient({
      $,
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
        notes: this.notes,
        wid: this.workspaceId,
      },
    });
    if (response.id) {
      $.export("$summary", `Successfully created client with ID: ${response.id}`);
    }
    return response;
  },
};
