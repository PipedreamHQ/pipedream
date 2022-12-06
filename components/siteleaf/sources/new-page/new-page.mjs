import base from "../common/base.mjs";
import app from "../../siteleaf.app.mjs";

export default {
  ...base,
  key: "siteleaf-new-page",
  type: "source",
  name: "New Page",
  description: "Emit new event when a new page is created. [See the docs here](https://learn.siteleaf.com/api/pages/#list-pages)",
  version: "0.0.2",
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
      this.app.listPages,
      this.siteId,
    );
  },
};
