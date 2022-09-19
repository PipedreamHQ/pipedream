import { v4 as uuid } from "uuid";
import { createHmac } from "crypto";
import constants from "../../common/constants.mjs";
import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-webhook-destination",
  name: "Webhook Destination (Instant)",
  description: "Send events to a webhook",
  version: "0.0.1",
  type: "source",
  props: {
    segmentApp,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspace: {
      propDefinition: [
        segmentApp,
        "workspace",
      ],
    },
    source: {
      propDefinition: [
        segmentApp,
        "source",
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const { source } = this;
      const secret = uuid();
      const destination = this.getDestination();
      const baseName = `${source}/destinations/${destination}`;

      await this.segmentApp.createDestination({
        source: `/${source}`,
        data: {
          destination: {
            name: baseName,
            enabled: true,
            connection_mode: "UNSPECIFIED",
            config: [
              {
                name: `${baseName}/config/sharedSecret`,
                type: "string",
                value: secret,
              },
              {
                name: `${baseName}/config/hooks`,
                type: "mixed",
                value: [
                  {
                    hook: this.http.endpoint,
                  },
                ],
              },
            ],
          },
        },
      });
      this.setSharedSecret(secret);
    },
    async deactivate() {
      return this.segmentApp.deleteDestination({
        source: `/${this.source}`,
        destination: this.getDestination(),
      });
    },
  },
  methods: {
    isValid(signature, bodyRaw) {
      const digest = createHmac("sha1", this.getSharedSecret())
        .update(Buffer.from(bodyRaw, "utf8"))
        .digest("hex");
      return signature === digest;
    },
    getDestination() {
      return "webhooks";
    },
    setSharedSecret(secret) {
      this.db.set(constants.SHARED_SECRET, secret);
    },
    getSharedSecret() {
      return this.db.get(constants.SHARED_SECRET);
    },
  },
  async run(event) {
    const {
      headers,
      body,
      bodyRaw,
    } = event;

    const signature = headers["x-signature"];

    if (this.isValid(signature, bodyRaw)) {

      this.http.respond({
        status: 200,
        headers: {
          "x-signature": signature,
        },
      });

      this.$emit(body, {
        id: signature,
        summary: `Received ${body.type} event`,
        ts: Date.parse(body.timestamp),
      });
    }
  },
};
