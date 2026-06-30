import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-update-page",
  name: "Update Page",
  description:
    "Update a Notion page's property values, and/or archive (delete) it. Properties you don't include are left unchanged."
    + " Provide the page ID or URL (use **Search** or **Query Data Source** to find it)."
    + " Set `properties` to a flat JSON object of column-name → value, e.g. `{ \"Status\": \"Contained\" }`; call **Retrieve Database Schema** first to learn the exact column names and valid select options."
    + " To add body content instead of changing properties, use **Append Block to Parent**."
    + " [See the documentation](https://developers.notion.com/reference/patch-page)",
  version: "3.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    pageId: {
      type: "string",
      label: "Page ID or URL",
      description: "The ID (or Notion URL) of the page to update. Use **Search** or **Query Data Source** to find it.",
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "A flat JSON object of column-name → value to set, e.g. `{ \"Status\": \"Contained\", \"ThreatLevel\": 8 }`. Omitted properties are left unchanged. Use **Retrieve Database Schema** to discover valid names and select options.",
      optional: true,
    },
    archived: {
      propDefinition: [
        notion,
        "archived",
      ],
    },
  },
  methods: {
    ...base.methods,
    /**
     * Builds a page for an update operation
     * @param page - the current page (provides the property schema + meta)
     * @returns the constructed page in Notion format
     */
    buildPage(page) {
      const meta = this.buildDataSourceMeta(page);
      const properties = this.buildPageProperties(page.properties);
      return {
        ...meta,
        properties,
      };
    },
  },
  async run({ $ }) {
    const pageId = utils.extractNotionId(this.pageId);
    this.properties = utils.parsePropertiesObject(this.properties);

    const currentPage = await this.notion.retrievePage(pageId);
    const page = this.buildPage(currentPage);
    const response = await this.notion.updatePage(pageId, page);

    $.export("$summary", "Updated page successfully");
    return response;
  },
};
