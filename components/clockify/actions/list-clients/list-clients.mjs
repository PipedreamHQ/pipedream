// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-clients",
  name: "List Clients",
  description: "List all clients in a Clockify workspace. Optionally filter by a substring of the client name or by archived status, and page through results with the page and page size inputs. [See the documentation](https://docs.clockify.me/#tag/Client)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "If provided, you'll get a filtered list of clients that contains the provided string in the client name",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "If set to `true`, you'll only get archived clients",
      optional: true,
    },
    page: {
      propDefinition: [
        clockify,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        clockify,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.listClients({
      $,
      workspaceId: this.workspaceId,
      params: {
        "name": this.name,
        "archived": this.archived,
        "page": this.page,
        "page-size": this.pageSize,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} clients in the workspace`);

    return response;
  },
};
