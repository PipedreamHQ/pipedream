import brewpage from "../../brewpage.app.mjs";

/** @typedef {import('@pipedream/types').ActionPropDefinitions} Props */
/** @satisfies {import('@pipedream/types').Action<{}, Props>} */
export default {
  key: "brewpage-publish-report",
  name: "Publish HTML or Markdown Report",
  description: "Publish a reviewed report to a temporary reader link. [See the documentation](https://brewpage.app/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    brewpage,
    content: {
      type: "string",
      label: "Report Content",
      secret: true,
      description: "Reviewed HTML or Markdown, maximum 5 MiB UTF-8. Sent to BrewPage. Exclude secrets and personal data. HTML may load external resources.",
    },
    format: {
      type: "string",
      label: "Report Format",
      description: "Choose the reviewed report's format explicitly.",
      options: [
        {
          label: "HTML",
          value: "html",
        },
        {
          label: "Markdown",
          value: "markdown",
        },
      ],
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Choose explicitly: Public is listed/searchable; Unlisted is readable by anyone with the link, without password protection.",
      options: [
        {
          label: "Public — gallery and search engines",
          value: "public",
        },
        {
          label: "Unlisted — anyone with the link",
          value: "unlisted",
        },
      ],
    },
    ttlDays: {
      type: "integer",
      label: "Requested Retention in Days",
      min: 1,
      max: 30,
      description: "Required, 1–30 days. Existing identical pages may retain their original expiry; use returned expiresAt. Management capabilities are discarded; this action cannot edit, delete or extend a publication.",
    },
  },
  async run({ $ }) {
    const result = await this.brewpage.publishReport({
      $,
      content: this.content,
      format: this.format,
      visibility: this.visibility,
      ttlDays: this.ttlDays,
    });
    $.export("$summary", `Published ${result.format} report; expires ${result.expiresAt}.`);
    return result;
  },
};
