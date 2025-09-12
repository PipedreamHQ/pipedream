import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-page",
  name: "Create Page",
  description: "Create a page from a parent page. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "0.2.21",
  type: "action",
  props: {
    notion,
    parent: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent Page ID",
      description: "Select a parent page or provide a page ID",
      reloadProps: true,
    },
    title: {
      propDefinition: [
        notion,
        "title",
      ],
    },
    metaTypes: {
      propDefinition: [
        notion,
        "metaTypes",
      ],
    },
    pageContent: {
      propDefinition: [
        notion,
        "pageContent",
      ],
    },
  },
  async additionalProps() {
    return this.buildAdditionalProps({
      meta: this.metaTypes,
    });
  },
  methods: {
    ...base.methods,
    /**
     * Builds a page from a parent page
     * @param parentPage - the parent page
     * @returns the constructed page in Notion format
     */
    buildPage(parentPage) {
      const meta = this.buildPageMeta(parentPage);
      const children = this.createBlocks(this.pageContent);

      const properties = {};
      if (this.title) {
        properties.title = {
          title: utils.buildTextProperty(this.title),
        };
      }

      return {
        ...meta,
        properties,
        children,
      };
    },
    splitChildrenArray(children) {
      const first100Children = children.slice(0, 100);
      const restOfChildren = children.slice(100);
      return {
        first100Children,
        restOfChildren,
      };
    },
    async appendChildren(pageId, children) {
      while (children.length) {
        const {
          first100Children, restOfChildren,
        } = this.splitChildrenArray(children);
        await this.notion.appendBlock(pageId, first100Children);
        children = restOfChildren;
      }
    },
  },
  async run({ $ }) {
    const parentPage = await this.notion.retrievePage(this.parent);
    const page = this.buildPage(parentPage);

    // Notion restricts children array length to <= 100
    const {
      first100Children, restOfChildren,
    } = this.splitChildrenArray(page.children);
    page.children = first100Children;

    const response = await this.notion.createPage(page);

    if (restOfChildren.length) {
      await this.appendChildren(response.id, restOfChildren);
    }

    $.export("$summary", "Created page successfully");
    return response;
  },
};
