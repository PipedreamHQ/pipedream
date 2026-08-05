// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-create-client",
  name: "Create Client",
  description: "Creates a new client in a Clockify workspace. Requires a client name; address and note are optional. [See the documentation](https://docs.clockify.me/#tag/Client)",
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
    name: {
      type: "string",
      label: "Name",
      description: "Name of the client",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the client",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note about the client",
      optional: true,
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
