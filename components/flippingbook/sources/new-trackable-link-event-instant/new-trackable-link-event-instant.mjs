import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-new-trackable-link-event-instant",
  name: "New Trackable Link Event",
  description: "Emit new event when there are any interactions with a trackable link. [See the documentation](https://apidocs.flippingbook.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    flippingbook: {
      type: "app",
      app: "flippingbook",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    trackableLink: {
      propDefinition: [
        flippingbook,
        "trackableLink",
      ],
    },
  },
  hooks: {
    async activate() {
      const linkId = await this.flippingbook.createTrackedLink({
        link: this.trackableLink,
      });
      this.db.set("linkId", linkId);
      const triggerId = await this.flippingbook._makeRequest({
        method: "POST",
        path: "/api/v1/fbonline/triggers",
        data: {
          trigger: {
            triggerOn: [
              "trackedlink",
            ],
            events: [
              "link",
            ],
            endpoint: this.http.endpoint,
            limitTo: {
              parentObject: "trackedlink",
              parentObjectId: linkId,
            },
          },
        },
      });
      this.db.set("triggerId", triggerId);
    },
    async deactivate() {
      const linkId = this.db.get("linkId");
      if (linkId) {
        await this.flippingbook._makeRequest({
          method: "DELETE",
          path: `/api/v1/fbonline/tracked_links/${linkId}`,
        });
      }
      const triggerId = this.db.get("triggerId");
      if (triggerId) {
        await this.flippingbook._makeRequest({
          method: "DELETE",
          path: `/api/v1/fbonline/triggers/${triggerId}`,
        });
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-flippingbook-event"] !== "link") {
      this.http.respond({
        status: 200,
      });
      return;
    }
    this.$emit(body, {
      id: body.id,
      summary: `New event on trackable link: ${body.linkId}`,
      ts: Date.now(),
    });
  },
};
