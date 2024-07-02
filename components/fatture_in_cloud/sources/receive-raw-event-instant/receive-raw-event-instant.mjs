import fattureInCloud from "../../fatture_in_cloud.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "fatture_in_cloud-receive-raw-event-instant",
  name: "Receive Raw Event Instant",
  description: "Emit new event when a raw event webhook from Fatture in Cloud is received. [See the documentation](https://developers.fattureincloud.it/api-reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fattureInCloud,
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
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data to fetch for webhooks
    },
    async activate() {
      // No webhook subscription required for Fatture in Cloud
    },
    async deactivate() {
      // No webhook subscription deletion required for Fatture in Cloud
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const rawBody = JSON.stringify(body);
    const webhookSignature = headers["x-fattureincloud-signature"];
    const secretKey = this.fattureInCloud.$auth.api_key;

    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const {
      companyid, eventtype,
    } = body;
    if (companyid && eventtype) {
      await this.fattureInCloud.emitRawEventWebhook({
        companyid,
        eventtype,
      });
      this.http.respond({
        status: 200,
        body: "OK",
      });
    } else {
      console.error("Missing required fields: companyid or eventtype");
      this.http.respond({
        status: 400,
        body: "Bad Request",
      });
    }
  },
};
