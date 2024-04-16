import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-add-webpage-content",
  name: "Add Webpage Content",
  description: "Adds your desired webpage content to the knowledge base. [See the documentation](https://developers.hansei.app/operation/operation-webpagesource)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hansei,
    url: {
      type: "string",
      label: "Webpage URL",
      description: "The URL of the webpage you want to extract content from",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the source",
    },
    collectionIds: {
      propDefinition: [
        hansei,
        "collectionIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hansei.addWebpage({
      $,
      data: {
        value: {
          url: this.url,
          name: this.name,
          collections: this.collectionIds,
        },
      },
    });
    $.export("$summary", `Successfully added webpage content from URL: ${this.url}`);
    return response;
  },
};
