import base from "../common/base.mjs";

export default {
  ...base,
  key: "siteleaf-new-site",
  type: "source",
  name: "New Site",
  description: "Emit new event when a new site is created. [See the docs here](https://learn.siteleaf.com/api/sites/#list-your-sites)",
  version: "0.0.2",
  async run() {
    await this.fetchEvents(
      this.app.listSites,
    );
  },
};
