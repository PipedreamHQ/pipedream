import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-page-property-item",
  name: "Retrieve Page Property Item",
  description: "Get a Property Item object for a selected page and property. [See the documentation](https://developers.notion.com/reference/retrieve-a-page-property)",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
    },
    propertyId: {
      propDefinition: [
        notion,
        "propertyId",
        (c) => ({
          pageId: c.pageId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.retrievePagePropertyItem(
      this.pageId,
      this.propertyId,
    );
    $.export("$summary", "Successfully retrieved property item");
    return response;
  },
};
