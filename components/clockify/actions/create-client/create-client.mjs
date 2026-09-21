import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-create-client",
  name: "Create Client",
  description: "Creates a new client in a Clockify workspace. Requires a client name; address and note are optional. [See the documentation](https://docs.clockify.me/#tag/Client/operation/createClient)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    name: {
      propDefinition: [
        clockify,
        "clientName",
      ],
    },
    address: {
      propDefinition: [
        clockify,
        "clientAddress",
      ],
    },
    note: {
      propDefinition: [
        clockify,
        "clientNote",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.createClient({
      $,
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
        address: this.address,
        note: this.note,
      },
    });

    $.export("$summary", `Successfully created client "${response.name}" with ID ${response.id}`);

    return response;
  },
};
