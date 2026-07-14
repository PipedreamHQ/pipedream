import app from "../../algodocs.app.mjs";
import { DEFAULT_LIST_LIMIT } from "../../common/constants.mjs";
import { normalizeRecords } from "../../common/utils.mjs";

export default {
  key: "algodocs-list-documents",
  name: "List Documents",
  description:
    "Lists documents for a given extractor by reading extraction records (GET /v1/extracted_data/{extractorId}) and returning their `documentId` and `fileName`, deduplicated by `documentId`. AlgoDocs has no dedicated documents endpoint, so this action derives the document list from extracted data. Use it to discover a valid `documentId` before configuring **New Extracted Data**. Run **List Extractors** to find a valid extractor ID first. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    algodocs: app,
    extractorId: {
      propDefinition: [
        app,
        "extractorId",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of records to return (min 1, max 1000). Defaults to ${DEFAULT_LIST_LIMIT} if omitted.`,
      optional: true,
      min: 1,
      max: 1000,
    },
  },
  async run({ $ }) {
    const limit = this.limit ?? DEFAULT_LIST_LIMIT;

    const response = await this.algodocs.getExtractedDataByExtractor({
      $,
      extractorId: this.extractorId,
      params: {
        folderId: this.folderId,
        limit,
      },
    });

    const records = normalizeRecords(response);
    const sliced = records.slice(0, limit);

    const seenDocumentIds = new Set();
    const documents = [];
    for (const record of sliced) {
      const documentId = record.documentId ?? record.document_id ?? record.id;
      if (seenDocumentIds.has(documentId)) {
        continue;
      }
      seenDocumentIds.add(documentId);
      documents.push({
        documentId,
        fileName: record.fileName ?? record.file_name ?? record.name,
      });
    }

    $.export("$summary", `Retrieved ${documents.length} document(s) for extractor ${this.extractorId}`);
    return documents;
  },
};
