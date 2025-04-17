import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import pick from "lodash-es/pick.js";

export default {
  ...base,
  key: "notion-create-page-from-database",
  name: "Create Page from Database",
  description: "Create a page from a database. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "0.1.18",
  type: "action",
  props: {
    notion,
    parent: {
      propDefinition: [
        notion,
        "databaseId",
      ],
      label: "Parent Database ID",
      description: "Select a parent database or provide a database ID",
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
      content: "This action will create an empty page by default. To add content, use the `Page Content` prop below.",
    },
    pageContent: {
      propDefinition: [
        notion,
        "pageContent",
      ],
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
