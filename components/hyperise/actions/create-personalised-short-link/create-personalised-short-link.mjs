js;
import hyperise from "../../hyperise.app.mjs";

export default {
  key: "hyperise-create-personalised-short-link",
  name: "Create Personalised Short Link",
  description: "Creates a personalised short URL from provided inputs.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hyperise,
    originalUrl: {
      propDefinition: [
        hyperise,
        "originalUrl",
      ],
    },
    personalisationTags: {
      propDefinition: [
        hyperise,
        "personalisationTags",
      ],
    },
    customShortUrl: {
      propDefinition: [
        hyperise,
        "customShortUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hyperise.createPersonalisedShortUrl(
      this.originalUrl,
      this.personalisationTags,
      this.customShortUrl,
    );
    $.export("$summary", `Successfully created personalised short URL: ${response.short_url}`);
    return response;
  },
};
