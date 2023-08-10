import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-webhook-destination",
  name: "Webhook Destination (Instant)",
  description: "Send events to a webhook. Requires a Team or Business account.",
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
    name: {
      type: "string",
      label: "Name",
      description: "Defines the display name of the Destination",
    },
    trigger: {
      type: "string",
      label: "Trigger",
      description: "Destination FQL Statement. [Filter Query Language](https://segment.com/docs/api/public-api/fql/)",
      optional: true,
      default: "type = \"identify\" or type = \"track\" or type = \"group\"",
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.segmentApp.createDestination({
        data: {
          sourceId: this.source,
          metadataId: await this.findMetadataId(),
          name: this.name,
          enabled: true,
          connection_mode: "UNSPECIFIED",
          settings: {},
        },
      });
      const destinationId = data.destination.id;
      this.setDestinationId(destinationId);

      const response = await this.segmentApp.createDestinationSubscription({
        destination: destinationId,
        data: {
          name: "Pipedream Webhook Subscription",
          trigger: this.trigger,
          actionId: await this.findActionId(destinationId),
          enabled: true,
          settings: {
            method: "POST",
            url: this.http.endpoint,
          },
        },
      });
      const subscriptionId = response.data.destinationSubscription.id;
      this.setSubscriptionId(subscriptionId);
    },
    async deactivate() {
      const destination = this.getDestinationId();
      const subscription = this.getSubscriptionId();
      await this.segmentApp.deleteDestinationSubscription({
        destination,
        subscription,
      });
      await this.segmentApp.deleteDestination({
        destination,
      });
    },
  },
  methods: {
    getDestination() {
      return "actions-webhook";
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
    async findDestinationMetadataId() {
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
      const destinationMetadataId = await this.findDestinationMetadataId();
      const { data: { destinationMetadata } } =  await this.segmentApp.getDestinationMetadata({
        destinationMetadataId,
      });
      if (!destinationMetadata?.id) {
        throw new Error(`MetadataId for ${this.getDestination()} not found.`);
      }
      return destinationMetadata.id;
    },
    async findActionId(destination) {
      const { data } = await this.segmentApp.getDestination({
        destination,
      });
      return data.destination.metadata.actions[0].id;
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    this.$emit(event, {
      id: Date.now(),
      summary: "Received event",
      ts: Date.now(),
    });
  },
};
