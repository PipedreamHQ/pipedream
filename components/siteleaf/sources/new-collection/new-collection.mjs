import base from "../common/base.mjs";
import app from "../../siteleaf.app.mjs";

export default {
  ...base,
  key: "siteleaf-new-collection",
  type: "source",
  name: "New Collection",
  description: "Emit new event when a new collection is created. [See the docs here](https://learn.siteleaf.com/api/collections/#list-collections)",
  version: "0.0.1",
  props: {
    ...base.props,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
  },
  async run() {
    await this.fetchEvents(
      this.app.listCollections,
      this.siteId,
    );
  },
};
