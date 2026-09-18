import NOTION_ICONS from "../../common/notion-icons.mjs";
import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-page-from-database",
  name: "Create Page from Data Source",
  description: "Create a new page (row) in a Notion data source (database). Provide the parent data source ID and the row's field values as a JSON object keyed by column name. Use the **Search** action (with `filter: data_source`) to resolve a database name into its data source ID, and **Retrieve Database Schema** to learn the exact column names and types before setting values. Optionally add page body content with `Page Content` (Markdown). Example: parentDataSource `\"a1b2c3d4-...\"` with properties `{ \"Name\": \"Q1 Report\", \"Status\": \"In Progress\", \"Tags\": [\"finance\"] }` → creates a new row with those fields and returns the created page object. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "3.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    notion,
    parentDataSource: {
      type: "string",
      label: "Parent Data Source ID",
      description: "The ID of the parent data source (database) to add the page to. Use the **Search** action with `filter: data_source` to resolve a database name into its data source ID.",
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "The new page's property values as a JSON object keyed by column name. Keys must match the parent data source's column names and the values their types — call **Retrieve Database Schema** first if you don't know them. Example: `{ \"Name\": \"Q1 Report\", \"Status\": \"In Progress\", \"Tags\": [\"finance\", \"planning\"], \"Link\": \"https://pipedream.com\" }`. [See the documentation](https://developers.notion.com/reference/property-object) for property types.",
      optional: true,
    },
    icon: {
      type: "string",
      label: "Icon Emoji",
      description: "Page Icon [Emoji](https://developers.notion.com/reference/emoji-object)",
      options: NOTION_ICONS,
      optional: true,
    },
    cover: {
      type: "string",
      label: "Cover URL",
      description: "Cover image [external URL](https://developers.notion.com/reference/file-object#external-file-objects)",
      optional: true,
    },
    pageContent: {
      propDefinition: [
        notion,
        "pageContent",
      ],
    },
    templateType: {
      type: "string",
      label: "Template Type",
      description: "How to populate the new page. `none` (default): apply the `Properties` and `Page Content` you provide. `default`: apply the data source's default template (`Page Content` is ignored). `template_id`: apply a specific template given by `Template ID` (`Page Content` is ignored). [See the documentation](https://developers.notion.com/docs/creating-pages-from-templates).",
      options: [
        "none",
        "default",
        "template_id",
      ],
      default: "none",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to apply. Required only when `Template Type` is `template_id`.",
      optional: true,
    },
  },
  methods: {
    ...base.methods,
    /**
     * Builds a page from a parent data source
     * @param parentDataSource - the parent data source
     * @returns the constructed page in Notion format
     */
    buildPage(parentDataSource) {
      const meta = this.buildDataSourceMeta(parentDataSource);
      this.properties = utils.parseObject(this.properties);
      const properties = this.buildPageProperties(parentDataSource.properties);
      const children = this.createBlocks(this.pageContent);
      return {
        ...meta,
        properties,
        children,
      };
    },
  },
  async run({ $ }) {
    const MAX_BLOCKS = 100;
    const parentPage = await this.notion.retrieveDataSource(this.parentDataSource);
    const {
      children, ...page
    } = this.buildPage(parentPage);
    const data = this.templateId
      ? {
        template: {
          type: this.templateType,
          template_id: this.templateId,
        },
      }
      : {
        children: children.slice(0, MAX_BLOCKS),
      };
    const response = await this.notion.createPage({
      ...data,
      ...page,
      parent: {
        data_source_id: this.parentDataSource,
      },
    });
    let remainingBlocks = children.slice(MAX_BLOCKS);
    while (remainingBlocks.length > 0) {
      await this.notion.appendBlock(response.id, remainingBlocks.slice(0, MAX_BLOCKS));
      remainingBlocks = remainingBlocks.slice(MAX_BLOCKS);
    }
    $.export("$summary", "Created page successfully");
    return response;
  },
};
