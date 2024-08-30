import scrapfly from "../../scrapfly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapfly-ai-data-extraction",
  name: "AI Data Extraction",
  description: "Automate content extraction from any text-based source using AI, LLM, and custom parsing. [See the documentation](https://scrapfly.io/docs/extraction-api/getting-started)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapfly,
    key: {
      propDefinition: [
        scrapfly,
        "key",
      ],
    },
    body: {
      propDefinition: [
        scrapfly,
        "body",
      ],
    },
    contentType: {
      propDefinition: [
        scrapfly,
        "contentType",
      ],
    },
    extractionPrompt: {
      type: "string",
      label: "Extraction Prompt",
      description: "Instruction to extract data or ask a question on the scraped content with an LLM (Large Language Model).",
      optional: true,
    },
    extractionTemplate: {
      type: "string",
      label: "Extraction Template",
      description: "Define an extraction template to get structured data. Use an ephemeral template (declared on the fly on the API call) or a stored template (declared in the dashboard) by using the template name.",
      optional: true,
    },
    extractionModel: {
      type: "string",
      label: "Extraction Model",
      description: "AI Extraction to auto parse document to get structured data. E.g., `product`, `review`, `real-estate`, `article`.",
      optional: true,
    },
    charset: {
      type: "string",
      label: "Charset",
      description: "Charset of the document passed in the body. If you are not sure, you can use the `auto` value and Scrapfly will try to detect it.",
      default: "auto",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      extraction_prompt: this.extractionPrompt,
      extraction_template: this.extractionTemplate,
      extraction_model: this.extractionModel,
      charset: this.charset,
    };

    const response = await this.scrapfly.automateContentExtraction({
      key: this.key,
      body: this.body,
      contentType: this.contentType,
      ...params,
    });

    $.export("$summary", "Successfully extracted content");
    return response;
  },
};
