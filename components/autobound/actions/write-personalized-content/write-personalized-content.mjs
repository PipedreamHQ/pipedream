import app from "../../autobound.app.mjs";

export default {
  key: "autobound-write-personalized-content",
  name: "Write Personalized Content",
  description: "Write personalized content using Autobound. [See the documentation](https://autobound-api.readme.io/docs/generate-personalized-content-copy)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    contentType: {
      propDefinition: [
        app,
        "contentType",
      ],
    },
    contactEmail: {
      propDefinition: [
        app,
        "contactEmail",
      ],
    },
    userEmail: {
      propDefinition: [
        app,
        "userEmail",
      ],
    },
    writingStyle: {
      propDefinition: [
        app,
        "writingStyle",
      ],
    },
    additionalContext: {
      propDefinition: [
        app,
        "additionalContext",
      ],
    },
    wordCount: {
      propDefinition: [
        app,
        "wordCount",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.writePersonalizedContent({
      $,
      data: {
        contactEmail: this.contactEmail,
        userEmail: this.userEmail,
        contentType: this.contentType,
        writingStyle: this.writingStyle,
        additionalContext: this.additionalContext,
        wordCount: this.wordCount,
      },
    });
    $.export("$summary", "Successfully generated personalized content");
    return response;
  },
};
