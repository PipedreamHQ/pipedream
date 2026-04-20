import coda from "../../coda.app.mjs";

export default {
  key: "coda-list-docs",
  name: "List Docs",
  description: "Returns a list of docs accessible by the user. These are returned in the same order as on the docs page: reverse chronological by the latest event relevant to the user (last viewed, edited, or shared). [See docs](https://coda.io/developers/apis/v1#operation/listDocs)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docId",
      ],
      description: "Show only docs copied from the specified doc",
      optional: true,
    },
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "Show only docs belonging to the given workspace",
      optional: true,
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "Show only docs belonging to the given folder",
    },
    query: {
      propDefinition: [
        coda,
        "query",
      ],
    },
    isOwner: {
      type: "boolean",
      label: "Is Owner Docs",
      description: "Show only docs owned by the user",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published Docs",
      description: "Show only published docs",
      optional: true,
    },
    isStarred: {
      type: "boolean",
      label: "Is Starred Docs",
      description: "If true, returns docs that are starred. If false, returns docs that are not starred",
      optional: true,
    },
    inGallery: {
      type: "boolean",
      label: "In Gallery Docs",
      description: "Show only docs visible within the gallery",
      optional: true,
    },
    max: {
      propDefinition: [
        coda,
        "max",
      ],
      label: "Max Items",
    },
  },
  async run({ $ }) {
    let params = {
      sourceDoc: this.docId,
      workspaceId: this.workspaceId,
      folderId: this.folderId,
      query: this.query,
      isOwner: this.isOwner,
      isPublished: this.isPublished,
      isStarred: this.isStarred,
      inGallery: this.inGallery,
    };

    let items = [];
    let response;
    do {
      response = await this.coda.listDocs($, params);
      items.push(...response.items);
      params.pageToken = response.nextPageToken;
    } while (params.pageToken && items.length < this.max);

    if (items.length > this.max) items.length = this.max;

    $.export("$summary", `Retrieved ${items.length} doc(s)`);

    return items;
  },
};
