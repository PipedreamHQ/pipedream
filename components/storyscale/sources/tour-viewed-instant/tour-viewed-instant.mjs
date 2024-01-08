import storyscale from "../../storyscale.app.mjs";

export default {
  key: "storyscale-tour-viewed-instant",
  name: "Tour Viewed Instant",
  description: "Emit new event when a tour is viewed",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    storyscale,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    viewerId: {
      propDefinition: [
        storyscale,
        "viewerId",
      ],
    },
    tourName: {
      propDefinition: [
        storyscale,
        "tourName",
        {
          optional: true,
        },
      ],
    },
    viewingTimestamp: {
      propDefinition: [
        storyscale,
        "viewingTimestamp",
        {
          optional: true,
        },
      ],
    },
  },
  async run(event) {
    const { body } = event;
    const {
      viewerId, tourName, viewingTimestamp,
    } = body;

    if (viewerId) {
      const data = {
        viewerId,
        tourName,
        viewingTimestamp,
      };

      const result = await this.storyscale.viewEvent(data);

      this.$emit(result, {
        id: result.id,
        summary: `New view event for tour ${tourName}`,
        ts: Date.now(),
      });
    }
  },
};
