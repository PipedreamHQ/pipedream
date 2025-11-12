import dockCerts from "../../dock_certs.app.mjs";

export default {
  key: "dock_certs-list-credentials",
  name: "List Credentials",
  description: "List existing credentials. [See the documentation](https://docs.api.dock.io/?json-doc#get-credentials-metadata)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dockCerts,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const response = await this.dockCerts.paginate({
      resourceFn: this.dockCerts.listCredentials,
      maxResults: this.maxResults,
      args: {
        $,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.length} credential${response.length === 1
        ? ""
        : "s"}`);
    }

    return response;
  },
};
