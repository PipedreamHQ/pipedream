import mailkite from "../../mailkite.app.mjs";

export default {
  key: "mailkite-list-domains",
  name: "List Domains",
  description:
    "List the domains on the MailKite account. Use this to find a domain ID (the `id` field) for **New Inbound Email (Instant)** and other domain-scoped props, without relying on the dropdown picker. [See the documentation](https://mailkite.dev/api/domains).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mailkite,
    mxVerifiedOnly: {
      type: "boolean",
      label: "MX-Verified Only",
      description:
        "Only return domains whose MX records are verified, e.g. `true`. MX verification is required to receive inbound email. Defaults to `false` (all domains).",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const domains = await this.mailkite.listDomains({
      $,
    });
    const results = this.mxVerifiedOnly
      ? (domains ?? []).filter((d) => d.mx_verified)
      : domains ?? [];

    $.export(
      "$summary",
      `Found ${results.length} domain${results.length === 1
        ? ""
        : "s"}`,
    );
    return results;
  },
};
