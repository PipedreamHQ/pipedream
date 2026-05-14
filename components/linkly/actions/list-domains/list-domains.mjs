import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-list-domains",
  name: "List Domains",
  description: "Lists all custom domains connected to your account via the [Linkly URL Shortener API](https://linklyhq.com), including the default Linkly domain. [See the documentation](https://linklyhq.com/url-shortener-api).",
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
    const domains = await this.linkly.listDomains({
      $,
    });
    $.export("$summary", `Successfully fetched ${domains?.length ?? 0} domain${domains?.length === 1 ? "" : "s"}.`);
    return domains;
  },
};
