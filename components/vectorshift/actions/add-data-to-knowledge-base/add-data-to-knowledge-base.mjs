import {
  DATA_TYPE_OPTIONS, RESCRAPE_FRANQUENCY_OPTIONS,
} from "../../common/constants.mjs";
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
    dataType: {
      type: "string",
      label: "Data Type",
      description: "The type of the data to be added.",
      options: DATA_TYPE_OPTIONS,
      reloadProps: true,
    },
    file: {
      type: "string",
      label: "File Data",
      description: "The file to be uploaded, please provide a file from `/tmp`. To upload a file to `/tmp` folder, [See the documentation](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
      hidden: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL to add to the knowledge base",
      hidden: true,
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
      options: RESCRAPE_FRANQUENCY_OPTIONS,
      optional: true,
      hidden: true,
    },
    wikipedia: {
      type: "string",
      label: "Wikipedia",
      description: "Wikipedia data to add to the knowledge base",
      hidden: true,
    },
    youtube: {
      type: "string",
      label: "YouTube",
      description: "YouTube data to add to the knowledge base",
      hidden: true,
    },
    arxiv: {
      type: "string",
      label: "ArXiv",
      description: "ArXiv data to add to the knowledge base",
      hidden: true,
    },
    git: {
      type: "string",
      label: "Git",
      description: "Git data to add to the knowledge base",
      hidden: true,
    },
  },
  async additionalProps(props) {
    if (this.dataType) {
      props.url.hidden = true;
      props.wikipedia.hidden = true;
      props.youtube.hidden = true;
      props.arxiv.hidden = true;
      props.git.hidden = true;
      props[this.dataType].hidden = false;

      const isUrl = this.dataType === "url";
      props.rescrapeFrequency.hidden = !isUrl;
      props.recursive.hidden = !isUrl;
    }
    return {};
  },
  async run({ $ }) {
    let data = (this.dataType === "url")
      ? {
        url_data: {
          request: {
            url: this.url,
            recursive: this.recursive,
            return_type: "CONTENT",
          },
          rescrape_frequency: this.rescrapeFrequency,
        },
      }
      : this[this.dataType];

    const response = await this.vectorshift.addDataToKnowledgeBase({
      $,
      knowledgeBaseId: this.knowledgeBaseId,
      data,
    });

    $.export("$summary", `Added ${response.document_ids.length} document(s) to knowledge base ${this.knowledgeBaseId}. Document IDs: ${response.document_ids.join(", ")}`);
    return response;
  },
};
