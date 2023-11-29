import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import pick from "lodash-es/pick.js";

export default {
  ...base,
  key: "notion-create-page-from-database",
  name: "Create Page from Database",
  description: "Creates a page from a database. [See the docs](https://developers.notion.com/reference/post-page)",
  version: "0.1.10",
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
    },
    pageContent: {
      type: "string",
      label: "Page Content",
      description: "Content of the page. You can use Markdown syntax [See docs](https://www.notion.so/help/writing-and-editing-basics#markdown-&-shortcuts)",
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
    buildPage(parentDatabase, $) {
      const MAX_BLOCKS = 100;
      const meta = this.buildDatabaseMeta(parentDatabase);
      const properties = this.buildPageProperties(parentDatabase.properties);
      let children = this.createBlocks(this.pageContent);
      const trim = children.length > MAX_BLOCKS;
      if (trim) {
        $.export("warning", {
          message: "Content trimmed",
          detail: `Notion limits the content to 100 blocks. Your Page Content had ${children.length} blocks. The page was created with the first ${MAX_BLOCKS} blocks, and the remaining content is available on the contentNotIncluded property.`,
          contentNotIncluded: children.slice(MAX_BLOCKS),
        });
        children = children.slice(0, MAX_BLOCKS);
      }
      return {
        ...meta,
        properties,
        children,
        trim,
      };
    },
  },
  async run({ $ }) {
    const parentPage = await this.notion.retrieveDatabase(this.parent);
    const page = this.buildPage(parentPage, $);
    const response = await this.notion.createPage(page);
    $.export("$summary", `Created page ${page.trim
      ? "(content trimmed, see warning)"
      : "successfully"}`);
    return response;
  },
};
