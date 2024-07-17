import documerge from "../../documerge.app.mjs";

export default {
  key: "documerge-new-merged-route-instant",
  name: "New Merged Route Instant",
  description: "Emit new event when a merged route is created. [See the documentation](https://app.documerge.ai/api-docs/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    documerge,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    routeTypes: {
      propDefinition: [
        documerge,
        "routeTypes",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.documerge.createRoute();
      this.db.set("routeId", data.id);
    },
    async deactivate() {
      const routeId = this.db.get("routeId");
      await this.documerge.mergeRoutes({
        data: {
          routeId,
        },
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // validate headers
    if (headers["Content-Type"] !== "application/json") {
      this.http.respond({
        status: 400,
      });
      return;
    }

    // validate body
    if (!this.routeTypes.includes(body.routeType)) {
      this.http.respond({
        status: 422,
      });
      return;
    }

    // emit the event
    this.$emit(body, {
      id: body.id,
      summary: `New Route Created: ${body.name}`,
      ts: Date.now(),
    });
  },
};
