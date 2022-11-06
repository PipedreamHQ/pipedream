import app from "../../siteleaf.app.mjs";
import base from "../common/base.mjs";

export default {
  ...base,
  key: "siteleaf-new-document",
  type: "source",
  name: "New Document",
  description: "Emit new event when a new document is created",
  version: "0.0.1",
  props: {
    ...base.props,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    collectionPath: {
      propDefinition: [
        app,
        "collectionPath",
        ({ siteId }) => ({
          siteId,
        }),
      ],
    },
  },
  async run() {
    await this.fetchEvents(
      this.app.listDocuments,
      this.siteId,
      this.collectionPath,
    );
  },
};
