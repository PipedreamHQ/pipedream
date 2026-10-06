import htmlCssToImageApp from "../../html_css_to_image.app.mjs";

export default {
  key: "html_css_to_image-list-templates",
  name: "List Templates",
  description: "List saved templates and their latest versions. Returns an array with each template's id, name, and version for **Create Image From Template**. Requires an API key with templates:read permission. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/templates/#listing-your-templates)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    htmlCssToImageApp,
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description: "Maximum number of templates to return, e.g. `100`. Defaults to 100 and automatically retrieves additional pages as needed.",
      optional: true,
      default: 100,
      min: 1,
    },
  },
  async run({ $ }) {
    const maxResults = this.maxResults ?? 100;
    const templates = [];
    let cursor;
    do {
      const response = await this.htmlCssToImageApp.listTemplates($, {
        count: Math.min(100, maxResults - templates.length),
        max_version: cursor,
      });
      templates.push(...response.data);
      cursor = response.pagination?.next_page_start;
    } while (cursor != null && templates.length < maxResults);

    const result = templates.slice(0, maxResults);
    $.export("$summary", `Found ${result.length} templates`);
    return result;
  },
};
