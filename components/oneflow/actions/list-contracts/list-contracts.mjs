import app from "../../oneflow.app.mjs";

export default {
  key: "oneflow-list-contracts",
  name: "List Contracts",
  description: "List contracts in your Oneflow account, optionally filtered by text, state or workspace."
    + " Use the `id` field with **Get Contract**."
    + " [See the documentation](https://developer.oneflow.com/reference/get-contracts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userEmail: {
      propDefinition: [
        app,
        "userEmail",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Free text to search for, such as a participant name or contract name, e.g. `Acme`.",
      optional: true,
    },
    states: {
      type: "string[]",
      label: "States",
      description: "Only return contracts in these states, e.g. `[\"pending\", \"signed\"]`.",
      options: [
        "draft",
        "pending",
        "overdue",
        "signed",
        "declined",
      ],
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
        ({ userEmail }) => ({
          userEmail,
        }),
      ],
      description: "Only return contracts in this workspace, e.g. `12345`. Use **List Workspaces** to find it (the `id` field).",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const contracts = await this.app.paginate({
      $,
      fn: this.app.listContracts,
      userEmail: this.userEmail,
      maxResults: this.maxResults,
      params: {
        "filter[query]": this.query,
        "filter[states]": this.states?.join(","),
        "filter[workspace_ids]": this.workspaceId,
      },
    });
    $.export("$summary", `Found ${contracts.length} contract${contracts.length === 1
      ? ""
      : "s"}`);
    return contracts;
  },
};
