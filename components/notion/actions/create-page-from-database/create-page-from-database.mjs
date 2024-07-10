import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import pick from "lodash-es/pick.js";

export default {
  ...base,
  key: "notion-create-page-from-database",
  name: "Create Page from Database",
  description: "Creates a page from a database. [See the docs](https://developers.notion.com/reference/post-page)",
  version: "0.1.13",
  type: "action",
  props: {
    notion,
    parent: {
      propDefinition: [
        notion,
        "databaseId",
      ],
      label: "Parent Database ID",
      description: "The identifier for a Notion parent page",
      reloadProps: true,
    },
    metaTypes: {
      propDefinition: [
        notion,
        "metaTypes",
      ],
    },
    propertyTypes: {
      propDefinition: [
        notion,
        "propertyTypes",
        (c) => ({
          parentId: c.parent,
          parentType: "database",
        }),
      ],
      reloadProps: true,
    },
    alert: {
      type: "alert",
      alertType: "info",
      content: "This action will create an empty page by default. To add content, use the `pageContent` prop below.",
    },
    pageContent: {
      type: "string",
      label: "Page Content",
      description: "Content of the page. You can use Markdown syntax [See docs](https://www.notion.so/help/writing-and-editing-basics#markdown-&-shortcuts)",
      optional: true,
    },
  },
  async additionalProps() {
    const { properties } = await this.notion.retrieveDatabase(this.parent);
    const selectedProperties = pick(properties, this.propertyTypes);
    return this.buildAdditionalProps({
      properties: selectedProperties,
      meta: this.metaTypes,
    });
  },
  methods: {
    ...base.methods,
    /**
     * Builds a page from a parent database
     * @param parentDatabase - the parent database
     * @returns the constructed page in Notion format
     */
    buildPage(parentDatabase) {
      const meta = this.buildDatabaseMeta(parentDatabase);
      const properties = this.buildPageProperties(parentDatabase.properties);
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
    const parentPage = await this.notion.retrieveDatabase(this.parent);
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
