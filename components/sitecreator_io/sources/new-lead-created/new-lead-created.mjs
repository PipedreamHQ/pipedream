import sitecreator from "../../sitecreator_io.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "sitecreator_io-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is added to a website. [See the docs here](http://api-doc.sitecreator.io/#tag/Contact/operation/getLeads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sitecreator,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    siteId: {
      type: "string",
      label: "Site ID",
      description: "ID of the site leads will be added to",
    },
  },
  async run() {
    const response = await this.sitecreator.getLead({
      data: {
        siteId: this.siteId,
      },
    });
    return response;
  },
};
