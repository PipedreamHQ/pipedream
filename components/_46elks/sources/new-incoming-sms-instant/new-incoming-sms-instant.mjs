import app from "../../_46elks.app.mjs";

export default {
  key: "_46elks-new-incoming-sms-instant",
  name: "New Incoming SMS (Instant)",
  description: "Emit new event instantly when an SMS is received by a specific number linked to your 46elks account. [See the documentation](https://46elks.com/docs/receive-sms)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
    id: {
      label: "Phone Number ID",
      description: "The phone number ID receiving the SMS message.",
      propDefinition: [
        app,
        "number",
        () => ({
          mapper: ({ id: value }) => value,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Number Name",
      description: "Optional field where you can set a name for the number for your reference. Maximum length is 50 characters",
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const {
        app,
        http,
        id,
        name,
      } = this;

      await app.configNumber({
        debug: true,
        id,
        data: {
          sms_url: http.endpoint,
          ...(name && {
            name,
          }),
        },
      });
    },
  },
  methods: {
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created);
      return {
        id: ts,
        summary: `New SMS: ${resource.message}`,
        ts,
      };
    },
  },
  run({ body }) {
    if (body.direction === "incoming") {
      this.processResource(body);
    }
  },
};
