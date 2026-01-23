import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-webinar-ended",
  type: "source",
  name: "Webinar Ended",
  description: "Emits an event each time a webinar ends in your Zoom account",
  version: "0.1.10",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "webinar.ended",
      ],
    },
    webinar: {
      type: "string",
      label: "Webinar",
      description:
        "Select a specific webinar to monitor. For recurring webinars, all occurrences will trigger events. Leave empty to monitor all webinars.",
      optional: true,
      async options({
        page,
        prevContext,
      }) {
        if (!prevContext.nextPageToken && page > 0) {
          return [];
        }
        const {
          webinars,
          next_page_token: nextPageToken,
        } =
          await this.zoomAdmin.listWebinars(30, prevContext.nextPageToken);

        if (!webinars?.length) {
          return [];
        }

        return {
          options: webinars.map((w) => ({
            label: w.topic,
            value: w.id,
          })),
          context: {
            nextPageToken,
          },
        };
      },
    },
  },
  methods: {
    isRelevant(object) {
      if (!this.webinar) {
        return true;
      }

      if (object.id !== String(this.webinar)) {
        console.log(`Webinar ID ${object.id} does not match filter. Skipping.`);
        return false;
      }

      return true;
    },
    emitEvent(payload, object) {
      this.$emit(
        {
          event: "webinar.ended",
          payload,
        },
        {
          summary: `Webinar ${object.topic} ended`,
          id: object.uuid,
          ts: +new Date(object.start_time),
        },
      );
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;

    if (!this.isRelevant(object)) {
      return;
    }

    this.emitEvent(payload, object);
  },
};
