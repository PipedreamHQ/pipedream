import app from "../../siteleaf.app.mjs";
import base from "../common/base.mjs";

export default {
  ...base,
  key: "siteleaf-new-document",
  type: "source",
  name: "New Document",
  description: "Emit new event when a new document is created. [See the docs here](https://learn.siteleaf.com/api/documents/#list-documents)",
  version: "0.0.2",
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
