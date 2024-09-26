import app from "../../mailersend.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    domainId: {
      propDefinition: [
        app,
        "domainId",
      ],
    },
  },
  methods: {
    generateMeta(event) {
      const { data } = event;
      return {
        id: data.id,
        summary: `${data.type}: ${data.email.subject}`.replace(/(^\w)/g, (m) => m.toUpperCase()),
        ts: Date.parse(data.created_at),
      };
    },
    emitEvent(data) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
  },
};
