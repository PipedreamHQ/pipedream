import { createHmac } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../aftership.app.mjs";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhookSecret: {
      type: "string",
      label: "Secret",
      description: "The secret for the webhook. You can find it in `Tracking -> Settings -> Webhooks -> Webhook secret`",
    },
  },
  hooks: {
    async deploy() {
      if (!this.webhookSecret) {
        console.log("No webhook secret was provided, skipping deployment");
        throw new ConfigurationError("No webhook secret was provided, skipping deployment");
      }

      const { data: { trackings } } = await this.app.listTrackings({
        params: {
          page: 1,
          limit: 25,
        },
      });

      trackings
        .slice(0, 25)
        .reverse()
        .forEach((tracking) => {
          this.processResource({
            event: this.getEventName(),
            event_id: tracking.id,
            msg: tracking,
            ts: Date.parse(tracking.updated_at) / 1000,
          });
        });
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    isSignatureValid(bodyRaw, signature) {
      const { webhookSecret } = this;
      if (!webhookSecret) {
        console.log("No webhook secret found, skipping signature verification");
        return true;
      }
      const hash = createHmac("sha256", webhookSecret)
        .update(bodyRaw)
        .digest("base64");
      return hash === signature;
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
  },
  async run({
    body, bodyRaw, headers,
  }) {
    const signature = headers["aftership-hmac-sha256"];

    if (!this.isSignatureValid(bodyRaw, signature)) {
      console.log("Could not verify incoming webhook signature");
      return this.http.respond({
        status: 401,
      });
    }

    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
