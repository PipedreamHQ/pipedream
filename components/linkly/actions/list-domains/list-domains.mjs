import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-list-domains",
  name: "List Domains",
  description: "List all custom domains in your workspace via `GET /api/v1/workspace/{workspace_id}/domains`. [See the documentation](https://app.linklyhq.com/swaggerui#/Domains/listDomains).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    linkly,
  },
  async run({ $ }) {
    const { domains } = await this.linkly.listDomains({
      $,
    });
    $.export("$summary", `Successfully fetched ${domains?.length ?? 0} domain${domains?.length === 1 ? "" : "s"}.`);
    return domains;
  },
};
