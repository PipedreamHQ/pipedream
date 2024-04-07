import autobound from "../../autobound.app.mjs";
import { CONTENT_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "autobound-write-personalized-content",
  name: "Write Personalized Content",
  description: "Enables you to create highly customized content for individual recipients.",
  version: "0.0.1",
  type: "action",
  props: {
    autobound,
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email address of the contact (prospect) the user (seller) is reaching out to.",
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email address of the user the content is written on behalf of.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of content you want to generate.",
      options: CONTENT_TYPE_OPTIONS,
      reloadProps: true,
    },
    n: {
      type: "integer",
      label: "Number of Content Pieces",
      description: "The number of unique pieces of content to generate for the given request.",
      optional: true,
      default: 1,
      min: 1,
      max: 3,
    },
    additionalContext: {
      type: "object",
      label: "Additional Context",
      description: "Allows for further customization of the generated content by providing specific guidelines or data to be included in the message. The flexibility here is powerful - you could incorporate intent data, mention past interactions logged in the CRM, or highlight any other relevant information. **Character limit is 10,000.**",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The desired language for content generation",
      optional: true,
      default: "english",
    },
    wordCount: {
      type: "integer",
      label: "Word Count",
      description: "The number of words (approx) you'd like the output to be. If word count is not passed in, the system will determine how many words to generate.",
      optional: true,
    },
  },
  additionalProps() {
    return this.contentType === "custom"
      ? {
        customContentType: {
          type: "string",
          label: "Custom Content Type",
          description: "Write out your own desired output, like \"describe this prospect's personality based on their social media\".",
        },
      }
      : {};
  },
  async run({ $ }) {
    const {
      autobound, ...data
    } = this;
    const response = await autobound.generateContent({
      $,
      data,
    });

    $.export("$summary", "Successfully generated personalized content");
    return response;
  },
};
