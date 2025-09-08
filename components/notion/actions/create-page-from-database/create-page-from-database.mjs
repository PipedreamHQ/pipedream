import NOTION_ICONS from "../../common/notion-icons.mjs";
import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-page-from-database",
  name: "Create Page from Data Source",
  description: "Create a page from a data source. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "1.0.0",
  type: "action",
  props: {
    notion,
    parentDataSource: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
      label: "Parent Data Source ID",
      description: "Select a parent data source or provide a data source ID",
    },
    Name: {
      type: "string",
      label: "Name",
      description: "The name of the page. Use this only if the data source has a `title` property named `Name`. Otherwise, use the `Properties` prop below to set the title property.",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "The values of the page's properties. The schema must match the parent data source's properties. [See the documentation](https://developers.notion.com/reference/property-object) for information on various property types. Example: `{ \"Tags\": [ \"tag1\" ], \"Link\": \"https://pipedream.com\" }`",
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
      description: "Cover [External URL](https://developers.notion.com/reference/file-object#external-file-objects)",
      optional: true,
    },
    alert: {
      type: "alert",
      alertType: "info",
      content: "This action will create an empty page by default. To add content, use the `Page Content` prop below.",
    },
    pageContent: {
      propDefinition: [
        notion,
        "pageContent",
      ],
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
    const response = await this.notion.createPage({
      ...page,
      children: children.slice(0, MAX_BLOCKS),
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
