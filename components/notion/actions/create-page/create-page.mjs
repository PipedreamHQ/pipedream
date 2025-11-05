import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-page",
  name: "Create Page",
  description: "Create a page from a parent page. [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  async run({ $ }) {
    const response = await this.buildPageFromDataSource({
      pageContent: this.pageContent,
      parentPageId: this.parent,
      properties: [
        {
          label: "title",
          type: "title",
          value: this.title,
        },
      ],
      icon: this.icon,
      cover: this.cover,
    });
    $.export("$summary", "Created page successfully");
    return response;
  },
};
