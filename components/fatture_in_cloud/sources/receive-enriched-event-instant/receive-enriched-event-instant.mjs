import fattureInCloud from "../../fatture_in_cloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fatture_in_cloud-receive-enriched-event-instant",
  name: "Receive Enriched Event Instant",
  description: "Emit new event when an enriched event webhook from Fatture in Cloud is received. [See the documentation](https://developers.fattureincloud.it/api-reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fatture_in_cloud: {
      type: "app",
      app: "fatture_in_cloud",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    companyid: {
      propDefinition: [
        fattureInCloud,
        "companyid",
      ],
    },
    eventtype: {
      propDefinition: [
        fattureInCloud,
        "eventtype",
      ],
    },
  },
  hooks: {
    async deploy() {
      // No historical events to fetch for this webhook
    },
    async activate() {
      // No activation needed for this webhook
    },
    async deactivate() {
      // No deactivation needed for this webhook
    },
  },
  async run(event) {
    const {
      companyid, eventtype,
    } = event.body;

    if (!companyid || !eventtype) {
      this.http.respond({
        status: 400,
        body: "Missing required parameters: companyid and eventtype",
      });
      return;
    }

    await this.fatture_in_cloud.emitEnrichedEventWebhook({
      companyid,
      eventtype,
    });

    this.http.respond({
      status: 200,
      body: "Event received",
    });
  },
};
