import coda from "../../coda.app.mjs";

export default {
  key: "coda_list-docs",
  name: "List Docs",
  description: "Returns a list of Coda docs accessible by the user. These are returned in the same order as on the docs page: reverse chronological by the latest event relevant to the user (last viewed, edited, or shared).",
  version: "0.0.26",
  type: "action",
  props: {
    coda,
    isOwner: {
      propDefinition: [
        coda,
        "isOwner",
      ],
    },
    isPublished: {
      propDefinition: [
        coda,
        "isPublished",
      ],
    },
    query: {
      propDefinition: [
        coda,
        "query",
      ],
    },
    sourceDoc: {
      propDefinition: [
        coda,
        "sourceDoc",
        (c) => c,
      ],
      description: "Show only docs copied from the specified doc ID.",
    },
    isStarred: {
      propDefinition: [
        coda,
        "isStarred",
      ],
    },
    inGallery: {
      propDefinition: [
        coda,
        "inGallery",
      ],
    },
    workspaceId: {
      propDefinition: [
        coda,
        "workspaceId",
      ],
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "Show only docs belonging to the given folder.",
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
    },
    paginate: {
      propDefinition: [
        coda,
        "paginate",
      ],
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

    var result = await this.coda.listDocs(params);

    if (!this.paginate) {
      return {
        items: result.items,
      };
    }

    var docList = result.items;
    while (result.nextPageToken) {
      params["pageToken"] = result.nextPageToken;
      result = await this.coda.listDocs(params);
      docList = [
        ...docList,
        ...result.items,
      ];
    }

    return {
      items: docList,
    };
  },
};
