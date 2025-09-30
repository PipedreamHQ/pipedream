import app from "../../pandadoc.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "pandadoc-list-documents",
  name: "List Documents",
  description: "List documents, optionally filtering by a search query or tags. [See the documentation here](https://developers.pandadoc.com/reference/list-documents)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Search query. Filter by document reference number (this token is stored on template level) or name.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Search tag. Filter by document tag.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Specify the status of documents to return.",
      options: constants.DOCUMENTS_STATUS_OPTS,
      optional: true,
    },
    id: {
      propDefinition: [
        app,
        "documentId",
      ],
      optional: true,
    },
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "Returns only deleted documents. Default is false.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Specify how many document results to return. Default is 50 documents, maximum is 100 documents.",
      optional: true,
      min: 0,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Specify which page of the dataset to return.",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const {
      query,
      tag,
      status,
      count,
      page,
      deleted,
      id,
    } = this;

    const response = await this.app.listDocuments({
      $,
      params: {
        q: query,
        tag,
        status,
        count,
        page,
        deleted,
        id,
      },
    });

    $.export("$summary", `Successfully fetched ${response?.results?.length} documents`);
    return response;
  },
};
