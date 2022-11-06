import base from "../common/base.mjs";

export default {
  ...base,
  key: "siteleaf-new-site",
  type: "source",
  name: "New Site",
  description: "Emit new event when a new site is created",
  version: "0.0.1",
  async run() {
    await this.fetchEvents(
      this.app.listSites,
    );
  },
};
