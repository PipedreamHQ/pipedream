import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-add-webpage-content",
  name: "Add Webpage Content",
  description: "Adds your desired webpage content to the knowledge base. [See the documentation](https://developers.hansei.app/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hansei,
    url: {
      propDefinition: [
        hansei,
        "url",
      ],
    },
    metadata: {
      propDefinition: [
        hansei,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hansei.addWebpageToKnowledgeBase({
      url: this.url,
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully added webpage content from URL: ${this.url}`);
    return response;
  },
};
