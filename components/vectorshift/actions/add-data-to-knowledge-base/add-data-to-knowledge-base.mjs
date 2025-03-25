import vectorshift from "../../vectorshift.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vectorshift-add-data-to-knowledge-base",
  name: "Add Data to Knowledge Base",
  description: "Adds data to a knowledge base in VectorShift. [See the documentation](https://docs.vectorshift.ai/api-reference/knowledge-bases/index).",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vectorshift,
    knowledgeBaseId: {
      propDefinition: [
        vectorshift,
        "knowledgeBaseId",
      ],
    },
    fileData: {
      propDefinition: [
        vectorshift,
        "fileData",
      ],
      optional: true,
    },
    urlData: {
      propDefinition: [
        vectorshift,
        "urlData",
      ],
      optional: true,
    },
    wikipedia: {
      propDefinition: [
        vectorshift,
        "wikipedia",
      ],
      optional: true,
    },
    youtube: {
      propDefinition: [
        vectorshift,
        "youtube",
      ],
      optional: true,
    },
    arxiv: {
      propDefinition: [
        vectorshift,
        "arxiv",
      ],
      optional: true,
    },
    git: {
      propDefinition: [
        vectorshift,
        "git",
      ],
      optional: true,
    },
    addDataConfig: {
      propDefinition: [
        vectorshift,
        "addDataConfig",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      !this.fileData &&
      !this.urlData &&
      !this.wikipedia &&
      !this.youtube &&
      !this.arxiv &&
      !this.git
    ) {
      throw new Error("At least one of fileData, urlData, wikipedia, youtube, arxiv, or git must be provided.");
    }

    const documentIds = await this.vectorshift.addDataToKnowledgeBase({
      knowledgeBaseId: this.knowledgeBaseId,
      fileData: this.fileData,
      urlData: this.urlData,
      wikipedia: this.wikipedia,
      youtube: this.youtube,
      arxiv: this.arxiv,
      git: this.git,
      addDataConfig: this.addDataConfig,
    });

    $.export(
      "$summary",
      `Added ${documentIds.length} document(s) to knowledge base ${this.knowledgeBaseId}. Document IDs: ${documentIds.join(", ")}`,
    );

    return {
      document_ids: documentIds,
    };
  },
};
