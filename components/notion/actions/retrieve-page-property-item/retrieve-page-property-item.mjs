import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-page-property-item",
  name: "Retrieve Page Property Item",
  description:
    "Retrieves a `property_item` object for a given `page_id` and `property_id`.",
  version: "0.0.34",
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
    $.export("$summary", "Retrieved property item successfully");
    return response;
  },
};
