import { v4 as uuid } from "uuid";
import { createHmac } from "crypto";
import constants from "../../common/constants.mjs";
import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-webhook-destination",
  name: "Webhook Destination (Instant)",
  description: "Send events to a webhook",
  version: "0.0.2",
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
      const baseName = `workspaces/${this.workspace}/sources/js/destinations/${destination}`;

      const { data } = await this.segmentApp.createDestination({
        data: {
          sourceId: source,
          metadataId: await this.findMetadataId(),
          name: baseName,
          enabled: true,
          connection_mode: "UNSPECIFIED",
          settings: {
            data: [
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
      this.setDestinationId(data.destination.id);

      const response = await this.segmentApp.createDestinationSubscription({
        destination: data.destination.id,
        data: {
          name: "Pipedream Webhook Subscription",
          trigger: "type = \"identify\" or type = \"track\" or type = \"group\"",
          actionId: "drop",
          enabled: true,
        },
      });

      this.setSubscriptionId(response.data.destinationSubscription.id);
    },
    async deactivate() {
      const destination = this.getDestinationId();
      const subscription = this.getSubscriptionId();
      await this.segmentApp.deleteDestination({
        destination,
      });
      await this.segmentApp.deleteDestinationSubscription({
        destination,
        subscription,
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
      return "actions-webhook";
    },
    setSharedSecret(secret) {
      this.db.set(constants.SHARED_SECRET, secret);
    },
    getSharedSecret() {
      return this.db.get(constants.SHARED_SECRET);
    },
    setDestinationId(id) {
      this.db.set("destinationId", id);
    },
    getDestinationId() {
      return this.db.get("destinationId");
    },
    setSubscriptionId(id) {
      this.db.set("subscriptionId", id);
    },
    getSubscriptionId() {
      return this.db.get("subscriptionId");
    },
    async findWebhookDestinationId() {
      const params = {
        pagination: {
          count: 200,
        },
      };
      do {
        const {
          data: {
            destinationsCatalog, pagination,
          },
        } = await this.segmentApp.getDestinationsCatalog({
          params,
        });
        const destination = destinationsCatalog.find(({ slug }) => slug === this.getDestination());
        if (destination) {
          return destination.id;
        }
        params.pagination.cursor = pagination?.next;
      } while (params.pagination.cursor);
    },
    async findMetadataId() {
      const destinationMetadataId = await this.findWebhookDestinationId();
      const { data: { destinationMetadata } } =  await this.segmentApp.getDestinationMetadata({
        destinationMetadataId,
      });
      return destinationMetadata.id;
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
