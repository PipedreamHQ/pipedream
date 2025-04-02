import { RESCRAPE_FREQUENCY_OPTIONS } from "../../common/constants.mjs";
import vectorshift from "../../vectorshift.app.mjs";

export default {
  key: "vectorshift-add-data-to-knowledge-base",
  name: "Add Data to Knowledge Base",
  description: "Adds data to a knowledge base in VectorShift. [See the documentation](https://docs.vectorshift.ai/api-reference/knowledge-bases/index).",
  version: "0.0.1",
  type: "action",
  props: {
    vectorshift,
    knowledgeBaseId: {
      propDefinition: [
        vectorshift,
        "knowledgeBaseId",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL to add to the knowledge base",
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Whether the scrape is recursive or not",
      default: false,
    },
    rescrapeFrequency: {
      type: "string",
      label: "Rescrape Frequency",
      description: "The frequency to rescrape the URL",
      options: RESCRAPE_FREQUENCY_OPTIONS,
      default: RESCRAPE_FREQUENCY_OPTIONS[0],
    },
  },
  async run({ $ }) {
    const response = await this.vectorshift.addDataToKnowledgeBase({
      $,
      knowledgeBaseId: this.knowledgeBaseId,
      data: {
        url_data: {
          request: {
            url: this.url,
            recursive: this.recursive,
            return_type: "CONTENT",
          },
          rescrape_frequency: this.rescrapeFrequency,
        },
      },
    });

    $.export("$summary", `Added ${response.document_ids.length} document(s) to knowledge base ${this.knowledgeBaseId}. Document IDs: ${response.document_ids.join(", ")}`);
    return response;
  },
};
