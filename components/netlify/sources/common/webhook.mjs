import netlify from "../../netlify.app.mjs";

export default {
  dedupe: "unique",
  props: {
    netlify,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    siteId: {
      propDefinition: [
        netlify,
        "siteId",
      ],
    },
  },
  hooks: {
    async activate() {
      const event = this.getHookEvent();
      const opts = {
        event,
        url: this.http.endpoint,
        siteId: this.siteId,
      };
      const {
        hookId,
        token,
      } = await this.netlify.createHook(opts);
      this.db.set("hookId", hookId);
      this.db.set("token", token);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const opts = {
        hookId,
        siteId: this.siteId,
      };
      await this.netlify.deleteHook(opts);
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id,
        created_at: createdAt,
      } = data;
      const ts = +new Date(createdAt);
      const summary = this.getMetaSummary(data);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const {
      headers,
      body,
      bodyRaw,
    } = event;

    // Reject any calls not made by the proper Netlify webhook.
    if (!this.netlify.isValidSource(headers, bodyRaw, this.db)) {
      this.http.respond({
        status: 404,
      });
      return;
    }

    // Acknowledge the event back to Netlify.
    this.http.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
