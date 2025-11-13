import ahrefs from "../../ahrefs.app.mjs";

export default {
  name: "Get Referring Domains",
  description: "Get the referring domains that contain backlinks to the target URL or domain. [See the documentation](https://docs.ahrefs.com/docs/api/site-explorer/operations/list-refdomains)",
  key: "ahrefs-get-referring-domains",
  version: "0.0.18",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ahrefs,
    target: {
      propDefinition: [
        ahrefs,
        "target",
      ],
    },
    select: {
      propDefinition: [
        ahrefs,
        "select",
      ],
      description: "An array of columns to return. [See response schema](https://docs.ahrefs.com/docs/api/site-explorer/operations/list-refdomains) for valid column identifiers.",
    },
    mode: {
      propDefinition: [
        ahrefs,
        "mode",
      ],
    },
    limit: {
      propDefinition: [
        ahrefs,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ahrefs.getReferringDomains({
      $,
      params: {
        target: this.target,
        select: this.select.join(","),
        mode: this.mode,
        limit: this.limit,
      },
    });
    $.export("$summary", "Successfully retrieved referring domains data");
    return response;
  },
};
