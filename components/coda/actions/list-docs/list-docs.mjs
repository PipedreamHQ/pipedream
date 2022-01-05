import coda from "../../coda.app.mjs";

export default {
  key: "coda_list-docs",
  name: "List Docs",
  description: "Returns a list of Coda docs accessible by the user. These are returned in the same order as on the docs page: reverse chronological by the latest event relevant to the user (last viewed, edited, or shared).",
  version: "0.0.13",
  type: "action",
  props: {
    coda,
    isOwner: {
      propDefinition: [
        coda,
        "isOwner",
      ],
      optional: true,
    },
    isPublished: {
      propDefinition: [
        coda,
        "isPublished",
      ],
      optional: true,
      default: false,
    },
    query: {
      propDefinition: [
        coda,
        "query",
      ],
      optional: true,
    },
    sourceDoc: {
      propDefinition: [
        coda,
        "sourceDoc",
      ],
      description: "Show only docs copied from the specified doc ID.",
      optional: true,
    },
    isStarred: {
      propDefinition: [
        coda,
        "isStarred",
      ],
      optional: true,
      default: false,
    },
    inGallery: {
      propDefinition: [
        coda,
        "inGallery",
      ],
      optional: true,
      default: false,
    },
    workspaceId: {
      propDefinition: [
        coda,
        "workspaceId",
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "Show only docs belonging to the given folder.",
      optional: true,
    },
    limit: {
      propDefinition: [
        coda,
        "limit",
      ],
    },
    pageToken: {
      propDefinition: [
        coda,
        "pageToken",
      ],
      optional: true,
    },
  },
  async run() {
    var params = {
      isOwner: this.isOwner,
      isPublished: this.isPublished,
      query: this.query,
      sourceDoc: this.sourceDoc,
      isStarred: this.isStarred,
      inGallery: this.inGallery,
      workspaceId: this.workspaceId,
      folderId: this.folderId,
      limit: this.limit,
      pageToken: this.pageToken,
    };
    Object.keys(params).forEach((key) => (params[key] === null
      || params[key] === undefined
      || params[key] === "")
      && delete params[key]);
    return await this.coda.listDocs(params);
  },
};
