import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";
import { pick } from "lodash-es";

export default {
  ...base,
  key: "notion-update-page",
  name: "Update Page",
  description: "Updates page property values for the specified page. Properties that are not set will remain unchanged. To append page content, use the *append block* action. [See the docs](https://developers.notion.com/reference/patch-page)",
  version: "0.2.4",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      reloadProps: true,
    },
    archived: {
      propDefinition: [
        notion,
        "archived",
      ],
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
          parentId: c.pageId,
          parentType: "page",
        }),
      ],
    },
  },
  async additionalProps() {
    const { properties } = await this.notion.retrievePage(this.pageId);
    const selectedProperties = pick(properties, this.propertyTypes);

    return this.buildAdditionalProps({
      properties: selectedProperties,
      meta: this.metaTypes,
    });
  },
  methods: {
    ...base.methods,
    /**
     * Builds a page for a update operation
     * @param page - the parent page
     * @returns the constructed page in Notion format
     */
    buildPage(page) {
      const meta = this.buildDatabaseMeta(page);
      const properties = this.buildPageProperties(page.properties);
      return {
        ...meta,
        properties,
      };
    },
  },
  async run({ $ }) {
    const currentPage = await this.notion.retrievePage(this.pageId);
    const page = this.buildPage(currentPage);
    const response = await this.notion.updatePage(this.pageId, page);
    $.export("$summary", "Updated page successfully");
    return response;
  },
};
