import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-page",
  name: "Create Page",
  description: "Creates a page from a parent page. The only valid property is *title*. [See the docs](https://developers.notion.com/reference/post-page)",
  version: "0.2.0",
  type: "action",
  props: {
    notion,
    parent: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent Page ID",
      description: "The identifier for a Notion parent page",
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
      type: "string",
      label: "Page Content",
      description: "Content of the page. You can use Markdown syntax [See docs](https://www.notion.so/help/writing-and-editing-basics#markdown-&-shortcuts)",
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
  },
  async run({ $ }) {
    const parentPage = await this.notion.retrievePage(this.parent);
    const page = this.buildPage(parentPage);
    const response = await this.notion.createPage(page);
    $.export("$summary", "Created page successfully");
    return response;
  },
};
