import airweave from "../../airweave.app.mjs";

export default {
  key: "airweave-list-sources",
  name: "List Available Sources",
  description: "List all available data source connectors. These are the types of integrations Airweave can connect to (e.g., GitHub, Slack, Google Drive, PostgreSQL, etc.). [See the documentation](https://docs.airweave.ai/api-reference/sources/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    airweave,
  },
  async run({ $ }) {
    const response = await this.airweave.listSources();

    const count = response.length;
    $.export("$summary", `Successfully retrieved ${count} available source connector(s)`);

    return response;
  },
};

