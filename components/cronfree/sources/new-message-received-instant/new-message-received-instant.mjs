import app from "../../cronfree.app.mjs";

export default {
  key: "cronfree-new-message-received-instant",
  name: "New Message Received (Instant)",
  description: "Emit new event when a new message is received. [See the documentation](https://docs.cronfree.com/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    wdays: {
      propDefinition: [
        app,
        "wdays",
      ],
    },
    months: {
      propDefinition: [
        app,
        "months",
      ],
    },
    mdays: {
      propDefinition: [
        app,
        "mdays",
      ],
    },
    hours: {
      propDefinition: [
        app,
        "hours",
      ],
    },
    minutes: {
      propDefinition: [
        app,
        "minutes",
      ],
    },
    timezone: {
      propDefinition: [
        app,
        "timezone",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        http,
        subscribe,
        wdays,
        months,
        mdays,
        hours,
        minutes,
        timezone,
      } = this;

      await subscribe({
        data: {
          hookUrl: http.endpoint,
          wdays,
          months,
          mdays,
          hours,
          minutes,
          timezone,
        },
      });
    },
    async deactivate() {
      const {
        http,
        unsubscribe,
      } = this;

      await unsubscribe({
        data: {
          hookUrl: http.endpoint,
        },
      });
    },
  },
  methods: {
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "Event Message Received",
        ts,
      };
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta());
    },
    subscribe(args = {}) {
      return this.app.post({
        path: "/schedule",
        ...args,
      });
    },
    unsubscribe(args = {}) {
      return this.app.post({
        path: "/unschedule",
        ...args,
      });
    },
  },
  run({ body }) {
    if (body.success === true) {
      console.log("Successfully subscribed");
      return;
    }
    this.processResource(body);
  },
};
