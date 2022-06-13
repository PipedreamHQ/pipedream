import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import { pick } from "lodash-es";

export default {
  ...base,
  key: "notion-create-page-from-database",
  name: "Create Page from Database",
  description: "Creates a page from a database. [See the docs](https://developers.notion.com/reference/post-page)",
  version: "0.0.1",
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
    blockTypes: {
      propDefinition: [
        notion,
        "blockTypes",
      ],
    },
  },
  async additionalProps() {
    const { properties } = await this.notion.retrieveDatabase(this.parent);
    const selectedProperties = pick(properties, this.propertyTypes);
    return this.buildAdditionalProps({
      properties: selectedProperties,
      meta: this.metaTypes,
      blocks: this.blockTypes,
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
      const children = this.createBlocks();
      return {
        ...meta,
        properties,
        children,
      };
    },
  },
  async run({ $ }) {
    const parentPage = await this.notion.retrieveDatabase(this.parent);
    const page = this.buildPage(parentPage);
    const response = await this.notion.createPage(page);
    $.export("$summary", "Created page successfully");
    return response;
  },
};
