import { ConfigurationError } from "@pipedream/platform";
import { getFileStream } from "@pipedream/platform";
import scrapfly from "../../scrapfly.app.mjs";

export default {
  key: "scrapfly-ai-data-extraction",
  name: "AI Data Extraction",
  description: "Automate content extraction from any text-based source using AI, LLM, and custom parsing. [See the documentation](https://scrapfly.io/docs/extraction-api/getting-started)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapfly,
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
    url: {
      propDefinition: [
        scrapfly,
        "url",
      ],
    },
    charset: {
      type: "string",
      label: "Charset",
      description: "Charset of the document pass in the body. If you are not sure, you can use the `auto` value and we will try to detect it. Bad charset can lead to bad extraction, so it's important to set it correctly. **The most common charset is `utf-8` for text document and `ascii` for binary**. The symptom of a bad charset is that the text is not correctly displayed (accent, special characters, etc).",
      default: "auto",
      optional: true,
    },
    extractionTemplate: {
      type: "string",
      label: "Extraction Template",
      description: "Define an extraction template to get structured data. Use an ephemeral template (declared on the fly on the API call) or a stored template (declared in the dashboard) by using the template name.",
      optional: true,
    },
    extractionPrompt: {
      type: "string",
      label: "Extraction Prompt",
      description: "Instruction to extract data or ask a question on the scraped content with an LLM (Large Language Model). [Must be url encoded](https://scrapfly.io/web-scraping-tools/urlencode).",
      optional: true,
    },
    extractionModel: {
      type: "string",
      label: "Extraction Model",
      description: "AI Extraction to auto parse document to get structured data. E.g., `product`, `review`, `real-estate`, `article`.",
      optional: true,
    },
    webhookName: {
      type: "string",
      label: "Webhook Name",
      description: "Queue you scrape request and redirect API response to a provided webhook endpoint. You can create a webhook endpoint from your `dashboard`, it takes the name of the webhook. Webhooks are scoped to the given project/env.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.extractionTemplate && !this.extractionPrompt && !this.extractionModel) {
      throw new ConfigurationError("You must provide at least **Extraction Template**, **Extraction Prompt** or **Extraction Model**");
    }

    const stream = await getFileStream(this.body);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks).toString();

    const response = await this.scrapfly.automateContentExtraction({
      $,
      headers: {
        "content-type": this.contentType,
      },
      maxBodyLength: Infinity,
      params: {
        url: this.url,
        charset: this.charset,
        extraction_template: this.extractionTemplate,
        extraction_prompt: this.extractionPrompt,
        extraction_model: this.extractionModel,
        webhook_name: this.webhookName,
      },
      data,
    });

    $.export("$summary", "Successfully extracted content");
    return response;
  },
};
